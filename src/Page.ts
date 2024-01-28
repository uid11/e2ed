// eslint-disable-next-line import/no-internal-modules
import {navigateToUrl} from './actions/navigateToUrl';
// eslint-disable-next-line import/no-internal-modules
import {waitForAllRequestsComplete, waitForInterfaceStabilization} from './actions/waitFor';
import {CREATE_PAGE_TOKEN} from './constants/internal';
import {assertValueIsTrue} from './utils/asserts';
import {getFullPackConfig} from './utils/config';
import {reloadDocument} from './utils/document';

import type {PageRoute} from './PageRoute';
import type {AsyncVoid, PageClassTypeArgs, ParamsKeyType, Url} from './types/internal';

/**
 * Inner key for parameters type.
 */
declare const PARAMS_KEY: ParamsKeyType;

/**
 * Abstract page with base methods.
 */
export abstract class Page<PageParams = undefined> {
  constructor(...args: PageClassTypeArgs<PageParams>) {
    const [createPageToken, pageParams] = args;

    assertValueIsTrue(createPageToken === CREATE_PAGE_TOKEN, 'createPageToken is correct', {
      createPageToken,
      pageParams,
    });

    this.pageParams = pageParams as PageParams;

    const {
      pageStabilizationInterval,
      waitForAllRequestsComplete: {maxIntervalBetweenRequestsInMs},
    } = getFullPackConfig();

    this.maxIntervalBetweenRequestsInMs = maxIntervalBetweenRequestsInMs;
    this.pageStabilizationInterval = pageStabilizationInterval;
  }

  /**
   * Default maximum interval (in milliseconds) between requests.
   * After navigating to the page, `e2ed` will wait until
   * all requests will complete, and only after that it will consider the page loaded.
   * If there are no new requests for more than this interval,
   * then we will consider that all requests completes
   * The default value is taken from the corresponding field of the pack config.
   */
  readonly maxIntervalBetweenRequestsInMs: number;

  /**
   * Immutable page parameters.
   */
  readonly pageParams: PageParams;

  /**
   * After navigating to the page, `e2ed` will wait until
   * the page is stable for the specified time in millisecond,
   * and only after that it will consider the page loaded.
   * The default value is taken from the corresponding field of the pack config.
   */
  readonly pageStabilizationInterval: number;

  /**
   * Type of page parameters.
   */
  declare readonly [PARAMS_KEY]: PageParams;

  /**
   * Optional initialization (asynchronous or synchronous) of the page after
   * the synchronous constructor has run.
   */
  init?(): AsyncVoid;

  /**
   * Optional hook that runs after asserts the page.
   */
  afterAssertPage?(): AsyncVoid;

  /**
   * Optional hook that runs after navigation to the page.
   */
  afterNavigateToPage?(): AsyncVoid;

  /**
   * Optional hook that runs after reload to the page.
   */
  afterReloadPage?(): AsyncVoid;

  /**
   * Asserts that we are on the expected page by `isMatch` flage.
   * `isMatch` equals `true`, if url matches the page with given parameters, and `false` otherwise.
   */
  assertPage(isMatch: boolean): AsyncVoid {
    assertValueIsTrue(isMatch, `the document url matches the page "${this.constructor.name}"`, {
      page: this,
    });
  }

  /**
   * Optional hook that runs before asserts the page.
   */
  beforeAssertPage?(): AsyncVoid;

  /**
   * Optional hook that runs before navigation to the page (but after page initialization).
   */
  beforeNavigateToPage?(): AsyncVoid;

  /**
   * Optional hook that runs before reload to the page.
   */
  beforeReloadPage?(): AsyncVoid;

  /**
   * Get page route (for navigation to the page).
   */
  abstract getRoute(): PageRoute<unknown>;

  /**
   * Navigates to the page by url.
   */
  navigateToPage(url: Url): Promise<void> {
    return navigateToUrl(url, {skipLogs: true});
  }

  /**
   * Reloads the page.
   */
  reloadPage(): Promise<void> {
    return reloadDocument();
  }

  /**
   * Waits for page loaded.
   */
  async waitForPageLoaded(): Promise<void> {
    await waitForAllRequestsComplete(() => true, {
      maxIntervalBetweenRequestsInMs: this.maxIntervalBetweenRequestsInMs,
    });

    await waitForInterfaceStabilization(this.pageStabilizationInterval);
  }
}
