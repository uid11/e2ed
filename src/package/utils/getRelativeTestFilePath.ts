import {join, sep} from 'path';

import {E2EDError} from './E2EDError';

const testPath = join(sep, 'e2ed', 'tests', sep);

/**
 * Get relative test file path from absolute file path.
 * @internal
 */
export const getRelativeTestFilePath = (absoluteFilePath: string): string => {
  const index = absoluteFilePath.lastIndexOf(testPath);

  if (index === -1) {
    throw new E2EDError('Not a path to test file', {absoluteFilePath});
  }

  return absoluteFilePath.slice(index + testPath.length);
};