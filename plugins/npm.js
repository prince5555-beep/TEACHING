const axios = require("axios");
const moment = require("moment");
const config = require("../config");

module.exports = {
  command: "npmweb",
  desc: "Check details of an NPM package",
  category: "search",
  use: ".npm <package>",
  filename: __filename,

  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ").trim();
    if (!text)
      return socket.sendMessage(
        msg.from,
        { text: "❌ Please enter an NPM package name.\nExample: `.npm axios`" },
        { quoted: msg }
      );

    try {
      const [meta, downloads] = await Promise.all([
        axios.get(`https://registry.npmjs.org/${text}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-week/${text}`),
      ]);

      const data = meta.data;
      const latest = data["dist-tags"].latest;
      const version = data.versions[latest];
      const maintainers = version.maintainers?.map((m) => m.name).join(", ") || "N/A";

      const created = moment(data.time.created).format("YYYY-MM-DD");
      const modified = moment(data.time.modified).format("YYYY-MM-DD");
      const weeklyDownloads = downloads.data.downloads.toLocaleString();

      const caption = `
┏━━━❰ 📦 *NPM PACKAGE INFO* ❱━━━┓
┃
┃ 🧩 *Name:* ${data.name}
┃ ✨ *Version:* ${latest}
┃ 📝 *Description:* ${data.description || "N/A"}
┃ 👤 *Author:* ${version.author?.name || "N/A"}
┃ 🛠️ *Maintainers:* ${maintainers}
┃
┃ 📅 *Created:* ${created}
┃ ♻️ *Updated:* ${modified}
┃ 📈 *Weekly Downloads:* ${weeklyDownloads}
┃ 🔗 *Homepage:* ${version.homepage || "N/A"}
┃
┃ 💾 *Install:* \`npm install ${data.name}\`
┃ 🔍 *More Info:* https://www.npmjs.com/package/${data.name}
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> 𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘔𝘋 𝘉𝘠 𝘝𝘢𝘫𝘪𝘳𝘢𝘖𝘧𝘧𝘪𝘤𝘪𝘢𝘭`;

      await socket.sendMessage(sender, { text: caption.trim() }, { quoted: msg });

    } catch (err) {
      await socket.sendMessage(
        sender,
        { text: "❌ Package not found or error occurred." },
        { quoted: msg }
      );
    }
  },
};
