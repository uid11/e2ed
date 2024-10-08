import type {RunLabel, RunLabelObject} from '../../types/internal';

/**
 * Creates `RunLabel` from `RunLabelObject` (for example, `'r:1/3,c:20'`).
 * @internal
 */
export const createRunLabel = ({concurrency, maxRetriesCount}: RunLabelObject): RunLabel =>
  `r:${maxRetriesCount},c:${concurrency}` as RunLabel;
