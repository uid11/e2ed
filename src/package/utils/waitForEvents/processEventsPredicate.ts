import {LogEventType} from '../../constants/internal';

import {E2edError} from '../E2edError';
import {getFunctionCode} from '../fn';
import {log} from '../log';

import type {Request, RequestOrResponsePredicateWithPromise, Response} from '../../types/internal';

type Options = Readonly<{
  eventType: 'Request' | 'Response';
  requestOrResponse: Request | Response;
  requestOrResponsePredicateWithPromise: RequestOrResponsePredicateWithPromise;
}>;

/**
 * Resolve/reject waitForRequest/waitForResponse promise if request/response matches one predicate.
 * Returns true if the promise was fulfilled.
 * @internal
 */
export const processEventsPredicate = async ({
  eventType,
  requestOrResponse,
  requestOrResponsePredicateWithPromise,
}: Options): Promise<boolean> => {
  const {predicate, reject, resolve} = requestOrResponsePredicateWithPromise;

  try {
    const isRequestMatched = await predicate(requestOrResponse);

    if (isRequestMatched !== true) {
      return false;
    }

    await log(
      `Have waited for the ${eventType}`,
      {predicateCode: getFunctionCode(predicate), [eventType.toLowerCase()]: requestOrResponse},
      LogEventType.InternalUtil,
    );

    resolve(requestOrResponse);
  } catch (cause) {
    const error = new E2edError(
      `waitFor${eventType} promise rejected due to error in predicate function`,
      {
        cause,
        predicateCode: getFunctionCode(predicate),
        [eventType.toLowerCase()]: requestOrResponse,
      },
    );

    reject(error);
  }

  return true;
};
