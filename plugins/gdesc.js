module.exports = {
  command: "gdesc",
  desc: "Change group description",
  category: "group",
  use: ".gdesc <new description>",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg, args) => {
    const newDesc = args.join(" ");
    if (!newDesc) return sock.sendMessage(msg.key.remoteJid, { text: "❗ Provide a description." }, { quoted: msg });
    await sock.groupUpdateDescription(msg.key.remoteJid, newDesc);
  }
};
