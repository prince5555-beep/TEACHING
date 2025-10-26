// list.js

let recentList = {};

module.exports = {
  command: 'list',
  description: 'Show command list with emoji reactions',
  type: 'default',

  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;
    const user = msg.key.participant || msg.key.remoteJid;

    // Emoji to command mapping
    const emojiMap = {
      '⚡': 'menu',
      '💗': 'alive',
      '👍': 'owner'
    };

    let listText = '*📃 React with an emoji to run a command:*\n\n';
    for (const [emoji, cmd] of Object.entries(emojiMap)) {
      listText += `${emoji} → *${cmd}*\n`;
    }

    // Send message
    const sentMsg = await sock.sendMessage(sender, {
      text: listText.trim(),
      quoted: msg,
    });

    // Store recent message + emoji map
    recentList[sentMsg.key.id] = {
      emojiMap,
      user,
      from: sender,
    };
  },

  recentList: () => recentList,

  // reaction handler inside list.js but
  // this function must be called from main event listener on reaction event
  onReaction: async (sock, msg, plugins) => {
    try {
      if (!msg.message?.reaction) return; // ignore if no reaction

      const { key, reaction } = msg.message.reaction;
      const emoji = reaction;
      const msgId = key.id;
      const sender = key.remoteJid;
      const reactingUser = key.participant;

      const data = recentList[msgId];
      if (!data) return; // no stored list message

      // Only allow original sender to react
      if (reactingUser !== data.user) return;

      const commandName = data.emojiMap[emoji];
      if (!commandName) return;

      const command = plugins.find(p => p.command === commandName);
      if (!command) return;

      const fakeMsg = {
        key: {
          remoteJid: sender,
          fromMe: false,
          id: `fake-${Date.now()}`
        },
        message: {
          conversation: `.${commandName}`
        },
        pushName: 'Reaction',
        participant: reactingUser
      };

      console.log(`Executing command via reaction: ${commandName}`);

      await command.execute(sock, fakeMsg, plugins);
    } catch (err) {
      console.error('Reaction Handler Error:', err);
    }
  }
};
