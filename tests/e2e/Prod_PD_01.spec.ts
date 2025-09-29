import { test, expect } from '../../fixtures';

test('Prod_PD_01', { tag: '@PD' }, async ({ page, pd, cart, common, config }: any) => {
    console.log('🚀 Starting Prod_PD_01 test...');

    const skus: string[] = [];

    try {
        // PD_IM1 페이지로 이동
        await page.goto(config.PD_IM1.Url);
        await page.waitForLoadState('domcontentloaded');
        await common.cookieAcceptAll();

        const imSku = await pd.getSKU();
        skus.push(imSku);

        await pd.continueToCart();

        // PD_Bespoke 페이지로 이동
        await page.goto(config.PD_Bespoke.Url);
        await page.waitForLoadState('domcontentloaded');

        const bespokeSku = await pd.getSKU();
        skus.push(bespokeSku);

        await pd.continueToCart();

        await cart.expectCartPageIsOpen();

        for (const sku of skus) {
            await cart.verifyCartSKU(sku);
        }

        console.log('🎉 Prod_PD_01 test completed successfully!');

    } catch (error: any) {
        console.error(`❌ Prod_PD_01 test failed: ${error.message}`);
        throw error;
    }
});
