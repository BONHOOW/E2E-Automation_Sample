import { Page, Locator, expect } from '@playwright/test';
import { Utils } from './Utils';
import { TIMEOUTS, DELAYS } from './Utils';

interface TradeUpData {
    model?: string;
    brand?: string;
}


export class TradeUpPopup {
    private page: Page;
    private utils: Utils;
    private siteCode: string;

    private readonly tradeUpYesOption: Locator;
    private readonly tradeUpPopup: Locator;
    private readonly modelDropdownButton: Locator;
    private readonly brandDropdownButton: Locator;
    private readonly continueButton: Locator;
    private readonly conditionNextButton: Locator;
    private readonly applyTradeUpButton: Locator;
    private readonly termsAgreementCheckbox: Locator;
    private readonly conditionYesLabel: Locator;
    private readonly getModelOption: (index: number) => Locator;
    private readonly getBrandOption: (index: number) => Locator;

    constructor(page: Page, config: any) {
        this.page = page;
        this.utils = new Utils(page);
        this.siteCode = config.siteCode?.toUpperCase() || 'UK';

        this.tradeUpYesOption = page.locator('.pd-option-selector:has([an-la="trade-up:yes" i])');
        this.tradeUpPopup = page.locator(`#trade-in > div.pd-select-option__wrap > ul > li:nth-child(1),
            .vd-trade-in-popup__step, app-trade-up-steps-global, .trade-up-steps, .tradeup-modal, 
            .trade-in-popup__contents:has(input[an-la*="trade up"]), .trade-up-modal.ng-star-inserted`);
        this.modelDropdownButton = page.locator(`.vd-trade-in-popup__product-select > li:nth-of-type(1), 
            .modal__body.ng-star-inserted li:nth-of-type(1) mat-select`);
        this.brandDropdownButton = page.locator(`.vd-trade-in-popup__product-select > li:nth-of-type(2), 
            .modal__body.ng-star-inserted li:nth-of-type(2) mat-select`);
        this.getModelOption = (index: number) =>
            page.locator(`.vd-trade-in-popup__product-select > li:nth-of-type(${index}) .menu__list li:first-child .menu__list-option, 
                .mat-mdc-select-panel mat-option:nth-of-type(${index})`);
        this.getBrandOption = (index: number) =>
            page.locator(`.vd-trade-in-popup__product-select > li:nth-of-type(2) .menu__list li:first-child .menu__list-option,
                .mat-mdc-select-panel mat-option:nth-of-type(${index})`);
        this.continueButton = page.locator(`button[an-la="trade-up:select device:next"],
            [data-an-la="trade-up:select device:next"]`);
        this.conditionNextButton = page.locator(`button[an-la="trade-up:check device condition:next"], 
            [data-an-la="trade-up:check device condition:next"]`);
        this.applyTradeUpButton = page.locator(`button[an-la="pd buying tool:trade-up:apply discount:apply trade up"], 
            [data-an-la="tradeup2termswrapper:add to cart"]`);
        this.termsAgreementCheckbox = page.locator(`label.checkbox-v2__label[for="chkTuTncAgree"],
            .trade-up-modal .mdc-checkbox:has(input:not(:checked))`);
        this.conditionYesLabel = page.locator(`label.radio-v2__label[for="conditionCheckInfoYes"], 
            div .condition-radio__yes`);
    }

    /**
     * Clicks the Trade-up "Yes" option
     */
    async clickAddTradeUp(): Promise<void> {
        try {
            await this.tradeUpYesOption.waitFor({ state: 'visible', timeout: TIMEOUTS.STANDARD });
            await this.tradeUpYesOption.click();
        } catch (error: any) {
            console.error(`❌ Failed to click Trade-up option: ${error.message}`);
            throw new Error(`Failed to click Trade-up option: ${error.message}`);
        }
    }

    /**
     * Waits for Trade-up popup to open
     */
    async waitForTradeUpPopupOpened(timeout: number = 3000): Promise<void> {
        try {
            await this.tradeUpPopup.first().waitFor({ state: 'visible', timeout: TIMEOUTS.STANDARD });
        } catch (error: any) {
            console.error(`❌ Trade-up popup did not open: ${error.message}`);
            throw new Error(`Trade-up popup did not open: ${error.message}`);
        }
    }

    /**
     * Selects model by index (clicks dropdown and selects first option)
     */
    async selectModelByIndex(index: number): Promise<void> {
        try {
            const isDropdownVisible = await this.modelDropdownButton.isVisible().catch(() => false);

            if (isDropdownVisible) {
                await this.modelDropdownButton.waitFor({ state: 'visible' });
                await this.page.waitForTimeout(DELAYS.SHORT);
                await this.utils.scrollClick(this.modelDropdownButton);
                await this.page.waitForTimeout(DELAYS.STANDARD);

                const firstOption = this.getModelOption(index);
                await firstOption.waitFor({ state: 'visible' });
                await this.utils.scrollClick(firstOption);
                await this.page.waitForTimeout(DELAYS.SHORT);
            }
        } catch (error: any) {
            console.error(`❌ Failed to select model: ${error.message}`);
            throw new Error(`Failed to select model: ${error.message}`);
        }
    }

    /**
     * Selects brand by index (clicks dropdown and selects first option)
     */
    async selectBrandByIndex(index: number): Promise<void> {
        try {
            const isDropdownVisible = await this.brandDropdownButton.isVisible().catch(() => false);

            if (isDropdownVisible) {
                await this.brandDropdownButton.waitFor({ state: 'visible' });
                await this.brandDropdownButton.click();
                await this.page.waitForTimeout(DELAYS.STANDARD);

                const firstBrandOption = this.getBrandOption(index);
                const isOptionVisible = await firstBrandOption.isVisible().catch(() => false);

                if (isOptionVisible) {
                    await firstBrandOption.waitFor({ state: 'visible' });
                    await firstBrandOption.click();
                }
            }
        } catch (error: any) {
            console.error(`❌ Failed to select brand: ${error.message}`);
            throw new Error(`Failed to select brand: ${error.message}`);
        }
    }


    /**
     * Clicks Continue/Next button
     */
    async clickContinueButton(): Promise<void> {
        try {
            const isVisible = await this.continueButton.isVisible().catch(() => false);

            if (isVisible) {
                await this.utils.scrollClick(this.continueButton);
            }
        } catch (error: any) {
            console.error(`❌ Failed to click Continue button: ${error.message}`);
            throw new Error(`Failed to click Continue button: ${error.message}`);
        }
    }

    /**
     * Clicks condition check next step button
     */
    async clickConditionNextButton(): Promise<void> {
        try {
            const isVisible = await this.conditionNextButton.isVisible().catch(() => false);

            if (isVisible) {
                await this.utils.scrollClick(this.conditionNextButton);
            }
        } catch (error: any) {
            console.error(`❌ Failed to click condition next button: ${error.message}`);
            throw new Error(`Failed to click condition next button: ${error.message}`);
        }
    }


    /**
     * Selects terms agreement checkbox
     */
    async selectTermsAgreement(): Promise<void> {
        try {
            await this.page.waitForTimeout(DELAYS.SHORT);
            const isVisible = await this.termsAgreementCheckbox.isVisible().catch(() => false);

            if (isVisible) {
                await this.utils.scrollClick(this.termsAgreementCheckbox);
            }
        } catch (error: any) {
            console.error(`❌ Failed to select terms agreement: ${error.message}`);
            throw new Error(`Failed to select terms agreement: ${error.message}`);
        }
    }

    /**
     * Clicks Apply Trade-up button
     */
    async clickApplyTradeUpButton(): Promise<void> {
        try {
            const isVisible = await this.applyTradeUpButton.isVisible().catch(() => false);

            if (isVisible) {
                await this.utils.scrollClick(this.applyTradeUpButton);
            }
        } catch (error: any) {
            console.error(`❌ Failed to click Apply Trade-up button: ${error.message}`);
            throw new Error(`Failed to click Apply Trade-up button: ${error.message}`);
        }
    }

    /**
     * Selects condition Yes option
     */
    async selectConditionYes(): Promise<void> {
        try {
            await this.page.waitForTimeout(DELAYS.SHORT);
            const isVisible = await this.conditionYesLabel.isVisible().catch(() => false);

            if (isVisible) {
                await this.utils.scrollClick(this.conditionYesLabel);
            }
        } catch (error: any) {
            console.error(`❌ Failed to select condition Yes: ${error.message}`);
            throw new Error(`Failed to select condition Yes: ${error.message}`);
        }
    }
}