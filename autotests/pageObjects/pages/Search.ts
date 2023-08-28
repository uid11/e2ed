import {MobilePage} from 'autotests/pageObjects';
import {Search as SearchRoute} from 'autotests/routes/pageRoutes';
import {waitForAllRequestsComplete, waitForInterfaceStabilization} from 'e2ed/actions';

import type {GetParamsType} from 'e2ed/types';

type RouteParams = GetParamsType<SearchRoute>;
type CustomPageParams = Partial<RouteParams>;

/**
 * The Search mobile page.
 */
export class Search extends MobilePage<CustomPageParams> {
  /**
   * The mobile device on which the page is open.
   */
  readonly mobileDevice = 'iphone' as const;

  /**
   * The search query of the page.
   */
  readonly searchQuery!: string;

  override init(): void {
    const searchQuery = this.pageParams.searchQuery ?? 'foo';

    Object.assign<Search, Partial<Search>>(this, {searchQuery});
  }

  getRoute(): SearchRoute {
    const {searchQuery} = this;

    return new SearchRoute({searchQuery});
  }

  override async waitForPageLoaded(): Promise<void> {
    await waitForAllRequestsComplete(({url}) => {
      if (
        url.startsWith('https://adservice.google.com/') ||
        url.startsWith('https://googleads.g.doubleclick.net/') ||
        url.startsWith('https://play.google.com/') ||
        url.startsWith('https://static.doubleclick.net/')
      ) {
        return false;
      }

      return true;
    });

    await waitForInterfaceStabilization(this.pageStabilizationInterval);
  }
}
