import {pageStorage} from '../../useContext';

import {assertValueIsDefined} from '../asserts';

import {afterErrorInTest} from './afterErrorInTest';
import {afterTest} from './afterTest';
import {beforeTest} from './beforeTest';
import {createRunId} from './createRunId';
import {getOutputDirectoryName} from './getOutputDirectoryName';
import {getShouldRunTest} from './getShouldRunTest';
import {getTestStaticOptions} from './getTestStaticOptions';
import {preparePage} from './preparePage';
import {runTestFn} from './runTestFn';
import {waitBeforeRetry} from './waitBeforeRetry';

import type {RunTest, Test, TestStaticOptions, TestUnit, UtcTimeInMs} from '../../types/internal';

/**
 * Get complete run test function by the complete test options.
 * @internal
 */
export const getRunTest =
  (test: Test): RunTest =>
  ({context, page, request}, testInfo): Promise<void> => {
    const runTest = async (): Promise<void> => {
      const startTimeInMs = Date.now() as UtcTimeInMs;
      const retryIndex = testInfo.retry + 1;
      const runId = createRunId(test, retryIndex);

      let hasRunError = false;
      let shouldRunTest = false;
      let testStaticOptions: TestStaticOptions | undefined;
      let unknownRunError: unknown;

      try {
        testStaticOptions = getTestStaticOptions(test, testInfo);
        shouldRunTest = await getShouldRunTest(testStaticOptions);

        if (!shouldRunTest) {
          return;
        }

        const testUnit: TestUnit = {
          beforeRetryTimeout: await waitBeforeRetry(runId, testStaticOptions),
          outputDirectoryName: getOutputDirectoryName(testInfo.outputDir),
          retryIndex,
          runId,
          startTimeInMs,
          testController: {context, page, request},
          testFn: test.testFn,
          testStaticOptions,
        };

        await preparePage(page);

        beforeTest(testUnit);

        await runTestFn(testUnit);
      } catch (error) {
        hasRunError = true;
        unknownRunError = error;

        assertValueIsDefined(testStaticOptions, 'testStaticOptions is defined', {error, runId});

        await afterErrorInTest(testStaticOptions);

        throw error;
      } finally {
        if (shouldRunTest) {
          await afterTest({hasRunError, runId, unknownRunError});
        }
      }
    };

    return pageStorage.run(page, runTest);
  };
