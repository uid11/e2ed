import {Selector as TestCafeSelector} from 'testcafe-without-typecheck';

import type {Selector} from '../../types/internal';

/**
 * Returns `true`, if the selector is in the viewport
 * (intersects with the viewport at least in one point), and `false` otherwise.
 */
export const isSelectorInViewport = async (selector: Selector): Promise<boolean> => {
  const htmlElementSelector = TestCafeSelector('html');

  const clientHeight = await htmlElementSelector.clientHeight;
  const clientWidth = await htmlElementSelector.clientWidth;

  const {bottom, left, right, top} = await selector.boundingClientRect;

  return top < clientHeight && bottom > 0 && left < clientWidth && right > 0;
};
