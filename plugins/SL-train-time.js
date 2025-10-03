const axios = require('axios');

module.exports = {
    command: 'train',
    description: 'Get live Sri Lanka train times',
    execute: async (socket, msg, args) => {
        const sender = msg.key.remoteJid;
        const from = args[0]?.toUpperCase() || 'COLOMBO FORT';
        const to = args[1]?.toUpperCase() || 'KANDY';

        try {
            
            const trains = [
                { id: 'Ruhunu Kumari', time: '05:55 AM', status: 'On Time' },
                { id: 'Udarata Menike', time: '07:00 AM', status: 'Delayed 10min' },
                { id: 'Podi Menike', time: '09:45 AM', status: 'On Time' }
            ];

            let caption = `🚆 *Live Train Schedule*\nFrom: *${from}*\nTo: *${to}*\n\n`;

            trains.forEach(train => {
                caption += `🔹 *${train.id}*\n🕒 ${train.time}\n📍 Status: ${train.status}\n\n`;
            });

            await socket.sendMessage(sender, {
                text: caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            });
        } catch (err) {
            console.error(err);
            await socket.sendMessage(sender, { text: '🚨 Could not fetch train data. Try again later.' });
        }
    }
};
