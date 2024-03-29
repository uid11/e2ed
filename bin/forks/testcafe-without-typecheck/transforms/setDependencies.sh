#!/usr/bin/env sh
set -eu

sed -i "s|\x22@types/node\x22: \x22[^\x22]*\x22,||" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s/\x22bin-v8-flags-filter\x22: \x22[^\x22]*\x22,/\x22bin-v8-flags-filter\x22: \x221.2.0\x22,/" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s/\x22globby\x22: \x22[^\x22]*\x22,/\x22globby\x22: \x2211.1.0\x22,/" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s/\x22pngjs\x22: \x22[^\x22]*\x22,/\x22pngjs\x22: \x227.0.0\x22,/" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s/\x22testcafe-hammerhead\x22: \x22[^\x22]*\x22,/\x22testcafe-hammerhead-up\x22: \x2231.7.0-rc.1\x22,/" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s|\x22testcafe-reporter-spec\x22: \x22[^\x22]*\x22,|\x22testcafe-reporter-for-e2ed\x22: \x220.0.4\x22,|" ./bin/forks/testcafe-without-typecheck/package/package.json
sed -i "s/\x22typescript\x22: \x22[^\x22]*\x22,//" ./bin/forks/testcafe-without-typecheck/package/package.json

sed -i "s|\x22devDependencies\x22|\x22peerDependencies\x22: {\x22@types/node\x22: \x22>=20\x22, \x22typescript\x22: \x22>=5\x22},\x22devDependencies\x22|" ./bin/forks/testcafe-without-typecheck/package/package.json

