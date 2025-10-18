# 1. Use Node.js 20 base image
FROM node:20-slim

# 2. Set workdir
WORKDIR /app

# 3. Install system dependencies for Chromium + git (important!)
RUN apt-get update && apt-get install -y \
    git \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends \
 && rm -rf /var/lib/apt/lists/*

# 4. Copy package.json and install node modules
COPY package*.json ./
RUN npm install

# 5. Copy source code
COPY . .

# 6. Expose port (Fly.io default 8080, but your bot uses 3000)
EXPOSE 3000

# 7. Puppeteer config (headless chrome)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

# 8. Start bot
CMD ["node", "lib/connection.js"]
