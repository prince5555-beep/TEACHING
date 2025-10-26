const fs = require("fs");
const { prepareWAMessageMedia } = require("@whiskeysockets/baileys");

module.exports = {
  command: "own",
  description: "Show owner contacts, website button and command list",
  category: "info",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // 1️⃣ Send Sticker
    const stickerPath = "./owner.webp";
    if (fs.existsSync(stickerPath)) {
      const stickerBuffer = fs.readFileSync(stickerPath);

      const message = await prepareWAMessageMedia(
        { image: stickerBuffer },
        { upload: sock.waUploadToServer }
      );

      await sock.sendMessage(jid, {
        sticker: message.image,
        mimetype: "image/webp",
      });
    }

    // 2️⃣ Send Contacts
    const contacts = [
      {
        displayName: "Vajira OFc",
        vcard: `
BEGIN:VCARD
VERSION:3.0
FN:Vajira OFc
TEL;type=CELL;type=VOICE;waid=94719199757:+94719199757
END:VCARD`.trim(),
      },
      {
        displayName: "MR-Hansamala",
        vcard: `
BEGIN:VCARD
VERSION:3.0
FN:MR-Hansamala
TEL;type=CELL;type=VOICE;waid=94701197452:+94701197452
END:VCARD`.trim(),
      },
    ];

    for (const contact of contacts) {
      await sock.sendMessage(jid, {
        contacts: {
          displayName: contact.displayName,
          contacts: [{ vcard: contact.vcard }],
        },
      });
    }

    // 3️⃣ Send List Menu
    await sock.sendMessage(jid, {
      title: "📑ᴏᴡɴᴇʀꜱ ɪɴꜰᴏx📑",
      text: "ᴄɪᴄᴋ ᴛʜᴇ ᴏᴡɴᴇʀꜱ ɪɴꜰᴏ ʙᴜᴛᴛᴏɴ🖲📋",
      footer: "● ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ ●",
      buttonText: "☤ᴏᴡɴᴇʀꜱ ɪɴꜰᴏ☤",
      sections: [
        {
          title: "ᴠᴀᴊɪʀᴀ ᴏꜰᴄ",
          rows: [
            {
              title: "ɴᴀᴍᴇ",
              description: "👨‍💻ᴠᴀᴊɪʀᴀ ʀᴀᴛʜɴᴀʏᴀᴋᴀ👨‍💻",
              rowId: ".owner",
            },
            {
              title: "ᴀɢᴇ",
              description: "ᴀɢᴇ - ➋➍",
              rowId: ".owner",
            },
            {
              title: "ᴄᴏᴜɴᴛʀʏ",
              description: "🇱🇰ꜱʀɪ-ʟᴀɴᴋᴀ🇱🇰",
              rowId: ".owner",
            },
          ],
        },
        {
          title: "ᴍʀ ʜᴀɴꜱᴀᴍᴀʟᴀ",
          rows: [
            {
              title: "ɴᴀᴍᴇ",
              description: "ꜱʜᴀꜱʜɪᴋᴀ ᴄʜɪʀᴀᴛʜ ʜᴀɴꜱᴀᴍᴀʟᴀ",
              rowId: ".owner",
            },
            {
              title: "ᴀɢᴇ",
              description: "ᴀɢᴇ - ➁O",
              rowId: ".owner",
            },
            {
              title: "ᴄᴏᴜɴᴛʀʏ",
              description: "🇱🇰ꜱʀɪ ʟᴀɴᴀᴋᴀ🇱🇰",
              rowId: ".owner",
            },
          ],
        },
      ],
    });
  },
};
