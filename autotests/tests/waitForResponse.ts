import {it} from 'autotests';
import {createClientFunction, expect} from 'e2ed';
import {waitForResponse} from 'e2ed/actions';
import {E2edError} from 'e2ed/utils';

import type {Response} from 'e2ed/types';

type Body = Readonly<{job: string; name: string}> | undefined;

it(
  'waitForResponse gets correct response body and rejects on timeout',
  {meta: {testId: '3'}, testIdleTimeout: 3_000},
  async () => {
    const addUser = createClientFunction(
      () =>
        fetch('https://reqres.in/api/users', {
          body: JSON.stringify({job: 'leader', name: 'John'}),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          method: 'POST',
        }).then((res) => res.json()),
      {name: 'addUser'},
    );

    void addUser();

    const response = await waitForResponse(
      ({responseBody}: Response<Body>) => responseBody?.name === 'John',
    );

    await expect(response.responseBody, 'response has correct body').contains({
      job: 'leader',
      name: 'John',
    });

    await waitForResponse(() => false, {timeout: 100}).then(
      () => {
        throw new E2edError('waitForResponse did not throw an error after timeout');
      },
      () => undefined,
    );
  },
);
