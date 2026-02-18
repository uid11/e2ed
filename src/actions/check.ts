import {LogEventType} from '../constants/internal';
import {step} from '../step';

import type {Locator} from '@playwright/test';

import type {Selector} from '../types/internal';

type Options = Parameters<Locator['check']>[0];

/**
 * Checks checkbox or radio element, if it is not checked yet.
 */
export const check = (selector: Selector, options: Options = {}): Promise<void> =>
  step(
    `Checks checked or radio element ${selector.description}`,
    async () => {
      await selector.getPlaywrightLocator().check(options);
    },
    {payload: {...options, selector}, type: LogEventType.InternalAction},
  );
