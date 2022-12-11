import type {request as httpRequest} from 'node:http';

import type {
  Headers,
  Method,
  OptionalIfValueIncludeDefault,
  Request,
  Response,
  Url,
} from '../../types/internal';

/**
 * Request log parameters.
 * @internal
 */
export type LogParams = Readonly<{
  cause: unknown;
  method: Method;
  requestHeaders: Headers | undefined;
  requestBody: unknown;
  retry: string | undefined;
  timeout: number;
  url: Url;
}>;

/**
 * Options of oneTryOfRequest function.
 * @internal
 */
export type OneTryOfRequestOptions = Readonly<{
  isResponseBodyInJsonFormat: boolean;
  libRequest: typeof httpRequest;
  logParams: LogParams;
  options: Readonly<{method: Method; requestHeaders: Headers}>;
  requestBodyAsString: string;
  timeout: number;
  urlObject: URL;
}>;

/**
 * Options of request function.
 */
export type Options<
  RouteParams,
  SomeRequest extends Request,
  SomeResponse extends Response,
> = Readonly<
  {
    isNeedRetry?: (response: SomeResponse) => Promise<boolean> | boolean;
    maxRetriesCount?: number;
    timeout?: number;
  } & OptionalIfValueIncludeDefault<'requestBody', SomeRequest['requestBody'], undefined> &
    OptionalIfValueIncludeDefault<'requestHeaders', SomeRequest['requestHeaders'], Headers> &
    OptionalIfValueIncludeDefault<'routeParams', RouteParams, undefined>
>;