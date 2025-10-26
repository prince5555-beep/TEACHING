const axios = require('axios');
let metaMode = false; // Global flag for Meta AI Mode
const metaNumber = '13135550002@s.whatsapp.net';

module.exports = {
  command: 'meta',
  description: 'Enable/Disable Meta AI or chat with AI',
  execute: async (socket, msg, { text }) => {
    try {
      const sender = msg.key.remoteJid;
      const args = text.trim().split(' ');
      const subCmd = args[0]?.toLowerCase();

      // ---- HELP ----
      if (!text || subCmd === 'help') {
        const helpText = `
╭━━━ 『 *META AI HELP* 』 ━━━⬣
┃ ⚡ *.meta on* - Enable Meta AI mode.
┃ ❌ *.meta off* - Disable Meta AI mode.
┃ 🎨 *.meta /imagine <prompt>* - Generate AI Image.
┃ 💬 *.meta <query>* - Send message to Meta AI.
╰━━━━━━━━━━━━━━━━━━━━⬣
        `;
        return await socket.sendMessage(sender, { text: helpText }, { quoted: msg });
      }

      // ---- META ON ----
      if (subCmd === 'on') {
        metaMode = true;
        return await socket.sendMessage(sender, { text: '🤖 *Meta AI Mode is now ON.*' }, { quoted: msg });
      }

      // ---- META OFF ----
      if (subCmd === 'off') {
        metaMode = false;
        return await socket.sendMessage(sender, { text: '❌ *Meta AI Mode is now OFF.*' }, { quoted: msg });
      }

      // ---- IMAGE GENERATION ----
      if (text.startsWith('/imagine')) {
        const prompt = text.replace('/imagine', '').trim();
        if (!prompt) {
          return await socket.sendMessage(sender, { text: '🖼 *Example:* `.meta /imagine a cat wearing sunglasses`' }, { quoted: msg });
        }
        await socket.sendMessage(sender, { text: `🎨 *Generating image for:* _${prompt}_` }, { quoted: msg });

        try {
          const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
          return await socket.sendMessage(sender, { image: { url: imgUrl }, caption: `🖼 *Meta AI Image*\n_${prompt}_` }, { quoted: msg });
        } catch {
          return await socket.sendMessage(sender, { text: '❌ *Image generation failed.*' }, { quoted: msg });
        }
      }

      // ---- NORMAL META AI CHAT ----
      await socket.sendMessage(sender, { text: '⏳ *Meta AI thinking...*' }, { quoted: msg });
      await socket.sendMessage(metaNumber, { text });

      socket.ev.once('messages.upsert', async (m) => {
        const metaMsg = m.messages[0];
        if (metaMsg.key.remoteJid === metaNumber && !metaMsg.key.fromMe) {
          if (metaMsg.message?.conversation) {
            await socket.sendMessage(sender, { text: `🤖 *Meta AI:* ${metaMsg.message.conversation}` }, { quoted: msg });
          } else if (metaMsg.message?.imageMessage) {
            const buffer = await socket.downloadMediaMessage(metaMsg);
            await socket.sendMessage(sender, { image: buffer, caption: '🖼 *Meta AI Image.*' }, { quoted: msg });
          } else if (metaMsg.message?.audioMessage) {
            const buffer = await socket.downloadMediaMessage(metaMsg);
            await socket.sendMessage(sender, { audio: buffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: msg });
          }
        }
      });

    } catch (err) {
      console.error('META CMD ERROR:', err);
      await socket.sendMessage(msg.key.remoteJid, { text: '❌ Meta AI command failed!' }, { quoted: msg });
    }
  },
  isMetaOn: () => metaMode // export flag for auto-reply
};
