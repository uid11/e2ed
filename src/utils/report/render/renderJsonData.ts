import {createSafeHtmlWithoutSanitize, sanitizeJson} from '../client';

import type {ReportData, SafeHtml} from '../../../types/internal';

/**
 * Renders tag <script type="application/json"> with JSON presentation of report data.
 * @internal
 */
export const renderJsonData = (reportData: ReportData): SafeHtml => {
  const {fullTestRuns} = reportData;

  const json = JSON.stringify(fullTestRuns);
  const sanitizedJson = sanitizeJson(json);

  return createSafeHtmlWithoutSanitize`
<script id="e2edJsonReportData" type="application/json">${sanitizedJson}</script>`;
};
