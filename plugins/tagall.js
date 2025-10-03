module.exports = {
  command: "tagall",
  desc: "Tag everyone in the group",
  category: "group",
  use: ".tagall",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg) => {
    const metadata = await sock.groupMetadata(msg.key.remoteJid);
    const participants = metadata.participants.map(p => p.id);

    const mentions = participants.map(id => "@" + id.split("@")[0]).join(" ");

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📢 *TAGALL*\n\n${mentions}`,
      mentions: participants
    }, { quoted: msg });
  }
};
