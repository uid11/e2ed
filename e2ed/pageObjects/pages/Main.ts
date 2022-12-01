import {Page} from 'e2ed';
import {createTestId} from 'e2ed/createTestId';
import {Input} from 'e2ed/pageObjects/components';
import {Main as MainRoute} from 'e2ed/routes/pageRoutes';
import {locatorIdSelector} from 'e2ed/selectors';

import type {GetParamsType, Language} from 'e2ed/types';

type RouteParams = GetParamsType<MainRoute>;
type CustomPageParams = Partial<RouteParams> | undefined;

const mainPageTestId = createTestId<{header: unknown}>('google');

/**
 * The Main (index) page.
 */
export class Main extends Page<CustomPageParams> {
  /**
   * Page language.
   */
  readonly language!: Language;

  override init(): void {
    const {language = 'de'} = this.pageParams ?? {};

    Object.assign<Main, Partial<Main>>(this, {language});
  }

  getRoute(): MainRoute {
    const {language} = this;

    return new MainRoute({language});
  }

  /**
   * Search input.
   */
  readonly searchInput = new Input('q');

  /**
   * Header selector.
   */
  readonly headerSelector = locatorIdSelector(mainPageTestId.header);

  /**
   * Current search string.
   */
  get searchString(): Promise<string> {
    return this.searchInput.value;
  }

  /**
   * Type text into a search input.
   */
  typeIntoSearchInput(text: string): Promise<void> {
    return this.searchInput.type(text);
  }
}
