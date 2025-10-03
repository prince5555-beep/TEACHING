const { exec } = require('child_process');

module.exports = {
  name: 'herokulog',
  description: 'Show latest Heroku app logs',
  category: 'system',
  async execute(socket, msg, { text }) {
    const sender = msg.sender;
    
    const HEROKU_OAUTH_ID = process.env.HEROKU_OAUTH_ID;
    const HEROKU_OAUTH_SECRET = process.env.HEROKU_OAUTH_SECRET;
    const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME || 'vajiramini';

    if (!HEROKU_OAUTH_ID || !HEROKU_OAUTH_SECRET) {
      return socket.sendMessage(sender, { text: '❌ Heroku credentials are not configured properly.' });
    }

    // Run Heroku logs command
    exec(`HEROKU_OAUTH_ID=${HEROKU_OAUTH_ID} HEROKU_OAUTH_SECRET=${HEROKU_OAUTH_SECRET} heroku logs --app ${HEROKU_APP_NAME} --num 50`, (error, stdout, stderr) => {
      if (error) {
        return socket.sendMessage(sender, { text: '❌ Error fetching logs: ' + error.message });
      }

      if (!stdout) {
        return socket.sendMessage(sender, { text: '⚠️ No logs available.' });
      }

      // Send log output as WhatsApp message (first 4000 characters max)
      socket.sendMessage(sender, { text: '```' + stdout.slice(0, 4000) + '```', mimetype: 'text/plain' });
    });
  }
};
