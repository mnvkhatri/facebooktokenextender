// delete-cache-files.js
// Deletes .sst, .meta, .log, .ldb files older than 1 minute in the project directory and subdirectories

const fs = require('fs');
const path = require('path');

const CACHE_EXTENSIONS = ['.sst', '.meta', '.log', '.ldb'];
const MAX_AGE_MS = 60 * 1000; // 1 minute

function deleteOldFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      deleteOldFiles(filePath);
    } else {
      const ext = path.extname(file);
      if (CACHE_EXTENSIONS.includes(ext)) {
        const age = Date.now() - stat.mtimeMs;
        if (age > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
          console.log('Deleted:', filePath);
        }
      }
    }
  });
}

deleteOldFiles(process.cwd());
console.log('Cache cleanup complete.');
