import {
  ANY_URL_REGEXP,
  INCLUDE_BODY_AND_HEADERS_IN_RESPONSE_EVENT,
  REQUEST_HOOK_CONTEXT_ID_KEY,
  REQUEST_HOOK_CONTEXT_KEY,
} from '../../constants/internal';

import {assertValueIsDefined} from '../asserts';
import {getDurationWithUnits} from '../getDurationWithUnits';
import {mapBackendResponseForLogs} from '../log';
import {addNotCompleteRequest, completeRequest, processEventsPredicates} from '../waitForEvents';

import {getHeaderValue} from './getHeaderValue';
import {getRequestFromRequestOptions} from './getRequestFromRequestOptions';
import {getResponseFromResponseEvent} from './getResponseFromResponseEvent';
import {RequestHookWithEvents} from './RequestHookWithEvents';

import type {
  RequestHookConfigureResponseEvent,
  RequestHookContextId,
  RequestHookRequestEvent,
  RequestHookResponseEvent,
  RequestWithUtcTimeInMs,
  ResponseWithRequest,
  UtcTimeInMs,
  WaitForEventsState,
} from '../../types/internal';

/**
 * `RequestHook` to wait for request/response events (`waitForAllRequestsComplete`,
 * `waitForRequest`/`waitForResponse`, `waitForRequestToRoute`/`waitForResponseToRoute`).
 * @internal
 */
export class RequestHookToWaitForEvents extends RequestHookWithEvents {
  constructor(private readonly waitForEventsState: WaitForEventsState) {
    super(ANY_URL_REGEXP, INCLUDE_BODY_AND_HEADERS_IN_RESPONSE_EVENT);
  }

  /**
   * Checks if the request matches any request predicate.
   */
  override async onRequest(event: RequestHookRequestEvent): Promise<void> {
    const request = getRequestFromRequestOptions(event.requestOptions);
    const requestWithUtcTimeInMs: RequestWithUtcTimeInMs = {
      ...request,
      utcTimeInMs: Date.now() as UtcTimeInMs,
    };

    const requestHookContext = event.requestOptions[REQUEST_HOOK_CONTEXT_KEY];
    const requestHookContextId = requestHookContext[REQUEST_HOOK_CONTEXT_ID_KEY];

    assertValueIsDefined(requestHookContextId, 'requestHookContextId is defined', {
      requestWithUtcTimeInMs,
    });

    await addNotCompleteRequest(
      requestWithUtcTimeInMs,
      requestHookContextId,
      this.waitForEventsState,
    );

    if (this.waitForEventsState.requestPredicates.size > 0) {
      await processEventsPredicates({
        eventType: 'Request',
        requestOrResponse: requestWithUtcTimeInMs,
        waitForEventsState: this.waitForEventsState,
      });
    }
  }

  /**
   * Checks if the response matches any request predicate.
   */
  override async onResponse(event: RequestHookResponseEvent): Promise<void> {
    const {body, headers} = event;

    if (headers === undefined) {
      return;
    }

    const contentLength = getHeaderValue(headers, 'content-length');

    if (contentLength !== '0' && body === undefined) {
      return;
    }

    const requestHookContextId = ((headers as Record<symbol, RequestHookContextId>)[
      REQUEST_HOOK_CONTEXT_ID_KEY
    ] || event.requestId) as RequestHookContextId | undefined;

    assertValueIsDefined(requestHookContextId, 'requestHookContextId is defined', {
      responseHeaders: headers,
    });

    const request = this.waitForEventsState.hashOfNotCompleteRequests[requestHookContextId];

    if (request === undefined) {
      return;
    }

    completeRequest(requestHookContextId, this.waitForEventsState);

    const isDecodingNeeded = requestHookContextId !== event.requestId;
    const response = await getResponseFromResponseEvent(event, isDecodingNeeded);
    const completionTimeInMs = Date.now() as UtcTimeInMs;
    const duration = getDurationWithUnits(completionTimeInMs - request.utcTimeInMs);

    const responseWithRequest: ResponseWithRequest = {
      completionTimeInMs,
      duration,
      request,
      ...response,
    };

    mapBackendResponseForLogs(responseWithRequest);

    if (this.waitForEventsState.responsePredicates.size > 0) {
      await processEventsPredicates({
        eventType: 'Response',
        requestOrResponse: responseWithRequest,
        waitForEventsState: this.waitForEventsState,
      });
    }
  }

  override async _onConfigureResponse(event: RequestHookConfigureResponseEvent): Promise<void> {
    await super._onConfigureResponse(event);

    const requestHookContext = event[REQUEST_HOOK_CONTEXT_KEY];
    const requestHookContextId = requestHookContext[REQUEST_HOOK_CONTEXT_ID_KEY];

    assertValueIsDefined(requestHookContextId, 'requestHookContextId is defined', {
      requestHookContext,
    });

    // eslint-disable-next-line no-underscore-dangle
    const headers = requestHookContext._ctx?.destRes?.headers;

    if (headers) {
      (headers as {[REQUEST_HOOK_CONTEXT_ID_KEY]: RequestHookContextId})[
        REQUEST_HOOK_CONTEXT_ID_KEY
      ] = requestHookContextId;
    }
  }
}
