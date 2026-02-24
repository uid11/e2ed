import type {ReportClientState} from '../../../types/internal';

declare const reportClientState: ReportClientState;

type Options = Readonly<{afterDomContentLoad?: boolean}> | undefined;

/**
 * Set dynamic DOM elements to `reportClientState`.
 * This client function should not use scope variables (except global functions).
 * @internal
 */
export const setDomElementsToClientState = ({afterDomContentLoad = false}: Options = {}): void => {
  let {e2edRightColumnContainer} = reportClientState;

  if (e2edRightColumnContainer) {
    return;
  }

  e2edRightColumnContainer = document.getElementById('e2edRightColumnContainer') ?? undefined;

  if (e2edRightColumnContainer) {
    Object.assign<ReportClientState, Partial<ReportClientState>>(reportClientState, {
      e2edRightColumnContainer,
    });

    return;
  }

  const messageTail = afterDomContentLoad
    ? ' after DOMContentLoaded'
    : '. Probably page not yet completely loaded. Please try click again later';

  // eslint-disable-next-line no-console
  console.error(`Cannot find right column container (id="e2edRightColumnContainer")${messageTail}`);
};
