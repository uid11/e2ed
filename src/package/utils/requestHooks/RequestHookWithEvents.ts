import {RequestHook} from 'testcafe-without-typecheck';

import {RESOLVED_PROMISE} from '../../constants/internal';

import {createTestRunCallback} from '../test';
import {wrapInTestRunTracker} from '../wrapInTestRunTracker';

import {addContextToResultsOfClassCreateMethods} from './addContextToResultsOfClassCreateMethods';
import {eventsFactoryPath} from './testCafeHammerheadPaths';

import type {
  RequestHookConfigureResponseEvent,
  RequestHookRequestEvent,
  RequestHookResponseEvent,
} from '../../types/internal';

type RequestPipelineRequestHookEventFactoryType =
  typeof import('testcafe-hammerhead/lib/request-pipeline/request-hooks/events/factory').default;

const RequestPipelineRequestHookEventFactory =
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
  require<RequestPipelineRequestHookEventFactoryType>(eventsFactoryPath);

addContextToResultsOfClassCreateMethods(RequestPipelineRequestHookEventFactory);

/**
 * Abstract RequestHook class with request/respons events.
 */
abstract class RequestHookWithEvents extends RequestHook {
  constructor(...args: unknown[]) {
    // @ts-expect-error: RequestHook constructor require any[] as arguments
    super(...args);

    /* eslint-disable @typescript-eslint/unbound-method */
    const onRequest = createTestRunCallback(this.onRequest, false);
    const onResponse = createTestRunCallback(this.onResponse, false);
    const onConfigureResponse = createTestRunCallback(this._onConfigureResponse, false);
    /* eslint-enable @typescript-eslint/unbound-method */

    this.resetMethods(onRequest, onResponse, onConfigureResponse);
  }

  /**
   * TestCafe request event handler.
   */
  override onRequest(event: RequestHookRequestEvent): Promise<void> {
    void event;

    return RESOLVED_PROMISE;
  }

  /**
   * TestCafe response event handler.
   */
  override onResponse(event: RequestHookResponseEvent): Promise<void> {
    void event;

    return RESOLVED_PROMISE;
  }

  /**
   * Internal TestCafe response event handler.
   */
  override async _onConfigureResponse(event: RequestHookConfigureResponseEvent): Promise<void> {
    await super._onConfigureResponse(event);
  }

  /**
   * Wrap RequestHook on-methods to TestRunTracker.
   * @internal
   */
  resetMethods(
    onRequest: this['onRequest'],
    onResponse: this['onResponse'],
    _onConfigureResponse: this['_onConfigureResponse'],
  ): void {
    this.onRequest = onRequest;
    this.onResponse = onResponse;
    this._onConfigureResponse = _onConfigureResponse;
  }
}

RequestHookWithEvents.prototype.resetMethods = wrapInTestRunTracker(
  // eslint-disable-next-line @typescript-eslint/unbound-method
  RequestHookWithEvents.prototype.resetMethods,
);

export {RequestHookWithEvents};
