const axios = require('axios');
const cheerio = require('cheerio')
const activeReplyHandlers = new Map(); // ✅ Prevent duplicate reply triggers

module.exports = {
  command: "news",
  description: "Download a YouTube video in normal, document, or video note format",
  react: "🎬",
  category: "download",

  execute: async (socket, msg, args) => {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const input = args.join(" ").trim();

    const caption =
      `🗞️ *𝘝𝘈𝘑𝘐𝘙𝘈 𝘕𝘌𝘞𝘚 𝘉𝘖𝘛*\n\n` +
      `🔢 *Reply with the number to read from a news source:*\n` +
      `╭─────────────●●►\n` +
      `├ 1. 🧾 Derana\n` +
      `├ 2. 📰 Silumina\n` +
      `├ 3. 🌐 LNW\n` +
      `├ 4. 📺 Siyatha\n` +
      `├ 5. 🗞️ Lankadeepa\n` +
      `├ 6. 🏏 Cricbuzz\n` +
      `├ 7. 💬 Helakuru\n` +
      `╰─────────────●●►\n\n` +
      `● *𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛* ●`;

    const sentMsg = await socket.sendMessage(from, {
      text: caption
    }, { quoted: msg });

    const msgId = sentMsg.key.id;
    if (activeReplyHandlers.has(msgId)) return;

    const messageListener = async (messageUpdate) => {
      try {
        const mek = messageUpdate.messages?.[0];
        if (!mek?.message) return;

        const replyTo = mek.message.extendedTextMessage?.contextInfo?.stanzaId;
        if (replyTo !== msgId) return;

        const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
        if (!text) return;

        await socket.sendMessage(from, { react: { text: "✅", key: mek.key } });

        const sendFormattedNews = async (news, quotedMsg) => {
          const newsText =
            `🗞️ *${news.title || "No Title"}*\n\n` +
            `🗓️ _${news.date || "No Date"}_\n\n` +
            `${news.desc || "No Description"}\n\n` +
            `🔗 [Read more](${news.url || "#"})\n\n` +
            `● *𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛* ●`;

          if (news.image) {
            await socket.sendMessage(from, {
              image: { url: news.image },
              caption: newsText,
              headerType: 4
            }, { quoted: quotedMsg });
          } else {
            await socket.sendMessage(from, {
              text: newsText
            }, { quoted: quotedMsg });
          }
        };

        switch (text.trim()) {
          case "1": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/derana`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

          case "2": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/silumina`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

          case "3": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/lnw`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

          case "4": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/siyatha`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

          case "5": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/lankadeepa`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

          case "6": {
            const res = await axios.get(`https://apiofficial-219be46516d4.herokuapp.com/news/cricbuzz`);
            const news = res.data.result || res.data;
            await sendFormattedNews(news, mek);
            break;
          }

         case "7": {
            
      const url = 'https://t.me/s/HelakuruNewsLK';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      
      const firstMsg = $('.tgme_widget_message_wrap').first();

      
      const messageText = firstMsg.find('.tgme_widget_message_text').text().trim();

      
      const imgTag = firstMsg.find('.tgme_widget_message_photo > a > img');
      let imageUrl = null;
      if (imgTag.length) {
        imageUrl = imgTag.attr('src');
        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
      }

      if (!messageText) {
        return await socket.sendMessage(from, {
          text: '❌ Helakuru channel එකෙන් පණිවිඩයක් හමු නොවීය.',
        }, { quoted: msg });
      }

      
      if (imageUrl) {
        await socket.sendMessage(from, {
          image: { url: imageUrl },
          caption: `📢 *Helakuru Latest News*\n\n${messageText}`,
        }, { quoted: msg });
      } else {
        await socket.sendMessage(from, {
          text: `📢 *Helakuru Latest News*\n\n${messageText}`,
        }, { quoted: msg });
      }
            break;
          }



          default:
            await socket.sendMessage(from, {
              text: "❌ Invalid option. Please reply with *1*, *2*, *3*, *4*, *5*, or *6*.",
            }, { quoted: mek });
        }

      } catch (e) {
        console.error("Error in messageListener:", e);
        await socket.sendMessage(from, {
          text: `⚠️ *Error occurred:* ${e.message || "Unknown error"}`,
        }, { quoted: msg });
      }
    };

    socket.ev.on("messages.upsert", messageListener);
    activeReplyHandlers.set(msgId, true);
  }
};
