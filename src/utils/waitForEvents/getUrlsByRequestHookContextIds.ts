import type {RequestHookContextId, Url, WaitForEventsState} from '../../types/internal';

type HashOfNotCompleteRequests = WaitForEventsState['hashOfNotCompleteRequests'];

/**
 * Get array of urls of not complete requests by theirs request hook context ids.
 * @internal
 */
export const getUrlsByRequestHookContextIds = (
  requestHookContextIds: Set<RequestHookContextId>,
  hashOfNotCompleteRequests: HashOfNotCompleteRequests,
): readonly Url[] => {
  const urls: Url[] = [];

  for (const requestHookContextId of requestHookContextIds) {
    const request = hashOfNotCompleteRequests[requestHookContextId];

    if (request !== undefined) {
      urls.push(request.url);
    }
  }

  return urls;
};
