#!/usr/bin/env sh

sed -i "s/\x22pngjs\x22: \x22[^\x22]*\x22,//" ./bin/TestCafeFork/package/package.json
sed -i "s/\x22typescript\x22: \x22[^\x22]*\x22,//" ./bin/TestCafeFork/package/package.json

sed -i "s/\x22devDependencies\x22/\x22peerDependencies\x22: {\x22pngjs\x22: \x22>=6\x22, \x22typescript\x22: \x22>=4\x22},\x22devDependencies\x22/" ./bin/TestCafeFork/package/package.json
