const { exec } = require('child_process');

module.exports = {
  command: 'npm',
  description: 'Install or uninstall npm packages',
  category: 'system',

  async execute(socket, msg, args) {
    if (!args || args.length < 2) {
      await socket.sendMessage(msg.key.remoteJid, {
        text: 'Usage: npm <install|uninstall> <package-name>'
      });
      return;
    }

    const action = args[0];
    const packageName = args[1];

    if (!['install', 'uninstall'].includes(action)) {
      await socket.sendMessage(msg.key.remoteJid, {
        text: 'Action must be "install" or "uninstall".'
      });
      return;
    }

    const cmd = `npm ${action} ${packageName}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        socket.sendMessage(msg.key.remoteJid, { text: `Error: ${error.message}` });
        return;
      }
      if (stderr) {
        socket.sendMessage(msg.key.remoteJid, { text: `stderr: ${stderr}` });
        return;
      }
      socket.sendMessage(msg.key.remoteJid, { text: `Success:\n${stdout}` });
    });
  }
};
