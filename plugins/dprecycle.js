module.exports = {
    command: 'forward',
    description: 'Forward quoted message with clickable channel link (shows forward icon)',
    execute: async (socket, msg, args, number) => {
        const sender = msg.key.remoteJid;

        if (!msg.quoted) {
            return await socket.sendMessage(sender, { text: "*Reply to a message to forward ❌*" }, { quoted: msg });
        }

        if (!args.join(" ").includes(",")) {
            return await socket.sendMessage(sender, { text: "Usage: .forward <channel_jid>, <caption>" }, { quoted: msg });
        }

        // Split into channel JID and caption
        const [jid, ...captionParts] = args.join(" ").split(",");
        const channelJid = jid.trim();
        const captionText = captionParts.join(",").trim();

        if (!channelJid || !captionText) {
            return await socket.sendMessage(sender, { text: "Please provide both channel JID and caption" }, { quoted: msg });
        }

        // Build clickable caption
        const clickableCaption = `${captionText}\nhttps://whatsapp.com/channel/${channelJid}`;

        try {
            // Clone quoted message
            let msgContent = JSON.parse(JSON.stringify(msg.quoted));

            // Replace caption if media
            if (msgContent.message?.imageMessage) {
                msgContent.message.imageMessage.caption = clickableCaption;
            }
            if (msgContent.message?.videoMessage) {
                msgContent.message.videoMessage.caption = clickableCaption;
            }
            if (msgContent.message?.documentMessage) {
                msgContent.message.documentMessage.caption = clickableCaption;
            }

            // Forward to channel (shows forward icon)
            await socket.forwardMessage(channelJid, msgContent, false);

            await socket.sendMessage(sender, { text: `✅ Message forwarded to channel:\n${channelJid}` }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await socket.sendMessage(sender, { text: `❌ Failed to forward: ${err.message}` }, { quoted: msg });
        }
    }
};
