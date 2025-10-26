const fs = require("fs");
const axios = require("axios");
const path = require("path");
const stream = require("stream");
const util = require("util");

const pipeline = util.promisify(stream.pipeline);
const CHUNK_SIZE = 5 * 1024 * 1024; // 10MB

module.exports = {
  command: 'splitzip',
  description: '🧩 Split a ZIP file from link into parts (safe extract)',
  execute: async (sock, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const url = args[0];

    if (!url || !url.startsWith("http")) {
      return await sock.sendMessage(sender, { text: "❗ Please send a valid direct .zip link." }, { quoted: msg });
    }

    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName = "downloaded.zip";
    const filePath = path.join(tempDir, fileName);

    try {
      // Download ZIP
      const response = await axios({ url, method: "GET", responseType: "stream" });
      await pipeline(response.data, fs.createWriteStream(filePath));

      const fileBuffer = fs.readFileSync(filePath);
      const totalParts = Math.ceil(fileBuffer.length / CHUNK_SIZE);
      const partsDir = path.join(tempDir, `parts_${Date.now()}`);
      fs.mkdirSync(partsDir);

      // Save parts
      for (let i = 0; i < totalParts; i++) {
        const chunk = fileBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const partName = `part${i + 1}.zip.part`;
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

      // Send extract instructions
      await sock.sendMessage(sender, {
        text: `✅ All parts sent.\n\n🛠️ To extract:\n1. Save all files as \`part1.zip.part\`, \`part2.zip.part\`, etc.\n2. Use WinRAR / 7-Zip > right-click part1 → Extract Here.\n\n💡 All parts must be in the same folder.`,
      }, { quoted: msg });

      // Cleanup
      fs.unlinkSync(filePath);
      fs.rmSync(partsDir, { recursive: true });

    } catch (e) {
      console.error("❌ Error:", e.message);
      await sock.sendMessage(sender, { text: "❌ Failed to download or split file." }, { quoted: msg });
    }
  }
};
