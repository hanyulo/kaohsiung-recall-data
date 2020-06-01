const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
/*
updatedAt = data.ST
numberOfYeses = data.CX.map((district, index) => district.agreeTks)
numberOfNos = data.CX.map((district, index) => district.disagreeTks)
totalBallotsCounted = data.CX.map((district, index) => district.prof3)
rateOfVoting = data.CX.map((district, index) => district.profRate)
votingEligiblePopulation = data.CX.map((district, index) => district.prof7)
*/

const isProduction = process.env.NODE_ENV === 'production';
const currentMode = process.env.MODE;
const modes = {
  defRunning: 'DEV_RUNNING',
  defFinal: 'DEV_FINAL',
  prodRunning: 'PROD_RUNNING',
  prodFinal: 'PROD_FINAL',
};
const cecUrlBase = 'https://tvdownload.2020.nat.gov.tw';


const cecUrl = (() => {
  if (currentMode === modes.defRunning) {
    return `${cecUrlBase}/doc/running.json`;
  } else if (currentMode === modes.defFinal) {
    return `${cecUrlBase}/doc/final.json`;
  } else if (currentMode === modes.prodRunning) {
    return ``;
  } else if (currentMode === modes.prodFinal) {
    return ``;
  } else {
    console.log('edge case')
  }
})();



const dataProcessor = () => {
  fetch(cecUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async (response) => {
      const data = await response.text();
      console.log('data: ', data);
    })
    .catch((e) => {
      console.log('e: ', e)
      console.log('fetch data fail')
    });
};

dataProcessor();

// module.exports = dataProcessor;
