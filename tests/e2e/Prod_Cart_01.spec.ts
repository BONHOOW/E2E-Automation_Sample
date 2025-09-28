import { test, expect } from '../../fixtures';

test('Prod_Cart_01', { tag: '@Cart' }, async ({ page, common, pd, bc, cart, config, home, gnb}) => {
  console.log('Starting Prod_Cart_01 test...');

  try {
    await page.goto(config.PD_IM1.Url);
    await page.waitForLoadState('domcontentloaded');

    await common.cookieAcceptAll();
    
    try {
      await pd.continueToCart();
    } catch (error) {
      const homeUrl = home.getHomeUrl(config.baseUrl, config.siteCode);
      await page.goto(homeUrl);
      await page.waitForLoadState('domcontentloaded');
      
      await common.cookieAcceptAll();
      
      // await gnb.hoverGnbCategory("Shop");
      // await gnb.clickGnbCatalog("shop", "Fold7");

      await bc.retryNavigation(gnb, "Shop", "tab s11");

      await bc.continueToCart();
    }
    
    await cart.expectCartPageIsOpen();
    await cart.verifyPaymentListNotDisplayed();
    
    console.log('Prod_Cart_01 test completed successfully!');
    
  } catch (error: any) {
    console.error(`Prod_Cart_01 test failed: ${error.message}`);
    throw error;
  }
});
