const { formatMessage } = require('../lib/formatter');
const axios = require("axios");

module.exports = {
    command: 'ping',
    description: 'to see ping',
    execute: async (socket, msg, args, number) => {
        const sender = msg.key.remoteJid;

        const thumbUrl = "https://files.catbox.moe/4f4adq.jpg";
        const { data: thumbBuffer } = await axios.get(thumbUrl, { responseType: "arraybuffer" });

        const inital = new Date().getTime();

        let ping = await socket.sendMessage(sender, {
            text: '*_Pinging {ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ}..._* ❗',
            contextInfo: {
                mentionedJid: [sender, "94719199757@s.whatsapp.net"],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285295780590@newsletter",
                    newsletterName: "⛬ᴠᴀᴊɪʀᴀ ᴍɪɴɪ ʙᴏᴛ ꜱᴇʀɪꜱᴇ☤",
                    serverMessageId: 143,
                },
                externalAdReply: {
                    title: "META AI • Alive",
                    body: "ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ",
                    mediaType: 2,
                    thumbnailUrl: thumbUrl,
                    jpegThumbnail: thumbBuffer,
                    sourceUrl: "https://wa.me/13135550002?s=5",
                },
            },
        });

        const final = new Date().getTime();

        const edits = ['◍○○○○', '◍◍○○○', '◍◍◍○○', '◍◍◍◍○', '◍◍◍◍◍'];
        for (let stage of edits) {
            await socket.sendMessage(sender, {
                text: stage,
                edit: ping.key
            });
        }

        return await socket.sendMessage(sender, {
            text: '📍️ *Pong ' + (final - inital) + ' Ms*',
            edit: ping.key,
            contextInfo: {
                mentionedJid: [sender, "94719199757@s.whatsapp.net"],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285295780590@newsletter",
                    newsletterName: "⛬ᴠᴀᴊɪʀᴀ ᴍɪɴɪ ʙᴏᴛ ꜱᴇʀɪꜱᴇ☤",
                    serverMessageId: 143,
                },
                externalAdReply: {
                    title: "META AI • Pong",               
                    body: "ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ",
                    mediaType: 2,
                    thumbnailUrl: thumbUrl,
                    jpegThumbnail: thumbBuffer,         
                    sourceUrl: "https://wa.me/13135550002?s=5",
                },
            },
        });
    }
}
