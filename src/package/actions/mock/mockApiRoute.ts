import {RequestMock} from 'testcafe-without-typecheck';

import {LogEventType} from '../../constants/internal';
import {getApiMockState} from '../../context/apiMockState';
import {testController} from '../../testController';
import {log} from '../../utils/log';
import {getRequestsFilter, getSetResponse} from '../../utils/mockApiRoute';
import {wrapInTestRunTracker} from '../../utils/wrapInTestRunTracker';

import type {
  ApiMockFunction,
  ApiMockState,
  ApiRouteClassTypeWithGetParamsFromUrl,
  Mutable,
  Request,
  Response,
} from '../../types/internal';

/**
 * Mock API for some API route.
 */
export const mockApiRoute = async <
  RouteParams,
  SomeRequest extends Request,
  SomeResponse extends Response,
>(
  Route: ApiRouteClassTypeWithGetParamsFromUrl<RouteParams, SomeRequest, SomeResponse>,
  apiMockFunction: ApiMockFunction<RouteParams, SomeRequest, SomeResponse>,
): Promise<void> => {
  const apiMockState = getApiMockState();
  let {functionByRoute} = apiMockState;

  if (functionByRoute === undefined) {
    functionByRoute = new Map();
    (apiMockState as Mutable<ApiMockState>).functionByRoute = functionByRoute;

    let requestMock = RequestMock();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    requestMock.onRequestTo = wrapInTestRunTracker(requestMock.onRequestTo);

    requestMock = requestMock.onRequestTo(getRequestsFilter(apiMockState));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    requestMock.respond = wrapInTestRunTracker(requestMock.respond);

    const apiMock = requestMock.respond(getSetResponse(apiMockState));

    await testController.addRequestHooks(apiMock);
  }

  functionByRoute.set(Route, apiMockFunction as unknown as ApiMockFunction);

  await log(
    `Mock API for route "${Route.name}"`,
    {apiMockFunctionCode: apiMockFunction.toString()},
    LogEventType.InternalCore,
  );
};