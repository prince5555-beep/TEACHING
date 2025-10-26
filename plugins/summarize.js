const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys'); 

module.exports = {
    command: 'summary',
    description: 'Summarize uploaded PDF or text file',
    execute: async (socket, msg, args, number) => {
        const sender = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const doc = quoted?.documentMessage;

        if (!doc) {
            return socket.sendMessage(sender, { text: '📄 කරුණාකර PDF හෝ .txt ගොනුවක් quote කරලා `.summary` කියන්න.' });
        }

        const mimeType = doc.mimetype;
        const fileName = doc.fileName || 'file';

        try {
            const stream = await downloadContentFromMessage(doc, 'document'); 
            let buffer = Buffer.from([]);

            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            let textContent = '';

            if (mimeType === 'application/pdf') {
                const data = await pdfParse(buffer);
                textContent = data.text;
            } else if (mimeType === 'text/plain') {
                textContent = buffer.toString('utf-8');
            } else {
                return socket.sendMessage(sender, { text: '🚫 PDF හෝ .txt file වලට පමණක් support කරනවා.' });
            }

            if (!textContent.trim()) {
                return socket.sendMessage(sender, { text: '😕 ගොනුවෙ ඇතුලේ text තියෙන්නේ නැහැ.' });
            }

            const summary = textContent.split(/\n+/).slice(0, 5).join('\n');

            const response = `📝 *Document Summary (Preview)*\n\n${summary.trim().substring(0, 1000)}\n\n📌 _This is a basic summary. Full NLP summarizer can be added later._`;

            await socket.sendMessage(sender, {
                text: response,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });

        } catch (error) {
            console.error('Summary plugin error:', error);
            return socket.sendMessage(sender, { text: '❌ ගොනුව download කරන්න බැරිවුනා. නැවත උත්සාහ කරන්න.' });
        }
    }
};
