import {test} from 'autotests';
import {Search} from 'autotests/pageObjects/pages';
import {expect} from 'e2ed';
import {navigateToPage, scroll} from 'e2ed/actions';
import {isSelectorEntirelyInViewport, isSelectorInViewport} from 'e2ed/utils';

test(
  'isSelectorInViewport, isSelectorEntirelyInViewport and expect().toBeInViewport',
  {meta: {testId: '24'}},
  async () => {
    const scrollValueForPartialInViewport = 50;
    const scrollValueForNotInViewport = 500;

    const searchQuery = 'foo';
    const searchPage = await navigateToPage(Search, {searchQuery});

    const searchInputSelector = searchPage.searchInput.input;

    await expect(
      isSelectorInViewport(searchInputSelector),
      'isSelectorInViewport: searchInput is in viewport after page load',
    ).ok();

    await expect(
      isSelectorEntirelyInViewport(searchInputSelector),
      'isSelectorEntirelyInViewport: searchInput is entirely in viewport after page load',
    ).ok();

    await expect(
      searchInputSelector,
      'toBeInViewport: searchInput is in viewport after page load',
    ).toBeInViewport();

    await expect(
      searchInputSelector,
      'toBeInViewport with ratio 1: searchInput is entirely in viewport after page load',
    ).toBeInViewport({ratio: 1});

    await scroll(0, scrollValueForPartialInViewport);

    await expect(
      isSelectorInViewport(searchInputSelector),
      'isSelectorInViewport: searchInput is in viewport after smaill scroll',
    ).ok();

    await expect(
      isSelectorEntirelyInViewport(searchInputSelector),
      'isSelectorEntirelyInViewport: searchInput is not entirely in viewport after small scroll',
    ).notOk();

    await expect(
      searchInputSelector,
      'toBeInViewport with ratio 0.1: searchInput is not entirely in viewport after small scroll',
    ).toBeInViewport({ratio: 0.1});

    await scroll(0, scrollValueForNotInViewport);

    await expect(
      isSelectorInViewport(searchInputSelector),
      'isSelectorInViewport: searchInput is not in viewport after big scroll',
    ).notOk();

    await expect(
      isSelectorEntirelyInViewport(searchInputSelector),
      'isSelectorEntirelyInViewport: searchInput is not entirely in viewport after big scroll',
    ).notOk();
  },
);
