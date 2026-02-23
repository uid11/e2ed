import type {Selector} from '../../types/internal';

import {expect as playwrightExpect} from '@playwright/test';

/**
 * Returns `true`, if the selector is in the viewport
 * (intersects with the viewport at least in one point), and `false` otherwise.
 */
export const isSelectorInViewport = async (selector: Selector): Promise<boolean> => {
  try {
    await playwrightExpect(selector.getPlaywrightLocator()).toBeInViewport({timeout: 1});

    return true;
  } catch {
    return false;
  }
};
