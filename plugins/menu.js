/*const config = require('../config');

module.exports = {
  command: "menu",
  description: "To get the menu.",
  react: "🛍️",
  category: "main",
  execute: async (socket, msg, args, number) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";

      const menumsg = `🔐 ＰＲＩＮＣＥ　ＭＩＮＩ 𝐗 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓 🪻

*👋 Hello ${pushname}*

🌐 *Available Commands Menu*

╭─❖ 【 🤖 BOT INFO 】
│ ⛩️ Name: ＰＲＩＮＣＥ　ＭＩＮＩ
│ 🌐 Version: 4.001v
│ 👤 Owner: prince
│ ☁️ Host: Heroku
│ 📞 Your Number: ${number}
╰─────────────⧈

🔢 *Reply the number you want to select...* 
╭─────────────●●►
├ 📥  *1*  DOWNLOAD
├ 🔄  *2*  MAIN
├ 🔎  *3*  SEARCH
├ 👨‍💻  *4*  OWNER
├ 🪀  *5*  GROUP
├ 🫅  *6*  OTHER
├ 📃  *7* ALL CMD
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●
`;

      const downloadmenu = `
╔═══════════════╗ 
║📥 *DOWNLOAD CMD* 📥
╚═══════════════╝
╭─────────────●●►
├📥  .song — Download MP3
├📥  .video — Download video
├📥  .tiktok — Download TikTok
├📥  .facebook — Download Facebook
├📥  .apk — Download apps
├📥  .img — Download Images
├📥  .xnxx — Download 18+
├📥  .slanimeclub — Download anime
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ𝘭* ●
`;

      const searchmenu = `
╔═══════════════╗ 
║🔎 *SEARCH CMD* 🔎
╚═══════════════╝
╭─────────────●●►
├🔎  .tmdb — tmdb movie search
├🔎  .news — news search
├🔎  .npm — npm search
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●
`;

      const ownermenu = `
╔═══════════════╗ 
║👨‍💻 *OWNER CMD* 👨‍💻
╚═══════════════╝
╭─────────────●●►
├👨‍💻  .block / .unblock — Manage users
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ𝘉𝘠 ＰＲＩＮＣＥ* ●
`;

      const groupmenu = `
╔═══════════════╗ 
║🪀 *GROUP CMD* 🪀
╚═══════════════╝
╭─────────────●●►
├🪀  .join — Join a group
├🪀  .leave — Leave group
├🪀  .bc — Broadcast message
├🪀  .mute / .unmute — Group lock
├🪀  .kick / .add — Manage members
├🪀  .tagall — Mention everyone
├🪀  .promote / .demote — Admin tools
├🪀  .gname / .gdesc — Edit group info
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ𝘭* ●
`;

      const mainmenu = `
╔═══════════════╗ 
║🫅 *MAIN CMD* 🫅
╚═══════════════╝
╭─────────────●●►
├🫅  .alive — Check bot status
├🫅  .ping — Speed test
├🫅  .system — Show system info
├🫅  .support — Report to owner
├🫅  .reply — Reply with ticket ID
├🫅  .devolopcount — Botdevelop count
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●
`;

      const othermenu = `
╔═══════════════╗ 
║🧣 *OTHER CMD* 🧣
╚═══════════════╝
╭─────────────●●►
├🧣  .getpp — Get profile picture
├🧣  .voicegpt — Talk with AI
├🧣  .cat — Random cat images
├🧣  .joke — Random jokes
├🧣  .weather — To check weather
├🧣  .train — to check train time
├🧣  .bus — to check bus time
├🧣  .summary — pdf to text
├🧣  .aisummary — pdf to text
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ𝘭* ●
`;

      const allmenu = `⛩️ 𝐕𝐀𝐉𝐈𝐑𝐀 𝐌𝐃 𝐗 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓 🪻

*👋 Hello ${pushname}*


🌐 *Available Commands Menu*

╭─❖ 【 🤖 BOT INFO 】
│ ⛩️ Name: 𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛
│ 🌐 Version: 4.001v
│ 👤 Owner: VajiraOfficial
│ ☁️ Host: Heroku
│ 📞 Your Number: ${number}
╰─────────────⧈

${downloadmenu}
${searchmenu}
${ownermenu}
${groupmenu}
${mainmenu}
${othermenu}

`;

      // Send main menu image + caption
      const sentMsg = await socket.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/u30plt.png' },
        caption: menumsg
      }, { quoted: msg });

      const msgId = sentMsg.key.id;

      // Await user's reply by listening to messages from same chat which reply to this menu
      const messageListener = async (messageUpdate) => {
        try {
          const mek = messageUpdate.messages[0];
          if (!mek.message) return;
          const isReply = mek.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
          if (!isReply) return;
          if (mek.key.remoteJid !== from) return; // only from same chat

          const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
          await socket.sendMessage(from, { react: { text: '🆗', key: mek.key } });

          switch (text.trim()) {
            case '1': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: downloadmenu }, { quoted: mek }); break;
            case '2': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: mainmenu }, { quoted: mek }); break;
            case '3': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: searchmenu }, { quoted: mek }); break;
            case '4': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: ownermenu }, { quoted: mek }); break;
            case '5': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: groupmenu }, { quoted: mek }); break;
            case '6': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: othermenu }, { quoted: mek }); break;
            case '7': await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, caption: allmenu }, { quoted: mek }); break;
            default: await socket.sendMessage(from, { text: "❌ Invalid option. Please reply with a number from the menu." }, { quoted: mek }); break;
          }

        } catch (e) {
          console.error(e);
        }
      };

      socket.ev.on('messages.upsert', messageListener);

      // Optional: Remove listener after some time to prevent memory leak (e.g., 2 minutes)
      setTimeout(() => {
        socket.ev.off('messages.upsert', messageListener);
      }, 2 * 60 * 1000);

    } catch (e) {
      console.error(e);
      await socket.sendMessage(msg.key.remoteJid, { text: `⚠️ *Black Fire MD Error:* ${e.message}` }, { quoted: msg });
    }
  }
};*/


/*const config = require('../config');

module.exports = {
  command: "menu",
  description: "To get the menu.",
  react: "🛍️",
  category: "main",
  execute: async (socket, msg, args, number) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";

      const menumsg = `⛩️ 𝐕𝐀𝐉𝐈𝐑𝐀 𝐌𝐃 𝐗 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓 🪻

*👋 Hello ${pushname}*

🌐 *Available Commands Menu*

╭─❖ 【 🤖 BOT INFO 】
│ ⛩️ Name: 𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛
│ 🌐 Version: 4.001v
│ 👤 Owner: VajiraOfficial
│ ☁️ Host: Heroku
│ 📞 Your Number: ${number}
╰─────────────⧈

🔢 *Reply the number you want to select...* 
╭─────────────●●►
├ 📥  *1*  DOWNLOAD
├ 🔄  *2*  MAIN
├ 🔎  *3*  SEARCH
├ 👨‍💻  *4*  OWNER
├ 🪀  *5*  GROUP
├ 🫅  *6*  OTHER
├ 📃  *7* ALL CMD
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ𝘭* ●
`;

      // Menu Definitions (same as you provided)
      const downloadmenu = `╔═══════════════╗ 
║📥 *DOWNLOAD CMD* 📥
╚═══════════════╝
╭─────────────●●►
├📥  .song — Download MP3
├📥  .video — Download video
├📥  .tiktok — Download TikTok
├📥  .facebook — Download Facebook
├📥  .apk — Download apps
├📥  .img — Download Images
├📥  .xnxx — Download 18+
├📥  .slanimeclub — Download anime
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●`;
      const searchmenu = `╔═══════════════╗ 
║🔎 *SEARCH CMD* 🔎
╚═══════════════╝
╭─────────────●●►
├🔎  .tmdb — tmdb movie search
├🔎  .news — news search
├🔎  .npm — npm search
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ𝘭* ●`;
      const ownermenu = `╔═══════════════╗ 
║👨‍💻 *OWNER CMD* 👨‍💻
╚═══════════════╝
╭─────────────●●►
├👨‍💻  .block / .unblock — Manage users
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ𝘉𝘠 ＰＲＩＮＣＥ* ●`;
      const groupmenu = `╔═══════════════╗ 
║🪀 *GROUP CMD* 🪀
╚═══════════════╝
╭─────────────●●►
├🪀  .join — Join a group
├🪀  .leave — Leave group
├🪀  .bc — Broadcast message
├🪀  .mute / .unmute — Group lock
├🪀  .kick / .add — Manage members
├🪀  .tagall — Mention everyone
├🪀  .promote / .demote — Admin tools
├🪀  .gname / .gdesc — Edit group info
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●`;
      const mainmenu = `╔═══════════════╗ 
║🫅 *MAIN CMD* 🫅
╚═══════════════╝
╭─────────────●●►
├🫅  .alive — Check bot status
├🫅  .ping — Speed test
├🫅  .system — Show system info
├🫅  .support — Report to owner
├🫅  .reply — Reply with ticket ID
├🫅  .devolopcount — Botdevelop count
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ 𝘉𝘠 ＰＲＩＮＣＥ* ●`;
      const othermenu = `╔═══════════════╗ 
║🧣 *OTHER CMD* 🧣
╚═══════════════╝
╭─────────────●●►
├🧣  .getpp — Get profile picture
├🧣  .voicegpt — Talk with AI
├🧣  .cat — Random cat images
├🧣  .joke — Random jokes
├🧣  .weather — To check weather
├🧣  .train — to check train time
├🧣  .bus — to check bus time
├🧣  .summary — pdf to text
├🧣  .aisummary — pdf to text
╰─────────────●●►

● *ＰＲＩＮＣＥ　ＭＩＮＩ𝘐 𝘔𝘋 𝘉𝘠 ＰＲＩＮＣＥ* ●`;
      const allmenu = `${downloadmenu}${searchmenu}${ownermenu}${groupmenu}${mainmenu}${othermenu}`;

      // Send banner image + main caption
      const sentMsg = await socket.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/u30plt.png' },
        caption: menumsg
      }, { quoted: msg });

      const msgId = sentMsg.key.id;

      // Handle user replies (1–7)
      const messageListener = async (messageUpdate) => {
        try {
          const mek = messageUpdate.messages[0];
          if (!mek.message) return;
          const isReply = mek.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
          if (!isReply || mek.key.remoteJid !== from) return;

          const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
          await socket.sendMessage(from, { react: { text: '🆗', key: mek.key } });

          const replyImage = 'https://files.catbox.moe/ao1lcx.jpg';
          const send = (caption) => socket.sendMessage(from, { image: { url: replyImage }, caption }, { quoted: mek });

          switch (text.trim()) {
            case '1': return send(downloadmenu);
            case '2': return send(mainmenu);
            case '3': return send(searchmenu);
            case '4': return send(ownermenu);
            case '5': return send(groupmenu);
            case '6': return send(othermenu);
            case '7': return send(allmenu);
            default:
              return socket.sendMessage(from, { text: "❌ Invalid option. Please reply with a number from the menu." }, { quoted: mek });
          }
        } catch (e) {
          console.error(e);
        }
      };

      socket.ev.on('messages.upsert', messageListener);
      setTimeout(() => socket.ev.off('messages.upsert', messageListener), 2 * 60 * 1000);

      // ✅ BONUS: Add Meta AI style button menu
   

    } catch (e) {
      console.error(e);
      await socket.sendMessage(msg.key.remoteJid, {
        text: `⚠️ *Error:* ${e.message}`
      }, { quoted: msg });
    }
  }
};*/ 


const config = require('../config');

module.exports = {
  command: "menu",
  description: "To get the menu.",
  react: "🛍️",
  category: "main",
  execute: async (socket, msg, args, number) => {
    try {


const from = msg.key.remoteJid;
const sender = msg.key.participant || from;


      
    
      const pushname = msg.pushName || "there";

      // Your menu texts (unchanged)
      const menumsg = `⛩️ＰＲＩＮＣＥ-ᴍᴅ⛬ᴍɪɴɪ ʙᴏᴛ ꜱᴇʀɪꜱᴇ⛩️

*👋 ʜᴇʟʟᴏ ${pushname}*

🌐 *Available Commands Menu*
╭─❖ 【 🤖 ʙᴏᴛ ɪɴꜰᴏ】
│ ⛩️ ɴᴀᴍᴇ: 𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛
│ 🌐 ᴠᴇʀꜱɪᴏɴ: 4.001v
│ ☁️ ʜᴏꜱᴛ: ʜᴇʀᴏᴋᴜ
│ 📞 ʏᴏᴜʀ ɴᴜᴍʙᴇʀ: ${number}
╰─────────────⧈
🔢 *ᴛᴀᴘ ᴀ ʙᴜᴛᴛᴏɴ ᴏʀ ʀᴇᴘʟʏ ᴛʜᴇ ɴᴜᴍʙᴇʀ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇʟᴇᴄᴛ...* 
╭─────────────●●►
├ 📥  *1*  ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ
├ 🔄  *2*  ᴍᴀɪɴ ᴍᴇɴᴜ
├ 🔎  *3*  ꜱᴇᴀʀᴄʜ ᴍᴇɴᴜ
├ 👨‍💻  *4*  ᴏᴡɴᴇʀ ᴍᴇɴᴜ
├ 🪀  *5*  ɢʀᴏᴜᴘ ᴍᴇɴᴜ
├ 🫅  *6*  ᴏᴛʜᴇʀ ᴍᴇɴᴜ
├ 📃  *7* ᴀʟʟ ᴍᴇɴᴜ
╰─────────────●●►
> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ●
`;

      // Other menus (downloadmenu, mainmenu, etc) -- keep same as you have, or shorten here for brevity

      const downloadmenu = `
╔═══════════════╗ 
║📥 *DOWNLOAD CMD* 📥
╚═══════════════╝
╭─────────────●●►
├📥  .song — Download MP3
├📥  .video — Download video
├📥  .tiktok — Download TikTok
├📥  .facebook — Download Facebook
├📥  .apk — Download apps
├📥  .img — Download Images
├📥  .xnxx — Download 18+
├📥  .slanimeclub — Download anime
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ●

`;

      const searchmenu = `
╔═══════════════╗ 
║🔎 *SEARCH CMD* 🔎
╚═══════════════╝
╭─────────────●●►
├🔎  .tmdb — tmdb movie search
├🔎  .news — news search
├🔎  .npm — npm search
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ ●
`;

      const ownermenu = `
╔═══════════════╗ 
║👨‍💻 *OWNER CMD* 👨‍💻
╚═══════════════╝
╭─────────────●●►
├👨‍💻  .block / .unblock — Manage users
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ●
`;

      const groupmenu = `
╔═══════════════╗ 
║🪀 *GROUP CMD* 🪀
╚═══════════════╝
╭─────────────●●►
├🪀  .join — Join a group
├🪀  .leave — Leave group
├🪀  .bc — Broadcast message
├🪀  .mute / .unmute — Group lock
├🪀  .kick / .add — Manage members
├🪀  .tagall — Mention everyone
├🪀  .promote / .demote — Admin tools
├🪀  .gname / .gdesc — Edit group info
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ ●
`;

      const mainmenu = `
╔═══════════════╗ 
║🫅 *MAIN CMD* 🫅
╚═══════════════╝
╭─────────────●●►
├🫅  .alive — Check bot status
├🫅  .ping — Speed test
├🫅  .system — Show system info
├🫅  .support — Report to owner
├🫅  .reply — Reply with ticket ID
├🫅  .devolopcount — Botdevelop count
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ●
`;

      const othermenu = `
╔═══════════════╗ 
║🧣 *OTHER CMD* 🧣
╚═══════════════╝
╭─────────────●●►
├🧣  .getpp — Get profile picture
├🧣  .voicegpt — Talk with AI
├🧣  .cat — Random cat images
├🧣  .joke — Random jokes
├🧣  .weather — To check weather
├🧣  .train — to check train time
├🧣  .bus — to check bus time
├🧣  .summary — pdf to text
├🧣  .aisummary — pdf to text
╰─────────────●●►

> ● ＰＲＩＮＣＥ X ＰＲＩＮＣＥ ●
`;
      const allmenu = `${downloadmenu}${searchmenu}${ownermenu}${groupmenu}${mainmenu}${othermenu}`;


const sentMsg = await socket.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/u30plt.png' },
        caption: menumsg
      }, { quoted: msg });
      
      // Send main menu WITH buttons
      await socket.sendMessage(from, {
        text: ' ',
        
        buttons: [
          { buttonId: "downloadmenu", buttonText: { displayText: "📥 Download" }, type: 1 },
        ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
      text: ' ',
        buttons: [
          { buttonId: "mainmenu", buttonText: { displayText: "🫅 Main" }, type: 1 },
        ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
        text: ' ',
      
        buttons: [
          { buttonId: "searchmenu", buttonText: { displayText: "🔎 Search" }, type: 1 },
          ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
        text: ' ',
        
        buttons: [
           { buttonId: "ownermenu", buttonText: { displayText: "👤 Owner" }, type: 1 },
          ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
        text: ' ',
        
        buttons: [
          { buttonId: "groupmenu", buttonText: { displayText: "🪀 Group" }, type: 1 },
           ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
        text: ' ',
        
        buttons: [
          { buttonId: "othermenu", buttonText: { displayText: "🧣 Other" }, type: 1 },
            ],
        headerType: 1,
      }, { quoted: msg });
      await socket.sendMessage(from, {
        text: ' ',
        
        buttons: [
          { buttonId: "allmenu", buttonText: { displayText: "📃 All Cmds" }, type: 1 },
        ],
        headerType: 1,
      }, { quoted: msg });

      // Listen for reply or button presses
      const msgId = sentMsg.key.id;

      // Handler function for both buttons and text replies
      const handleResponse = async (messageUpdate) => {
        try {
          const mek = messageUpdate.messages[0];
          if (!mek.message) return;
          if (mek.key.remoteJid !== from) return; // Only from same chat

          // Check if this message is a reply to the menu or a button press
          const isReplyToMenu = mek.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
          const isButtonResponse = mek.message.buttonsResponseMessage?.selectedButtonId;

          if (!isReplyToMenu && !isButtonResponse) return;

          await socket.sendMessage(from, { react: { text: '🆗', key: mek.key } });

          // Determine choice from buttonId or text
          let choice = '';

          if (isButtonResponse) {
            choice = mek.message.buttonsResponseMessage.selectedButtonId;
          } else if (isReplyToMenu) {
            // user replied with text number
            const text = mek.message.conversation || mek.message.extendedTextMessage?.text || '';
            choice = text.trim();
          }

          // Respond based on choice
          switch (choice) {
            case '1':
            case 'downloadmenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: downloadmenu }, { quoted: mek });
              break;
            case '2':
            case 'mainmenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: mainmenu }, { quoted: mek });
              break;
            case '3':
            case 'searchmenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: searchmenu }, { quoted: mek });
              break;
            case '4':
            case 'ownermenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: ownermenu }, { quoted: mek });
              break;
            case '5':
            case 'groupmenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: groupmenu }, { quoted: mek });
              break;
            case '6':
            case 'othermenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: othermenu }, { quoted: mek });
              break;
            case '7':
            case 'allmenu':
              await socket.sendMessage(from, { image: { url: 'https://files.catbox.moe/u30plt.png' }, caption: allmenu }, { quoted: mek });
              break;
            default:
              await socket.sendMessage(from, { text: "❌ Invalid option. Please reply with a valid number or tap a button." }, { quoted: mek });
              break;
          }
        } catch (e) {
          console.error(e);
        }
      };

      socket.ev.on('messages.upsert', handleResponse);

      // Remove listener after 2 minutes to avoid memory leaks
      setTimeout(() => {
        socket.ev.off('messages.upsert', handleResponse);
      }, 2 * 60 * 1000);

    } catch (e) {
      console.error(e);
      await socket.sendMessage(msg.key.remoteJid, { text: `⚠️ *Vajira  MD Error:* ${e.message}` }, { quoted: msg });
    }
  }
};
