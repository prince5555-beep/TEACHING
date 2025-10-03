const axios = require('axios');
const cheerio = require('cheerio');

const recentSearches = {}; // memory store for reply matching

module.exports = {
  command: 'fitgirl',
  description: 'Search and get FitGirl repack games',
  category: 'download',

  async execute(socket, msg, text) {
    if (!text) {
      return await socket.sendMessage(msg.from, {
        text: '❌ Please enter a game name.\n\nUsage: fitgirl GTA'
      }, { quoted: msg });
    }

    const searchUrl = `https://fitgirl-repacks.site/?s=${encodeURIComponent(text)}`;

    try {
      const searchRes = await axios.get(searchUrl);
      const $ = cheerio.load(searchRes.data);

      const results = [];
      $('div > article').each((i, el) => {
        const title = $(el).find('header > h1 > a').text();
        const link = $(el).find('header > h1 > a').attr('href');
        const date = $(el).find('header time').text();

        if (title && link) {
          results.push({ title, link, date });
        }
      });

      if (results.length === 0) {
        return await socket.sendMessage(msg.from, {
          text: '❌ No results found.'
        }, { quoted: msg });
      }

      let listText = `🎮 *FitGirl Results for:* _${text}_\n\n_Reply with a number to get game details_\n\n`;
      results.slice(0, 5).forEach((game, i) => {
        listText += `*${i + 1}.* ${game.title}\n🗓️ ${game.date}\n\n`;
      });

      // Send search results
      await socket.sendMessage(msg.from, { text: listText }, { quoted: msg });

      // Save reply context
      recentSearches[msg.key.id] = results.slice(0, 5);

    } catch (err) {
      console.error(err);
      return await socket.sendMessage(msg.from, {
        text: '⚠️ Error fetching FitGirl data.'
      }, { quoted: msg });
    }
  },

  // This gets triggered on reply
  async onReply(socket, msg) {
    const quotedId = msg.quoted?.key?.id;
    const results = recentSearches[quotedId];

    if (!results) return;

    const selected = parseInt(msg.body.trim());
    if (isNaN(selected) || selected < 1 || selected > results.length) {
      return await socket.sendMessage(msg.from, {
        text: '❌ Invalid number. Please reply with a valid number.'
      }, { quoted: msg });
    }

    const game = results[selected - 1];

    try {
      const res = await axios.get(game.link);
      const $ = cheerio.load(res.data);

      const title = $('header > h1').first().text();
      const image = $('div > p > a > img').first().attr('src') || null;

      let message = `🎮 *${title}*\n📅 ${game.date}\n\n🔗 ${game.link}`;

      if (image) {
        await socket.sendMessage(msg.from, {
          image: { url: image },
          caption: message
        }, { quoted: msg });
      } else {
        await socket.sendMessage(msg.from, {
          text: message
        }, { quoted: msg });
      }

    } catch (err) {
      console.error(err);
      return await socket.sendMessage(msg.from, {
        text: '⚠️ Failed to fetch game details.'
      }, { quoted: msg });
    }
  }
};
