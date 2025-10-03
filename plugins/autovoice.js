const axios = require('axios');
const { proto, generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys'); // Adjust if needed

module.exports = {
  command: 'randomimage',
  description: '🎀 Get random Blue Archive waifu images in a carousel',
  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    await socket.sendMessage(sender, {
      react: { text: '⏰', key: msg.key }
    });

    try {
      const jumlahGambar = 8;
      let picked = [];

      for (let i = 0; i < jumlahGambar; i++) {
        const res = await axios.get('https://api.siputzx.my.id/api/r/blue-archive', {
          responseType: 'arraybuffer'
        });
        picked.push({
          buffer: Buffer.from(res.data),
          directLink: 'https://bluearchive.jp'
        });
      }

      const carouselCards = await Promise.all(picked.map(async (item, index) => {
        const mediaMsg = await generateWAMessageContent({
          image: item.buffer
        }, {
          upload: socket.waUploadToServer
        });

        return {
          header: {
            title: `🎀 ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ ${index + 1}`,
            hasMediaAttachment: true,
            imageMessage: mediaMsg.imageMessage
          },
          body: {
            text: `🖼️ ᴡᴀɪғᴜ ʀᴀɴᴅᴏᴍ ᴋᴇ - ${index + 1}`
          },
          footer: {
            text: "🔹 ɢᴇsᴇʀ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ʟᴀɪɴɴʏᴀ"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "🌐 ʙᴜᴋᴀ sɪᴛᴜs",
                  url: item.directLink
                })
              }
            ]
          }
        };
      }));

      const carouselMessage = generateWAMessageFromContent(sender, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: {
                text: `🎀 ᴡᴀɪғᴜ ʀᴀɴᴅᴏᴍ ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ`
              },
              footer: {
                text: `📂 Gambar Ke: ${jumlahGambar}`
              },
              carouselMessage: {
                cards: carouselCards
              }
            })
          }
        }
      }, { quoted: msg });

      await socket.relayMessage(sender, carouselMessage.message, {
        messageId: carouselMessage.key.id
      });

    } catch (err) {
      console.error('Blue Archive random image error:', err);
      await socket.sendMessage(sender, {
        text: '❌ Gagal memuat waifu!'
      });
    }
  }
};
