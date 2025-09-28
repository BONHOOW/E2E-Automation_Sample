import { test, expect } from '../../fixtures';

test('Prod_Search_01', { tag: '@SEARCH' }, async ({ page, config, home, common }) => {
  console.log('Starting Prod_Search_01 test');

  try {
    const homeUrl = home.getHomeUrl(config.baseUrl, config.siteCode);
    await page.goto(homeUrl);
    await common.cookieAcceptAll();

    await home.clickSearchIcon();

    const searchSKU = config.BC_Phone.sku;
    await home.enterSearchText(searchSKU);

    await page.keyboard.press('Enter');

    if (await home.isSearchResultsVisible(searchSKU)) {
      // Search results found
    } else {
      throw new Error('Search results are not visible');
    }
    
    console.log('Prod_Search_01 test completed successfully!');
    
  } catch (error) {
    console.error(`Prod_Search_01 test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
});