import {appendFile} from 'node:fs/promises';
import {join} from 'node:path';

import {REPORTS_DIRECTORY_PATH} from '../../constants/internal';

import {getFullPackConfig} from '../config';

/**
 * Array of pack logs. Logs are stored in this array for further saving in the pack logs file.
 * @internal
 */
const logs: string[] = [];

/**
 * Adds log message to pack logs (for later saving to the pack logs file).
 * @internal
 */
export const addLogToLogFile = (logMessage: string): void => {
  logs.push(logMessage);
};

/**
 * Writes pack logs to logs file (if the pack config requires it and there are unwritten logs).
 * @internal
 */
export const writeLogsToFile = async (): Promise<void> => {
  if (logs.length === 0) {
    return;
  }

  const {logFileName} = getFullPackConfig();

  if (logFileName === null) {
    return;
  }

  const logsFilePath = join(REPORTS_DIRECTORY_PATH, logFileName);
  const logsText = logs.join('');

  logs.length = 0;

  await appendFile(logsFilePath, logsText);
};
