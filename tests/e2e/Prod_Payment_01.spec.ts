import { test } from '../../fixtures';
import { prod_Payment_01_UK } from '../../pages/Checkout/SMN4/UK/commonCheckoutSteps_UK';

test('Prod_Payment_01', { tag: '@PAYMENT' }, async ({ page, config, pd, cart, common, checkout, utils, payment }: any) => {
    console.log('🚀 Starting Prod_Payment_01 test...');

    try {
        await page.goto(config.PD_IM1.Url);
        await page.waitForLoadState('domcontentloaded');
        await common.cookieAcceptAll();

        await pd.continueToCart();

        await cart.expectCartPageIsOpen();

        await checkout.goToCheckoutPage(cart, config, utils);

        switch (config.siteCode.toUpperCase()) {
            case 'UK':
                await prod_Payment_01_UK(checkout, config, utils);
                break;
            default:
                throw new Error(`Unsupported site code: ${config.siteCode}`);
        }

        await payment.verifyAllPaymentModes(config.siteCode);

        console.log('🎉 Prod_Payment_01 test completed successfully!');

    } catch (error: any) {
        console.error(`❌ Prod_Payment_01 test failed: ${error.message}`);
        throw error;
    }
});
