import {EndE2edReason} from '../../constants/internal';

import {getFullPackConfig} from '../config';
import {endE2ed, endE2edReason} from '../end';
import {setReadonlyProperty} from '../setReadonlyProperty';

import {processRetry} from './processRetry';

import type {RetriesState} from '../../types/internal';

/**
 * Processes retries of remaining tests in a loop.
 * @internal
 */
export const processRetries = async (retriesState: RetriesState): Promise<void> => {
  const fullConfig = getFullPackConfig();
  const {concurrency} = fullConfig;
  const maxRetriesCount = 1;

  Object.assign<RetriesState, Partial<RetriesState>>(retriesState, {concurrency, maxRetriesCount});

  for (
    ;
    !retriesState.isLastRetrySuccessful &&
    retriesState.retryIndex <= maxRetriesCount &&
    endE2edReason === undefined;
    setReadonlyProperty(retriesState, 'retryIndex', retriesState.retryIndex + 1)
  ) {
    await processRetry(retriesState);
  }

  setReadonlyProperty(retriesState, 'isRetriesCycleEnded', true);

  endE2ed(EndE2edReason.RetriesCycleEnded);
};
