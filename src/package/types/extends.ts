import type {DeepReadonly, OriginalTestRunError} from './internal';

/**
 * Internal extend TestController type.
 * @internal
 */
declare module 'testcafe-without-typecheck' {
  namespace Inner {
    interface TestController {
      readonly testRun: DeepReadonly<{
        errs: readonly OriginalTestRunError[];
        test: {
          testFile: {
            filename: string;
          };
        };
      }>;
    }
  }
}
