import {assertValueIsDefined} from '../asserts';

import {processAllRequestsCompletePredicate} from './processAllRequestsCompletePredicate';

import type {RequestHookContextId, WaitForEventsState} from '../../types/internal';

/**
 * Processes waitForAllRequestsComplete predicates for new request.
 * @internal
 */
export const processAllRequestsCompletePredicates = async (
  requestHookContextId: RequestHookContextId,
  waitForEventsState: WaitForEventsState,
): Promise<void> => {
  const {allRequestsCompletePredicates, hashOfNotCompleteRequests} = waitForEventsState;
  const request = hashOfNotCompleteRequests[requestHookContextId];

  assertValueIsDefined(request, 'request is defined', {hashOfNotCompleteRequests});

  const promises = [...allRequestsCompletePredicates].map(
    async (allRequestsCompletePredicateWithPromise) => {
      const isFulfilled = await processAllRequestsCompletePredicate(
        allRequestsCompletePredicateWithPromise,
        request,
        requestHookContextId,
      );

      if (isFulfilled) {
        allRequestsCompletePredicates.delete(allRequestsCompletePredicateWithPromise);
      }
    },
  );

  await Promise.all(promises);
};
