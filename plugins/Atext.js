const fs = require("fs");

module.exports = {
  command: "textm",
  description: "Show Menu with Owner button side by side",
  category: "info",

  async execute(sock, m) {
    const jid = m.key.remoteJid;

    await sock.sendMessage(jid, {
      text: "⭐ Select an option below:",
      footer: "© ",
      buttons: [
        {
          buttonId: ".menu",
          buttonText: { displayText: "📋 MENU" },
          type: 1
        },
        {
          buttonId: ".owner",
          buttonText: { displayText: "👑 OWNER" },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m });
  }
};
