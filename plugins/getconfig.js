const { getUserConfig } = require('../lib/userConfig');

module.exports = {
  command: 'edid',
  description: 'View your personal config settings',
  category: 'info',
  use: '.getconfig',
  execute: async (socket, msg) => {
    const sender = msg.key.remoteJid;
    const reply = (text) => socket.sendMessage(sender, { text }, { quoted: msg });

    const config = getUserConfig(sender);

    let output = '🛠️ *Your Config Settings:*\n\n';

    for (const [key, value] of Object.entries(config)) {
      let displayValue = Array.isArray(value) ? JSON.stringify(value) : String(value);
      output += `🔧 *${key}* = ${displayValue}\n`;
    }

    reply(output.trim());
  }
};
