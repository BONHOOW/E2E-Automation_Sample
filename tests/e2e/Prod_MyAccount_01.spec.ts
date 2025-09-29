import { test, expect } from '../../fixtures';

/** [Test Scenario]
 * Able to add/delete/edit addresses in My Profile
 * [Verify Point]
 * 1. Verify login status in the GNB on the Home page by checking the AfterLogin icon.
 * 2. Verify Shipping address – save/compare, count check, edit before/after, delete count check
 * 3. Verify Billing address – save/compare, count check, edit before/after, delete count check
 */
test('Prod_MyAccount_01', { tag: '@MyAccount' }, async ({ page, config, myAccount, common, login, home, gnb }: any) => {
  console.log(`Starting Prod_MyAccount_01 test | Site Code: ${config.siteCode}`);

  const homeUrl = home.getHomeUrl(config.baseUrl, config.siteCode);
  await page.goto(homeUrl);
  await common.cookieAcceptAll();

  await gnb.hoverBeforeLogin();
  await gnb.clickSignInSignUp();
  await login.login(config.SSOID, config.SSOPW);
  await gnb.verifyLoginSuccess();

  await myAccount.navigateToMyPage();
  await myAccount.verifyMyPageIsLoaded();

  await myAccount.navigateToProfileSetting();

  await myAccount.cleanupAllAddresses();

  const newAddressData = config.myAccountData.addresses;

  await myAccount.clickAddAddress();
  await myAccount.verifyAddressDialogIsOpen();
  await myAccount.fillAddressForm(newAddressData, config.siteCode);
  await myAccount.saveAddress();

  await myAccount.clickEditAddress(0);
  await myAccount.verifyAddressAdded(newAddressData);

  const editAddressData = {
    ...newAddressData,
    firstName: 'Updated',
    lastName: 'Delivery'
  };

  await myAccount.fillAddressForm(editAddressData, config.siteCode);
  await myAccount.saveAddress();

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await myAccount.loadAllAddresses();

  await myAccount.clickEditAddress(0);
  await myAccount.verifyAddressUpdated(editAddressData, 'delivery');

  await myAccount.removeAddress(0);

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await myAccount.loadAllAddresses();

  await myAccount.switchToBillingTab();

  await myAccount.cleanupAllAddresses();

  const billingAddressData = config.myAccountData.addresses;
  await myAccount.clickAddAddress();
  await myAccount.verifyAddressDialogIsOpen();
  await myAccount.fillAddressForm(billingAddressData, config.siteCode);
  await myAccount.saveAddress();

  await myAccount.clickEditAddress(0);
  await myAccount.verifyAddressAdded(billingAddressData);

  const editBillingAddressData = {
    ...billingAddressData,
    firstName: 'Updated',
    lastName: 'Billing'
  };

  await myAccount.fillAddressForm(editBillingAddressData, config.siteCode);
  await myAccount.saveAddress();

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await myAccount.loadAllAddresses();
  await myAccount.switchToBillingTab();

  await myAccount.clickEditAddress(0);
  await myAccount.verifyAddressUpdated(editBillingAddressData, 'billing');

  await myAccount.removeAddress(0);

  const finalAddressCount = await myAccount.getSavedAddressesCount();
  expect(finalAddressCount).toBe(0);

  console.log(` Prod_MyAccount_01_(${config.siteCode}) test completed successfully!`);
});