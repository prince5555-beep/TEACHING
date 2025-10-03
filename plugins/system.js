const { formatMessage } = require('../lib/formatter');
const os = require('os');
const moment = require('moment');


module.exports = {
        command: 'system',
        description: 'Show the system',
        execute: async (socket, msg, args, number) => {
            const uptime = process.uptime();
            const formattedUptime = moment.utc(uptime * 1000).format("HH:mm:ss");

            const memoryUsage = process.memoryUsage();
            const usedMemory = (memoryUsage.rss / 1024 / 1024).toFixed(2);
            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
            const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
            const cpuInfo = os.cpus()[0].model;

            const caption = `⛩️ 𝐕𝐀𝐉𝐈𝐑𝐀 𝐌𝐃 𝐗 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓 🪻

*🤖 Platform:* ${os.platform()}
*🖥️ Arch:* ${os.arch()}
*💾 Uptime:* ${formattedUptime}
*🧠 RAM Usage:* ${usedMemory} MB / ${totalMem} MB
*⚙️ Free Memory:* ${freeMem} MB
*🔌 CPU:* ${cpuInfo}

*⚙️ Node:* ${process.version}
*📂 Working Dir:* ${process.cwd()}

*🧩 Modules Loaded:* ${Object.keys(require.cache).length}
*👤 User:* ${os.userInfo().username}

> 𝘝𝘈𝘑𝘐𝘙𝘈 𝘖𝘍𝘍𝘐𝘊𝘐𝘈𝘓 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛`
            

            const sender = msg.key.remoteJid;

            await socket.sendMessage(sender, {
                image: { url: 'https://files.catbox.moe/ao1lcx.jpg' }, // Confirm accessibility
                caption,
                contextInfo: {
                    mentionedJid: ['94719199757@s.whatsapp.net'],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363285295780590@newsletter',
                        newsletterName: '𝘝𝘈𝘑𝘐𝘙𝘈 𝘖𝘍𝘍𝘐𝘊𝘐𝘈𝘓 𝘔𝘐𝘕𝘐 𝘉𝘖𝘛🪻',
                        serverMessageId: 143
                    }
                }
            })
        }
}




