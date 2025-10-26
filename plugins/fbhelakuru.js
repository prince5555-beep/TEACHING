const axios = require('axios');

module.exports = {
  name: 'esana',
  description: 'Get the latest news from Helakuru Esana (via API)',
  category: 'news',
  async execute(conn, m) {
    try {
      const res = await axios.get('https://esana-api.vercel.app/EsanaV3');
      const latest = res.data?.Posts?.[0];

      if (!latest) {
        return conn.sendMessage(m.chat, { text: '😕 නවතම පුවත ලබාගත නොහැක...' }, { quoted: m });
      }

      const image = latest.thumb;
      const title = latest.title?.trim();
      const content = latest.content?.[0]?.data?.trim();
      const link = latest.link;

      const caption = `📰 *${title}*\n\n${content}\n\n🔗 *වැඩිදුරට බලන්න:* ${link}\n\n_© Helakuru Esana News_`;

      await conn.sendMessage(m.chat, {
        image: { url: image },
        caption: caption
      }, { quoted: m });

    } catch (err) {
      console.error('[ESANA ERROR]', err);
      await conn.sendMessage(m.chat, { text: '🚫 Helakuru news ලබාගැනීමේදී දෝෂයකි.' }, { quoted: m });
    }
  }
};
