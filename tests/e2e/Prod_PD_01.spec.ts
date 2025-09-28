import { test, expect } from '../../fixtures';
import { DynamicConfig } from '../../api/DynamicConfig';

test.describe('Prod_PD_01', () => {
    let dynamicConfig: any;

    test.beforeAll(async ({ config }) => {
        console.log('🔄 Using DynamicConfig for PD_IM1 and PD_Bespoke...');
        dynamicConfig = await DynamicConfig.getPDIM1Config(config.siteCode, config);
        dynamicConfig = await DynamicConfig.getPDBespokeConfig(config.siteCode, dynamicConfig);
        
        console.log('✅ PD_IM1 config ready:', {
            url: dynamicConfig.PD_IM1.Url,
            sku: dynamicConfig.PD_IM1.SKU,
            deviceName: dynamicConfig.PD_IM1.DeviceName
        });
        
        console.log('✅ PD_Bespoke config ready:', {
            url: dynamicConfig.PD_Bespoke.Url,
            sku: dynamicConfig.PD_Bespoke.SKU,
            deviceName: dynamicConfig.PD_Bespoke.DeviceName
        });
    });

    test('Prod_PD_01', { tag: '@PD' }, async ({ page, pd, cart, common }: any) => {
        console.log('🚀 Starting Prod_PD_01 test...');

        const skus: string[] = [];

        try {
            await page.goto(dynamicConfig.PD_IM1.Url);
        await page.waitForLoadState('domcontentloaded');
        await common.cookieAcceptAll();

        const imSku = await pd.getSKU();
        skus.push(imSku);

        await pd.continueToCart();

        await page.goto(dynamicConfig.PD_Bespoke.Url);
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
});
