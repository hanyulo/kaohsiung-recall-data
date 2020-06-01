const fs = require('fs');
const path = require('path');
const logger = require('./create-logger');
const _get = require('lodash/get');

const _ = {
  get: _get
};

/*
updatedAt = data.ST
numberOfYeses = data.CX.map((district, index) => district.agreeTks)
numberOfNos = data.CX.map((district, index) => district.disagreeTks)
attemptedVoteCount = data.CX.map((district, index) => district.prof3)
rateOfVoting = data.CX.map((district, index) => district.profRate)
votingEligiblePopulation = data.CX.map((district, index) => district.prof7)

totalBallotsCounted = data.CX.map((district, index) => district.prof1)
*/

const currentMode = process.env.MODE;
const extension = 'json';

const modes = {
  defRunning: 'devRunning',
  devFinal: 'devFinal',
  prodRunning: 'prodRunning',
  prodFinal: 'prodFinal'
};

const fileNames = {
  [modes.defRunning]: 'defRunning',
  [modes.devFinal]: 'devFinal',
  [modes.prodRunning]: 'prodRunning',
  [modes.prodFinal]: 'prodFinal'
};

const targetFileName = (() => {
  if (currentMode === modes.defRunning) {
    return fileNames[modes.defRunning];
  } else if (currentMode === modes.devFinal) {
    return fileNames[modes.devFinal];
  } else if (currentMode === modes.prodRunning) {
    return fileNames[modes.prodRunning];
  } else if (currentMode === modes.prodFinal) {
    return fileNames[modes.prodFinal];
  } else {
    console.log('edge case');
  }
})();

const processData = ({
  jsonObject
}) => {
  const updatedAt = _.get(jsonObject, 'ST', undefined);
  const districts = _.get(jsonObject, 'CX', []);
  let numberOfYeses = 0;
  let numberOfNos = 0;
  let attemptedVoteCount = 0;
  let rateOfVoting = 0;
  let votingEligiblePopulation = 0;
  let totalBallotsCounted = 0;
  districts.forEach(({
    agreeTks,
    disagreeTks,
    prof3,
    profRate,
    prof7,
    prof1
  }) => {
    numberOfYeses = agreeTks + numberOfYeses;
    numberOfNos = disagreeTks + numberOfNos;
    attemptedVoteCount = attemptedVoteCount + prof3;
    rateOfVoting = rateOfVoting + profRate;
    votingEligiblePopulation = votingEligiblePopulation + prof7;
    totalBallotsCounted = totalBallotsCounted + prof1;
  });

  return {
    updatedAt,
    numberOfYeses,
    numberOfNos,
    attemptedVoteCount,
    rateOfVoting: (rateOfVoting / districts.length).toFixed(2),
    votingEligiblePopulation,
    totalBallotsCounted
  };
};

const processAndWrite = ({
  jsonObject,
  targetDirectory,
  originalDirectory,
  fileName,
  extension
}) => {
  fs
    .writeFile(`${targetDirectory}/${fileName}_${Date.now()}.${extension}`, JSON.stringify(jsonObject, null, 2), (err) => {
      if (err) {
        logger.log({
          level: 'error',
          message: `fail to write file: ${fileName}: ${err}`
        });
      } else {
        logger.log({
          level: 'info',
          message: `write file ${fileName} successfully`
        });
      }
    });
  const desiredData = processData({
    jsonObject
  });
  fs
    .writeFile(`${originalDirectory}/${fileName}.${extension}`, JSON.stringify(desiredData, null, 2), (err) => {
      if (err) {
        logger.log({
          level: 'error',
          message: `fail to write file: ${fileName}: ${err}`
        });
      } else {
        logger.log({
          level: 'info',
          message: `write file ${fileName} successfully`
        });
      }
    });
};

const fetchData = ({
  fileName,
  extension
}) => {
  const filePath = path.resolve(__dirname, `../../dist/${fileName}.${extension}`);
  const binaryData = fs.readFileSync(filePath);
  const jsonObject = JSON.parse(binaryData);
  processAndWrite({
    jsonObject,
    originalDirectory: path.resolve(__dirname, '../../dist'),
    targetDirectory: path.resolve(__dirname, '../../history'),
    fileName,
    extension
  });
};

fetchData({
  fileName: targetFileName,
  extension
});
