#!/bin/sh

# for linux OS
export NODE_ENV=development
#export NODE_ENV=production
./app/bin/node --harmony app.js & wait
#node --harmony-proxies app.js & wait
#node app.js & wait

# for windows OS
#set NODE_ENV=production
#./app/bin/node.exe --harmony app.js


