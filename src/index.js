const path = require('path');
const fs = require('fs');
const logger = require('./utils/create-logger');
const uploadDirectory = require('./utils/uploader');
const BUCKET_NAME = 'pts-multimedia';
const DIRECTORY_NAME = 'recall-vote-han-kuo-yu';
const TARGET_DIRECTORY = path.resolve(__dirname, '../../dist');

try {
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
} catch (e) {
  logger.log({
    level: 'error',
    message: `fail to create directory - erroe message: ${e.message}`
  });
}

uploadDirectory(TARGET_DIRECTORY, BUCKET_NAME, DIRECTORY_NAME);
