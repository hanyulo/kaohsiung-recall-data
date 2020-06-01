#!/bin/sh

account=''
password=''

## Dev on my mac
nodePathDev=/usr/local/bin/node
awsPathDev=/usr/local/bin/aws
srcDirectoryDev=/Users/han/Documents/code

## Production on AWS server
nodePathProd=~/.nvm/versions/node/v13.9.0/bin/node
awsPathProd=/usr/bin/aws
srcDirectoryProd=/home/ec2-user/code
urlBase=https://tvdownload.2020.nat.gov.tw
s3Directory=/recall-vote-han-kuo-yu
devRunURL=${urlBase}/doc/running.json
devFinalURL=${urlBase}/doc/final.json
prodRunURL=${urlBase}/data/json/running.json
prodFinalURL=${urlBase}/data/json/final.json
targetURL=''
sourceURL=''
invalidationPath=''
srcDirectory=''
folder=kaohsiung-recall-data
prodOption="--http-user=${account} --http-password=${password}"

#wget --no-check-certificate	--http-user=your_account --httppassword=your_password \
# https://tvdownload.2020.nat.gov.tw/running.json

if [ "${env}" == "development" ]; then
  nodePath=${nodePathDev}
  awsPath=${awsPathDev}
  srcDirectory=${srcDirectoryDev}
else
  nodePath=${nodePathProd}
  awsPath=${awsPathProd}
  srcDirectory=${srcDirectoryProd}
fi

if [ "${mode}" == "devRunning" ]; then
  sourceURL=${devRunURL}
  targetURL="${srcDirectory}/${folder}/dist/devRunning.json"
  s3targetPath=${s3Directory}/devRunning.json
  prodOption=''
elif [ "${mode}" == "devFinal" ]; then
  sourceURL=${devFinalURL}
  targetURL="${srcDirectory}/${folder}/dist/devFinal.json"
  s3targetPath=${s3Directory}/devFinal.json
  prodOption=''
elif [ "${mode}" == "prodRunning" ]; then
  sourceURL=${prodRunURL}
  targetURL="${srcDirectory}/${folder}/dist/prodRunning.json"
  s3targetPath=${s3Directory}/prodRunning.json
elif [ "${mode}" == "prodFinal" ]; then
  sourceURL=${prodFinalURL}
  targetURL="${srcDirectory}/${folder}/dist/prodFinal.json"
  s3targetPath=${s3Directory}/prodFinal.json
else
  echo "edge case"
fi


if [ "${env}" == "development" ]; then
  echo ${sourceURL}
  echo ${targetURL}
  $nodePath ${srcDirectory}/kaohsiung-recall-data/src/index.js &&
  curl --max-time 120 -k --insecure -u ${account}:${password} ${sourceURL} --output ${targetURL} &&
  MODE=${mode} $nodePath ${srcDirectory}/kaohsiung-recall-data/src/utils/data-processor.js &&
  $nodePath ${srcDirectory}/kaohsiung-recall-data/src/utils/uploader.js &&
  $awsPath cloudfront create-invalidation --distribution-id E2RE5FZJI8MX89 --paths ${s3targetPath}
else
  $nodePath ${srcDirectory}/kaohsiung-recall-data/src/index.js &&
  wget --no-check-certificate ${prodOption} -O ${targetURL} ${sourceURL} &&
  MODE=${mode} $nodePath ${srcDirectory}/kaohsiung-recall-data/src/utils/data-processor.js &&
  $nodePath ${srcDirectory}/kaohsiung-recall-data/src/utils/uploader.js &&
  $awsPath cloudfront create-invalidation --distribution-id E2RE5FZJI8MX89 --paths ${s3targetPath}
fi
