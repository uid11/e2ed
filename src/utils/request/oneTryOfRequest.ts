import {BAD_REQUEST_STATUS_CODE, LogEventType} from '../../constants/internal';
import {getRandomId} from '../../generators/internal';

import {cloneWithoutUndefinedProperties} from '../clone';
import {E2edError} from '../error';
import {log} from '../log';
import {parseMaybeEmptyValueAsJson} from '../parseMaybeEmptyValueAsJson';
import {wrapInTestRunTracker} from '../testRun';

import type {Response} from '../../types/internal';

import type {LogParams, OneTryOfRequestOptions} from './types';

/**
 * One try of request.
 * @internal
 */
export const oneTryOfRequest = <SomeResponse extends Response>({
  isResponseBodyInJsonFormat,
  libRequest,
  logParams,
  options,
  requestBodyAsString,
  timeout,
  urlObject,
}: OneTryOfRequestOptions): Promise<{
  fullLogParams: LogParams;
  response: SomeResponse;
}> =>
  new Promise((resolve, reject) => {
    const fullOptions = {
      ...options,
      requestHeaders: cloneWithoutUndefinedProperties({
        'x-e2ed-request-id': getRandomId(),
        ...options.requestHeaders,
      }),
    };
    const fullLogParams: LogParams = {...logParams, ...fullOptions};
    const {requestHeaders, ...fullOptionsWithoutHeaders} = fullOptions;
    const fullOptionsWithHeaders = {...fullOptionsWithoutHeaders, headers: requestHeaders};

    log(`Will be send a request to ${logParams.url}`, fullLogParams, LogEventType.InternalUtil);

    let endTimeout: NodeJS.Timeout;

    const req = libRequest(urlObject, fullOptionsWithHeaders, (res) => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      res.on = wrapInTestRunTracker(res.on);

      res.setEncoding('utf8');

      const chunks: string[] = [];

      res.on('data', (chunk: string) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const responseBodyAsString = chunks.join('');
        const statusCode = res.statusCode ?? BAD_REQUEST_STATUS_CODE;

        try {
          const responseBody: SomeResponse['responseBody'] = isResponseBodyInJsonFormat
            ? parseMaybeEmptyValueAsJson(responseBodyAsString)
            : responseBodyAsString;

          const response = {
            responseBody,
            responseHeaders: res.headers,
            statusCode,
          } as SomeResponse;

          clearTimeout(endTimeout);
          resolve({fullLogParams, response});
        } catch (cause) {
          clearTimeout(endTimeout);
          reject(
            new E2edError(
              `The response data string to request ${logParams.url} is not valid JSON: ${responseBodyAsString}`,
              {...fullLogParams, cause, statusCode},
            ),
          );
        }
      });
    });

    endTimeout = setTimeout(() => {
      req.destroy();
      req.emit(
        'error',
        new E2edError(`The request to ${logParams.url} is timed out in ${timeout}ms`, {
          ...fullLogParams,
          cause: undefined,
        }),
      );
    }, timeout);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    req.on = wrapInTestRunTracker(req.on);

    req.on('error', (cause) => {
      clearTimeout(endTimeout);
      reject(new E2edError(`Error on request to ${logParams.url}`, {...fullLogParams, cause}));
    });

    req.write(requestBodyAsString);
    req.end();
  });
