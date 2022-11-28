import type {Inner} from 'testcafe-without-typecheck';

type MainOptionsKeys = 'headers' | 'method' | 'url';

type Return = {
  [Key in MainOptionsKeys]: Inner.RequestOptions[Key] | undefined;
};

/**
 * Get main request options for printing in logs.
 * @internal
 */
export const getMainRequestOptions = (requestOptions: Inner.RequestOptions): Return => {
  const {headers, method, url} = requestOptions;

  return {headers, method, url};
};