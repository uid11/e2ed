import {ClientFunction} from '../../ClientFunction';
import {LogEventType} from '../../constants/internal';
import {log} from '../../utils/log';

import {waitForInterfaceStabilization} from '../waitForInterfaceStabilization';

import type {AnyPageClassType} from '../../types/internal';

const clientReloadPage = ClientFunction(() => window.location.reload(), 'reloadPage');

/**
 * Reloads the page, taking into account its stabilization interval.
 */
export const reloadPage = async (page: InstanceType<AnyPageClassType>): Promise<void> => {
  await log(`Reload page "${page.constructor.name}"`, LogEventType.InternalAction);

  await clientReloadPage();

  await waitForInterfaceStabilization(page.pageStabilizationInterval);
};
