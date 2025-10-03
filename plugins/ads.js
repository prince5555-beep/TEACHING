const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

const adsPath = path.join(__dirname, "../ads.json");
const PASSWORD = "1234vajiramd";

module.exports = {
  command: "ads",
  description: "Set or remove bot ad (with password)",

  async execute(sock, msg, args) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const jid = msg.key.remoteJid;
    const subcmd = args[0];

    
    if (subcmd === "remove") {
      if (args[1] !== PASSWORD) {
        return await sock.sendMessage(sender, {
          text: "❌ *Incorrect password!*\nUsage: `.ads remove <your-passworld>`"
        });
      }

      if (fs.existsSync(adsPath)) {
        fs.unlinkSync(adsPath);
        await sock.sendMessage(sender, {
          text: "✅ Ad removed successfully!"
        });

        
        await sock.sendMessage(jid, { delete: msg.key });
        return;
      } else {
        return await sock.sendMessage(sender, {
          text: "⚠️ No ad is currently set."
        });
      }
    }

  
    if (!subcmd || subcmd !== PASSWORD) {
      return await sock.sendMessage(sender, {
        text: "*🔐 Enter password to set ad.*\nUsage:\n`.ads <your-passworld> Your ad text` (as reply to image/video)"
      });
    }

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
      return await sock.sendMessage(sender, {
        text: "❌ Please reply to an image or video with your ad caption.\n\n_Example:_\n`.ads <your-passworld> Buy now!🔥` (as reply)"
      });
    }

    const mediaType = quoted.imageMessage ? "image" : "video";

    const buffer = await downloadMediaMessage(
      { message: quoted },
      "buffer",
      {},
      { logger: sock.logger, reuploadRequest: sock.updateMediaMessage }
    );

    const allWords = msg.message?.extendedTextMessage?.text?.trim().split(" ") || [];
    const caption = allWords.slice(2).join(" ") || "🔥 Ad";

    const adData = {
      type: mediaType,
      media: buffer.toString("base64"),
      caption: caption
    };

    fs.writeFileSync(adsPath, JSON.stringify(adData, null, 2));
    await sock.sendMessage(sender, {
      text: "✅ Ad saved successfully! It will appear under all bot commands."
    });

    
    await sock.sendMessage(jid, { delete: msg.key });
  }
};
