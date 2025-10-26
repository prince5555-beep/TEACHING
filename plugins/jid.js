module.exports = {
        command: 'jid',
        description: 'to take jid id',
        execute: async (socket, msg, args, number) => {
         const sender = msg.key.remoteJid;   
    const chatJid = sender;
        
        await socket.sendMessage(sender, {
            text: `${chatJid}`
        });
            
        }
}
