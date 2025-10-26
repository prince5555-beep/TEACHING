const fs = require('fs');
const path = require('path');
const axios = require('axios');

const dbFile = path.join(__dirname, '../database/commandTrack.json');

function loadDB() {
  if (!fs.existsSync(dbFile)) return {};
  return JSON.parse(fs.readFileSync(dbFile));
}

module.exports = {
  command: 'rank',
  description: 'Show your command usage and level info',
  category: 'info',

  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;
    const jidName = sender.split('@')[0];

    const db = loadDB();
    const user = db[sender] || { count: 0, rankShown: 0, lastReset: 'Never' };

    let thumbnailBuffer;
    try {
      const thumbUrl = await sock.profilePictureUrl(sender, 'image');
      const res = await axios.get(thumbUrl, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(res.data, 'binary');
    } catch {
      thumbnailBuffer = Buffer.from('');
    }

    const caption = `🎖️ *RANK STATUS*

👤 *User:* @${jidName}
📆 *Date:* ${new Date().toLocaleDateString()}
📊 *Commands Used Today:* ${user.count}
🚀 *Rank Messages Shown:* ${user.rankShown}/8
🔁 *Last Reset:* ${user.lastReset || "Today"}

💬 Keep using commands to level up!`;

    await sock.sendMessage(sender, {
      image: { url: 'https://files.catbox.moe/3hqsq9.png' }, // You can change thumbnail here
      caption,
      footer: 'Rank Tracker by VAJIRA-OFC',
      headerType: 4,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 888,
        isForwarded: true,
        externalAdReply: {
          title: 'Your Progress Report',
          body: 'Track your bot usage & level up!',
          thumbnail: thumbnailBuffer,
          mediaType: 2,
          mediaUrl: 'https://meta.ai',
          sourceUrl: 'https://meta.ai',
          showAdAttribution: true
        }
      }
    });
  }
};
