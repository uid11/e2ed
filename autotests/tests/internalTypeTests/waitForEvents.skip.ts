import {AddUser, GetUser} from 'autotests/routes/apiRoutes';
import {
  waitForNewTab,
  waitForRequest,
  waitForRequestToRoute,
  waitForResponse,
  waitForResponseToRoute,
} from 'e2ed/actions';

// ok
void waitForRequest(() => false);

// ok
void waitForResponse(() => false);

// ok
void waitForRequest(() => false, {});

// ok
void waitForResponse(() => false, {});

// @ts-expect-error: wrong returned value
void waitForRequest(() => undefined, {});

// @ts-expect-error: wrong returned value
void waitForResponse(() => undefined, {});

// ok
void waitForRequest(() => Promise.resolve(true), {});

// ok
void waitForResponse(() => Promise.resolve(true), {});

// ok
void waitForRequest(() => false, {timeout: 10_000});

// ok
void waitForResponse(() => false, {timeout: 10_000});

// @ts-expect-error: unknown options property
void waitForRequest(() => false, {foo: 10_000});

// @ts-expect-error: unknown options property
void waitForResponse(() => false, {foo: 10_000});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
void waitForRequest(({method, query, requestBody, requestHeaders, url}) => true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
void waitForResponse(({responseBody, responseHeaders, statusCode}) => true);

// ok
void waitForRequestToRoute(AddUser);

// ok
void waitForRequestToRoute(AddUser, ({delay}, {requestBody, url}) => {
  if (delay !== undefined && delay > 0 && requestBody.job !== 'foo') {
    return url.startsWith('https');
  }

  return false;
}).then(
  ({request, routeParams}) =>
    request.requestBody.job === 'foo' && 'delay' in routeParams && routeParams.delay > 0,
);

// @ts-expect-error: waitForRequestToRoute does not accept routes without `getParamsFromUrlOrThrow` method
void waitForRequestToRoute(GetUser);

// ok
void waitForResponseToRoute(AddUser);

// ok
void waitForResponseToRoute(AddUser, ({delay}, {responseBody, request: {requestBody, url}}) => {
  if (delay !== undefined && delay > 0 && requestBody.job !== 'foo' && responseBody.job !== 'bar') {
    return url.startsWith('https');
  }

  return false;
}).then(
  ({response, routeParams}) =>
    response.request.requestBody.job === 'foo' &&
    response.responseBody.name === 'bar' &&
    'delay' in routeParams &&
    routeParams.delay > 0,
);

// @ts-expect-error: waitForResponseToRoute does not accept routes without `getParamsFromUrlOrThrow` method
void waitForResponseToRoute(GetUser);

// ok
void waitForNewTab();

// ok
void waitForNewTab({timeout: 2_000});

// ok
void waitForNewTab(() => Promise.resolve());

// ok
void waitForNewTab(() => {});

// ok
void waitForNewTab(() => Promise.resolve(), {timeout: 1_000});

// @ts-expect-error: waitForNewTab does not accept options as first argument
void waitForNewTab({timeout: 1_000}, () => {});
