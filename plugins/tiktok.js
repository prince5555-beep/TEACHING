const axios = require('axios');

module.exports = {
  command: "tiktok",
  description: "Download TikTok video with watermark, no watermark and audio",
  react: "🎥",
  category: "download",
  execute: async (socket, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";
      const url = args[0];

      if (!url || !url.includes("tiktok.com")) {
        return await socket.sendMessage(from, {
          text: `❌ *Please provide a valid TikTok URL!*\n\nExample: *.tiktok https://www.tiktok.com/@user/video/12345*`,
        }, { quoted: msg });
      }

      const api = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = api.data.data;

      if (!data || api.data.code !== 0) {
        return await socket.sendMessage(from, {
          text: "❌ Failed to fetch video. Try again or check your URL.",
        }, { quoted: msg });
      }

      const caption =
        `⛩️ 𝘝𝘈𝘑𝘐𝘙𝘈 𝘛𝘐𝘒𝘛𝘖𝘒 𝘋𝘖𝘞𝘕𝘓𝘖𝘈𝘋𝘌𝘙 🎥\n\n` +
        `🎬 *${data.title || "No Title"}*\n` +
        `👤 Author: ${data.author || "Unknown"}\n` +
        `❤️ Likes: ${data.like_count || 0}\n` +
        `🗣️ Comments: ${data.comment_count || 0}\n` +
        `🔗 Source: ${url}\n\n` +
        `🔢 *Reply the number you want to download...*\n` +
        `╭─────────────●●►\n` +
        `├ 🎞️ *1* No Watermark\n` +
        `├ 💧 *2* With Watermark\n` +
        `├ 🎧 *3* Audio Only\n` +
        `╰─────────────●●►\n\n` +
        `● *𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛* ●`;

      const sentMsg = await socket.sendMessage(from, {
        image: { url: data.cover },
        caption
      }, { quoted: msg });

      const msgId = sentMsg.key.id;

      // Await user reply
      const messageListener = async (messageUpdate) => {
        try {
          const mek = messageUpdate.messages[0];
          if (!mek.message) return;
          const isReply = mek.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
          if (!isReply) return;
          if (mek.key.remoteJid !== from) return;

          const text = mek.message.conversation || mek.message.extendedTextMessage?.text;

          await socket.sendMessage(from, { react: { text: '✅', key: mek.key } });

          switch (text.trim()) {
            case "1":
              await socket.sendMessage(from, {
                video: { url: data.play },
                caption: "✅ *Video (No Watermark)*\n> Vajira Mini Bot"
              }, { quoted: mek });
              break;

            case "2":
              await socket.sendMessage(from, {
                video: { url: data.wmplay },
                caption: "💧 *Video (With Watermark)*\n> Vajira Mini Bot"
              }, { quoted: mek });
              break;

            case "3":
              await socket.sendMessage(from, {
                audio: { url: data.music },
                mimetype: "audio/mpeg",
                ptt: false
              }, { quoted: mek });
              break;

            default:
              await socket.sendMessage(from, {
                text: "❌ Invalid option. Please reply with 1, 2, or 3.",
              }, { quoted: mek });
          }
        } catch (err) {
          console.error(err);
        }
      };

      socket.ev.on("messages.upsert", messageListener);

      setTimeout(() => {
        socket.ev.off("messages.upsert", messageListener);
      }, 2 * 60 * 1000);

    } catch (e) {
      console.error(e);
      await socket.sendMessage(msg.key.remoteJid, {
        text: `⚠️ *Error occurred:* ${e.message}`,
      }, { quoted: msg });
    }
  }
};
