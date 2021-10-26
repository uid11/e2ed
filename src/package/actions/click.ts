import {testController} from '../testController';
import {getLocatorFromSelector} from '../utils/getLocatorFromSelector';
import {log} from '../utils/log';

import {waitForInterfaceStabilization} from './waitForInterfaceStabilization';

import type {Selector} from '../types/internal';

type Options = Parameters<typeof testController.click>[1];

/**
 * Clicks an element.
 */
export const click = async (selector: Selector, options?: Options): Promise<void> => {
  const locator = getLocatorFromSelector(selector);

  log('Click an element', {locator, options});

  await testController.click(selector, options);

  await waitForInterfaceStabilization();
};
