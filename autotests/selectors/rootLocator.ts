import {createSelectorByCss} from 'autotests/selectors';
import {createLocator, getCssSelectorFromAttributesChain} from 'e2ed/createLocator';

import type {ReportRootLocator, Selector} from 'e2ed/types';

/**
 * Project root locator, mapped to `Selector`.
 */
export const rootLocator = createLocator<ReportRootLocator, Selector>('app', {
  mapAttributesChain: (attributesChain) => {
    const cssSelector = getCssSelectorFromAttributesChain(attributesChain);

    return createSelectorByCss(cssSelector.replace('data-test-runhash', 'data-runhash'));
  },
});
