const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), '.next/cache');

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
    // Ensure cache directory exists
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  async get(key) {
    try {
      const data = await fs.promises.readFile(
        path.join(CACHE_DIR, key),
        'utf8'
      );
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async set(key, data) {
    try {
      await fs.promises.writeFile(
        path.join(CACHE_DIR, key),
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }
};