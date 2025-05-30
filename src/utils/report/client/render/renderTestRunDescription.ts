import {parseMarkdownLinks as clientParseMarkdownLinks} from '../parseMarkdownLinks';
import {
  createSafeHtmlWithoutSanitize as clientCreateSafeHtmlWithoutSanitize,
  sanitizeHtml as clientSanitizeHtml,
} from '../sanitizeHtml';

import {renderDatesInterval as clientRenderDatesInterval} from './renderDatesInterval';
import {renderDuration as clientRenderDuration} from './renderDuration';

import type {FullTestRun, ReportClientState, SafeHtml} from '../../../../types/internal';

const createSafeHtmlWithoutSanitize = clientCreateSafeHtmlWithoutSanitize;
const parseMarkdownLinks = clientParseMarkdownLinks;
const renderDatesInterval = clientRenderDatesInterval;
const renderDuration = clientRenderDuration;
const sanitizeHtml = clientSanitizeHtml;

declare const reportClientState: ReportClientState;

/**
 * Renders tag `<dl class="test-description">` with test run description.
 * The value strings of meta can contain links in markdown format.
 * This base client function should not use scope variables (except other base functions).
 * @internal
 */
export function renderTestRunDescription(fullTestRun: FullTestRun): SafeHtml {
  const {endTimeInMs, outputDirectoryName, runError, startTimeInMs} = fullTestRun;
  const durationInMs = endTimeInMs - startTimeInMs;
  const {meta} = fullTestRun.options;
  const metaHtmls: SafeHtml[] = [];

  for (const [key, value] of Object.entries(meta)) {
    const valueWithLinks = parseMarkdownLinks`${value}`;
    const metaHtml = sanitizeHtml`
<dt class="test-description__term">${key}</dt>
<dd class="test-description__definition">${valueWithLinks}</dd>`;

    metaHtmls.push(metaHtml);
  }

  let traceHtml: SafeHtml = createSafeHtmlWithoutSanitize``;

  if (runError !== undefined) {
    const {internalDirectoryName} = reportClientState;
    const traceLabel = 'Download trace';
    const traceName = 'trace.zip';
    const traceUrl = `./${internalDirectoryName}/${outputDirectoryName}/${traceName}`;

    traceHtml = sanitizeHtml`
<dt class="test-description__term">${traceLabel}</dt>
<dd class="test-description__definition">
  <a href="${traceUrl}" aria-label="${traceLabel}" download="${traceName}">${traceName}</a>
</dd>`;
  }

  const metaProperties = createSafeHtmlWithoutSanitize`${metaHtmls.join('')}`;

  return sanitizeHtml`
<dl class="test-description test-description_type_meta">
  ${metaProperties}
  ${traceHtml}
  <dt class="test-description__term">Date</dt>
  <dd class="test-description__definition">
    ${renderDatesInterval({endTimeInMs, startTimeInMs})}
  </dd>
  <dt class="test-description__term">Duration</dt>
  <dd class="test-description__definition">
    ${renderDuration(durationInMs)}
  </dd>
</dl>`;
}
