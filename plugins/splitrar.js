const fs = require("fs");
const axios = require("axios");
const path = require("path");
const stream = require("stream");
const util = require("util");

const pipeline = util.promisify(stream.pipeline);
const CHUNK_SIZE = 250 * 1024 * 1024; // 250MB

module.exports = {
  command: 'splitrar',
  description: '🧩 Split a RAR file from a direct link into 250MB parts',
  execute: async (sock, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const url = args[0];

    if (!url || !url.endsWith(".rar") || !url.startsWith("http")) {
      return await sock.sendMessage(sender, {
        text: "❗ Please send a valid direct `.rar` link."
      }, { quoted: msg });
    }

    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName = "downloaded.rar";
    const filePath = path.join(tempDir, fileName);

    try {
      // Inform user
      await sock.sendMessage(sender, {
        text: `📥 Downloading RAR file...\n\n🔗 Link: ${url}`
      }, { quoted: msg });

      // Download with spoofed headers
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*',
          'Referer': url
        }
      });

      const writer = fs.createWriteStream(filePath);
      await pipeline(response.data, writer);

      // Split into parts
      const fileBuffer = fs.readFileSync(filePath);
      const totalParts = Math.ceil(fileBuffer.length / CHUNK_SIZE);
      const partsDir = path.join(tempDir, `parts_${Date.now()}`);
      fs.mkdirSync(partsDir);

      for (let i = 0; i < totalParts; i++) {
        const chunk = fileBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const partName = `part${i + 1}.rar.part`;
        fs.writeFileSync(path.join(partsDir, partName), chunk);
      }

      // Send parts
      const parts = fs.readdirSync(partsDir).sort();
      for (const part of parts) {
        const partPath = path.join(partsDir, part);
        await sock.sendMessage(sender, {
          document: fs.readFileSync(partPath),
          fileName: part,
          mimetype: "application/octet-stream"
        }, { quoted: msg });
      }

      // Send extraction instructions
      await sock.sendMessage(sender, {
        text: `✅ All RAR parts sent (250MB each).\n\n🛠️ To extract:\n1. Save all files as \`part1.rar.part\`, \`part2.rar.part\`, etc.\n2. Use WinRAR or 7-Zip\n3. Right-click \`part1\` → Extract Here\n\n💡 All parts must be in the same folder.`,
      }, { quoted: msg });

      // Clean up
      fs.unlinkSync(filePath);
      fs.rmSync(partsDir, { recursive: true });

    } catch (e) {
      console.error("❌ FULL ERROR LOG:", e);
      await sock.sendMessage(sender, {
        text: "❌ Failed to download or split RAR file. Check link or try again."
      }, { quoted: msg });
    }
  }
};
