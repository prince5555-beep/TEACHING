const path = require("path");
const fs = require("fs");

module.exports = {
  command: "run",
  description: "Run temporary saved command",
  category: "owner",

  async execute(sock, msg, args = []) {
    const jid = msg.key.remoteJid;
    const codePath = path.join(__dirname, "../tempCode.js");

    // ✅ validate input
    if (args.length === 0) {
      return sock.sendMessage(jid, {
        text: "⚠️ Run කරන්න ඕන command එක specify කරන්න. (උදා: `.run alive`)",
      });
    }

    const inputCommand = args[0].toLowerCase();

    // ✅ check file exists
    if (!fs.existsSync(codePath)) {
      return sock.sendMessage(jid, {
        text: "❌ Temporary code එකක් save කරලා නැහැ. `.codeadd` එකක් දාන්න.",
      });
    }

    try {
      // 🧹 clear require cache
      delete require.cache[require.resolve(codePath)];

      const tempCommand = require(codePath);

      // ✅ validate structure
      if (!tempCommand || typeof tempCommand !== "object") {
        return sock.sendMessage(jid, {
          text: "❌ Code එකෙන් valid command object එකක් export වෙලා නෑ.",
        });
      }

      // ✅ check command match
      if (tempCommand.command !== inputCommand) {
        return sock.sendMessage(jid, {
          text: `❌ Code එක "${inputCommand}" command එකට match වෙන්නෙ නෑ. ඔයාල save කරපු එක: "${tempCommand.command}"`,
        });
      }

      // ✅ execute command
      if (typeof tempCommand.execute === "function") {
        await tempCommand.execute(sock, msg, args.slice(1));
      } else {
        return sock.sendMessage(jid, {
          text: "❌ `execute()` function එකක් නැහැ. Valid command object එකක්ද බලන්න.",
        });
      }

    } catch (err) {
      console.error("[RUN COMMAND ERROR]", err);
      return sock.sendMessage(jid, {
        text: `❌ Code එක run කරන්න ගියපොදුවේ error එකක් ආවා:\n\`\`\`${err.toString()}\`\`\``,
      });
    }
  }
};
