import {setPageCookiesAndNavigateToUrl} from 'autotests/actions';
import {clearPageCookies, getPageCookies} from 'autotests/context';
import {navigateToUrl} from 'e2ed/actions';

import type {NavigateTo} from 'autotests/types';

/**
 * This hook is used inside the navigateToPage function to navigate to the page
 * under the already computed url.
 * Use context (e2ed/context) to get parameters inside a hook.
 */
export const navigateTo: NavigateTo = async (url) => {
  const pageCookies = getPageCookies();

  if (pageCookies === undefined) {
    // As with all hooks, you can replace it with your own implementation.
    await navigateToUrl(url, {skipLogs: true});
  } else {
    clearPageCookies();

    await setPageCookiesAndNavigateToUrl(url, pageCookies);
  }
};
