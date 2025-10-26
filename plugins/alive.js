const axios = require("axios");
const { proto } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { sendWithAd } = require("../middleware/adsMiddleware");

module.exports = {
  command: "alive",
  description: "Show owner info with enhanced design and feedback buttons",
  category: "info",

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const jidName = sender.split("@")[0];

      const bannerUrl = "https://files.catbox.moe/u30plt.png";
      const thumbUrl = "https://files.catbox.moe/4f4adq.jpg";
      const { data: thumbBuffer } = await axios.get(thumbUrl, { responseType: "arraybuffer" });

      const date = new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });
      const time = new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Colombo" });
      const speed = Math.floor(Math.random() * 90 + 10);

      const caption = `╭━━━ 『 BOT STATUS 』 ━━━⬣
┃🤖 Bot Name: ＰＲＩＮＣＥ　ＭＩＮＩ
┃💠 Status: Online ✅
┃⚡ Speed: ${speed}ms
┃👤 User: @${jidName}
┃📆 Date: ${date}
┃⏰ Time: ${time}
┃🔰 Prefix: .
╰━━━━━━━━━━━━━━━━━⬣

> ᴄʀᴇᴀᴛᴇ ʙʏ
🔻 *ᴠᴀᴊɪʀᴀ-ᴏꜰᴄ X ᴍʀ-ʜᴀɴꜱᴀᴍᴀʟᴀ*`;

      // 1. Send Banner + Caption
      await sock.sendMessage(
        jid,
        {
          image: { url: bannerUrl },
          caption,
          contextInfo: {
            mentionedJid: [sender, "255614545735@s.whatsapp.net"],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "META AI • Alive",
              body: "ᴠＰＲＩＮＣＥ　ＭＩＮＩ",
              mediaType: 2,
              thumbnailUrl: thumbUrl,
              jpegThumbnail: thumbBuffer,
              sourceUrl: "https://wa.me/255614545735?s=5",
            },
          },
        },
        { quoted: msg }
      );

      // 2. Send Voice
      const voicePath = path.join(__dirname, "../Audio/alive.mp3");
      if (fs.existsSync(voicePath)) {
        const voiceBuffer = fs.readFileSync(voicePath);
        await sock.sendMessage(
          jid,
          {
            audio: voiceBuffer,
            mimetype: "audio/mpeg",
            ptt: true,
          },
          { quoted: msg }
        );
      }

     
      // Menu Button with small image
// Menu button - View Once label style
await sock.sendMessage(jid, {
  text: " ",
  buttons: [
    { buttonId: ".menu", buttonText: { displayText: "📂 Menu" }, type: 1 },
  ],
  headerType: 1, // text header
  contextInfo: {
    forwardingScore: 999,
    isForwarded: false,
    ephemeralExpiration: 0,
    externalAdReply: {
      title: " ", // no image, small space
      body: "View once", // label text simulate
      mediaType: 0, // no media
    },
  },
});

// Owner button - Quoted label style
await sock.sendMessage(jid, {
  text: " ",
  buttons: [
    { buttonId: ".owner", buttonText: { displayText: "🎗️ Owner" }, type: 1 },
  ],
  headerType: 1,
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    quotedMessage: { conversation: " " }, // simulate quoted
  },
});
    
      const adText = " ";
      await sendWithAd(sock, msg, adText);

      // Feedback buttons
     /* const feedbackMsg = await sock.sendMessage(jid, {
        text: "*Did you find this info helpful?*",
        buttons: [
          {
            buttonId: "feedback_like",
            buttonText: { displayText: "👍 Like" },
            type: 1,
          },
          {
            buttonId: "feedback_dislike",
            buttonText: { displayText: "👎 Dislike" },
            type: 1,
          },
        ],
        headerType: 1,
      });

      const feedbackMsgKey = feedbackMsg.key;

      
      sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message?.buttonsResponseMessage) return;

        const btn = m.message.buttonsResponseMessage.selectedButtonId;
        if (btn === "feedback_like" || btn === "feedback_dislike") {
          const replyText =
            btn === "feedback_like"
              ? "🙏 *Thank you for your feedback!* ❤️"
              : "👍 *Thanks! We'll try to improve.*";

          await sock.sendMessage(jid, {
            text: replyText,
            edit: feedbackMsgKey,
          });
        }
      });*/

      

// 1. Send poll message
const pollMsg = await sock.sendMessage(jid, {
  pollCreationMessage: proto.Message.PollCreationMessage.fromObject({
    name: "⭐ Rate this info",
    options: ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"],
    selectMultiple: false,
    selectableOptionsCount: 1,
  }),
});

const pollMsgKey = pollMsg.key;

// 2. Listen for votes
sock.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];

  // Only handle poll updates
  if (!m.message?.pollUpdateMessage) return;

  const votes = m.message.pollUpdateMessage.pollAnswers;

  // Find the user's vote
  const userVote = votes.find(v => v.pollerId === m.key.participant)?.optionIds[0];

  if (userVote !== undefined) {
    const starMap = ["🌟","🌟🌟","🌟🌟🌟","🌟🌟🌟🌟","🌟🌟🌟🌟🌟"];
    await sock.sendMessage(jid, {
      text: `You voted: ${starMap[userVote]}\n🙏 *Thank you for your feedback!*`,
      quoted: m,
    });
  }
});
    } catch (err) {
      console.error("❌ Error in alive command:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Something went wrong while processing the alive command.",
      });
    }
  },
};
