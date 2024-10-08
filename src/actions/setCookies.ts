import {LogEventType} from '../constants/internal';
import {getPlaywrightPage} from '../useContext';
import {log} from '../utils/log';

import type {Cookie} from '../types/internal';

/**
 * Set cookies with the specified cookies parameters.
 */
export const setCookies = async (cookies: readonly Cookie[]): Promise<void> => {
  log('Set cookies with the specified cookies parameters', {cookies}, LogEventType.InternalAction);

  const page = getPlaywrightPage();

  const browserContext = page.context();

  await browserContext.addCookies(cookies);
};
