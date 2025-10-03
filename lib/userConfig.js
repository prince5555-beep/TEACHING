const fs = require('fs');
const path = require('path');
const defaultConfig = require('../config');

const CONFIGS_DIR = path.join(__dirname, '../configs');

if (!fs.existsSync(CONFIGS_DIR)) {
  fs.mkdirSync(CONFIGS_DIR);
}

function getUserConfig(jid) {
  const id = jid.split('@')[0]; // only number
  const file = path.join(CONFIGS_DIR, `${id}.json`);

  let userConfig = {};
  if (fs.existsSync(file)) {
    userConfig = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  return { ...defaultConfig, ...userConfig }; // merge with default
}

function saveUserConfig(jid, config) {
  const id = jid.split('@')[0];
  const file = path.join(CONFIGS_DIR, `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
}

module.exports = {
  getUserConfig,
  saveUserConfig
};
