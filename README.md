const loadingText = ["Loading ⬛⬛⬜⬜⬜⬜", "Loading ⬛⬛⬛⬛⬜⬜", "Loading ⬛⬛⬛⬛⬛⬛", "✅ Completed"];
    let { key } = await socket.sendMessage(sender, { text: '' });

    for (let stage of loadingText) {
      await socket.sendMessage(sender, { text: stage, edit: key });
      await new Promise(r => setTimeout(r, 300));
    }
