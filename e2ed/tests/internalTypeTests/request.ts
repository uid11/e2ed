import {CreateDevice, UserSignUp} from 'e2ed/routes/apiRoutes';
import {Main} from 'e2ed/routes/pageRoutes';
import {getRandomId, request} from 'e2ed/utils';

import type {ApiDevice, ApiDeviceParams, ApiUserParams, MobileDevice} from 'e2ed/types';

declare const apiUserParams: ApiUserParams;
declare const model: MobileDevice;
declare const apiDeviceParams: ApiDeviceParams;

// @ts-expect-error: request require API route as first argument
void request(Main, {requestBody: apiUserParams});

// @ts-expect-error: wrong requestBody type
void request(UserSignUp, {requestBody: {}});

// @ts-expect-error: property requestBody should be
void request(UserSignUp, {});

// ok
void request(UserSignUp, {requestBody: apiUserParams});

void async function test() {
  // ok
  const {
    responseBody: {payload},
  } = await request(UserSignUp, {requestBody: apiUserParams});

  const {name}: {name: string} = payload;

  void name;

  // @ts-expect-error: property requestHeaders should be
  void request(CreateDevice, {
    requestBody: apiDeviceParams,
    routeParams: {model},
  });

  void request(CreateDevice, {
    requestBody: apiDeviceParams,
    // @ts-expect-error: wrong requestHeaders type
    requestHeaders: {foo: 'bar'},
    routeParams: {model},
  });

  const {responseBody} = await request(CreateDevice, {
    requestBody: apiDeviceParams,
    requestHeaders: {'x-my-request-id': getRandomId()},
    routeParams: {model},
  });

  const apiDevice: ApiDevice = responseBody.payload;

  void apiDevice;
};
