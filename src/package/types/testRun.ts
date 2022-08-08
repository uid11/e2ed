import type {TestRunStatus} from '../constants/internal';

import type {Brand} from './brand';
import type {UtcTimeInMs} from './date';
import type {DeepReadonly} from './deep';
import type {TestRunError} from './errors';
import type {TestRunEvent} from './events';
import type {TestFilePath} from './fs';
import type {RunLabel} from './runLabel';
import type {TestMeta} from './userland/types';

/**
 * Method for rejecting (force ending) TestRun.
 */
export type RejectTestRun = (reason: string) => void;

/**
 * Hash string of each test run, generated by userland hook.
 * Used in html report as url-hash for test runs.
 */
export type RunHash = Brand<string, 'RunHash'>;

/**
 * Unique id of each test run.
 */
export type RunId = Brand<string, 'RunId'>;

/**
 * Test function itself.
 */
export type TestFn = () => Promise<void>;

/**
 * Test options.
 */
export type TestOptions = DeepReadonly<{
  meta: TestMeta;
  testTimeout?: number;
}>;

/**
 * The complete static test options, that is, the options
 * available from the code before the tests are run.
 */
export type TestStaticOptions = Readonly<{
  filePath: TestFilePath;
  name: string;
  options: TestOptions;
}>;

/**
 * Completed test run object.
 * Not internal because it used in user hooks.
 */
export type TestRun = Readonly<{
  errors: readonly TestRunError[];
  startTimeInMs: UtcTimeInMs;
  endTimeInMs: UtcTimeInMs;
}> &
  Omit<TestRunEvent, 'clearTimeout' | 'ended' | 'originalErrors' | 'reject' | 'utcTimeInMs'>;

/**
 * Internal state of one test (task).
 * @internal
 */
export type TestRunState = Omit<TestStaticOptions, 'filePath'> & {
  previousRunId: RunId | undefined;
  readonly testFn: TestFn;
  testFnClosure: TestFn | undefined;
};

/**
 * Lite test run object.
 */
export type LiteTestRun = Readonly<{
  endTimeInMs: UtcTimeInMs;
  errors: readonly TestRunError[];
  mainParams: string;
  runHash: RunHash;
  runLabel: RunLabel;
  startTimeInMs: UtcTimeInMs;
  status: TestRunStatus;
}> &
  TestStaticOptions;

/**
 * TestRun object with result of userland hooks (like mainParams and runHash).
 * Used in HTML report.
 * @internal
 */
export type TestRunWithHooks = Readonly<{mainParams: string; runHash: RunHash}> & TestRun;

/**
 * Full test run object with hooks and status.
 * @internal
 */
export type FullTestRun = Readonly<{status: TestRunStatus}> & TestRunWithHooks;
