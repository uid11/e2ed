import type {TestRunStatus} from '../constants/internal';

import type {Brand} from './brand';
import type {UtcTimeInMs} from './date';
import type {DeepReadonly} from './deep';
import type {TestRunError} from './errors';
import type {TestRunEvent} from './events';
import type {TestMeta} from './userland';

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
