import {getExitStatus} from '../exit';
import {getFullConfig} from '../getFullConfig';

import {assertThatTestNamesAndFilePathsAreUnique} from './assertThatTestNamesAndFilePathsAreUnique';
import {getReportErrors} from './getReportErrors';
import {getRetries} from './getRetries';
import {unificateRunHashes} from './unificateRunHashes';

import type {FullEventsData, ReportData} from '../../types/internal';

/**
 * Collect complete report data from all sources.
 * @internal
 */
export const collectReportData = async ({
  endE2edReason,
  endTimeInMs,
  fullTestRuns,
  startInfo,
}: FullEventsData): Promise<ReportData> => {
  const {liteReportFileName, reportFileName} = getFullConfig();

  const errors = await getReportErrors(startInfo.runEnvironment, fullTestRuns);

  assertThatTestNamesAndFilePathsAreUnique(fullTestRuns);

  unificateRunHashes(fullTestRuns);

  const retries = getRetries(fullTestRuns);
  const exitStatus = getExitStatus(retries);

  return {
    endE2edReason,
    endTimeInMs,
    errors,
    exitStatus,
    fullTestRuns,
    liteReportFileName,
    reportFileName,
    retries,
    startInfo,
  };
};
