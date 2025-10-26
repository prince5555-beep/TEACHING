const gis = require("g-i-s");
const {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto,
} = require("@whiskeysockets/baileys");

module.exports = {
  command: "img",
  description: "👾 Google Image Search (reply 1 = image, 2 = doc, 3 = 10 more images)",
  react: "📸",
  category: "media",

  execute: async (socket, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const query = args.join(" ");
      const pushname = msg.pushName || "there";

      if (!query) {
        return await socket.sendMessage(from, {
          text: `🔍 *Google Image Search*\n\nPlease enter a query!\n\nExample:\n.imgno cat`,
        }, { quoted: msg });
      }

      gis(query, async (error, result) => {
        if (error || !result || result.length < 12) {
          return await socket.sendMessage(from, {
            text: "❌ Not enough images found. Try another keyword.",
          }, { quoted: msg });
        }

        const img1 = result[0].url;
        const img2 = result[1].url;
        const moreImages = result.slice(2, 12).map(r => r.url); // 10 images

        const caption =
          `👾 *VAJIRA IMAGE SEARCH*\n\n` +
          `👤 *Requested by:* ${pushname}\n` +
          `🔍 *Query:* ${query}\n\n` +
          `📸 Reply with:\n` +
          `╭─────────────●●►\n` +
          `├ 🖼️ *1* → Image Type\n` +
          `├ 📄 *2* → Document Type\n` +
          `├ 🖼️ *3* → 10 More Images\n` +
          `╰─────────────●●►\n\n` +
          `● *𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛* ●`;

        const sentMsg = await socket.sendMessage(from, {
          image: { url: img1 },
          caption,
        }, { quoted: msg });

        const results = result.slice(0, 10); // Top 10 images
        const cards = [];

        for (let i = 0; i < results.length; i++) {
          const imageUrl = results[i].url;

          const media = await prepareWAMessageMedia(
            { image: { url: imageUrl } },
            { upload: socket.waUploadToServer } // FIXED conn → socket
          );

          const header = proto.Message.InteractiveMessage.Header.create({
            ...media,
            title: `📸 Result ${i + 1}: ${query}\n\n👤 *Requested by:* ${pushname}`,
            gifPlayback: true,
            subtitle: "VAJIRA-MD",
            hasMediaAttachment: false,
          });

          cards.push({
            header,
            body: { text: `\n\n● *𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛* ●` },
            nativeFlowMessage: {},
          });
        }

        const carouselMessage = generateWAMessageFromContent(
          from,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: { text: "" },
                  carouselMessage: {
                    cards,
                    messageVersion: 1,
                  },
                },
              },
            },
          },
          { quoted: msg }
        );

        // FIXED conn → socket and added await
        await socket.relayMessage(from, carouselMessage.message, {
          messageId: carouselMessage.key.id,
        });

        const msgId = sentMsg.key.id;

        const messageListener = async (messageUpdate) => {
          try {
            const mek = messageUpdate.messages[0];
            if (!mek.message) return;

            // safer optional chaining for stanzaId
            const isReply = mek.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
            if (!isReply) return;
            if (mek.key.remoteJid !== from) return;

            const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
            await socket.sendMessage(from, { react: { text: '✅', key: mek.key } });

            switch (text.trim()) {
              case "1":
                await socket.sendMessage(from, {
                  image: { url: img1 },
                  caption: `✅ *Here is your image!*\n> Vajira Mini Bot`,
                }, { quoted: mek });
                break;

              case "2":
                await socket.sendMessage(from, {
                  document: { url: img2 },
                  mimetype: "image/jpeg",
                  fileName: `img_${Date.now()}.jpg`,
                  caption: `📄 *Here is your image as document!*\n> Vajira Mini Bot`,
                }, { quoted: mek });
                break;

              case "3":
                for (let i = 0; i < moreImages.length; i++) {
                  await socket.sendMessage(from, {
                    image: { url: moreImages[i] },
                    caption: `🖼️ *Extra Image ${i + 1}*\n> Vajira Mini Bot`,
                  }, { quoted: mek });
                  await new Promise(res => setTimeout(res, 1000)); // slight delay
                }
                break;

              default:
                await socket.sendMessage(from, {
                  text: "❌ Invalid option. Reply with 1, 2, or 3 only.",
                }, { quoted: mek });
            }
          } catch (err) {
            console.error("Reply handler error:", err);
          }
        };

        socket.ev.on("messages.upsert", messageListener);
        setTimeout(() => socket.ev.off("messages.upsert", messageListener), 2 * 60 * 1000); // 2 min auto off
      });
    } catch (e) {
      console.error("Main error:", e);
      await socket.sendMessage(msg.key.remoteJid, {
        text: `⚠️ *Error occurred:* ${e.message}`,
      }, { quoted: msg });
    }
  }
};
