import {parse} from 'node:querystring';
import {URL} from 'node:url';

import type {Inner} from 'testcafe-without-typecheck';

import type {Method, Request, Url} from '../../types/internal';

/**
 * Parse request body as JSON string.
 * @internal
 */
const parseBody = (body: unknown): unknown => (body ? JSON.parse(String(body)) : undefined);

/**
 * Get Request object from the original TestCafe request options object.
 * @internal
 */
export const getRequestFromRequestOptions = (
  requestOptions: Inner.RequestOptions,
  requestBodyIsInJsonFormat?: boolean,
): Request => {
  const url = String(requestOptions.url) as Url;
  const {search} = new URL(url);

  const method = (requestOptions.method ?? 'GET').toUpperCase() as Method;

  const query = parse(search ? search.slice(1) : '');

  let requestBody: unknown | undefined;

  if (requestBodyIsInJsonFormat === true) {
    requestBody = parseBody(requestOptions.body);
  } else if (requestBodyIsInJsonFormat === false) {
    requestBody = requestOptions.body;
  } else {
    try {
      requestBody = parseBody(requestOptions.body);
    } catch {
      requestBody = requestOptions.body;
    }
  }

  const requestHeaders = requestOptions.headers ?? {};

  return {method, query, requestBody, requestHeaders, url};
};