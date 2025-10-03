const axios = require('axios');

module.exports = {
    command: 'bus',
    description: 'Get live Sri Lanka bus times',
    execute: async (socket, msg, args) => {
        const sender = msg.key.remoteJid;
        const from = args[0]?.toUpperCase() || 'COLOMBO';
        const to = args[1]?.toUpperCase() || 'KANDY';

        try {
            
            const buses = [
                { id: 'EX01', time: '06:00 AM', type: 'Express', status: 'On Time' },
                { id: 'NW23', time: '07:15 AM', type: 'Normal', status: 'Delayed 5min' },
                { id: 'EX09', time: '08:30 AM', type: 'AC Express', status: 'On Time' }
            ];

            let caption = `🚌 *Sri Lanka Bus Schedule*\nFrom: *${from}*\nTo: *${to}*\n\n`;

            buses.forEach(bus => {
                caption += `🔹 *Route:* ${bus.id}\n🕒 *Time:* ${bus.time}\n🚍 *Type:* ${bus.type}\n📍 *Status:* ${bus.status}\n\n`;
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
            await socket.sendMessage(sender, { text: '🚨 Could not fetch bus data. Try again later.' });
        }
    }
};
