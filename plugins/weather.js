
const axios = require('axios');

module.exports = {
command: 'weather',
description: 'Get real-time weather information',
execute: async (socket, msg, args, number) => {
const sender = msg.key.remoteJid;
const jidName = sender.split('@')[0];
const location = args.join(' ') || 'Colombo';

const weatherImgUrl = `https://wttr.in/${encodeURIComponent(location)}.png?m`;  

// 🌦️ Emoji animation   
const emojiStages = [  
  '☁️',  
  '🌤️',  
  '🌥️',  
  '🌧️',  
  '🌦️',  
  '⛈️',  
  '⚡',  
  '*✅ Weather Data Ready!*'  
];  

// Send  message  
let { key } = await socket.sendMessage(sender, { text: '☁️ Preparing weather info...' });  

for (const emoji of emojiStages) {  
  await socket.sendMessage(sender, { text: `> ${emoji} Getting data for *${location}*...`, edit: key });  
  await new Promise(res => setTimeout(res, 500)); // 0.5s delay  
}  

// Final image  
const caption = `╭━━⊰ *『 WEATHER STATUS 』* ⊱━━⬣

> ┃🌍 Location: ${location}
> ┃⛅ Real-Time Weather Image
> ┃👤 User: @${jidName}
> ┃📅 Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
╰━━━⊰ 🔰 ⊱━━━━━━⬣

> ⚡See the image for all the details.
> 🔎 Type .weather [location] to check any city weather!
`;



await socket.sendMessage(sender, {  
  image: { url: weatherImgUrl },  
  caption,  
  contextInfo: {  
    mentionedJid: [sender],  
    forwardingScore: 999,  
    isForwarded: true  
  }  
});

}
};
