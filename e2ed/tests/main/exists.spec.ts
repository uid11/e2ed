import {expect, it, navigateToPage} from 'e2ed';

it('exists', {meta: {testId: '1'}}, async () => {
  const mainPage = await navigateToPage('main', {language: 'en'});

  await expect(mainPage.searchString, 'search string is empty').eql('');
});
