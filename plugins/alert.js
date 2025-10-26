const axios = require('axios');

// Define your constants
const GITHUB_TOKEN = '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'; // 🔐 Replace with real token
const GIST_ID = '7ebc528b5e157f26f43585a09d2462a3';           // 📄 Replace with your Gist ID
const FILENAME = 'update.txt';                 // 📝 Name of the file inside Gist

module.exports = {
  command: 'sendupdate',
  description: 'Update message to Gist',
  category: 'tools',
  
  /**
   * @param {import('@whiskeysockets/baileys').WASocket} socket
   * @param {*} msg
   * @param {string[]} args
   * @param {string} number - sender number
   */
  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const senderNumber = number;
    const allowedNumber = '94719199757';

    const q = args.join(' ').trim();
    const reply = (text) => socket.sendMessage(sender, { text }, { quoted: msg });

    // Permission check
    if (senderNumber !== allowedNumber) {
      return await socket.sendMessage(sender, { text: '❌ Only VAJIRA MD owner can use this command.' }, { quoted: msg });
    }

    if (!q) return reply('⚠️ Please provide a message. Example: .sendupdate Hello');

    try {
      const url = `https://api.github.com/gists/${GIST_ID}`;
      const payload = {
        files: {
          [FILENAME]: {
            content: q
          }
        }
      };

      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      };

      await axios.patch(url, payload, { headers });

      return reply('✅ Gist updated successfully!');
    } catch (err) {
      console.error('Error updating Gist:', err.message);
      return reply('❌ Failed to update the Gist.');
    }
  }
};
