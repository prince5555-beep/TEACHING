const fs = require("fs");
const path = require("path");

module.exports = {
  command: "contactlist",
  description: "📇 Show all contacts registered in contactlist",
  category: "info",

  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    try {
      const contactFile = path.join(__dirname, "../lib/contacts.json");

      // Check if the contact file exists
      if (!fs.existsSync(contactFile)) {
        return await socket.sendMessage(sender, { text: "❌ contactlist.json file එක හමු නොවිනි!" }, { quoted: msg });
      }

      // Read and parse the contact file
      const contactsData = fs.readFileSync(contactFile, "utf-8");

      let contactList;
      try {
        contactList = JSON.parse(contactsData);
      } catch (err) {
        return await socket.sendMessage(sender, { text: "⚠️ contactlist.json file එකේ format එක වැරදියි!" }, { quoted: msg });
      }

      // Check if the contact list is empty
      if (!Array.isArray(contactList) || contactList.length === 0) {
        return await socket.sendMessage(sender, { text: "📭 Contact list එක හිස්වයි!" }, { quoted: msg });
      }

      // Build the message
      let msgText = `📇 *Contact List (${contactList.length} members)*\n\n`;
      contactList.forEach((contact, index) => {
        msgText += `${index + 1}. wa.me/${contact.replace(/[^0-9]/g, "")}\n`;
      });

      await socket.sendMessage(sender, { text: msgText }, { quoted: msg });

    } catch (err) {
      console.error("❌ Error in contactlist command:", err);
      await socket.sendMessage(sender, { text: "❌ කණගාටුයි, contact list එක load කල නොහැක." }, { quoted: msg });
    }
  }
};
