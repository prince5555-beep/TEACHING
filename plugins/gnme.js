module.exports = {
  command: "gname",
  desc: "Change group name",
  category: "group",
  use: ".gname <new name>",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg, args) => {
    const newName = args.join(" ");
    if (!newName) return sock.sendMessage(msg.key.remoteJid, { text: "❗ Provide a name." }, { quoted: msg });
    await sock.groupUpdateSubject(msg.key.remoteJid, newName);
  }
};
