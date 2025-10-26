const fs = require('fs');
const path = require('path');

const PASSWORD_FILE = path.join(__dirname, 'password.json');
const RESET_FILE = path.join(__dirname, 'resetpassword.json');

const PASSWORD_ATTEMPT_LIMIT = 3;
const LOCKOUT_DURATION_MINUTES = 5;

let wrongAttempts = {};

// Countdown function
const countdownTimer = async (socket, sender, quoted, durationMs) => {
  let endTime = Date.now() + durationMs;
  let { key } = await socket.sendMessage(sender, { text: '🔒 Lockdown initiated...' }, { quoted });

  while (Date.now() < endTime) {
    const remaining = endTime - Date.now();
    const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
    const text = `⏳ Lockout time remaining: ${minutes}:${seconds}`;

    await socket.sendMessage(sender, { text, edit: key });
    await new Promise(res => setTimeout(res, 1000));
  }

  await socket.sendMessage(sender, { text: `✅ Lockout ended. Try again.`, edit: key });
};

module.exports = {
  command: 'chack',
  description: 'Password protection system',
  category: 'security',
  use: '.chack <password>',

  execute: async (socket, msg, args) => {
    let senderId = msg.sender || msg.key?.participant || msg.key?.remoteJid || '';
    if (!senderId) {
      return await socket.sendMessage(senderId, { text: '❌ Sender ID not found.' }, { quoted: msg });
    }

    const number = senderId.split('@')[0];
    const inputPassword = args.length ? args.join(' ') : '';

    // Load saved passwords
    let savedPasswords = {};
    if (fs.existsSync(PASSWORD_FILE)) {
      try {
        savedPasswords = JSON.parse(fs.readFileSync(PASSWORD_FILE));
      } catch {
        savedPasswords = {};
      }
    }

    // Check lockout
    if (wrongAttempts[number] && wrongAttempts[number].lockedUntil > Date.now()) {
      const remainingTime = wrongAttempts[number].lockedUntil - Date.now();
      await countdownTimer(socket, senderId, msg, remainingTime);
      return;
    }

    // First-time user
    if (!savedPasswords[number]) {
      if (!inputPassword) {
        return await socket.sendMessage(senderId, {
          text: `🔐 ඔබේ password එක යොදන්න:\nඋදාහරණයක්: .chack mypassword`
        }, { quoted: msg });
      }
      savedPasswords[number] = inputPassword;
      fs.writeFileSync(PASSWORD_FILE, JSON.stringify(savedPasswords, null, 2));
      await socket.sendMessage(senderId, { text: `✅ ඔබේ password එක සාර්ථකව සුරකින ලදි.` }, { quoted: msg });
      return;
    }

    const correctPassword = savedPasswords[number];
    if (inputPassword === correctPassword) {
      wrongAttempts[number] = null;
      await socket.sendMessage(senderId, { text: `✅ Welcome back, සාර්ථකව ඇතුල් විය.` }, { quoted: msg });
    } else {
      if (!wrongAttempts[number]) wrongAttempts[number] = { count: 0, lockedUntil: 0 };
      wrongAttempts[number].count += 1;

      if (wrongAttempts[number].count >= PASSWORD_ATTEMPT_LIMIT) {
        wrongAttempts[number].lockedUntil = Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000;
        await countdownTimer(socket, senderId, msg, LOCKOUT_DURATION_MINUTES * 60 * 1000);
        return;
      } else {
        const remaining = PASSWORD_ATTEMPT_LIMIT - wrongAttempts[number].count;
        return await socket.sendMessage(senderId, {
          text: `❌ වැරදි password එකකි. ඉතුරු උත්සාහයන්: ${remaining}`
        }, { quoted: msg });
      }
    }

    // Save to reset list
    let resetList = {};
    if (fs.existsSync(RESET_FILE)) {
      try {
        resetList = JSON.parse(fs.readFileSync(RESET_FILE));
      } catch {
        resetList = {};
      }
    }

    if (!resetList[number]) {
      resetList[number] = correctPassword;
      fs.writeFileSync(RESET_FILE, JSON.stringify(resetList, null, 2));
    }
  }
};
