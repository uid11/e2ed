import {getLiteRetry} from './getLiteRetry';

import type {LiteReport, ReportData} from '../../types/internal';

/**
 * Get lite report with test runs results and without test run logs.
 * @internal
 */
export const getLiteReport = (reportData: ReportData): LiteReport => {
  const {endTimeInMs, errors, name, retries, startInfo, startTimeInMs} = reportData;

  const liteRetries = retries.map(getLiteRetry);

  return {
    endTimeInMs,
    errors,
    name,
    retries: liteRetries,
    startInfo,
    startTimeInMs,
  };
};
