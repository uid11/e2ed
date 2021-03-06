import {LogEventType} from '../constants/internal';
import {testController} from '../testController';
import {log} from '../utils/log';

/**
 * Sets the browser window size.
 */
export const resizeWindow = async (width: number, height: number): Promise<void> => {
  await log(
    `Set the browser window size to width ${width} and height ${height}`,
    LogEventType.InternalAction,
  );

  return testController.resizeWindow(width, height);
};
