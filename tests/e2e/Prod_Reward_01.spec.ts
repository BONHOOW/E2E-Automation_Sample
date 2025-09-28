import { test, expect } from '../../fixtures';

test('Prod_Reward_01', { tag: '@Reward' }, async ({ page, config, pd, cart, common, checkout, reward, utils }: any) => {
    console.log('🚀 Starting Prod_Reward_01 test...');

    try {
        await page.goto(config.PD_IM1.Url);
        await page.waitForLoadState('domcontentloaded');
        await common.cookieAcceptAll();

        await pd.continueToCart();

        await reward.verifyRewardMessagesInCart(config);

        await checkout.goToCheckoutPage(cart, config, utils);

        await reward.verifyRewardMessagesInCheckout(config);

        console.log('🎉 Prod_Reward_01 test completed successfully!');

    } catch (error: any) {
        console.error(`❌ Prod_Reward_01 test failed: ${error.message}`);
        throw error;
    }
});
