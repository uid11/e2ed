import {EndE2edReason, TESTCAFERC_PATH} from '../../constants/internal';

import {assertValueIsDefined} from '../asserts';
import {hasBrowsersArg} from '../browser';
import {getFullPackConfig} from '../config';
import {endE2ed} from '../end';
import {setRunLabel} from '../environment';
import {startResourceUsageReading} from '../resourceUsage';
import {createRunLabel} from '../runLabel';

import {getPackTimeoutPromise} from './packTimeout';

/**
 * Runs e2ed pack of tests (or tasks) with command line arguments.
 * @internal
 */
export const runPackWithArgs = async (): Promise<void> => {
  const {browsers, concurrency, enableLiveMode, resourceUsageReadingInternal} = getFullPackConfig();
  const runLabel = createRunLabel({
    concurrency,
    disconnectedBrowsersCount: 0,
    maxRetriesCount: 1,
    retryIndex: 1,
  });

  startResourceUsageReading(resourceUsageReadingInternal);
  setRunLabel(runLabel);

  if (browsers.length > 0 && !hasBrowsersArg()) {
    process.argv.splice(2, 0, String(browsers));
  }

  process.argv.push('--concurrency', String(concurrency));
  process.argv.push('--config-file', TESTCAFERC_PATH);

  if (enableLiveMode) {
    process.argv.push('--live');
  }

  const packTimeoutPromise = getPackTimeoutPromise();

  type TestCafeWithoutTypeCheckCli = typeof import('testcafe-without-typecheck/lib/cli/cli');

  const {runTestCafePromise} =
    // eslint-disable-next-line global-require, import/no-internal-modules, @typescript-eslint/no-var-requires
    require<TestCafeWithoutTypeCheckCli>('testcafe-without-typecheck/lib/cli/cli');

  assertValueIsDefined(runTestCafePromise, 'runTestCafePromise is defined', {argv: process.argv});

  await Promise.race([runTestCafePromise, packTimeoutPromise]);

  endE2ed(EndE2edReason.LocalTestCafeRunEnded);
};
