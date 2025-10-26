module.exports = {
  command: "add",
  desc: "Add member to group",
  category: "group",
  use: ".add <number>",
  fromMe: true,
  filename: __filename,

  execute: async (socket, msg, args) => {
    const { remoteJid } = msg.key;
    const sender = msg.key.participant || msg.key.remoteJid; // who sent command
    

    if (!remoteJid.endsWith("@g.us")) {
      return socket.sendMessage(remoteJid, { text: "❗ Group only command." }, { quoted: msg });
    }

    if (!number) {
      return socket.sendMessage(remoteJid, { text: "❗ Provide a number to add." }, { quoted: msg });
    }

    try {
      await socket.groupParticipantsUpdate(remoteJid, [`${number}@s.whatsapp.net`], "add");
    } catch {
      socket.sendMessage(remoteJid, { 
        text: "⚠️ Failed to add user. Maybe the number is incorrect or private." 
      }, { quoted: msg });
    }
  }
};
