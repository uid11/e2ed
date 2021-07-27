import {t as testController} from 'testcafe';

import {waitForInterfaceStabilization} from './actions/waitForInterfaceStabilization';
import {pages} from './pageObjects';
import {log} from './utils/log';

import type {Page} from './Page';
import type {NavigateToPage} from './types/internal';

type Pages = typeof pages;

/**
 * Navigate to the page by page name and page params.
 */
export const navigateToPage: NavigateToPage<Pages> = async (
  pageName: keyof Pages,
  params?: unknown,
): Promise<never> => {
  const startTime = Date.now();
  const page: Page = pages[pageName];
  const fullParams = await page.willNavigateTo(params as never);
  const url = page.route.getUrl(fullParams as never);
  const startNavigateTime = Date.now();

  log(`Will navigate to the page "${String(pageName)}"`, {
    originParams: params,
    fullParams,
    url,
    willNavigateToExecutedInMs: startNavigateTime - startTime,
  });

  await testController.navigateTo(url);

  const stabilizationIntervalFromEnv = Number(process.env.E2ED_NAVIGATE_STABILIZATION_INTERVAL);
  const isStabilizationIntervalFromEnvValid =
    Number.isInteger(stabilizationIntervalFromEnv) && stabilizationIntervalFromEnv > 0;
  const stabilizationInterval = isStabilizationIntervalFromEnvValid
    ? stabilizationIntervalFromEnv
    : 2000;

  if (
    process.env.E2ED_NAVIGATE_STABILIZATION_INTERVAL !== undefined &&
    isStabilizationIntervalFromEnvValid === false
  ) {
    log(
      `Invalid value for environment variable E2ED_NAVIGATE_STABILIZATION_INTERVAL: ${process.env.E2ED_NAVIGATE_STABILIZATION_INTERVAL}. Instead, use the default value ${stabilizationInterval}`,
      {url},
    );
  }

  await waitForInterfaceStabilization(stabilizationInterval);

  log(`Page "${String(pageName)}" loaded in ${Date.now() - startNavigateTime} ms`, {url});

  return page as never;
};
