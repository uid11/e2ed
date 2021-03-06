import {RunEnvironment} from '../../configurator';

import {getUnvisitedTestFilePaths} from '../getUnvisitedTestFilePaths';

import type {TestRunWithHooks} from '../../types/internal';

/**
 * Get all report errors. General report status is failed if there is any error.
 * @internal
 */
export const getReportErrors = async (
  runEnvironment: RunEnvironment,
  testRunsWithHooks: readonly TestRunWithHooks[],
): Promise<readonly string[]> => {
  const errors: string[] = [];

  if (runEnvironment === RunEnvironment.Docker) {
    const unvisitedTestFilePaths = await getUnvisitedTestFilePaths(testRunsWithHooks);
    const numberOfUnvisited = unvisitedTestFilePaths.length;
    const onlyOne = numberOfUnvisited === 1;

    if (numberOfUnvisited !== 0) {
      errors.push(
        `Error: There ${onlyOne ? 'is' : 'are'} ${numberOfUnvisited} e2ed/tests/**/*.spec.ts-file${
          onlyOne ? '' : 's'
        } not visited when running tests: ${unvisitedTestFilePaths.join(', ')}`,
      );
    }
  }

  return errors;
};
