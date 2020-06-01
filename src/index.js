const path = require('path');
const fs = require('fs');
const logger = require('./utils/create-logger');

try {
  (function createDirectories () {
    const distTargetDirectory = path.resolve(__dirname, '../dist');
    const logsTargetDirectory = path.resolve(__dirname, '../logs');
    const historyTargetDirectory = path.resolve(__dirname, '../history');

    const allDirs = [distTargetDirectory, logsTargetDirectory, historyTargetDirectory];

    allDirs.forEach((target) => {
      if (!fs.existsSync(target)) {
        fs.mkdir(target, { recursive: true }, (err) => {
          if (err) throw err;
        });
      }
    });
  })();
} catch (e) {
  logger.log({
    level: 'error',
    message: `fail to create directory - erroe message: ${e.message}`
  });
}
