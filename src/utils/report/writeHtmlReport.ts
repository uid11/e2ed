import {join} from 'node:path';

import {
  ABSOLUTE_PATH_TO_PROJECT_ROOT_DIRECTORY,
  REPORTS_DIRECTORY_PATH,
} from '../../constants/internal';

import {assertValueIsNotNull} from '../asserts';
import {getFileSize, writeFile} from '../fs';
import {generalLog} from '../generalLog';
import {getDurationWithUnits} from '../getDurationWithUnits';
import {getFileSizeInMb} from '../getFileSizeInMb';

import {renderReportToHtml} from './render';

import type {FilePathFromRoot, ReportData, UtcTimeInMs} from '../../types/internal';

/**
 * Writes HTML report (`report.html` file) with test runs results.
 * @internal
 */
export const writeHtmlReport = async (reportData: ReportData): Promise<void> => {
  const startTimeInMs = Date.now() as UtcTimeInMs;

  const reportHtml = renderReportToHtml(reportData);
  const {reportFileName} = reportData;

  assertValueIsNotNull(reportFileName, 'reportFileName is not null');

  const reportFilePath = join(
    ABSOLUTE_PATH_TO_PROJECT_ROOT_DIRECTORY,
    REPORTS_DIRECTORY_PATH,
    reportFileName,
  ) as FilePathFromRoot;

  await writeFile(reportFilePath, String(reportHtml));

  const reportFileSizeInBytes = await getFileSize(reportFilePath);

  const reportFileSizeInMb = getFileSizeInMb(reportFileSizeInBytes);

  const durationWithUnits = getDurationWithUnits(Date.now() - startTimeInMs);

  generalLog(
    `HTML report was written (${reportFileSizeInMb}) to "file://${reportFilePath}" in ${durationWithUnits}`,
  );
};
