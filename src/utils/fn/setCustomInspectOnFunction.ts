/* eslint-disable no-param-reassign */

import {inspect} from 'node:util';

import {assertValueHasProperty} from '../asserts';

import {getFunctionPresentationForLogs} from './getFunctionPresentationForLogs';

import type {Fn, StringForLogs} from '../../types/internal';

function getFunctionPresentationForThis(this: Fn): string | StringForLogs {
  return getFunctionPresentationForLogs(this);
}

/**
 * Set custom `node:inspect` and toJSON presentation (with function code) on function.
 */
export const setCustomInspectOnFunction = <Args extends readonly unknown[], Return, This>(
  func: Fn<Args, Return, This>,
): void => {
  assertValueHasProperty(func, inspect.custom, {
    check: '`func` has `inspect.custom` property',
    skipCheckInRuntime: true,
  });

  if (func[inspect.custom]) {
    return;
  }

  func[inspect.custom] = getFunctionPresentationForThis;

  (func as unknown as {toJSON(): string | StringForLogs}).toJSON = getFunctionPresentationForThis;
};
