import {createRunId} from '../../generators/internal';

import {generalLog} from '../generalLog';

import {afterTest} from './afterTest';
import {beforeTest} from './beforeTest';
import {runTestFn} from './runTestFn';

import type {RunId, Test, TestController} from '../../types/internal';

type RunTest = (testController: TestController) => Promise<void>;

/**
 * Get complete run test function by the complete test options.
 * @internal
 */
export const getRunTest = (test: Test): RunTest => {
  let previousRunId: RunId | undefined;

  return async (testController: TestController) => {
    const runId = createRunId();

    let hasRunError = false;
    let unknownRunError: unknown;

    try {
      beforeTest({previousRunId, runId, test, testController});

      previousRunId = runId;

      await runTestFn(runId);
    } catch (error) {
      hasRunError = true;
      unknownRunError = error;

      generalLog(`Test run ${runId} failed with error`, {error});

      throw error;
    } finally {
      await afterTest({hasRunError, runId, unknownRunError});
    }
  };
};