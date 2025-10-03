const axios = require('axios');
const { prefix: PREFIX } = require('../config');

const thumbUrl = "https://files.catbox.moe/4f4adq.jpg";

async function sendUnknownCommandReply(sock, msg, sender) {
  try {
   
    const { data: thumbBuffer } = await axios.get(thumbUrl, { responseType: 'arraybuffer' });

    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: `❌ මෙම command එක නොපවතී.\nකරුණාකර \`${PREFIX}menu\` ටයිප් කර නැවත උත්සාහ කරන්න.`,
      contextInfo: {
        mentionedJid: [sender, "94719199757@s.whatsapp.net"],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "META AI • Command Not Found",
          body: "ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ",
          mediaType: 2,
          thumbnailUrl: thumbUrl,
          jpegThumbnail: thumbBuffer,
          sourceUrl: "https://wa.me/13135550002?s=5",
        },
      },
    });
  } catch (error) {
    console.error("❌ Error sending unknown command reply:", error);
    await sock.sendMessage(msg.from, {
      text: `❌ මෙම command එක නොපවතී. කරුණාකර \`${PREFIX}menu\` ටයිප් කර නැවත උත්සාහ කරන්න.`,
    });
  }
}

module.exports = {
  sendUnknownCommandReply,
};
