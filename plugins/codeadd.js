const fs = require("fs");
const path = require("path");

module.exports = {
  command: "codeadd",
  description: "Add a temporary full JS command",
  category: "owner",

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = args.join(" ");

    if (!text || !text.includes("module.exports")) {
      return sock.sendMessage(jid, {
        text: "⚠️ කරුණාකර valid JavaScript command object එකක් එවන්න. (උදා: `.codeadd module.exports = { command: \"alive\", ... }`)",
      });
    }

    const codePath = path.join(__dirname, "../tempCode.js");

    // Directly write the code
    fs.writeFileSync(codePath, text);

    await sock.sendMessage(jid, {
      text: "✅ Command එක temporary save කරා. `.run alive` කියලා test කරන්න.",
    });

    // Delete after 5 mins
    setTimeout(() => {
      if (fs.existsSync(codePath)) {
        fs.unlinkSync(codePath);
      }
    }, 5 * 60 * 1000);
  },
};
