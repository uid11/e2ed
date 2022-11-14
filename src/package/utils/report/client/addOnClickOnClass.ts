import type {ReportClientState} from '../../../types/internal';

declare const reportClientState: ReportClientState;

/**
 * Add onclick event listener on all elements with some class.
 * This base client function should not use scope variables (except other base functions).
 * @internal
 */
export function addOnClickOnClass(className: string, onclick: (event: HTMLElement) => void): void {
  let {e2edClickListeners} = reportClientState;

  if (!e2edClickListeners) {
    e2edClickListeners = {};
    reportClientState.e2edClickListeners = e2edClickListeners;

    document.addEventListener('click', (event) => {
      let currentElement = event.target as HTMLElement | null;

      while (currentElement) {
        for (const currentClass of Object.keys(e2edClickListeners as object)) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (currentElement.classList?.contains(currentClass)) {
            const listener = e2edClickListeners?.[currentClass];

            listener?.(currentElement);

            return;
          }
        }

        currentElement = currentElement.parentNode as HTMLElement;
      }
    });
  }

  e2edClickListeners[className] = onclick;
}
