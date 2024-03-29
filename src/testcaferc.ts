/**
 * @file Full pack configuration (extended TestCafe configuration) for running tests.
 * Don't import this module. Instead, use `getFullPackConfig` from `utils/config`.
 */

import {join} from 'node:path';

import {
  ABSOLUTE_PATH_TO_PROJECT_ROOT_DIRECTORY,
  COMPILED_USERLAND_CONFIG_DIRECTORY,
  SCREENSHOTS_DIRECTORY_PATH,
} from './constants/internal';
import {assertValueIsTrue} from './utils/asserts';
import {getTestCafeBrowsersString} from './utils/browser';
// eslint-disable-next-line import/no-internal-modules
import {assertUserlandPack} from './utils/config/assertUserlandPack';
import {getPathToPack} from './utils/environment';
import {setCustomInspectOnFunction} from './utils/fn';

import type {FrozenPartOfTestCafeConfig, FullPackConfig, UserlandPack} from './types/internal';

const pathToPack = getPathToPack();
const tsExtension = '.ts';

assertValueIsTrue(pathToPack.endsWith(tsExtension), `pathToPack ends with "${tsExtension}"`, {
  pathToPack,
});

const pathFromCompiledConfigDirectoryToCompiledPack = `${pathToPack.slice(0, -tsExtension.length)}.js`;

const absoluteCompiledUserlandPackPath = join(
  ABSOLUTE_PATH_TO_PROJECT_ROOT_DIRECTORY,
  COMPILED_USERLAND_CONFIG_DIRECTORY,
  pathFromCompiledConfigDirectoryToCompiledPack,
);

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
const userlandPack = require<{pack: UserlandPack}>(absoluteCompiledUserlandPackPath).pack;

assertUserlandPack(userlandPack);

const frozenPartOfTestCafeConfig: FrozenPartOfTestCafeConfig = {
  color: true,
  compilerOptions: {typescript: {options: {esModuleInterop: true, resolveJsonModule: true}}},
  disableMultipleWindows: true,
  hostname: 'localhost',
  pageLoadTimeout: 0,
  reporter: [{name: 'for-e2ed'}],
  retryTestPages: true,
  screenshots: {
    path: SCREENSHOTS_DIRECTORY_PATH,
    // eslint-disable-next-line no-template-curly-in-string
    pathPattern: '${DATE}_${TIME}_${BROWSER}_${BROWSER_VERSION}/${TEST}/${FILE_INDEX}.png',
    takeOnFails: false,
    thumbnails: false,
  },
  skipJsErrors: true,
};

const fullPackConfig: FullPackConfig = {
  ...userlandPack,
  browsers: getTestCafeBrowsersString(userlandPack),
  disableNativeAutomation: !userlandPack.enableChromeDevToolsProtocol,
  src: userlandPack.testFileGlobs,
  ...frozenPartOfTestCafeConfig,
};

const {
  doAfterPack,
  doBeforePack,
  filterTestsIntoPack,
  mapBackendResponseErrorToLog,
  mapBackendResponseToLog,
  mapLogPayloadInConsole,
  mapLogPayloadInLogFile,
  mapLogPayloadInReport,
} = fullPackConfig;

for (const fn of doAfterPack) {
  setCustomInspectOnFunction(fn);
}

for (const fn of doBeforePack) {
  setCustomInspectOnFunction(fn);
}

setCustomInspectOnFunction(filterTestsIntoPack);
setCustomInspectOnFunction(mapBackendResponseErrorToLog);
setCustomInspectOnFunction(mapBackendResponseToLog);
setCustomInspectOnFunction(mapLogPayloadInConsole);
setCustomInspectOnFunction(mapLogPayloadInLogFile);
setCustomInspectOnFunction(mapLogPayloadInReport);

Object.assign(exports, fullPackConfig);

// eslint-disable-next-line import/no-unused-modules
export {fullPackConfig};
