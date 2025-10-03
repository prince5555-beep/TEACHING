const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'devolopcount',
  description: 'Show how many session files are in the session folder',
  category: 'info',
  use: '.devolopcount',
  execute: async (socket, msg) => {
    try {
      const sessionPath = path.join(__dirname, '../session');
      const sender = msg.key?.remoteJid || msg.chat || '';

      if (!fs.existsSync(sessionPath)) {
        await socket.sendMessage(sender, {
          text: '❌ BOT Developers folder not found.'
        }, { quoted: msg });
        return;
      }

      const files = fs.readdirSync(sessionPath);
      const sessionFiles = files.filter(file => {
        const fullPath = path.join(sessionPath, file);
        return fs.statSync(fullPath).isFile();
      });

      const fileCount = sessionFiles.length;

      
      let { key } = await socket.sendMessage(sender, { text: '' }, { quoted: msg });

     
      for (let i = 1; i <= fileCount; i++) {
        await socket.sendMessage(sender, {
          text: `📁 BOT Developers counting: ${i}`,
          edit: key
        });
        await new Promise(r => setTimeout(r, 150)); 
      }

      
      await socket.sendMessage(sender, {
        text: `📁 BOT Developers contains: *${fileCount}*`,
        edit: key
      });

    } catch (err) {
      console.error('[BOT Developers Count ERROR]', err);
      const sender = msg.key?.remoteJid || msg.chat || '';
      await socket.sendMessage(sender, {
        text: '❌ Error occurred while counting session files.'
      }, { quoted: msg });
    }
  }
};
