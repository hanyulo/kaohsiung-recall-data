const path = require('path');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');

const targetDirectory = path.resolve(__dirname, '../../logs');

(function createDirectories () {
  const logsTargetDirectory = path.resolve(__dirname, '../../logs');

  const allDirs = [logsTargetDirectory];

  allDirs.forEach((target) => {
    if (!fs.existsSync(target)) {
      fs.mkdir(target, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
})();

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'han-recall-0606-deploy' },
  transports: [
    new transports.File({ filename: `${targetDirectory}/error.log`, level: 'error' }),
    new transports.File({ filename: `${targetDirectory}/history.log` })
  ]
});

module.exports = logger;
