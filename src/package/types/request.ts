import type {IncomingHttpHeaders} from 'http';

import type {Brand} from './brand';

/**
 * Cookie object.
 */
export type Cookie = Readonly<{name: string; value: string}>;

/**
 * HTTP headers.
 */
export type Headers = Readonly<IncomingHttpHeaders>;

/**
 * Map headers to new (overridden) headers.
 */
export type MapHeaders = (headers: Headers) => Partial<Headers>;

/**
 * Options for mappers of headers.
 */
export type MapOptions = Readonly<{
  mapRequestHeaders?: MapHeaders;
  mapResponseHeaders?: MapHeaders;
}>;

/**
 * HTTP Method.
 */
export type Method =
  | 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

/**
 * Object with query (search) part of the url, or query string itself.
 */
export type Query =
  | Record<
      string,
      | string
      | number
      | boolean
      | readonly string[]
      | readonly number[]
      | readonly boolean[]
      | null
      | undefined
    >
  | string;

/**
 * Brand type for url string.
 */
export type Url = Brand<string, 'Url'>;
