import {t as testController} from 'testcafe';

import {log} from '../utils/log';

type ConsoleMessages = ReturnType<typeof testController.getBrowserConsoleMessages> extends Promise<
  infer T
>
  ? T
  : never;

/**
 * Returns an object that contains messages output to the browser console.
 */
export const getBrowserConsoleMessages = (): Promise<ConsoleMessages> => {
  log('Get browser console messages');

  return testController.getBrowserConsoleMessages();
};