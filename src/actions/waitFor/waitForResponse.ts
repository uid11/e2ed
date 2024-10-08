import {AsyncLocalStorage} from 'node:async_hooks';

import {LogEventType} from '../../constants/internal';
import {getPlaywrightPage} from '../../useContext';
import {getFullPackConfig} from '../../utils/config';
import {setCustomInspectOnFunction} from '../../utils/fn';
import {getDurationWithUnits} from '../../utils/getDurationWithUnits';
import {log} from '../../utils/log';
import {getResponseFromPlaywrightResponse} from '../../utils/requestHooks';
import {getWaitForResponsePredicate} from '../../utils/waitForEvents';

import type {
  Request,
  Response,
  ResponsePredicate,
  ResponseWithRequest,
  UtcTimeInMs,
} from '../../types/internal';

type Options = Readonly<{includeNavigationRequest?: boolean; skipLogs?: boolean; timeout?: number}>;

/**
 * Waits for some response (from browser) filtered by the response predicate.
 * If the function runs longer than the specified timeout, it is rejected.
 */
export const waitForResponse = <
  SomeResponse extends Response = Response,
  SomeRequest extends Request = Request,
>(
  predicate: ResponsePredicate<SomeRequest, SomeResponse>,
  {includeNavigationRequest = false, skipLogs = false, timeout}: Options = {},
): Promise<ResponseWithRequest<SomeResponse, SomeRequest>> => {
  const startTimeInMs = Date.now() as UtcTimeInMs;

  setCustomInspectOnFunction(predicate);

  const {waitForResponseTimeout} = getFullPackConfig();
  const rejectTimeout = timeout ?? waitForResponseTimeout;

  const page = getPlaywrightPage();

  const promise = page
    .waitForResponse(
      AsyncLocalStorage.bind(
        getWaitForResponsePredicate(
          predicate as ResponsePredicate,
          includeNavigationRequest,
          rejectTimeout,
        ),
      ),
      {timeout: rejectTimeout},
    )
    .then(
      (playwrightResponse) =>
        getResponseFromPlaywrightResponse(playwrightResponse) as Promise<
          ResponseWithRequest<SomeResponse, SomeRequest>
        >,
    );

  const timeoutWithUnits = getDurationWithUnits(rejectTimeout);

  if (skipLogs !== true) {
    log(
      `Set wait for response with timeout ${timeoutWithUnits}`,
      {predicate},
      LogEventType.InternalCore,
    );
  }

  return skipLogs !== true
    ? promise.then((response) => {
        const waitWithUnits = getDurationWithUnits(Date.now() - startTimeInMs);

        log(
          `Have waited for response for ${waitWithUnits}`,
          {predicate, response, timeoutWithUnits},
          LogEventType.InternalCore,
        );

        return response;
      })
    : promise;
};
