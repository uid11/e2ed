import {readJsonReportData as clientReadJsonReportData} from './readJsonReportData';
import {setDomElementsToClientState as clientSetDomElementsToClientState} from './setDomElementsToClientState';

import type {ReportClientState} from '../../../types/internal';

declare const reportClientState: ReportClientState;

const readJsonReportData = clientReadJsonReportData;
const setDomElementsToClientState = clientSetDomElementsToClientState;

/**
 * `DOMContentLoaded` handler for report page.
 * This client function should not use scope variables (except global functions).
 * @internal
 */
export const onDomContentLoad = (): void => {
  setDomElementsToClientState({afterDomContentLoad: true});

  readJsonReportData(true);

  for (const observer of reportClientState.readJsonReportDataObservers) {
    observer.disconnect();
  }

  reportClientState.readJsonReportDataObservers.length = 0;
};
