module.exports = {
  command: "leave",
  desc: "Leave the current group",
  category: "owner",
  use: ".leave",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg) => {
    const { remoteJid } = msg.key;

    if (!remoteJid.endsWith("@g.us")) {
      return sock.sendMessage(remoteJid, { text: "⚠️ This command can only be used in a group." }, { quoted: msg });
    }

    await sock.sendMessage(remoteJid, { text: "👋 Leaving the group..." }, { quoted: msg });
    await sock.groupLeave(remoteJid);
  }
};
