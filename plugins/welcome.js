
const fs = require('fs');
const path = require('path');
const settingsFile = path.join(__dirname, '../group-settings.json');

let groupSettings = {};
if (fs.existsSync(settingsFile)) {
  try {
    groupSettings = JSON.parse(fs.readFileSync(settingsFile));
  } catch {
    groupSettings = {};
  }
}

function saveSettings() {
  fs.writeFileSync(settingsFile, JSON.stringify(groupSettings, null, 2));
}

module.exports = {
  command: "welcome",
  desc: "Toggle welcome messages ON/OFF",
  category: "group",
  filename: __filename,
  fromMe: false,
  onlyGroup: true,
  admin: true,
  use: ".welcome <on|off>",

  execute: async (socket, msg, args) => {
    const gid = msg.key.remoteJid;
    if (!args[0]) {
      return await socket.sendMessage(gid, {
        text: "❗ Usage: .welcome on\nor\n.welcome off"
      }, { quoted: msg });
    }

    const option = args[0].toLowerCase();
    if (!['on', 'off'].includes(option)) {
      return await socket.sendMessage(gid, {
        text: "❗ Invalid option! Use 'on' or 'off'."
      }, { quoted: msg });
    }

    if (!groupSettings[gid]) {
      groupSettings[gid] = {
        welcomeEnabled: false
      };
    }

    groupSettings[gid].welcomeEnabled = option === 'on';
    saveSettings();

    await socket.sendMessage(gid, {
      text: `✅ Welcome messages are now *${option.toUpperCase()}*`
    }, { quoted: msg });
  }
};
