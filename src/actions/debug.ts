import {LogEventType} from '../constants/internal';
import {testController} from '../testController';
import {log} from '../utils/log';

/**
 * Pauses the test and switches to the step-by-step execution mode.
 */
export const debug = (): Promise<void> => {
  log('Start debug mode', LogEventType.InternalAction);

  return testController.debug();
};
