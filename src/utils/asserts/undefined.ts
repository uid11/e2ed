import {E2edError} from '../error';

import type {LogParams} from '../../types/internal';

/**
 * Asserts that the value is defined (is not undefined).
 */
export function assertValueIsDefined<T>(
  value: T,
  check: string,
  payload?: LogParams,
): asserts value is Exclude<T, undefined> {
  if (value === undefined) {
    throw new E2edError('Asserted value is undefined', {check, payload});
  }
}

/**
 * Asserts that the value is undefined (is not defined).
 */
export function assertValueIsUndefined<T>(
  value: T,
  check: string,
  payload?: LogParams,
): asserts value is T & undefined {
  if (value !== undefined) {
    throw new E2edError('Asserted value is defined', {check, payload, value});
  }
}
