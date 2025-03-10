import {LogEventType} from '../../constants/internal';
import {getPlaywrightPage} from '../../useContext';
import {getFullPackConfig} from '../../utils/config';
import {E2edError} from '../../utils/error';
import {setCustomInspectOnFunction} from '../../utils/fn';
import {getDurationWithUnits} from '../../utils/getDurationWithUnits';
import {log} from '../../utils/log';
import {getRequestFromPlaywrightRequest} from '../../utils/requestHooks';

import type {
  Request,
  RequestPredicate,
  RequestWithUtcTimeInMs,
  Trigger,
  UtcTimeInMs,
} from '../../types/internal';

type Action = (<SomeRequest extends Request>(
  predicate: RequestPredicate<SomeRequest>,
  trigger: Trigger | undefined,
  options?: Options,
) => Promise<RequestWithUtcTimeInMs<SomeRequest>>) &
  (<SomeRequest extends Request>(
    predicate: RequestPredicate<SomeRequest>,
    options?: Options,
  ) => Promise<RequestWithUtcTimeInMs<SomeRequest>>);

type Options = Readonly<{skipLogs?: boolean; timeout?: number}>;

/**
 * Waits for some request (from browser) filtered by the request predicate.
 * If the function runs longer than the specified timeout, it is rejected.
 */
export const waitForRequest = (async <SomeRequest extends Request>(
  predicate: RequestPredicate<SomeRequest>,
  triggerOrOptions?: Options | Trigger,
  options?: Options,
): Promise<RequestWithUtcTimeInMs<SomeRequest>> => {
  const startTimeInMs = Date.now() as UtcTimeInMs;

  setCustomInspectOnFunction(predicate);

  const trigger = typeof triggerOrOptions === 'function' ? triggerOrOptions : undefined;
  const finalOptions = typeof triggerOrOptions === 'function' ? options : triggerOrOptions;

  const timeout = finalOptions?.timeout ?? getFullPackConfig().waitForRequestTimeout;

  if (trigger !== undefined) {
    setCustomInspectOnFunction(trigger);
  }

  const page = getPlaywrightPage();

  const promise = page
    .waitForRequest(
      async (playwrightRequest) => {
        try {
          const request = getRequestFromPlaywrightRequest(playwrightRequest);

          const result = await predicate(request as RequestWithUtcTimeInMs<SomeRequest>);

          return result;
        } catch (cause) {
          throw new E2edError('waitForRequest predicate threw an exception', {
            cause,
            timeout,
            trigger,
          });
        }
      },
      {timeout},
    )
    .then(
      (playwrightRequest) =>
        getRequestFromPlaywrightRequest(playwrightRequest) as RequestWithUtcTimeInMs<SomeRequest>,
    );

  const timeoutWithUnits = getDurationWithUnits(timeout);

  if (finalOptions?.skipLogs !== true) {
    log(
      `Set wait for request with timeout ${timeoutWithUnits}`,
      {predicate, trigger},
      LogEventType.InternalCore,
    );
  }

  await trigger?.();

  const request = await promise;

  if (finalOptions?.skipLogs !== true) {
    const waitWithUnits = getDurationWithUnits(Date.now() - startTimeInMs);

    log(
      `Have waited for request for ${waitWithUnits}`,
      {predicate, request, timeoutWithUnits, trigger},
      LogEventType.InternalCore,
    );
  }

  return request;
}) as Action;
