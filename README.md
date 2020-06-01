## Kaohsiung Recall Data


## Data Source
* https://tvdownload.2020.nat.gov.tw/
    * [devRunning](https://tvdownload.2020.nat.gov.tw/doc/running.json)
    * [devFinal](https://tvdownload.2020.nat.gov.tw/doc/final.json)


## URLs
* `https://d3prffu8f9hpuw.cloudfront.net/recall-vote-han-kuo-yu/${fileName};`

## Files
* devRunning.json
* devFinal.json
* prodRunning.json
* prodFinal.json


## How to use it

* addd account and password value to start.sh

```bash
mode=devRunning env=development ./start.sh
mode=devFinal env=development ./start.sh
mode=prodRunning env=production ./start.sh
mode=prodFinal env=production ./start.sh
```

```js
MODE=devRunning node ./src/utils/data-processor.js
MODE=devFinal node ./src/utils/data-processor.js
MODE=prodRunning node ./src/utils/data-processor.js
MODE=prodFinal node ./src/utils/data-processor.js

```

## TO DO
* [ ] account password to env for script
