import {ClientFunction as BaseClientFunction} from 'testcafe-without-typecheck';

import {generalLog} from './utils/generalLog';

import type {WrappedClientFunction} from './types/internal';

type E2edClientFunctionWrapper = Array<(() => void) | undefined>;

/**
 * This client function wraps all ClientFunction bodies and terminates them on page unload.
 */
const clientFunctionWrapper = function clientFunctionWrapper(): unknown {
  // eslint-disable-next-line
  const args: unknown[] = Array.prototype.slice.call(arguments);

  const global: {
    e2edClientFunctionWrapper?: E2edClientFunctionWrapper;
  } & Window = window;

  if (!global.e2edClientFunctionWrapper) {
    global.e2edClientFunctionWrapper = [];

    global.addEventListener('beforeunload', () => {
      const {e2edClientFunctionWrapper} = global;

      if (!e2edClientFunctionWrapper) {
        return;
      }

      e2edClientFunctionWrapper.forEach((resolve, index) => {
        e2edClientFunctionWrapper[index] = undefined;

        if (resolve) {
          resolve();
        }
      });
    });
  }

  const {e2edClientFunctionWrapper} = global;
  let result: Promise<void> | undefined;

  try {
    // @ts-expect-error: originFn is out of scope
    result = originFn.apply(undefined, args); // eslint-disable-line
  } catch (error) {
    // do nothing
  }

  if (!result || typeof result.then !== 'function') {
    return result;
  }

  return new Promise<void>((resolve, reject) => {
    const index = e2edClientFunctionWrapper.push(resolve) - 1;

    (result as Promise<void>).then(
      (value) => {
        e2edClientFunctionWrapper[index] = undefined;

        resolve(value);
      },
      (error) => {
        e2edClientFunctionWrapper[index] = undefined;

        reject(error);
      },
    );
  });
};

/**
 * Creates a client function.
 */
export const ClientFunction = <R, A extends unknown[]>(
  originFn: (...args: A) => R,
  name: string,
): WrappedClientFunction<R, A> => {
  const clientFunction = BaseClientFunction<Awaited<R> | undefined, A>(
    clientFunctionWrapper as unknown as (...args: A) => Awaited<R> | undefined,
    {
      dependencies: {originFn},
    },
  );

  generalLog(`Create client function "${name}"`, {
    originFn: String(originFn).slice(0, 80),
  });

  const wrappedClientFunction = (async (...args: A) => {
    try {
      return clientFunction(...args).catch((error: unknown) => {
        generalLog(`Client function "${name}" rejected with error`, {args, error, originFn});

        return undefined;
      });
    } catch (error) {
      generalLog(`Client function "${name}" thrown an error`, {args, error, originFn});
    }

    return undefined;
  }) as WrappedClientFunction<R, A>;

  return wrappedClientFunction;
};
