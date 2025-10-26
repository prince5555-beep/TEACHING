module.exports = {
  command: "owner",
  description: "Show owner contacts, website button and command list",
  category: "info",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

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

    // Send contacts
    for (const contact of contacts) {
      await sock.sendMessage(jid, {
        contacts: {
          displayName: contact.displayName,
          contacts: [{ vcard: contact.vcard }],
        },
      });
    }

    // Send list message with 2 sections
    await sock.sendMessage(jid, {
      title: "📑ᴏᴡɴᴇʀꜱ ɪɴꜰᴏx📑",
      text: "ᴄɪᴄᴋ ᴛʜᴇ ᴏᴡᴇʀꜱ ɪɴꜰᴏ ʙᴜᴛᴛᴏɴ🖲📋",
      footer: "● ＰＲＩＮＣＥ●",
      buttonText: "☤ᴏᴡɴᴇʀꜱ ɪɴꜰᴏ☤",
      sections: [
        {
          title: "ＰＲＩＮＣＥ",
          rows: [
            {
              title: "ɴᴀᴍᴇ",
              description: "👨‍💻ＰＲＩＮＣＥ👨‍💻",
              rowId: ".owner",
            },
            {
              title: "ᴀɢᴇ",
              description: "ᴀɢᴇ - 23",
              rowId: ".owner",
            },
            {
              title: "ᴄᴏᴜɴʀᴛʏ",
              description: "🇱🇰TANZANIA🇱🇰",
              rowId: ".owner",
            },
          ],
        },
        {
          title: "ＰＲＩＮＣＥ",
          rows: [
            {
              title: "ɴᴀᴍᴇ",
              description:"ＰＲＩＮＣＥ",
              rowId: ".owner",
            },
            {
              title: "ᴀɢᴇ",
              description: "ᴀɢᴇ - ➁O",
              rowId: ".owner",
            },
{
              title: "ᴄᴏᴜɴʀᴛʏ",
              description: "🇱🇰 TANZANIA 🇱🇰",
              rowId: ".owner",
            },

          ],
        },
      ],
    });
  },
};
