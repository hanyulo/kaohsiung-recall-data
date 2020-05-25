#!/bin/sh
nodePath=~/.nvm/versions/node/v13.9.0/bin/node
awsPath=/usr/bin/aws
urlBase=https://tvdownload.2020.nat.gov.tw
devRunURL=${urlBase}/doc/running.json
devFinalURL=${urlBase}/doc/final.json
prodRunURL=${urlBase}/running.json
prodFinalURL=${urlBase}/final.json
targetURL=''
sourceURL=''
prodOption='--http-user=your_account --httppassword=your_password'

#wget --no-check-certificate	--http-user=your_account --httppassword=your_password \
# https://tvdownload.2020.nat.gov.tw/running.json

if [ "${target}" == "devRun" ]; then
  sourceURL=${devRunURL}
  targetURL='./dist/defRunning.json'
  prodOption=''
elif [ "${target}" == "devFinal" ]; then
  sourceURL=${devFinalURL}
  targetURL='./dist/devFinal.json'
  prodOption=''
elif [ "${target}" == "prodRun" ]; then
  sourceURL=${prodRunURL}
  targetURL='./dist/prodRunning.json'
elif [ "${target}" == "prodFinal" ]; then
  sourceURL=${prodFinalURL}
  targetURL='./dist/prodFinal.json'
else
  echo "edge case"
fi

$nodePath /home/ec2-user/code/google-sheet-uploader/src/index.js &&
wget --no-check-certificate ${prodOption} -O ${targetURL} ${sourceURL} &&
$awsPath cloudfront create-invalidation --distribution-id E2RE5FZJI8MX89 --paths \
"/recall-vote-han-kuo-yu/defRunning.json" \
"/recall-vote-han-kuo-yu/devFinal.json" \
"/recall-vote-han-kuo-yu/prodRunning.json" \
"/recall-vote-han-kuo-yu/prodFinal.json"
