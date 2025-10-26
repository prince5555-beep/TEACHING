const axios = require("axios");
const sharp = require("sharp");

const activeReplyHandlers = new Map();

const getThumbnailBuffer = async (url) => {
  try {
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    return await sharp(data).resize(300, 300).jpeg({ quality: 80 }).toBuffer();
  } catch (err) {
    console.error("Thumbnail Error:", err);
    return null;
  }
};

// Function to get a working direct link with retries
const getWorkingDlLink = async (btnUrl, attempts = 3, delay = 4000) => {
  let lastLink = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const { data: dlRes } = await axios.get(
        `https://movie-db-api-fawn.vercel.app/api/download?url=${encodeURIComponent(btnUrl)}`
      );
      if (dlRes && dlRes.link) {
        lastLink = dlRes.link;
        if (/\.(mp4|mkv|avi|mov)$/i.test(dlRes.link)) {
          return dlRes.link; // Direct file found
        }
      }
    } catch (err) {
      console.error("Retry error:", err);
    }
    // Wait before retry
    await new Promise(r => setTimeout(r, delay));
  }
  return lastLink; // Return last fetched link even if not direct
};

module.exports = {
  command: "moviedb",
  description: "Search movies and download",
  react: "📑",
  category: "movie",

  execute: async (socket, msg, args) => {
    const from = msg.key.remoteJid;
    const input = args.join(" ").trim();

    if (!input) {
      return socket.sendMessage(
        from,
        { text: "📌 *Please provide a search query!*\nExample: `.moviedb one piece`" },
        { quoted: msg }
      );
    }

    try {
      const { data } = await axios.get(
        `https://movie-db-api-fawn.vercel.app/api/search?q=${encodeURIComponent(input)}`
      );
      const results = data || [];

      if (results.length === 0) {
        return socket.sendMessage(from, { text: "😓 No results found." }, { quoted: msg });
      }

      const list = results.slice(0, 10);
      let text = `🎬 *Search Results for:* ${input}\n\n`;
      list.forEach((item, i) => {
        text += `*${i + 1}.* ${item.title}\n`;
      });
      text += `\n🔢 *Reply with a number (1-${list.length}) to select.*`;

      const sentMsg = await socket.sendMessage(from, { text }, { quoted: msg });
      const msgId = sentMsg.key.id;

      if (activeReplyHandlers.has(msgId)) return;

      const replyHandler = async (update) => {
        const m = update.messages?.[0];
        if (!m?.message) return;

        const replyTo = m.message.extendedTextMessage?.contextInfo?.stanzaId;
        if (replyTo !== msgId) return;

        const userInput = m.message.conversation || m.message.extendedTextMessage?.text;
        const selectedNum = parseInt(userInput?.trim());

        if (isNaN(selectedNum) || selectedNum < 1 || selectedNum > list.length) {
          return socket.sendMessage(
            from,
            { text: `❌ Invalid number. Please select between 1 and ${list.length}.` },
            { quoted: m }
          );
        }

        await socket.sendMessage(from, { react: { text: "✅", key: m.key } });

        const selected = list[selectedNum - 1];
        const { data: movie } = await axios.get(
          `https://movie-db-api-fawn.vercel.app/api/movieinfo?url=${encodeURIComponent(selected.link)}`
        );

        if (!movie) {
          return socket.sendMessage(from, { text: "🚫 Could not load details." }, { quoted: m });
        }

        // Build movie details caption
        let cap = `╔══════════════════════╗\n`;
        cap += `   🎬  *${movie.title.toUpperCase()}*  \n`;
        cap += `╚══════════════════════╝\n\n`;

        cap += `🌍 *Country:* ${movie.country}\n`;
        cap += `📚 *Genre:* ${movie.genre}\n`;
        cap += `🕛 *Runtime:* ${movie.runtime}\n`;
        cap += `🗣️ *Language:* ${movie.language}\n`;
        cap += `⭐ *Stars:* ${movie.stars}\n`;
        cap += `🏆 *Ratings:* ${movie.ratings}\n`;
        cap += `📅 *Release Date:* ${movie.releaseDate}\n`;
        if (movie.youtubeLink) cap += `▶️ *Trailer:* ${movie.youtubeLink}\n`;
        cap += `📝 *Description:* ${movie.description}\n\n`;

        if (movie.buttons && movie.buttons.length > 0) {
          cap += `📥 *Reply with number to download:* \n\n`;
          movie.buttons.forEach((btn, i) => {
            cap += `*${i + 1}.* ${btn.name}\n`;
            cap += `   🔗 ${btn.url}\n\n`;
          });
        } else {
          cap += `⚠️ No direct download buttons found.`;
        }

        const detailMsg = await socket.sendMessage(
          from,
          {
            image: { url: movie.image },
            caption: cap,
          },
          { quoted: m }
        );

        const detailMsgId = detailMsg.key.id;

        // Handle user reply for download number
        const buttonReplyHandler = async (update2) => {
          const m2 = update2.messages?.[0];
          if (!m2?.message) return;

          const replyTo2 = m2.message.extendedTextMessage?.contextInfo?.stanzaId;
          if (replyTo2 !== detailMsgId) return;

          const selectedText = m2.message.conversation || m2.message.extendedTextMessage?.text;
          const btnNum = parseInt(selectedText?.trim());

          if (!movie.buttons || movie.buttons.length === 0) {
            return socket.sendMessage(from, { text: "❌ No download links available." }, { quoted: m2 });
          }

          if (isNaN(btnNum) || btnNum < 1 || btnNum > movie.buttons.length) {
            return socket.sendMessage(
              from,
              { text: `❌ Invalid choice. Please reply with number between 1 and ${movie.buttons.length}.` },
              { quoted: m2 }
            );
          }

          const selectedBtn = movie.buttons[btnNum - 1];
          await socket.sendMessage(from, { text: "⏳ Fetching download link..." }, { quoted: m2 });

          // ✅ Get working link with retries
          const dlLink = await getWorkingDlLink(selectedBtn.url, 3, 4000);

          if (!dlLink) {
            return socket.sendMessage(from, { text: "❌ Failed to get download link." }, { quoted: m2 });
          }

          const thumb = await getThumbnailBuffer(movie.image);
          const isDirect = /\.(mp4|mkv|avi|mov)$/i.test(dlLink);

          if (isDirect) {
            // Send as document
            await socket.sendMessage(
              from,
              {
                document: { url: dlLink },
                caption: `${movie.title}\n\n🔗 Download Link: ${dlLink}\n\n> Vajira Mini MD by VajiraOfficial`,
                mimetype: "video/mp4",
                fileName: `${movie.title}.mp4`,
                jpegThumbnail: thumb,
              },
              { quoted: m2 }
            );
          } else {
            // Send as clickable link with warning
            await socket.sendMessage(
              from,
              { text: `${movie.title}\n⚠️ Could not get direct file, use this link:\n${dlLink}` },
              { quoted: m2 }
            );
          }

          await socket.sendMessage(from, { react: { text: "✅", key: m2.key } });
        };

        socket.ev.on("messages.upsert", buttonReplyHandler);
      };

      socket.ev.on("messages.upsert", replyHandler);
      activeReplyHandlers.set(msgId, true);
    } catch (err) {
      console.error("moviedb error:", err);
      await socket.sendMessage(from, { text: "🚫 An error occurred." }, { quoted: msg });
    }
  },
};
