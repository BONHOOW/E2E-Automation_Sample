import { test, expect } from '../../fixtures';
import { prod_Checkout_01_UK } from '../../pages/Checkout/SMN4/UK/commonCheckoutSteps_UK';
import { prod_Checkout_01_AU } from '../../pages/Checkout/SMA/AU/commonCheckoutSteps_AU';

test('Prod_Checkout_01', { tag: '@CHECKOUT' }, async ({ page, config, pd, addon, cart, common, checkout, utils }: any) => {

    console.log('🚀 starting checkout 01 test...');

    try {
        await page.goto(config.PD_IM1.Url);
        await page.waitForLoadState('domcontentloaded');
        await common.cookieAcceptAll();

        await pd.continueToCart();

        await cart.expectCartPageIsOpen();

        await checkout.goToCheckoutPage(cart, config, utils);

        switch (config.siteCode.toUpperCase()) {
            case 'UK':
                await prod_Checkout_01_UK(checkout, config, cart, utils);
                break;
            case 'AU':
                await prod_Checkout_01_AU(checkout, config, cart, utils);
                break;
            default:
                throw new Error(`Unsupported site code: ${config.siteCode}`);
        }

        console.log('🎉 Test completed successfully!');

    } catch (error: any) {
        console.error(`❌ Test failed: ${error.message}`);
        throw error;
    }
});