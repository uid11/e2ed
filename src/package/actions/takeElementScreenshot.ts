import {LogEventType} from '../constants/internal';
import {testController} from '../testController';
import {getLocatorFromSelector} from '../utils/locators';
import {log} from '../utils/log';

import type {Selector, TestCafeSelector} from '../types/internal';

type Options = Parameters<typeof testController.takeElementScreenshot>[2];

/**
 * Takes a screenshot of the specified element.
 */
export const takeElementScreenshot = async (
  selector: Selector,
  path?: string,
  options?: Options,
): Promise<void> => {
  const locator = getLocatorFromSelector(selector);
  const pathMessage = path === undefined ? '' : ` to path "${path}"`;

  await log(
    `Take a screenshot of the element${pathMessage}`,
    {locator, options},
    LogEventType.InternalAction,
  );

  return testController.takeElementScreenshot(selector as TestCafeSelector, path, options);
};
