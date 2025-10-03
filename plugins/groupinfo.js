const axios = require("axios");

module.exports = {
  command: "wainfo",
  description: "Get WhatsApp group info with description and image preview",
  async execute(sock, msg, args) {
    const link = args[0];

    if (!link || !link.includes("chat.whatsapp.com")) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Please provide a valid WhatsApp group/channel link.\n\n*Example:* .wainfo https://chat.whatsapp.com/XXXXXX`,
      });
    }

    try {
      // Try to extract invite code
      const code = link.split("chat.whatsapp.com/")[1].split("?")[0];

      // Accept invite to get metadata (only if not already in)
      const groupInfo = await sock.groupAcceptInvite(code).catch(() => null);
      const jid = groupInfo ? `${groupInfo}@g.us` : null;

      // If bot is in group, get metadata
      let desc = "❌ Description not available";
      if (jid) {
        const metadata = await sock.groupMetadata(jid);
        desc = metadata.desc || desc;
      }

      // Create preview image from API
      const previewURL = `https://social-card.kawwa.site/api?channellink=${encodeURIComponent(link)}&theme=dark&overrideVerified=true&overrideVerifiedIcon=https://static.whatsapp.net/rsrc.php/v4/yM/r/SGDtWWR7x5L.png`;
      const response = await axios.get(previewURL, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data, "binary");

      // Send image with caption + desc
      await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: `🌐 *Group Info Preview*\n🔗 ${link}\n\n📝 *Description:*\n${desc}\n\n✅ Powered by 😂👍hutta`,
      });
    } catch (error) {
      console.error("❌ Error in .wainfo command:", error.message);

      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to fetch preview.\nMake sure the group link is valid and accessible.`,
      });
    }
  },
};
