import {setHeadersAndNavigateToUrl} from 'e2ed/actions';
import {LogEventType} from 'e2ed/constants';
import {getHeaderValue, log, replaceSetCookie} from 'e2ed/utils';

import type {Cookie, Headers, Url} from 'e2ed/types';

/**
 * Navigate to the url and set custom page cookies.
 */
export const setPageCookiesAndNavigateToUrl = async (
  url: Url,
  pageCookies: readonly Cookie[],
): Promise<void> => {
  const mapResponseHeaders = (headers: Headers): Headers => {
    let setCookies = getHeaderValue(headers, 'set-cookie');

    if (setCookies === undefined) {
      setCookies = [];
    }

    for (const cookie of pageCookies) {
      setCookies = replaceSetCookie(setCookies, cookie);
    }

    return {'set-cookie': setCookies};
  };

  log(`Navigate to ${url} and set page cookie`, {pageCookies, url}, LogEventType.Action);

  await setHeadersAndNavigateToUrl(url, {mapResponseHeaders});
};
