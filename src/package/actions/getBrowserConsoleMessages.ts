import {testController} from '../testController';
import {log} from '../utils/log';

type ConsoleMessages = ReturnType<typeof testController.getBrowserConsoleMessages> extends Promise<
  infer T
>
  ? T
  : never;

/**
 * Returns an object that contains messages output to the browser console.
 */
export const getBrowserConsoleMessages = async (): Promise<ConsoleMessages> => {
  await log('Get browser console messages', 'internalAction');

  return testController.getBrowserConsoleMessages();
};
