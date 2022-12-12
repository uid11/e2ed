import {join} from 'node:path';

import {INSTALLED_E2ED_DIRECTORY_PATH} from '../../constants/internal';
import {createTestCafe} from '../../testcafe';

import {E2edError} from '../E2edError';
import {generalLog} from '../generalLog';
import {getFullConfig} from '../getFullConfig';

import type {Inner} from 'testcafe-without-typecheck';

import type {E2edEnvironment, RunRetryOptions} from '../../types/internal';

const pathToTestcaferc = join(INSTALLED_E2ED_DIRECTORY_PATH, 'testcaferc.js');

/**
 * Runs tests (via TestCafe JavaScript API, for running one retry in docker).
 * Rejects, if there are some failed tests.
 * @internal
 */
export const runTests = async ({
  concurrency,
  runLabel,
  successfulTestRunNamesHash,
}: RunRetryOptions): Promise<void> => {
  (process.env as E2edEnvironment).E2ED_RUN_LABEL = runLabel;

  let maybeTestCafe: Inner.TestCafe | undefined;

  try {
    const {browser} = getFullConfig();
    const browsers = [browser];

    const testCafe = await createTestCafe({browsers, configFile: pathToTestcaferc});

    maybeTestCafe = testCafe;

    const runner = testCafe.createRunner();

    const failedTestsCount = await runner
      .browsers(browsers)
      .concurrency(concurrency)
      .filter((testName: string) => !successfulTestRunNamesHash[testName])
      .run();

    if (failedTestsCount !== 0) {
      throw new E2edError(`Got ${failedTestsCount} failed tests in retry with label "${runLabel}"`);
    }
  } catch (error) {
    generalLog(`Caught an error when running tests in retry with label "${runLabel}"`, {error});

    throw error;
  } finally {
    await maybeTestCafe?.close();
  }
};
