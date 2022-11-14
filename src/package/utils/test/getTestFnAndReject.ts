import {RESOLVED_PROMISE} from '../../constants/internal';

import {E2EDError} from '../E2EDError';
import {generalLog} from '../generalLog';
import {getPromiseWithResolveAndReject} from '../promise';

import type {Onlog, RejectTestRun, RunId, TestFn, Void} from '../../types/internal';

type Options = Readonly<{
  isSkipped: boolean;
  runId: RunId;
  testFn: TestFn;
  testIdleTimeout: number;
  testTimeout: number;
}>;

type Return = Readonly<{onlog: Onlog; reject: RejectTestRun; testFnWithReject: TestFn}>;

const skippedTestFnAndReject: Return = {
  onlog: () => undefined,
  reject: () => undefined,
  testFnWithReject: () => RESOLVED_PROMISE,
};

/**
 * Get test function with execution timeout, idle timeout, reject and onlog functions,
 * by isSkipped flag, test function, runId, test execution timeout and test idle timeouts.
 * @internal
 */
export const getTestFnAndReject = ({
  isSkipped,
  runId,
  testFn,
  testIdleTimeout,
  testTimeout,
}: Options): Return => {
  if (isSkipped) {
    return skippedTestFnAndReject;
  }

  const {
    clearRejectTimeout,
    promise,
    reject: rejectPromise,
    setRejectTimeoutFunction,
  } = getPromiseWithResolveAndReject<Void, Void, Parameters<RejectTestRun>[0]>(testTimeout);

  let isTestRunCompleted = false;

  let idleTimeoutId: NodeJS.Timeout | undefined;

  const testFnWithReject: TestFn = () =>
    Promise.race([testFn(), promise]).finally(() => {
      isTestRunCompleted = true;

      clearTimeout(idleTimeoutId);
      clearRejectTimeout();
    });

  /**
   * Reset idle timeout on log call.
   * @internal
   */
  const onlog = (): void => {
    clearTimeout(idleTimeoutId);

    if (isTestRunCompleted) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    idleTimeoutId = setTimeout(rejectByIdleTimeoutError, testIdleTimeout);
  };

  /**
   * Reject test run by some run error.
   * @internal
   */
  const reject: RejectTestRun = (error) => {
    if (isTestRunCompleted) {
      return;
    }

    generalLog(`Reject test run ${runId} with run error`, {error});

    rejectPromise(error);
  };

  /**
   * Reject test run by test idle timeout error (timeout between steps).
   * @internal
   */
  function rejectByIdleTimeoutError(): void {
    const error = new E2EDError(
      `Test run ${runId} was rejected after ${testIdleTimeout}ms idle timeout`,
    );

    reject(error);
  }

  setRejectTimeoutFunction(() => {
    const error = new E2EDError(`Test run ${runId} was rejected after ${testTimeout}ms timeout`);

    reject(error);
  });

  return {onlog, reject, testFnWithReject};
};
