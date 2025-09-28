import { Page, Locator, expect } from '@playwright/test';
import { PaymentModes } from './PaymentModes';

export class Payment {
    private page: Page;

    // Payment locators
    private paymentTitleLocator: Locator;
    private paymentModesLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.paymentTitleLocator = page.locator(PaymentModes.PAYMENT_TITLE_SELECTOR);
        this.paymentModesLocator = page.locator(PaymentModes.getPaymentModesLocatorSelector());
    }

    /**
     * Verifies that all payment modes are displayed.
     */
    async verifyAllPaymentModes(siteCode?: string) {
        try {
            await this.page.waitForLoadState('domcontentloaded');
            
            await this.paymentTitleLocator.first().waitFor({ state: 'visible', timeout: 3000 });

            const paymentTitles = await this.page.locator('[data-activestepname="CHECKOUT_STEP_PAYMENT"] mat-expansion-panel .payment-title').allTextContents();

            let expandErrorCount = 0;

            for (const title of paymentTitles) {
                try {
                    await this.expandPaymentMethod(title);

                    // await this.page.waitForTimeout(3000);
                    
                    const paymentModeElement = await this.findPaymentModeElement();
                    if (!paymentModeElement) {
                        console.warn(`⚠️ Payment mode for ${title} is not handled`);
                        continue;
                    }

                    const tagName = await paymentModeElement.evaluate(el => el.tagName.toLowerCase());

                    const ok = await this.verifyPaymentModeByType(tagName, title, siteCode);
                    expect.soft(ok, `Verification failed for payment mode: ${title} (tag=${tagName})`).toBeTruthy();

                } catch (error: any) {
                    expandErrorCount++;
                    const msg = `Unable to expand '${title}': ${error.message}`;
                    console.error(`❌ ${msg}`);
                    expect.soft(false, msg).toBeTruthy();
                    continue;
                }
            }

            return true;

        } catch (error: any) {
            console.error(`❌ Failed to verify payment modes: ${error.message}`);
            throw new Error(`Payment modes verification failed: ${error.message}`);
        }
    }

    /**
     * Expands the payment method.
     */
    private async expandPaymentMethod(title: string) {
        try {
            const expansionPanel = this.page.locator(`//app-payment-modes//mat-expansion-panel[.//*[@class='payment-title' and normalize-space(text())='${title.trim()}']]`);
            await expansionPanel.first().scrollIntoViewIfNeeded();
            
            const isExpanded = await expansionPanel.first().evaluate(el => el.classList.contains('mat-expanded'));
            if (!isExpanded) {
                await expansionPanel.first().click();
            }
        } catch (error: any) {
            throw new Error(`Unable to expand payment method '${title}': ${error.message}`);
        }
    }

    /**
     * Finds the payment mode element.
     */
    private async findPaymentModeElement() {
        try {
            await this.page.waitForSelector(PaymentModes.getPaymentModesLocatorSelector(), { 
                timeout: 10000,
                state: 'visible' 
            });
            
            const paymentModeLocator = this.page.locator(PaymentModes.getPaymentModesLocatorSelector());
            const count = await paymentModeLocator.count();
            
            for (let i = 0; i < count; i++) {
                const element = paymentModeLocator.nth(i);
                const isVisible = await element.isVisible();
                if (isVisible) {
                    return element;
                }
            }
            return null;
        } catch (error: any) {
            console.warn(`⚠️ Unable to find payment mode element: ${error.message}`);
            return null;
        }
    }

    /**
     * Executes verification based on payment mode type.
     */
    private async verifyPaymentModeByType(tagName: string, title: string, siteCode?: string): Promise<boolean> {
        if (PaymentModes.COMMON.includes(tagName)) {
            if (!await this.common(title)) {
                return false;
            }
        } else if (PaymentModes.CREDITCARD.includes(tagName)) {
            if (!await this.creditCard(title)) {
                return false;
            }
        } else if (PaymentModes.PAYPAL.includes(tagName)) {
            if (!await this.payPal(title)) {
                return false;
            }
        } else if (PaymentModes.ONERADIO.includes(tagName)) {
            if (!await this.oneRadioSelect(title)) {
                return false;
            }
        } else if (PaymentModes.ONEMATSELECT.includes(tagName)) {
            if (!await this.oneMatSelect(title, siteCode)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-google-pay") {
            if (!await this.google(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-latitude") {
            if (!await this.latitude(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-adyen-ideal") {
            if (!await this.ideal(title, siteCode)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-cybersource-credit-installment") {
            if (!await this.creditInstallment(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-twoc2p-card-based-installment") {
            if (!await this.twoPCardInstallment(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-walley-b2b") {
            if (!await this.walley(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-billie-b2b") {
            if (!await this.billie(title, siteCode)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-adyen-swish") {
            if (!await this.swish(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-midtrans-credit-debit-card") {
            if (!await this.otherBank(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-midtrans-credit-card-inst") {
            if (!await this.bca(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-ipay88-sop") {
            if (!await this.pickExpiryDateFromComboBox(title)) {
                return false;
            }
        } else if (["app-payment-mode-cybersource-credit-card", "app-payment-mode-cybersource-credit-card-hk", "app-payment-mode-payfortcreditcard"].includes(tagName)) {
            if (!await this.creditCardHK(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-installment") {
            if (!await this.installmentHK(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-cofidis") {
            if (!await this.Cofidis(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-simple-pay") {
            if (!await this.banki(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-iyzico-bank") {
            if (!await this.havale(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-masterpass") {
            if (!await this.masterpass(title)) {
                return false;
            }
        } else if (tagName === "payment-mode-credit-card-installment") {
            if (!await this.oneMatSelectGR(title)) {
                return false;
            }
        } else if (tagName === "app-cod-payment") {
            if (!await this.internetbankaSEB(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-p24-blik") {
            if (!await this.bilkPL(title)) {
                return false;
            }
        } else if (tagName === "app-payment-lacaixa") {
            if (!await this.lacaixa(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-simpaisa-voucher") {
            if (!await this.simpaisa(title)) {
                return false;
            }
        } else if (tagName === "app-payment-mode-finance-now-purple-visa") {
            if (!await this.purpleVisa(title)) {
                return false;
            }
        } else {
            // skip Cicilan Kartu Kredit in ID
        }
        return true;
    }

    private async common(title: string): Promise<boolean> {
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            await this.acceptTermAndCondition();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify common payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async creditCard(title: string): Promise<boolean> {
        try {
            await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            await this.fillCreditCardFields();
            
            if (title === "ผ่อนชำระผ่านธนาคารกสิกรไทย") {
                await this.handleThailandSpecialCase();
            }
            
            await this.acceptTermAndCondition();
            
            await payNowButton.scrollIntoViewIfNeeded();
            // await this.page.waitForTimeout(2000);
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify credit card payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async payPal(title: string): Promise<boolean> {
        try {
            await this.page.waitForTimeout(3000);
            
            await this.acceptTermAndCondition();
            
            const payPalButton = await this.handlePayPalIframe(title);
            if (!payPalButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            if (await this.isButtonClickable(payPalButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify PayPal payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async oneRadioSelect(title: string): Promise<boolean> {
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            // await this.page.waitForTimeout(1000);
            
            const radioButtons = this.page.locator('input[type="radio"]');
            const count = await radioButtons.count();
            
            if (count > 0) {
                const firstRadioButton = radioButtons.first();
                const isVisible = await firstRadioButton.isVisible();
                
                if (isVisible) {
                    await firstRadioButton.click();
                } else {
                    console.warn('⚠️ First radio button is not visible');
                }
            } else {
                console.warn('⚠️ No radio buttons found');
            }
            
            await this.acceptTermAndCondition();
            
            await payNowButton.scrollIntoViewIfNeeded();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify one radio select payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async oneMatSelect(title: string, siteCode?: string): Promise<boolean> {
        console.log(`Processing one mat select payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            if (siteCode !== 'PK') {
                const matSelects = this.page.locator('form mat-select, mat-form-field mat-select');
                const count = await matSelects.count();
                
                if (count > 0) {
                    const firstMatSelect = matSelects.first();
                    await firstMatSelect.scrollIntoViewIfNeeded();
                    
                    const tagName = await firstMatSelect.evaluate(el => el.tagName.toLowerCase());
                    if (tagName === 'mat-select') {
                        const ariaExpanded = await firstMatSelect.getAttribute('aria-expanded');
                        
                        if (ariaExpanded !== 'true') {
                            await firstMatSelect.click();
                            console.log('✅ Mat-select dropdown opened');
                        }
                        
                        const id = await firstMatSelect.getAttribute('id');
                        if (id) {
                            const firstOption = this.page.locator(`#${id}-panel mat-option`).first();
                            await firstOption.scrollIntoViewIfNeeded();
                            await firstOption.click();
                            console.log('✅ First mat-option selected');
                        }
                    }
                }
            }
            
            await this.acceptTermAndCondition();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            console.log(`✅ One mat select payment mode '${title}' verified successfully`);
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify one mat select payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async google(title: string): Promise<boolean> {
        console.log(`Processing Google Pay payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(5000);
            
            await this.acceptTermAndCondition();
            
            const googlePayButton = this.page.locator(PaymentModes.GOOGLE_PAY_BUTTON_SELECTOR);
            const count = await googlePayButton.count();
            
            let foundButton = null;
            for (let i = 0; i < count; i++) {
                const button = googlePayButton.nth(i);
                const isVisible = await button.isVisible();
                if (isVisible) {
                    foundButton = button;
                    break;
                }
            }
            
            if (!foundButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            if (await this.isButtonClickable(foundButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            console.log(`✅ Google Pay payment mode '${title}' verified successfully`);
            return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify Google Pay payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async latitude(title: string): Promise<boolean> {
        console.log(`Processing Latitude payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(3000);
            
            const radioButton = this.page.locator('mat-radio-button.mat-mdc-radio-button');
            const radioCount = await radioButton.count();
            
            if (radioCount > 0) {
                const firstRadioButton = radioButton.first();
                const isVisible = await firstRadioButton.isVisible();
                
                if (isVisible) {
                    await firstRadioButton.click();
                    console.log('✅ Latitude plan radio button clicked successfully');
                } else {
                    console.warn('⚠️ Latitude plan radio button is not visible');
                }
            } else {
                console.warn('⚠️ No Latitude plan radio buttons found');
            }
            
            await this.acceptTermAndCondition();
            
            const iframe = this.page.locator('iframe.ng-star-inserted');
            const iframeExists = await iframe.isVisible({ timeout: 5000 });
            
            if (iframeExists) {
                console.log('✅ Latitude iframe found, processing...');
                
                const frame = this.page.frameLocator('iframe.ng-star-inserted');
                const payButton = frame.locator('form input.btn.paynow:visible').first();
                
                if (await payButton.isVisible()) {
                    await payButton.scrollIntoViewIfNeeded();
                    // await this.page.waitForTimeout(2000);
                    
                    if (await this.isButtonClickable(payButton)) {
                        console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                        return false;
                    }
                    
                    console.log('✅ Latitude Pay Now button verified successfully');
                } else {
                    console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                    return false;
                }
            } else {
                console.warn('⚠️ No Latitude iframe found');
                return false;
            }
            
            console.log(`✅ Latitude payment mode '${title}' verified successfully`);
        return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify Latitude payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async ideal(title: string, siteCode?: string): Promise<boolean> {
        console.log(`Processing iDEAL payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            if (siteCode !== 'NL') {
                const input = this.page.locator('input.adyen-checkout__filter-input');
                const dropdown = this.page.locator('li.adyen-checkout__dropdown__element');
                
                if (await input.isVisible()) {
                    await input.click();
                    console.log('✅ iDEAL input clicked');
                    
                    if (await dropdown.isVisible()) {
                        await dropdown.click();
                        console.log('✅ iDEAL dropdown option selected');
                    }
                }
            }
            
            await this.acceptTermAndCondition();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            console.log(`✅ iDEAL payment mode '${title}' verified successfully`);
        return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify iDEAL payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async creditInstallment(title: string): Promise<boolean> {
        console.log(`Processing credit installment payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            const fields = this.page.locator('app-payment-mode-cybersource-credit-installment form input, app-payment-mode-cybersource-credit-installment form mat-select');
            const count = await fields.count();
            
            for (let i = 0; i < count; i++) {
                const element = fields.nth(i);
                const isVisible = await element.isVisible();
                if (!isVisible) continue;
                
                await element.scrollIntoViewIfNeeded();
                
                const formControlName = await element.getAttribute('formcontrolname');
                if (!formControlName) continue;
                
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                
                switch (formControlName) {
                    case 'idPassport':
                        await this.fillField(element, '123456789', 'Passport');
                        break;
                        
                    case 'fullName':
                        await this.fillField(element, 'auto test', 'Full name');
                        break;
                        
                    case 'phoneNumber':
                        await this.fillField(element, '0912345678', 'Phone number');
                        break;
                        
                    case 'cardIssuingBank':
                    case 'installmentTerm':
                        if (tagName === 'mat-select') {
                            const ariaExpanded = await element.getAttribute('aria-expanded');
                            if (ariaExpanded !== 'true') {
                                await element.click();
                                console.log('✅ Mat-select dropdown opened');
                            }
                            
                            const id = await element.getAttribute('id');
                            if (id) {
                                const firstOption = this.page.locator(`#${id}-panel mat-option`).first();
                                await firstOption.scrollIntoViewIfNeeded();
                                await firstOption.click();
                                console.log('✅ First mat-option selected');
                            }
                        }
                        break;
                        
                    case 'cardType':
                        await element.selectOption('MasterCard');
                        console.log('✅ Card type selected: MasterCard');
                        break;
                        
                    case 'cardNumber':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                        break;
                        
                    case 'cardHolderName':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.holderName, 'Card holder name');
                        break;
                        
                    case 'month':
                        await element.selectOption('03');
                        console.log('✅ Month selected: 03');
                        break;
                        
                    case 'year':
                        await element.selectOption('2030');
                        console.log('✅ Year selected: 2030');
                        break;
                        
                    case 'cvv':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cvv, 'CVV');
                        break;
                        
                    default:
                        console.warn(`⚠️ Field ${formControlName} not handled`);
                }
            }
            
            await this.acceptTermAndCondition();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            console.log(`✅ Credit installment payment mode '${title}' verified successfully`);
        return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify credit installment payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async twoPCardInstallment(title: string): Promise<boolean> {
        console.log(`Processing 2C2P card installment payment mode: ${title}`);
        
        try {
            // await this.page.waitForTimeout(5000);
            
            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }
            
            const matSelect = this.page.locator('form mat-select').first();
            if (await matSelect.isVisible()) {
                await matSelect.scrollIntoViewIfNeeded();
                
                const ariaExpanded = await matSelect.getAttribute('aria-expanded');
                if (ariaExpanded !== 'true') {
                    await matSelect.click();
                    console.log('✅ Mat-select dropdown opened');
                }
                
                const id = await matSelect.getAttribute('id');
                if (id) {
                    const firstOption = this.page.locator(`#${id}-panel mat-option`).first();
                    await firstOption.scrollIntoViewIfNeeded();
                    await firstOption.click();
                    console.log('✅ First mat-option selected');
                }
            }
            
            const radioButton = this.page.locator('input[type="radio"]').first();
            if (await radioButton.isVisible()) {
                await radioButton.click();
                console.log('✅ Radio button clicked');
            }
            
            const formFields = this.page.locator('app-payment-mode-twoc2p-card-based-installment mat-form-field input');
            const count = await formFields.count();
            
            for (let i = 0; i < count; i++) {
                const element = formFields.nth(i);
                const isVisible = await element.isVisible();
                if (!isVisible) continue;
                
                await element.scrollIntoViewIfNeeded();
                
                const formControlName = await element.getAttribute('formcontrolname');
                if (!formControlName) continue;
                
                switch (formControlName) {
                    case 'cardNumber':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                        break;
                        
                    case 'cardHolderName':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.holderName, 'Card holder name');
                        break;
                        
                    case 'month':
                        await this.fillField(element, '03', 'Month');
                        break;
                        
                    case 'year':
                        await this.fillField(element, '2030', 'Year');
                        break;
                        
                    case 'cvv':
                        const cvvElement = this.page.locator('input[data-encrypt="cvv"]');
                        if (await cvvElement.isVisible()) {
                            await cvvElement.evaluate((el: HTMLInputElement, value: string) => {
                                el.value = value;
                                el.dispatchEvent(new Event('input'));
                            }, PaymentModes.CREDIT_CARD_DATA.cvv);
                            console.log(`✅ CVV entered: ${PaymentModes.CREDIT_CARD_DATA.cvv}`);
                        }
                        break;
                        
                    default:
                        console.warn(`⚠️ Field ${formControlName} not handled`);
                }
            }
            
            await this.acceptTermAndCondition();
            
            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }
            
            console.log(`✅ 2C2P card installment payment mode '${title}' verified successfully`);
        return true;
            
        } catch (error: any) {
            console.error(`❌ Failed to verify 2C2P card installment payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async walley(title: string): Promise<boolean> {
        console.log(`Processing Walley B2B payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(5000);

            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            const companyInput = this.page.locator("input[formcontrolname='companyName']");
            await this.fillAndBlur(companyInput, title, 'Company name');

            await this.acceptTermAndCondition();

            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ Walley payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify Walley payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async billie(title: string, siteCode?: string): Promise<boolean> {
        console.log(`Processing Billie B2B payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(5000);

            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            const companyInput = this.page.locator("input[formcontrolname='companyName']");
            await this.fillAndBlur(companyInput, title, 'Company name');

            const regNumberInput = this.page.locator("input[formcontrolname='companyRegistrationNumber']");
            const regNumber = siteCode === 'SE' ? '123456-7890' : '123456789';
            await this.fillAndBlur(regNumberInput, regNumber, 'Company registration number');

            await this.acceptTermAndCondition();

            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ Billie payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify Billie payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async swish(title: string): Promise<boolean> {
        console.log(`Processing Swish payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(5000);

            const beforeButton = this.page.locator("app-payment-mode-adyen-swish div#swish-button");
            if (!(await beforeButton.isVisible())) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            await this.acceptTermAndCondition();

            const afterButton = this.page.locator("app-payment-mode-adyen-swish button.adyen-checkout__button");
            const visibleAfter = await afterButton.isVisible();
            if (!visibleAfter) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            if (await this.isButtonClickable(afterButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ Swish payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify Swish payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async otherBank(title: string): Promise<boolean> {
        console.log(`Processing other bank payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(8000);

            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            const bankSelect = this.page.locator('form mat-select').first();
            if (await bankSelect.isVisible()) {
                await bankSelect.scrollIntoViewIfNeeded();
                const expanded = await bankSelect.getAttribute('aria-expanded');
                if (expanded !== 'true') {
                    await bankSelect.click();
                }
                const selectId = await bankSelect.getAttribute('id');
                if (selectId) {
                    const option = this.page.locator(`#${selectId}-panel mat-option`).filter({ hasText: 'Other Bank' }).first();
                    if (await option.isVisible()) {
                        await option.click();
                        console.log('✅ Bank option selected: Other Bank');
                    }
                }
            }

            const fields = this.page.locator(
                "app-payment-mode-midtrans-credit-debit-card mat-form-field input, app-payment-mode-midtrans-credit-debit-card mat-form-field mat-select:not([formcontrolname='bankCode'])"
            );
            const count = await fields.count();
            for (let i = 0; i < count; i++) {
                const element = fields.nth(i);
                if (!(await element.isVisible())) continue;

                await element.scrollIntoViewIfNeeded();
                const formControlName = (await element.getAttribute('formcontrolname')) || '';
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());

                switch (formControlName) {
                    case 'cardNumber':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                        // await this.page.waitForTimeout(5000);
                        break;

                    case 'cardHolderName':
                    case 'cardName':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.holderName, 'Card holder name');
                        break;

                    case 'month':
                    case 'cardExpMonth':
                        if (tagName === 'mat-select') {
                            const expandedMonth = await element.getAttribute('aria-expanded');
                            if (expandedMonth !== 'true') await element.click();
                            const idMonth = await element.getAttribute('id');
                            if (idMonth) {
                                const opt = this.page.locator(`#${idMonth}-panel mat-option`).filter({ hasText: '03' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'year':
                    case 'cardExpYear':
                        if (tagName === 'mat-select') {
                            const expandedYear = await element.getAttribute('aria-expanded');
                            if (expandedYear !== 'true') await element.click();
                            const idYear = await element.getAttribute('id');
                            if (idYear) {
                                const opt = this.page.locator(`#${idYear}-panel mat-option`).filter({ hasText: '2030' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'cvv':
                    case 'cardCvv':
                        const cvvInput = this.page.locator("input[formcontrolname='cvv'], input[formcontrolname='cardCvv']");
                        if (await cvvInput.first().isVisible()) {
                            await cvvInput.first().evaluate((el: HTMLInputElement, value: string) => {
                                el.value = value;
                                el.dispatchEvent(new Event('input'));
                            }, PaymentModes.CREDIT_CARD_DATA.cvv);
                            console.log(`✅ CVV entered: ${PaymentModes.CREDIT_CARD_DATA.cvv}`);
                        }
                        break;

                    default:
                        console.warn(`⚠️ Field ${formControlName} not handled`);
                        break;
                }
            }

            await this.acceptTermAndCondition();

            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ Other Bank payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify other bank payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async bca(title: string): Promise<boolean> {
        console.log(`Processing BCA payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(8000);

            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            const bankSelect = this.page.locator('form mat-select').first();
            if (await bankSelect.isVisible()) {
                await bankSelect.scrollIntoViewIfNeeded();
                const expanded = await bankSelect.getAttribute('aria-expanded');
                if (expanded !== 'true') await bankSelect.click();
                const selectId = await bankSelect.getAttribute('id');
                if (selectId) {
                    const option = this.page.locator(`#${selectId}-panel mat-option`).filter({ hasText: 'BCA' }).first();
                    if (await option.isVisible()) {
                        await option.click();
                        console.log('✅ Bank option selected: BCA');
                    }
                }
            }

            // await this.page.waitForTimeout(3000);

            const monthOption = this.page.locator("app-payment-mode-midtrans-credit-card-inst input[value='3M']");
            if (await monthOption.isVisible()) {
                await monthOption.click();
                console.log('✅ Installment option selected: 3M');
            }

            const fields = this.page.locator(
                "app-payment-mode-midtrans-credit-card-inst input, app-payment-mode-midtrans-credit-card-inst mat-select:not([formcontrolname='bankCode'])"
            );
            const count = await fields.count();
            for (let i = 0; i < count; i++) {
                const element = fields.nth(i);
                if (!(await element.isVisible())) continue;

                await element.scrollIntoViewIfNeeded();
                const formControlName = (await element.getAttribute('formcontrolname')) || '';
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());

                switch (formControlName) {
                    case 'cardNumber':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                        // await this.page.waitForTimeout(8000);
                        break;

                    case 'cardHolderName':
                    case 'cardName':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.holderName, 'Card holder name');
                        break;

                    case 'month':
                    case 'cardExpMonth':
                        if (tagName === 'mat-select') {
                            const expandedMonth = await element.getAttribute('aria-expanded');
                            if (expandedMonth !== 'true') await element.click();
                            const idMonth = await element.getAttribute('id');
                            if (idMonth) {
                                const opt = this.page.locator(`#${idMonth}-panel mat-option`).filter({ hasText: '03' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'year':
                    case 'cardExpYear':
                        if (tagName === 'mat-select') {
                            const expandedYear = await element.getAttribute('aria-expanded');
                            if (expandedYear !== 'true') await element.click();
                            const idYear = await element.getAttribute('id');
                            if (idYear) {
                                const opt = this.page.locator(`#${idYear}-panel mat-option`).filter({ hasText: '2030' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'cvv':
                    case 'cardCvv':
                        const cvvInput = this.page.locator("app-payment-mode-midtrans-credit-card-inst input[formcontrolname='cvv'], app-payment-mode-midtrans-credit-card-inst input[formcontrolname='cardCvv']").first();
                        if (await cvvInput.isVisible()) {
                            await cvvInput.evaluate((el: HTMLInputElement, value: string) => {
                                el.value = value;
                                el.dispatchEvent(new Event('input'));
                            }, PaymentModes.CREDIT_CARD_DATA.cvv);
                            console.log(`✅ CVV entered: ${PaymentModes.CREDIT_CARD_DATA.cvv}`);
                        }
                        break;

                    default:
                        console.warn(`⚠️ Field ${formControlName} not handled`);
                        break;
                }
            }

            await this.acceptTermAndCondition();

            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ BCA payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify BCA payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async pickExpiryDateFromComboBox(title: string): Promise<boolean> {
        console.log(`Processing pick expiry date from combo box payment mode: ${title}`);
        try {
            // await this.page.waitForTimeout(8000);

            const payNowButton = await this.findPayNowButton();
            if (!payNowButton) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not visible`);
                return false;
            }

            const fields = this.page.locator(
                "mat-expansion-panel mat-form-field input, mat-expansion-panel mat-form-field mat-select:not([formcontrolname='bankCode'])"
            );
            const count = await fields.count();
            for (let i = 0; i < count; i++) {
                const element = fields.nth(i);
                if (!(await element.isVisible())) continue;

                await element.scrollIntoViewIfNeeded();
                const formControlName = (await element.getAttribute('formcontrolname')) || '';
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());

                switch (formControlName) {
                    case 'cardNumber':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                        // await this.page.waitForTimeout(5000);
                        break;

                    case 'cardHolderName':
                        await this.fillField(element, PaymentModes.CREDIT_CARD_DATA.holderName, 'Card holder name');
                        break;

                    case 'month':
                        if (tagName === 'mat-select') {
                            const expandedMonth = await element.getAttribute('aria-expanded');
                            if (expandedMonth !== 'true') await element.click();
                            const idMonth = await element.getAttribute('id');
                            if (idMonth) {
                                const opt = this.page.locator(`#${idMonth}-panel mat-option`).filter({ hasText: '03' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'year':
                        if (tagName === 'mat-select') {
                            const expandedYear = await element.getAttribute('aria-expanded');
                            if (expandedYear !== 'true') await element.click();
                            const idYear = await element.getAttribute('id');
                            if (idYear) {
                                const opt = this.page.locator(`#${idYear}-panel mat-option`).filter({ hasText: '30' }).first();
                                if (await opt.isVisible()) await opt.click();
                            }
                        }
                        break;

                    case 'cvv':
                        const cvvInput = this.page.locator("input[formcontrolname='cvv']").first();
                        if (await cvvInput.isVisible()) {
                            await cvvInput.evaluate((el: HTMLInputElement, value: string) => {
                                el.value = value;
                                el.dispatchEvent(new Event('input'));
                            }, PaymentModes.CREDIT_CARD_DATA.cvv);
                            console.log(`✅ CVV entered: ${PaymentModes.CREDIT_CARD_DATA.cvv}`);
                        }
                        break;

                    default:
                        console.warn(`⚠️ Field ${formControlName} not handled`);
                        break;
                }
            }

            await this.acceptTermAndCondition();

            if (await this.isButtonDisabled(payNowButton)) {
                console.error(`❌ Payment '${title}': button 'Buy Now' is not enabled after fill all required data`);
                return false;
            }

            console.log(`✅ Pick expiry date combo payment mode '${title}' verified successfully`);
        return true;
        } catch (error: any) {
            console.error(`❌ Failed to verify pick expiry date combo payment mode '${title}': ${error.message}`);
            return false;
        }
    }

    private async creditCardHK(title: string): Promise<boolean> {
        console.log(`Processing credit card HK payment mode: ${title}`);
        return true;
    }

    private async installmentHK(title: string): Promise<boolean> {
        console.log(`Processing installment HK payment mode: ${title}`);
        return true;
    }

    private async Cofidis(title: string): Promise<boolean> {
        console.log(`Processing Cofidis payment mode: ${title}`);
        return true;
    }

    private async banki(title: string): Promise<boolean> {
        console.log(`Processing Banki payment mode: ${title}`);
        return true;
    }

    private async havale(title: string): Promise<boolean> {
        console.log(`Processing Havale payment mode: ${title}`);
        return true;
    }

    private async masterpass(title: string): Promise<boolean> {
        console.log(`Processing Masterpass payment mode: ${title}`);
        return true;
    }

    private async oneMatSelectGR(title: string): Promise<boolean> {
        console.log(`Processing one mat select GR payment mode: ${title}`);
        return true;
    }

    private async internetbankaSEB(title: string): Promise<boolean> {
        console.log(`Processing Internetbanka SEB payment mode: ${title}`);
        return true;
    }

    private async bilkPL(title: string): Promise<boolean> {
        console.log(`Processing BLIK PL payment mode: ${title}`);
        return true;
    }

    private async lacaixa(title: string): Promise<boolean> {
        console.log(`Processing La Caixa payment mode: ${title}`);
        return true;
    }

    private async simpaisa(title: string): Promise<boolean> {
        console.log(`Processing Simpaisa payment mode: ${title}`);
        return true;
    }

    private async purpleVisa(title: string): Promise<boolean> {
        console.log(`Processing Purple Visa payment mode: ${title}`);
        return true;
    }

    /**
     * Finds the Pay Now button.
     */
    private async findPayNowButton(): Promise<Locator | null> {
        try {
            await this.page.waitForSelector(PaymentModes.BTN_PAY_NOW_SELECTOR, { 
                timeout: 5000,
                state: 'visible' 
            });
            
            const payNowLocator = this.page.locator(PaymentModes.BTN_PAY_NOW_SELECTOR);
            const count = await payNowLocator.count();
            
            for (let i = 0; i < count; i++) {
                const element = payNowLocator.nth(i);
                const isVisible = await element.isVisible();
                if (isVisible) {
                    return element;
                }
            }
            return null;
        } catch (error: any) {
            console.warn(`⚠️ Unable to find Pay Now button: ${error.message}`);
            return null;
        }
    }

    /**
     * Accepts terms and conditions.
     */
    private async acceptTermAndCondition(): Promise<void> {
        try {
            // await this.page.waitForTimeout(1000);
            
            const termsCheckboxes = this.page.locator(PaymentModes.TERMS_AND_CONDITIONS_SELECTOR);
            const count = await termsCheckboxes.count();
            
            for (let i = 0; i < count; i++) {
                const checkbox = termsCheckboxes.nth(i);
                const isVisible = await checkbox.isVisible();
                if (isVisible) {
                    try {
                        const tagName = await checkbox.evaluate(el => el.tagName.toLowerCase());
                        const inputType = await checkbox.getAttribute('type');
                        
                        let isChecked = false;
                        try {
                            if (tagName === 'div') {
                                const input = checkbox.locator('input.mdc-checkbox__native-control');
                                if (await input.count() > 0) {
                                    const classList = await input.first().getAttribute('class');
                                    if (classList && classList.includes('mdc-checkbox--selected')) {
                                        isChecked = true;
                                    }
                                }
                            }
                            
                            if (!isChecked && tagName === 'input' && (inputType === 'checkbox' || inputType === 'radio')) {
                                isChecked = await checkbox.isChecked();
                            }
                            
                            if (!isChecked) {
                                const ariaChecked = await checkbox.getAttribute('aria-checked');
                                isChecked = ariaChecked === 'true';
                            }
                        } catch (checkError: any) {
                            console.warn(`⚠️ Unable to check if checkbox ${i + 1} is checked: ${checkError.message}`);
                        }
                        
                        if (!isChecked) {
                            await checkbox.click();
                        }
                        
                    } catch (checkboxError: any) {
                        console.warn(`⚠️ Error processing checkbox ${i + 1}: ${checkboxError.message}`);
                    }
                }
            }
            
            await this.page.waitForTimeout(1000);
            
        } catch (error: any) {
            console.warn(`⚠️ Unable to accept payment Terms and Conditions: ${error.message}`);
        }
    }

    /**
     * Checks if the button is disabled.
     */
    private async isButtonDisabled(button: Locator): Promise<boolean> {
        try {
            await button.waitFor({ state: 'visible', timeout: 3000 });
            
            const disabled = await button.getAttribute('disabled');
            if (disabled) {
                return true;
            }
            
            const className = await button.getAttribute('class');
            if (className && className.includes('mat-form-field-disabled')) {
                return true;
            }
            
            return false;
        } catch (error: any) {
            console.warn(`⚠️ Unable to check if button is disabled: ${error.message}`);
            return false;
        }
    }

    /**
     * Fills credit card fields.
     */
    private async fillCreditCardFields(): Promise<void> {
        try {
            const creditCardFields = this.page.locator(PaymentModes.PAYMENT_CREDIT_CARD_FIELDS_SELECTOR);
            const count = await creditCardFields.count();
            
            for (let i = 0; i < count; i++) {
                const element = creditCardFields.nth(i);
                const isVisible = await element.isVisible();
                if (!isVisible) continue;
                
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                
                if (tagName === 'iframe') {
                    await this.handleIframeField(element);
                } else {
                    await this.enterCreditCardField(element);
                }
            }
        } catch (error: any) {
            throw new Error(`Unable to fill Credit Card data: ${error.message}`);
        }
    }

    /**
     * Handles iframe field.
     */
    private async handleIframeField(iframe: Locator): Promise<void> {
        try {
            const frameId = await iframe.getAttribute('title');
            
            await iframe.scrollIntoViewIfNeeded();
            
            const frame = this.page.frameLocator(`iframe[title="${frameId}"]`);
            const inputs = frame.locator('input:not([type="hidden"]):not([aria-hidden])');
            const inputCount = await inputs.count();
            
            for (let i = 0; i < inputCount; i++) {
                const input = inputs.nth(i);
                const isVisible = await input.isVisible();
                if (isVisible) {
                    await this.enterCreditCardFieldInFrame(input);
                }
            }
        } catch (error: any) {
            console.warn(`⚠️ Unable to handle iframe field: ${error.message}`);
        }
    }

    /**
     * Enters data into credit card fields inside iframe.
     */
    private async enterCreditCardFieldInFrame(field: Locator): Promise<void> {
        try {
            const nameOrId = await field.getAttribute('name') || await field.getAttribute('id') || '';
            
            let fieldIdentifier = nameOrId;
            if (PaymentModes.VALID_SITES.includes('AE') && nameOrId === 'input-text') {
                fieldIdentifier = 'cardHolderName';
            }
            
            if (this.isCardNumberField(fieldIdentifier)) {
                await this.fillFieldInFrame(field, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                await this.page.waitForTimeout(3000);
            } else if (this.isHolderNameField(fieldIdentifier)) {
                await this.fillFieldInFrame(field, PaymentModes.CREDIT_CARD_DATA.holderName, 'Holder name');
            } else if (this.isExpiryDateField(fieldIdentifier)) {
                await this.fillFieldInFrame(field, PaymentModes.CREDIT_CARD_DATA.expiryDate, 'Expiry date');
            } else if (this.isCvvField(fieldIdentifier)) {
                await this.fillFieldInFrame(field, PaymentModes.CREDIT_CARD_DATA.cvv, 'CVV');
            } else {
                console.warn(`⚠️ Iframe field ${fieldIdentifier} not handled`);
            }
            
            // await this.page.waitForTimeout(1000);
        } catch (error: any) {
            console.warn(`⚠️ Unable to enter credit card field in iframe: ${error.message}`);
        }
    }

    /**
     * Fills data into fields inside iframe.
     */
    private async fillFieldInFrame(field: Locator, value: string, fieldType: string): Promise<void> {
        try {
            await field.clear();
            await field.fill(value);
        } catch (error: any) {
            console.warn(`⚠️ Unable to fill ${fieldType} in iframe: ${error.message}`);
        }
    }

    /**
     * Enters data into credit card fields.
     */
    private async enterCreditCardField(field: Locator): Promise<void> {
        try {
            const nameOrId = await field.getAttribute('name') || await field.getAttribute('id') || '';
            
            let fieldIdentifier = nameOrId;
            if (PaymentModes.VALID_SITES.includes('AE') && nameOrId === 'input-text') {
                fieldIdentifier = 'cardHolderName';
            }
            
            if (this.isCardNumberField(fieldIdentifier)) {
                await this.fillField(field, PaymentModes.CREDIT_CARD_DATA.cardNumber, 'Card number');
                // await this.page.waitForTimeout(3000);
            } else if (this.isHolderNameField(fieldIdentifier)) {
                await this.fillField(field, PaymentModes.CREDIT_CARD_DATA.holderName, 'Holder name');
            } else if (this.isExpiryDateField(fieldIdentifier)) {
                await this.fillField(field, PaymentModes.CREDIT_CARD_DATA.expiryDate, 'Expiry date');
            } else if (this.isCvvField(fieldIdentifier)) {
                await this.fillField(field, PaymentModes.CREDIT_CARD_DATA.cvv, 'CVV');
            } else {
                console.warn(`⚠️ Field ${fieldIdentifier} not handled`);
            }
            
            // await this.page.waitForTimeout(1000);
        } catch (error: any) {
            console.warn(`⚠️ Unable to enter credit card field: ${error.message}`);
        }
    }

    /**
     * Fills data into field.
     */
    private async fillField(field: Locator, value: string, fieldType: string): Promise<void> {
        try {
            await field.clear();
            await field.fill(value);
        } catch (error: any) {
            console.warn(`⚠️ Unable to fill ${fieldType}: ${error.message}`);
        }
    }

    /**
     * Checks if the field is a card number field.
     */
    private isCardNumberField(fieldIdentifier: string): boolean {
        const cardNumberFields = [
            'encryptedCardNumber', 'cardNumber', 'cardnumber', 'card-number'
        ];
        return cardNumberFields.includes(fieldIdentifier) || 
               fieldIdentifier.startsWith('adyen-checkout-encryptedCardNumber-');
    }

    /**
     * Checks if the field is a card holder name field.
     */
    private isHolderNameField(fieldIdentifier: string): boolean {
        const holderNameFields = [
            'holderNameInput', 'holderName', 'input-checkout__cardholderName', 
            'card-name', 'cardHolderName'
        ];
        return holderNameFields.includes(fieldIdentifier);
    }

    /**
     * Checks if the field is an expiry date field.
     */
    private isExpiryDateField(fieldIdentifier: string): boolean {
        const expiryFields = [
            'encryptedExpiryDate', 'expirationDate', 'card-expiry', 'expiry', 'exp-date'
        ];
        return expiryFields.includes(fieldIdentifier) || 
               fieldIdentifier.startsWith('adyen-checkout-encryptedExpiryDate-');
    }

    /**
     * Checks if the field is a CVV field.
     */
    private isCvvField(fieldIdentifier: string): boolean {
        const cvvFields = [
            'encryptedSecurityCode', 'securityCode', 'card-cvv', 'cvnNumber', 'cvc'
        ];
        return cvvFields.includes(fieldIdentifier);
    }

    /**
     * Handles Thailand special case.
     */
    private async handleThailandSpecialCase(): Promise<void> {
        try {
            const radioButton = this.page.locator('input[type="radio"]');
            await radioButton.first().click();
        } catch (error: any) {
            console.warn(`⚠️ Unable to handle Thailand special case: ${error.message}`);
        }
    }

    /**
     * Handles PayPal iframe and finds PayPal button.
     */
    private async handlePayPalIframe(title: string): Promise<Locator | null> {
        try {
            const payPalIframe = this.page.locator(PaymentModes.PAYPAL_IFRAME_SELECTOR);
            const iframeExists = await payPalIframe.isVisible({ timeout: 10000 });
            
            if (iframeExists) {
                const frame = this.page.frameLocator(PaymentModes.PAYPAL_IFRAME_SELECTOR);
                const payPalButton = frame.locator(PaymentModes.PAYPAL_PAY_BUTTON_SELECTOR);
                const buttonCount = await payPalButton.count();
                
                for (let i = 0; i < buttonCount; i++) {
                    const button = payPalButton.nth(i);
                    const isVisible = await button.isVisible();
                    if (isVisible) {
                        return button;
                    }
                }
                
                console.warn('⚠️ No visible PayPal button found in iframe');
                return null;
            } else {
                const directPayPalButton = this.page.locator(PaymentModes.PAYPAL_PAY_BUTTON_SELECTOR);
                const directButtonCount = await directPayPalButton.count();
                
                for (let i = 0; i < directButtonCount; i++) {
                    const button = directPayPalButton.nth(i);
                    const isVisible = await button.isVisible();
                    if (isVisible) {
                        return button;
                    }
                }
                
                console.warn('⚠️ No visible PayPal button found');
                return null;
            }
        } catch (error: any) {
            console.warn(`⚠️ Unable to handle PayPal iframe: ${error.message}`);
            return null;
        }
    }

    /**
     * Common: Fills input and blurs with ESC key.
     */
    private async fillAndBlur(input: Locator, value: string, labelForLog: string): Promise<void> {
        try {
            const isVisible = await input.isVisible();
            if (!isVisible) {
                console.warn(`⚠️ ${labelForLog} input is not visible`);
                return;
            }
            await input.scrollIntoViewIfNeeded();
            await input.fill(value);
            await input.press('Escape');
        } catch (error: any) {
            console.warn(`⚠️ Unable to fill and blur ${labelForLog}: ${error.message}`);
        }
    }

    /**
     * Checks if the button is clickable.
     */
    private async isButtonClickable(button: Locator): Promise<boolean> {
        try {
            await button.waitFor({ state: 'visible', timeout: 3000 });
            
            const isDisabled = await button.isDisabled();
            if (isDisabled) {
                return true;
            }
            
            const isVisible = await button.isVisible();
            if (!isVisible) {
                return true;
            }
            
            const isEnabled = await button.isEnabled();
            return !isEnabled;
            
        } catch (error: any) {
            console.warn(`⚠️ Unable to check if button is clickable: ${error.message}`);
            return true;
        }
    }


}

