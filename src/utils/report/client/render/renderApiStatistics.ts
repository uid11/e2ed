import {createSafeHtmlWithoutSanitize as clientCreateSafeHtmlWithoutSanitize} from '../sanitizeHtml';

import {ApiStatisticsItem as clientApiStatisticsItem} from './ApiStatisticsItem';

import type {
  ApiStatistics,
  ApiStatisticsReportHash,
  ObjectEntries,
  SafeHtml,
} from '../../../../types/internal';

const createSafeHtmlWithoutSanitize = clientCreateSafeHtmlWithoutSanitize;
const ApiStatisticsItem = clientApiStatisticsItem;

type Options = Readonly<{
  apiStatistics: ApiStatistics;
  hash: ApiStatisticsReportHash;
}>;

/**
 * Renders `ApiStatistics` of one kind (pages, requests or resources).
 * This base client function should not use scope variables (except other base functions).
 * @internal
 */
export function renderApiStatistics({apiStatistics, hash}: Options): SafeHtml {
  let header: string | undefined;
  const items: SafeHtml[] = [];

  if (hash === 'api-statistics-pages') {
    header = 'Pages';

    for (const [name, byUrl] of Object.entries(apiStatistics.pages)) {
      let pageCount = 0;
      let pageDuration = 0;
      const pageItems: SafeHtml[] = [];

      for (const [url, {count, duration}] of Object.entries(byUrl) as ObjectEntries<typeof byUrl>) {
        pageCount += count;
        pageDuration += duration;

        pageItems.push(ApiStatisticsItem({count, duration, name: url, url}));
      }

      items.push(
        ApiStatisticsItem({count: pageCount, duration: pageDuration, isHeader: true, name}),
      );
      items.push(...pageItems);
    }
  } else if (hash === 'api-statistics-requests') {
    header = 'Requests';

    for (const [url, byMethod] of Object.entries(apiStatistics.requests)) {
      for (const [method, byStatusCode] of Object.entries(byMethod)) {
        // eslint-disable-next-line max-depth
        for (const [statusCode, {count, duration, size}] of Object.entries(byStatusCode)) {
          items.push(
            ApiStatisticsItem({
              count,
              duration,
              name: `${method} ${url} ${statusCode}`,
              size,
            }),
          );
        }
      }
    }
  } else {
    header = 'Resources';

    for (const [url, byStatusCode] of Object.entries(apiStatistics.resources) as ObjectEntries<
      typeof apiStatistics.resources
    >) {
      for (const [statusCode, {count, duration, size}] of Object.entries(byStatusCode)) {
        items.push(
          ApiStatisticsItem({
            count,
            duration,
            name: `${url} ${statusCode}`,
            size,
            url,
          }),
        );
      }
    }
  }

  return createSafeHtmlWithoutSanitize`<article class="test-details">
  <p class="test-details__path"></p>
  <h2 class="test-details__title">${header}</h2>
  <div role="tabpanel">
    <article class="overview">${items.join('')}</article>
  </div>
</article>`;
}
