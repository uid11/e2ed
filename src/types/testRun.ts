import type {TestRunStatus} from '../constants/internal';
import type {E2edError} from '../utils/error';

import type {Brand} from './brand';
import type {UtcTimeInMs} from './date';
import type {DeepReadonly} from './deep';
import type {TestRunEvent} from './events';
import type {TestFilePath} from './paths';
import type {TestMetaPlaceholder} from './userland';

/**
 * Reject test run.
 */
export type RejectTestRun = (error: E2edError) => void;

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
 * Test options with userland metadata.
 */
export type TestOptions<TestMeta = TestMetaPlaceholder> = DeepReadonly<{
  meta: TestMeta;
  testIdleTimeout?: number;
  testTimeout?: number;
}>;

/**
 * The complete static test options, that is, the options
 * available from the code before the tests are run.
 */
export type TestStaticOptions<TestMeta = TestMetaPlaceholder> = Readonly<{
  filePath: TestFilePath;
  name: string;
  options: TestOptions<TestMeta>;
}>;

/**
 * Completed test run object with userland metadata.
 * Not internal because it used in user hooks.
 */
export type TestRun<TestMeta = TestMetaPlaceholder> = Readonly<{
  endTimeInMs: UtcTimeInMs;
  runError: string | undefined;
  startTimeInMs: UtcTimeInMs;
}> &
  Omit<
    TestRunEvent<TestMeta>,
    'onlog' | 'previousRunId' | 'reject' | 'testFnWithReject' | 'utcTimeInMs'
  >;

/**
 * The complete test options, that is, all information about the test
 * that is input to the test function.
 * @internal
 */
export type Test = Readonly<{testFn: TestFn}> & Omit<TestStaticOptions, 'filePath'>;

/**
 * Test function as part of public API, with userland metadata.
 */
export type TestFunction<TestMeta = TestMetaPlaceholder> = (
  name: string,
  options: TestOptions<TestMeta>,
  testFn: TestFn,
) => void;

/**
 * Lite test run object with userland metadata.
 */
export type LiteTestRun<TestMeta = TestMetaPlaceholder> = Readonly<{
  endTimeInMs: UtcTimeInMs;
  mainParams: string;
  runError: string | undefined;
  runHash: RunHash;
  startTimeInMs: UtcTimeInMs;
  status: TestRunStatus;
}> &
  TestStaticOptions<TestMeta>;

/**
 * Full test run object result of userland hooks (like mainParams and runHash).
 * @internal
 */
export type FullTestRun = Readonly<{mainParams: string; runHash: RunHash}> & TestRun;
