import {ClientFunction} from '../../../ClientFunction';
import {LogEventType} from '../../../constants/internal';
import {log} from '../../../utils/log';

import {waitForInterfaceStabilization} from '../../waitFor';

import type {AnyPageClassType} from '../../../types/internal';

const goPageHistoryClient = ClientFunction(
  (delta: number) => window.history.go(delta),
  'goPageHistory',
);

/**
 * Go delta steps in browser page history.
 */
export const goPageHistory = async (
  page: InstanceType<AnyPageClassType>,
  delta: number,
): Promise<void> => {
  await log(
    `Go ${delta} steps in browser history from page "${page.constructor.name}"`,
    undefined,
    LogEventType.InternalAction,
  );

  await goPageHistoryClient(delta);

  await waitForInterfaceStabilization(page.pageStabilizationInterval);
};