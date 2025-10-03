module.exports = {
  command: 'grouplink',
  description: 'Send custom WhatsApp group social card with image and join link',
  async execute(socket, msg, args) {
    const jid = msg.key.remoteJid;

    
    const inviteLink = 'https://chat.whatsapp.com/ITumcbPEune9gesh1vSi1n?mode=ac_t';
    const imageUrl = 'https://social-card.kawwa.site/api' +
      '?channellink=' + encodeURIComponent(inviteLink) +
      '&theme=dark' +
      '&overrideVerified=true' +
      '&overrideVerifiedIcon=' + encodeURIComponent('https://static.whatsapp.net/rsrc.php/v4/yM/r/SGDtYg_EYce.png') +
      '&overrideClickableLink=' + encodeURIComponent('https://wa.me/94701197452') +
      '&overrideSlogan1=' + encodeURIComponent('ᴠᴀʊɪʀᴀ ᴏʜ͜ᴄXᴍʀ-ʜᴀɴͱᴀᴍᴀʟᴀ');

    const caption = `*Join the group:*\n${inviteLink}`;

    try {
      await socket.sendMessage(
        jid,
        {
          image: { url: imageUrl },
          caption,
          mimetype: 'image/png'
        },
        { quoted: msg }
      );
    } catch (err) {
      await socket.sendMessage(jid, { text: `❌ Error: ${err.message}` }, { quoted: msg });
    }
  }
};
