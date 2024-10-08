import {assertValueIsNotNull} from '../asserts';
import {getFullPackConfig} from '../config';
import {generalLog} from '../generalLog';

import type {FullMocksState, TestFilePath} from '../../types/internal';

/**
 * Writes full mocks of one test.
 * @internal
 */
export const writeFullMocks = async (
  fullMocksState: FullMocksState,
  name: string,
  filePath: TestFilePath,
): Promise<void> => {
  const {fullMocks: fullMocksConfig} = getFullPackConfig();

  assertValueIsNotNull(fullMocksConfig, 'fullMocksConfig is not null');

  await fullMocksConfig.writeTestFullMocks(fullMocksState.testId, fullMocksState.testFullMocks);

  generalLog('Full mocks have been written', {
    filePath,
    name,
    requestKinds: Object.fromEntries(
      Object.entries(fullMocksState.testFullMocks).map(([key, value]) => [key, value.length]),
    ),
    testId: fullMocksState.testId,
  });
};
