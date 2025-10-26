/**
 * pcgame.js
 * - Download torrent with WebTorrent
 * - Compress full folder to ZIP
 * - Upload ZIP to GoFile
 * - Split ZIP to 250MB RAR parts with WinRAR
 * - Send parts to chat with progress EDIT updates
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { existsSync, mkdirSync, readdirSync } = fs;
const archiver = require('archiver');
const axios = require('axios');
const FormData = require('form-data');

// GoFile API Token (Hardcoded)
const GOFILE_TOKEN = 'T9y8ohlVLpwN69jpsZu0LCIBBYnTxvzF';

// Gofile Upload Helper (Fixed)
async function uploadToGoFile(filePath) {
  // 1) Get fastest server
  const serverRes = await axios.get('https://api.gofile.io/getServer');
  if (serverRes.data.status !== 'ok') throw new Error('Failed to get GoFile server');
  const server = serverRes.data.data.server;

  // 2) Prepare form-data
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('token', GOFILE_TOKEN); // use direct token

  // 3) Upload
  const uploadRes = await axios.post(`https://${server}.gofile.io/uploadFile`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (uploadRes.data.status !== 'ok') {
    throw new Error('Upload failed: ' + JSON.stringify(uploadRes.data));
  }
  return uploadRes.data.data.downloadPage;
}

// ZIP Folder Helper
async function zipFolder(folderPath, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(outputPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

// Helpers
const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(2)}${units[i]}`;
};
const formatETA = (ms) => {
  if (!isFinite(ms) || ms <= 0) return '∞';
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (h ? `${h}h ` : '') + (m ? `${m}m ` : '') + `${sec}s`;
};
const makeBar = (p, size = 20) => {
  const filled = Math.round(p * size);
  return '▰'.repeat(filled) + '▱'.repeat(size - filled);
};

// Message Helpers
async function sendOrEdit(socket, jid, state, text) {
  if (!state.key) {
    const { key } = await socket.sendMessage(jid, { text });
    state.key = key;
  } else {
    await socket.sendMessage(jid, { text, edit: state.key });
  }
}
async function stagedLoading(socket, jid, prefix = 'Loading') {
  const loadingText = [
    `${prefix} ⬛⬛⬜⬜⬜⬜`,
    `${prefix} ⬛⬛⬛⬛⬜⬜`,
    `${prefix} ⬛⬛⬛⬛⬛⬛`,
    `✅ Completed`,
  ];

  let key;
  let first = true;

  for (const stage of loadingText) {
    if (first) {
      const res = await socket.sendMessage(jid, { text: stage });
      key = res.key;
      first = false;
    } else {
      await socket.sendMessage(jid, { text: stage, edit: key });
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return key;
}

module.exports = {
  command: 'pcgames',
  description: 'Download torrent, zip, upload to GoFile, split to 250MB RAR and send',
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const magnetLink = Array.isArray(args) ? args.join(' ').trim() : String(args).trim();

    if (!magnetLink.startsWith('magnet:')) {
      return socket.sendMessage(sender, { text: '🧲 valid magnet link එකක් දෙන්න.' });
    }

    const tempDir = path.join(__dirname, '../temp');
    const rarOutput = path.join(tempDir, 'parts');
    if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });
    if (!existsSync(rarOutput)) mkdirSync(rarOutput, { recursive: true });

    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();
    const state = { key: null };
    const send = async (text) => socket.sendMessage(sender, { text });

    try {
      await stagedLoading(socket, sender, '⏳ Starting torrent');
    } catch (_) {}

    client.add(magnetLink, { path: tempDir }, async (torrent) => {
      let frame = 0;
      let lastUpdate = 0;

      torrent.once('ready', async () => {
        const totalSizeGB = (torrent.length / 1024 ** 3).toFixed(2);
        if (totalSizeGB > 15) {
          await send(
            `⚠️ මේ game එකේ size **${totalSizeGB}GB**.\n` +
            `15GB ට වඩා files download කරන්න **Premium Version** එකක් අවශ්‍ය. 🚀\n` +
            `👉 Premium ගැනීමට අමතන්න: wa.me/947XXXXXXXX`
          );
        }
      });

      torrent.on('download', async () => {
        const now = Date.now();
        if (now - lastUpdate < 1000) return;
        lastUpdate = now;

        const spinner = SPIN[frame++ % SPIN.length];
        const percent = (torrent.progress * 100).toFixed(1);
        const downloaded = formatBytes(torrent.downloaded);
        const total = formatBytes(torrent.length);
        const speed = formatBytes(torrent.downloadSpeed) + '/s';
        const eta = formatETA(torrent.timeRemaining);
        const bar = makeBar(torrent.progress, 20);

        const status = `${spinner} Loading...\n` +
          `⬇️ [${bar}] ${percent}%\n` +
          `📦 ${downloaded} / ${total}\n` +
          `⚡ ${speed}   ⏱️ ETA ${eta}`;
        try { await sendOrEdit(socket, sender, state, status); } catch (_) {}
      });

      torrent.on('done', async () => {
        await send('✅ Torrent download complete!');

        const zipPath = path.join(tempDir, 'game.zip');
        await send('📦 Compressing game folder...');
        try {
          await zipFolder(tempDir, zipPath);
          await send('✅ Compression done.');
        } catch (e) {
          await send('❌ Compression failed: ' + e.message);
          return;
        }

        // Upload to GoFile
        try {
          await send('☁️ Uploading to GoFile...');
          const link = await uploadToGoFile(zipPath);
          await send(`🔗 GoFile mirror: ${link}`);
        } catch (e) {
          await send('⚠️ GoFile upload fail: ' + (e?.message || e));
        }

        // Split to 250MB RAR
        await send('📦 Splitting into 250MB RAR parts...');
        const rarBase = path.join(rarOutput, 'first_open.rar');
        const winrar = path.join(__dirname, '../WinRAR/WinRAR.exe');
        const rarArgs = ['a', '-v250m', '-ep1', rarBase, zipPath];
        const rarProc = spawn(winrar, rarArgs, { windowsHide: true });

        let rarFrame = 0;
        const rarState = { key: null };

        rarProc.stdout?.on('data', async (d) => {
          const out = d.toString();
          const spin = SPIN[rarFrame++ % SPIN.length];
          try {
            await sendOrEdit(socket, sender, rarState, `${spin} Packing...\n${out.trim()}`);
          } catch (_) {}
        });

        rarProc.on('close', async (code) => {
          if (code !== 0) {
            await send('❌ Failed to split into RAR parts.');
            client.destroy();
            return;
          }

          fs.writeFileSync(
            path.join(rarOutput, 'extract.bat'),
            `@echo off\ncd /d "%~dp0"\n"WinRAR.exe" x -y "first_open.part1.rar"\npause`
          );

          await send('✅ RAR split successful. Sending parts...');
          const files = readdirSync(rarOutput)
            .filter((f) => f.endsWith('.rar') || f.endsWith('.bat'))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

          for (const f of files) {
            try {
              await socket.sendMessage(sender, {
                document: fs.createReadStream(path.join(rarOutput, f)),
                fileName: f,
                mimetype: f.endsWith('.bat') ? 'application/x-bat' : 'application/x-rar-compressed',
              });
              await new Promise((r) => setTimeout(r, 2000));
            } catch (err) {
              console.error('send err', err);
              await send(`❌ Failed sending: ${f} - ${err.message}`);
            }
          }
          await send('📁 Upload complete! Use extract.bat to extract files.');
          client.destroy();
        });
      });
    });

    client.on('error', (e) => socket.sendMessage(sender, { text: '⚠️ Torrent error: ' + e.message }));
  },
};
