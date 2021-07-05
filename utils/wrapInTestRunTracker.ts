import testRunTracker from 'testcafe/lib/api/test-run-tracker';

/**
 * Wrap functions that set callbacks in the test run tracker.
 */
export const wrapInTestRunTracker = <F extends (...args: never[]) => unknown>(fn: F): F => {
  // eslint-disable-next-line no-underscore-dangle
  return testRunTracker._createContextSwitchingFunctionHook(fn, 8) as F;
};
