const vm = require('vm');

module.exports = {
  command: 'cedid',
  description: '🛠️ Check if the given JavaScript code is valid',
  category: 'tools',
  use: '.cedid ```js\nconst a = 1;\n```',

  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const reply = (text) => socket.sendMessage(sender, { text }, { quoted: msg });

    try {
      // Validate presence of code
      if (!body) {
        return reply("❗️ Please provide code.\n\nExample:\n.cedid ```js\nconst a = 1;\n```");
      }

      // Ensure the message contains a triple-backtick code block
      const codeMatch = body.match(/```(?:js|javascript)?\s*([\s\S]+?)\s*```/i);
      if (!codeMatch) {
        return reply("❗️ Please wrap your code inside triple backticks like this:\n```js\nconsole.log('Hello');\n```");
      }

      const userCode = codeMatch[1];

      // Try parsing the code (syntax check)
      new vm.Script(userCode);
      return reply("✅ *Correct code!*");

    } catch (err) {
      console.error("Code validation error:", err);
      return socket.sendMessage(sender, {
        text: `❌ *Invalid code!*\n\n🪵 *Error:* ${err.message}`
      }, { quoted: msg });
    }
  }
};
