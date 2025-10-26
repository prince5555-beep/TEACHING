const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  command: "hela",
  description: "Get latest post (image + text) from Helakuru Telegram channel",
  react: "📰",
  category: "news",

  execute: async (socket, msg, args) => {
    const from = msg.key.remoteJid;

    try {
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

    } catch (error) {
      console.error('Helakuru scrape error:', error);
      await socket.sendMessage(from, {
        text: '❌ Helakuru data ගන්න ගැටලුවක් තියෙනවා. පසුව උත්සාහ කරන්න.',
      }, { quoted: msg });
    }
  },
};
