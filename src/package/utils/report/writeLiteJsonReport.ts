import {join} from 'path';

import {REPORTS_DIRECTORY_PATH} from '../../constants/internal';

import {generalLog} from '../generalLog';
import {writeFile} from '../writeFile';

import {getLiteReport} from './getLiteReport';

import type {ReportData, UtcTimeInMs} from '../../types/internal';

/**
 * Save lite JSON report (lite-report.json file) with test runs results
 * (and without test run logs).
 * @internal
 */
export const writeLiteJsonReport = async (reportData: ReportData): Promise<void> => {
  const startTimeInMs = Date.now() as UtcTimeInMs;

  const liteReport = getLiteReport(reportData);
  const reportJson = JSON.stringify(liteReport);
  const reportFileName = `lite-${reportData.name}.json`;
  const reportFilePath = join(REPORTS_DIRECTORY_PATH, reportFileName);

  await writeFile(reportFilePath, reportJson);

  const duration = Date.now() - startTimeInMs;

  generalLog(
    `Lite JSON report was written (${reportJson.length} symbols) to "${reportFilePath}" in ${duration} ms`,
  );
};