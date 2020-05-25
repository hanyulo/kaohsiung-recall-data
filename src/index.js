const path = require('path');
const fs = require('fs');

(function createDirectories () {
  const distTargetDirectory = path.resolve(__dirname, '../dist');
  const logsTargetDirectory = path.resolve(__dirname, '../logs');

  const allDirs = [distTargetDirectory, logsTargetDirectory];

  allDirs.forEach((target) => {
    if (!fs.existsSync(target)) {
      fs.mkdir(target, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
})();
