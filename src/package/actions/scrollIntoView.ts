import {LogEventType} from '../constants/internal';
import {testController} from '../testController';
import {getLocatorFromSelector} from '../utils/locators';
import {log} from '../utils/log';

import type {Selector, TestCafeSelector} from '../types/internal';

type Options = Parameters<typeof testController.scrollIntoView>[1];

/**
 * Scrolls the specified element into view.
 */
export const scrollIntoView = async (selector: Selector, options?: Options): Promise<void> => {
  const locator = getLocatorFromSelector(selector);

  await log(
    'Scroll the specified element into view',
    {locator, options},
    LogEventType.InternalAction,
  );

  return testController.scrollIntoView(selector as TestCafeSelector, options);
};
