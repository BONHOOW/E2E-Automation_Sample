import { test, expect } from '../../fixtures';

test('Prod_Home_01', { tag: '@HOME' }, async ({ page, config, home, common, gnb, login }: any) => {
  try {
    // Step 1: Navigate to home page
    const homeUrl = home.getHomeUrl(config.baseUrl, config.siteCode);
    await page.goto(homeUrl);
    await common.cookieAcceptAll();

    // Step 2: Verify home areas before login
    await home.clickHomeLogo();
    await home.verifyAllHomeAreas();

    // Step 3: Login and verify home areas after login
    await gnb.hoverBeforeLogin();
    await gnb.clickSignInSignUp();
    await login.login(config.SSOID, config.SSOPW);
    await gnb.verifyLoginSuccess();
    await home.verifyAllHomeAreas();

  } catch (error: any) {
    console.error(`Prod_Home_01 test failed: ${error.message}`);
    throw error;
  }
});
