/* eslint-disable max-lines */

import {test} from 'autotests';
import {getPageCookies} from 'autotests/context';
import {addUser} from 'autotests/entities';
import {AddUser} from 'autotests/routes/apiRoutes';
import {expect} from 'e2ed';
import {waitForResponse, waitForResponseToRoute} from 'e2ed/actions';
import {assertFunctionThrows} from 'e2ed/utils';

import type {ApiAddUserRequest, ApiAddUserResponse, UserWorker} from 'autotests/types';

const worker: UserWorker = {firstName: 'John', lastName: 'Doe'};

test(
  'waitForResponse/waitForResponseToRoute gets correct response body and rejects on timeout',
  {meta: {testId: '3'}, testIdleTimeout: 3_000},
  // eslint-disable-next-line max-lines-per-function
  async () => {
    let response = await waitForResponse<ApiAddUserRequest, ApiAddUserResponse>(
      ({responseBody}) => {
        getPageCookies();

        return responseBody.firstName === worker.firstName;
      },
      async () => {
        getPageCookies();

        await addUser({user: worker});
      },
    );

    await expect(response.responseBody, 'response has correct body').contains(worker);

    await assertFunctionThrows(async () => {
      await waitForResponse(() => false, {timeout: 100});
    }, 'waitForResponse throws an error on timeout');

    response = await waitForResponse<ApiAddUserRequest, ApiAddUserResponse>(
      ({request}) => request.url === 'https://dummyjson.com/users/add',
      async () => {
        await addUser({user: worker});
      },
    );

    await expect(response.responseBody, 'second response has correct body').contains(worker);

    await assertFunctionThrows(async () => {
      await waitForResponse(
        () => {
          throw new Error('foo');
        },
        () => {
          void addUser({user: worker});
        },
      ).catch((error: Error) => {
        if (error.cause instanceof Error && error.cause.message === 'foo') {
          throw error;
        }
      });
    }, 'waitForResponse throws an error from predicate');

    await assertFunctionThrows(async () => {
      await waitForResponse(
        () => true,
        async () => {
          await Promise.resolve();

          throw new Error('foo');
        },
      ).catch((error: unknown) => {
        if (error instanceof Error && error.message === 'foo') {
          throw error;
        }
      });
    }, 'waitForResponse throws an error from trigger');

    let {response: routeResponse, routeParams} = await waitForResponseToRoute(AddUser, async () => {
      await addUser({delay: 1_000, user: worker});
    });

    await expect(
      routeResponse.request.requestBody,
      'request from waitForResponseToRoute has correct body',
    ).eql(worker);

    await expect(routeParams, 'routeParams from waitForResponseToRoute is correct').eql({
      delay: 1_000,
    });

    ({response: routeResponse, routeParams} = await waitForResponseToRoute(
      AddUser,
      async () => {
        await addUser({delay: 1_000, user: worker});
      },
      {
        predicate: ({delay}, {request, responseBody}) =>
          delay === 1_000 &&
          request.requestBody.firstName === worker.firstName &&
          responseBody.lastName === worker.lastName,
      },
    ));

    await expect(
      routeParams,
      'routeParams from waitForRequestToRoute with predicate is correct',
    ).eql({delay: 1_000});

    await assertFunctionThrows(async () => {
      await waitForResponseToRoute(
        AddUser,
        async () => {
          await addUser({user: worker});
        },
        {predicate: ({delay}) => delay === 1_000, timeout: 2_000},
      );
    }, 'waitForResponseToRoute throws an error on timeout');

    void addUser({user: worker});

    await assertFunctionThrows(async () => {
      await waitForResponseToRoute(AddUser, {
        predicate: () => {
          throw new Error('foo');
        },
      }).catch((error: Error) => {
        if (error.cause instanceof Error && error.cause.message === 'foo') {
          throw error;
        }
      });
    }, 'waitForResponseToRoute throws an error from predicate');

    await assertFunctionThrows(async () => {
      await waitForResponseToRoute(AddUser, () => {
        throw new Error('foo');
      }).catch((error: unknown) => {
        if (error instanceof Error && error.message === 'foo') {
          throw error;
        }
      });
    }, 'waitForResponseToRoute throws an error from trigger');

    await assertFunctionThrows(async () => {
      await waitForResponseToRoute(
        AddUser,
        async () => {
          await addUser({user: worker});
        },
        {
          predicate: () => {
            throw new Error('foo');
          },
        },
      ).catch((error: Error) => {
        if (error.cause instanceof Error && error.cause.message === 'foo') {
          throw error;
        }
      });
    }, 'waitForResponseToRoute throws an error from predicate with trigger');
  },
);
