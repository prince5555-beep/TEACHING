module.exports = {
  command: "kick",
  desc: "Remove member(s) from group",
  category: "group",
  use: ".kick @user or reply",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg, args) => {
    const { remoteJid, participant } = msg.key;

    if (!remoteJid.endsWith("@g.us")) {
      return sock.sendMessage(remoteJid, { text: "❌ This command is for groups only." }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const isReply = msg.message?.extendedTextMessage?.contextInfo?.participant;

    const targets = mentioned.length ? mentioned : isReply ? [msg.message.extendedTextMessage.contextInfo.participant] : [];

    if (!targets.length) return sock.sendMessage(remoteJid, { text: "❗ Mention or reply to a user to kick." }, { quoted: msg });

    for (let user of targets) {
      await sock.groupParticipantsUpdate(remoteJid, [user], "remove");
    }
  }
};
