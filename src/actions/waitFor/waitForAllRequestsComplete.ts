import {LogEventType} from '../../constants/internal';
import {getTestRunPromise} from '../../context/testRunPromise';
import {getWaitForEventsState} from '../../context/waitForEventsState';
import {E2edError} from '../../utils/error';
import {setCustomInspectOnFunction} from '../../utils/fn';
import {getFullPackConfig} from '../../utils/getFullPackConfig';
import {log} from '../../utils/log';
import {getPromiseWithResolveAndReject} from '../../utils/promise';
import {RequestHookToWaitForEvents} from '../../utils/requestHooks';
import {setReadonlyProperty} from '../../utils/setReadonlyProperty';
import {
  getInitialIdsForAllRequestsCompletePredicate,
  getUrlsByRequestHookContextIds,
} from '../../utils/waitForEvents';

import type {
  AllRequestsCompletePredicateWithPromise,
  RequestPredicate,
  UtcTimeInMs,
  Void,
} from '../../types/internal';

type Options = Readonly<{maxIntervalBetweenRequestsInMs?: number; timeout?: number}>;

/**
 * Wait for the complete of all requests that satisfy the request predicate.
 * If the function runs longer than the specified timeout, it is rejected.
 * If there are no new requests for more than `maxIntervalBetweenRequestsInMs`ms,
 * the function resolves successfully.
 */
export const waitForAllRequestsComplete = async (
  predicate: RequestPredicate,
  {maxIntervalBetweenRequestsInMs, timeout}: Options = {},
): Promise<void> => {
  const startTimeInMs = Date.now() as UtcTimeInMs;

  setCustomInspectOnFunction(predicate);

  const {allRequestsCompletePredicates, hashOfNotCompleteRequests} = getWaitForEventsState(
    RequestHookToWaitForEvents,
  );
  const {waitForAllRequestsComplete: defaultTimeouts} = getFullPackConfig();
  const resolveTimeout =
    maxIntervalBetweenRequestsInMs ?? defaultTimeouts.maxIntervalBetweenRequestsInMs;
  const rejectTimeout = timeout ?? defaultTimeouts.timeout;

  log(
    `Set wait for all requests complete with timeout ${rejectTimeout}ms`,
    {maxIntervalBetweenRequestsInMs: resolveTimeout, predicate},
    LogEventType.InternalCore,
  );

  const requestHookContextIds = await getInitialIdsForAllRequestsCompletePredicate(
    hashOfNotCompleteRequests,
    predicate,
  );

  const {clearRejectTimeout, promise, reject, resolve, setRejectTimeoutFunction} =
    getPromiseWithResolveAndReject<Void>(rejectTimeout);

  const allRequestsCompletePredicateWithPromise: AllRequestsCompletePredicateWithPromise = {
    clearResolveTimeout: () => {},
    predicate,
    reject,
    requestHookContextIds,
    setResolveTimeout: () => {},
  };
  const testRunPromise = getTestRunPromise();

  void testRunPromise.then(clearRejectTimeout);

  setRejectTimeoutFunction(() => {
    const urlsOfNotCompleteRequests = getUrlsByRequestHookContextIds(
      requestHookContextIds,
      hashOfNotCompleteRequests,
    );
    const error = new E2edError(
      `waitForAllRequestsComplete promise rejected after ${rejectTimeout}ms timeout`,
      {predicate, urlsOfNotCompleteRequests},
    );

    allRequestsCompletePredicates.delete(allRequestsCompletePredicateWithPromise);

    allRequestsCompletePredicateWithPromise.clearResolveTimeout();

    reject(error);
  });

  const setResolveTimeout = (): void => {
    allRequestsCompletePredicateWithPromise.clearResolveTimeout();

    const {clearRejectTimeout: clearResolveTimeout, promise: resolvePromise} =
      getPromiseWithResolveAndReject<Void>(resolveTimeout);

    setReadonlyProperty(
      allRequestsCompletePredicateWithPromise,
      'clearResolveTimeout',
      clearResolveTimeout,
    );

    void testRunPromise.then(clearResolveTimeout);

    resolvePromise.catch(() => {
      allRequestsCompletePredicates.delete(allRequestsCompletePredicateWithPromise);

      const waitInMs = Date.now() - startTimeInMs;

      log(
        `Have waited for all requests complete for ${waitInMs}ms`,
        {maxIntervalBetweenRequestsInMs: resolveTimeout, predicate, timeout: rejectTimeout},
        LogEventType.InternalUtil,
      );

      resolve();
    });
  };

  setReadonlyProperty(
    allRequestsCompletePredicateWithPromise,
    'setResolveTimeout',
    setResolveTimeout,
  );

  allRequestsCompletePredicates.add(allRequestsCompletePredicateWithPromise);

  if (requestHookContextIds.size === 0) {
    allRequestsCompletePredicateWithPromise.setResolveTimeout();
  }

  return promise;
};