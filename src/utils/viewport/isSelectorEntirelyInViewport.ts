import type {Selector} from '../../types/internal';

import {expect as playwrightExpect} from '@playwright/test';

/**
 * Returns `true`, if the selector is entirely in the viewport
 * (all selector points are in the viewport), and `false` otherwise.
 */
export const isSelectorEntirelyInViewport = async (selector: Selector): Promise<boolean> => {
  try {
    await playwrightExpect(selector.getPlaywrightLocator()).toBeInViewport({
      ratio: 1,
      timeout: 1,
    });

    return true;
  } catch {
    return false;
  }
};
