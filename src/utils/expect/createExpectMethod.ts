import {LogEventStatus, LogEventType, RESOLVED_PROMISE} from '../../constants/internal';
import {testController} from '../../testController';

import {getFullPackConfig} from '../config';
import {E2edError} from '../error';
import {getDurationWithUnits} from '../getDurationWithUnits';
import {log} from '../log';
import {addTimeoutToPromise} from '../promise';
import {getDescriptionFromSelector} from '../selectors';
import {isReExecutablePromise, isThenable} from '../typeGuards';
import {valueToString, wrapStringForLogs} from '../valueToString';

import type {Selector} from '../../types/internal';

import type {
  AssertionFunction,
  AssertionFunctionKey,
  AssertionFunctionsRecord,
  ExpectMethod,
} from './types';

const additionalAssertionTimeoutInMs = 1_000;
let assertionTimeout: number | undefined;

/**
 * Creates method of `Expect` class.
 * @internal
 */
export const createExpectMethod = (
  key: AssertionFunctionKey,
  getAssertionMessage: AssertionFunction<string>,
): ExpectMethod =>
  // eslint-disable-next-line no-restricted-syntax
  function method(...args: Parameters<ExpectMethod>) {
    assertionTimeout ??= getFullPackConfig().assertionTimeout;

    const timeout = assertionTimeout + additionalAssertionTimeoutInMs;
    const message = getAssertionMessage(...args);

    const timeoutWithUnits = getDurationWithUnits(timeout);
    const error = new E2edError(
      `"${key}" assertion promise rejected after ${timeoutWithUnits} timeout`,
    );

    const runAssertion = (value: unknown): Promise<unknown> => {
      const assertion = testController.expect(value) as AssertionFunctionsRecord<Promise<void>>;

      return addTimeoutToPromise(assertion[key](...args), timeout, error);
    };

    const assertionPromise = RESOLVED_PROMISE.then(() => {
      if (
        isThenable(this.actualValue) &&
        !isReExecutablePromise<unknown>(this.actualValue as Promise<unknown>)
      ) {
        return addTimeoutToPromise(this.actualValue as Promise<unknown>, timeout, error).then(
          runAssertion,
        );
      }

      return runAssertion(this.actualValue);
    }).then(
      () => undefined,
      (assertionError: Error) => assertionError,
    );

    return assertionPromise.then((maybeError) => {
      const logMessage = `Assert: ${this.description}`;
      const logPayload = {
        assertionArguments: args,
        description:
          this.actualValue != null
            ? getDescriptionFromSelector(this.actualValue as Selector)
            : undefined,
        error: maybeError,
        logEventStatus: maybeError ? LogEventStatus.Failed : LogEventStatus.Passed,
      };

      return addTimeoutToPromise(Promise.resolve(this.actualValue), timeout, error)
        .then(
          (actualValue) =>
            log(
              logMessage,
              {
                actualValue,
                assertion: wrapStringForLogs(`value ${valueToString(actualValue)} ${message}`),
                ...logPayload,
              },
              LogEventType.InternalAssert,
            ),
          (actualValueResolveError: Error) => {
            log(logMessage, {actualValueResolveError, ...logPayload}, LogEventType.InternalAssert);
          },
        )
        .then(() => {
          if (maybeError) {
            throw maybeError;
          }
        });
    });
  };
