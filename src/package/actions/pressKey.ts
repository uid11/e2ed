import {LogEventType} from '../constants/internal';
import {testController} from '../testController';
import {log} from '../utils/log';

import {waitForInterfaceStabilization} from './waitForInterfaceStabilization';

type Options = Parameters<typeof testController.pressKey>[1];

/**
 * Presses the specified keyboard keys.
 */
export const pressKey = async (keys: string, options?: Options): Promise<void> => {
  await log(`Press keyboard keys: "${keys}"`, {options}, LogEventType.InternalAction);

  await testController.pressKey(keys, options);

  await waitForInterfaceStabilization();
};
