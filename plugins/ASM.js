const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const axios = require('axios');

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

async function getRarDownloadLink(url) {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath || '/usr/bin/google-chrome-stable',
    headless: chromium.headless,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for .rar link
  await page.waitForSelector('a[href$=".rar"]', { timeout: 15000 });

  const rarLink = await page.evaluate(() => {
    const link = document.querySelector('a[href$=".rar"]');
    return link ? link.href : null;
  });

  await browser.close();

  if (!rarLink) throw new Error('❌ .rar download link not found');
  return rarLink;
}

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports = {
  command: 'gamedl',
  description: 'Download .rar file from link and send via WhatsApp (Heroku-safe)',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const textMessage =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      '';

    const args = textMessage.trim().split(/\s+/).slice(1);
    const inputUrl = args[0];

    if (!inputUrl) {
      await sock.sendMessage(jid, { text: '⚡ Usage: .gamedlff <link>' });
      return;
    }

    await sock.sendMessage(jid, { text: '🔍 Extracting .rar file download link...' });

    try {
      const rarUrl = await getRarDownloadLink(inputUrl);

      await sock.sendMessage(jid, {
        text: `✅ Found .rar file:\n${rarUrl}\n⏬ Downloading...`,
      });

      const downloadDir = path.resolve(__dirname, '../downloads');
      if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

      const fileName = path.basename(new URL(rarUrl).pathname);
      const filePath = path.join(downloadDir, fileName);

      await downloadFile(rarUrl, filePath);

      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 600 * 1024 * 1024) {
        await sock.sendMessage(jid, {
          text: `⚠️ File too large for WhatsApp (${formatBytes(fileSize)}).\nUse the link manually: ${rarUrl}`,
        });
        fs.unlinkSync(filePath);
        return;
      }

      const buffer = fs.readFileSync(filePath);
      await sock.sendMessage(jid, {
        document: buffer,
        fileName,
        mimetype: 'application/vnd.rar',
        caption: `✅ Download Complete!\n📦 ${fileName}\n💾 ${formatBytes(fileSize)}`,
      });

      fs.unlinkSync(filePath);
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${error.message}` });
    }
  },
};
