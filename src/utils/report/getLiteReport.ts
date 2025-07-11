import {assertValueIsNotNull} from '../asserts';

import {getLiteRetry} from './getLiteRetry';

import type {LiteReport, ReportData} from '../../types/internal';

/**
 * Get lite report with test runs results and without test run logs.
 * @internal
 */
export const getLiteReport = (reportData: ReportData): LiteReport => {
  const {
    apiStatistics,
    endE2edReason,
    endTimeInMs,
    errors,
    exitCode,
    failedTestsMainParams,
    liteReportFileName,
    retries,
    startInfo,
    summaryPackResults,
    warnings,
  } = reportData;

  assertValueIsNotNull(liteReportFileName, 'liteReportFileName is not null');

  const liteRetries = retries.map(getLiteRetry);

  return {
    afterPackExecutionTimeWithUnits: '',
    apiStatistics,
    customReportProperties: undefined,
    endE2edReason,
    endTimeInMs,
    errors,
    exitCode,
    failedTestsMainParams,
    liteReportFileName,
    retries: liteRetries,
    startInfo,
    summaryPackResults,
    warnings,
  };
};
