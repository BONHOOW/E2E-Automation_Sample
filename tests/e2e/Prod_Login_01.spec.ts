import { test, expect } from '../../fixtures';

/** [Test Scenario]
 * Login from the BC page
 * [Verify Point]
 * 1. Verify that the AfterLogin icon is visible in the GNB on the BC page.
 */
test('Prod_Login_01', { tag: '@LOGIN' }, async ({ page, config, common, login, gnb, bc }: any) => {
  console.log(`Starting Prod_Login_01 test | Site Code: ${config.siteCode}`);

  const bcUrl = `${config.baseUrl}${config.siteCode}${config.bcUrl}`;
  await page.goto(bcUrl);
  await common.cookieAcceptAll();

  const beforeLoginSKU = await bc.getSelectedSKU();

  await page.evaluate(() => window.scrollTo(0, 0));
  await gnb.hoverBeforeLogin();
  await gnb.clickSignInSignUp();
  await login.login(config.SSOID, config.SSOPW);

  const afterLoginSKU = await bc.getSelectedSKU();
  await bc.expectSKUSelected(beforeLoginSKU, afterLoginSKU);

  await gnb.verifyLoginSuccess();

  console.log(` Prod_Login_01_(${config.siteCode}) test completed successfully!`);
});