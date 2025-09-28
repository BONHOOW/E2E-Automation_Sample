import { test, expect } from '../../fixtures';

test('Prod_BC_01', { tag: ['@BC', '@TABLET'] }, async ({ page, config, bc, common, addon, cart, home, gnb, scp }) => {
  console.log('🚀 Starting Prod_BC_01 test...');

  const { device, color, storage, sku } = config.BC_Tablet;

  // Navigate to home page
  const homeUrl = home.getHomeUrl(config.baseUrl, config.siteCode);
  await page.goto(homeUrl);
  await common.cookieAcceptAll();

  // Navigate to product page (with retry)
  await bc.retryNavigation(gnb, "Shop", device);
  await bc.selectDeviceOptions(device, color, storage);

  // Get and verify SKU
  const selectedSKU = await bc.getSelectedSKU();
  console.log('✓ Selected SKU (BC): ', selectedSKU);
  await bc.expectSKUSelected(sku, selectedSKU);

  // Add trade-in and Samsung Care+ 
  let tradeInAdded = false;
  let scpAdded = false;

  // Conditionally add trade-in if available
  if (await bc.isTradeInAvailable()) {
    await bc.addTradeIn(device);
    await bc.verifyTradeInAdded();
    tradeInAdded = true;
  }

  // Conditionally add Samsung Care+ if available
  if (await bc.isSCPAvailable()) {
    await bc.selectNoGalaxyClub();
    await bc.addSamsungCarePlus();
    scpAdded = true;
  }

  // Verify at least one option was added
  expect(tradeInAdded || scpAdded).toBeTruthy();

  
  // Step 4: Test verifyPrice with device
  await bc.verifyPrice('device', device);

  // Step 5: Test verifyPrice with storage
  await bc.verifyPrice('storage', storage);

  // Step 6: Test verifySummaryAndCalculator
  await bc.verifySummaryAndCalculatorPrice();

  // Continue to cart
  await bc.continueToCart();

  // Verify cart contents
  await cart.verifyCartSKU(selectedSKU);

  if (tradeInAdded) {
    await cart.verifyTradeInAdded(1);
  }

  if (scpAdded) {
    await cart.verifySCPInCart(1);
  }

  console.log('🎉 Prod_BC_01 test completed successfully!');
});