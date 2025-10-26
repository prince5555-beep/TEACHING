const fs = require("fs");
const path = require("path");

const SUPPORT_LOG_FILE = path.join(__dirname, "../lib/support-logs.json");
const OWNER_JID = "94719199757@s.whatsapp.net"; // Your number here

// Load support logs
function loadSupportLogs() {
    if (!fs.existsSync(SUPPORT_LOG_FILE)) {
        fs.writeFileSync(SUPPORT_LOG_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(SUPPORT_LOG_FILE));
}

function saveSupportLogs(data) {
    fs.writeFileSync(SUPPORT_LOG_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  command: "reply",
  desc: "Reply to user support ticket",
  category: "main",
  use: ".reply <ticketID> <message>",
  fromMe: true,
  filename: __filename,
  react: "✉️",

  execute: async (socket, msg, args) => {
    try {
      const supportLogs = loadSupportLogs();
      const sender = msg.key.remoteJid;
      const q = args.join(" ").trim();

      if (!q) {
        return await socket.sendMessage(sender, { text: "❗ Usage: .reply <ticketID> <message>" }, { quoted: msg });
      }

      const spaceIndex = q.indexOf(" ");
      if (spaceIndex === -1) {
        return await socket.sendMessage(sender, { text: "❗ Usage: .reply <ticketID> <message>" }, { quoted: msg });
      }

      const ticketID = q.slice(0, spaceIndex).toUpperCase();
      const message = q.slice(spaceIndex + 1).trim();

      const ticket = supportLogs[ticketID];
      if (!ticket) {
        return await socket.sendMessage(sender, { text: `❌ Ticket ID *#${ticketID}* not found.` }, { quoted: msg });
      }

      if (ticket.status === "closed") {
        return await socket.sendMessage(sender, { text: `ℹ️ Ticket *#${ticketID}* is already closed.` }, { quoted: msg });
      }

      // Send reply to user
      await socket.sendMessage(ticket.userJid, {
        text: `📩 *Support Reply (#${ticketID}):*\n\n${message}`
      });

      // Update ticket status
      supportLogs[ticketID].status = "closed";
      supportLogs[ticketID].reply = message;
      supportLogs[ticketID].replyTime = new Date().toISOString();

      saveSupportLogs(supportLogs);

      await socket.sendMessage(sender, {
        text: `✅ Replied to ticket *#${ticketID}* and marked it as closed.`,
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await socket.sendMessage(msg.key.remoteJid, {
        text: "⚠️ Failed to send reply message. Try again later."
      }, { quoted: msg });
    }
  }
};
