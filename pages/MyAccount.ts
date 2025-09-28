import { Page, Locator, expect } from '@playwright/test';
import { Utils } from './Utils';
import { TIMEOUTS } from './Utils';
import * as fs from 'fs';
import * as path from 'path';

export class MyAccount {
    private page: Page;
    private utils: Utils;
    private locators: any; 
    private config: any; 
    
    constructor(page: Page, config: any) {
        this.page = page;
        this.utils = new Utils(page);
        this.locators = config.myAccountLocators || {};
        this.config = config;
    }

    private getLocator(locatorKey: string): string {
        // Get current country code
        const country = this.config.siteCode?.toLowerCase() || 'uk';

        // Check country-specific override locators
        const countryOverrides = this.locators.countryOverrides?.[country];
        if (countryOverrides && countryOverrides[locatorKey]) {
            return countryOverrides[locatorKey];
        }

        // Return default locator (or error message if not found)
        return this.locators[locatorKey] || `[data-locator-missing="${locatorKey}"]`;
    }

    // ===== 1. Navigation and Page Entry =====

    async navigateToMyPage() {
        try {
            // Hover "Open My Menu" button in GNB
            const openMyMenuButton = this.page.locator('button[an-la="user name"]');
            await expect(openMyMenuButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });

            // Hover to show menu
            await openMyMenuButton.hover();

            // Click "My Page" menu item
            const myPageMenuItem = this.page.locator('a[an-ac="gnb"][an-ca="account"][an-la="my page"][aria-label="my page"]');
            await expect(myPageMenuItem).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await myPageMenuItem.click();
        } catch (error: any) {
            console.error(`❌ Failed to navigate to MyPage: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async navigateToMyOrders() {
        try {
            // Hover before-login menu in GNB
            const beforeLoginButton = this.page.locator('div.nv00-gnb-v4__utility-wrap.before-login > button');
            await expect(beforeLoginButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });

            // Hover to show menu
            await beforeLoginButton.hover();

            // Click "Orders" menu item
            const ordersMenuItem = this.page.locator('a[an-ac="gnb"][an-ca="account"][an-la="orders"]').first();
            await expect(ordersMenuItem).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await ordersMenuItem.click();

            // Wait for My Orders page to load
            await this.page.waitForSelector('input[formcontrolname="orderId"]', { timeout: 10000 });
        } catch (error: any) {
            console.error(`❌ Failed to navigate to My Orders: ${error.message}`);
            throw new Error(error.message);
        }
    }

     async searchAsGuest(orderId: string, email: string) {
        try {
            // Enter order ID
            const orderIdField = this.page.locator('input[formcontrolname="orderId"]');
            await expect(orderIdField).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await orderIdField.fill(orderId);

            // Enter email
            const emailIdField = this.page.locator('input[formcontrolname="emailId"]');
            await expect(emailIdField).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await emailIdField.fill(email);
    }  catch (error: any){
        console.error(`❌ Failed to search as guest: ${error.message}`);
        throw new Error(error.message);
       }
    }

     async searchAsRegistered(orderId: string) {
        try {
            // Enter guest order number
            const orderSearchField = this.page.locator('input[formcontrolname="orderSearchInput"]');
            await expect(orderSearchField).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await orderSearchField.fill(orderId);

            // Click search button
            const searchButton = this.page.locator('button[data-an-la="order lookup"]');
            await expect(searchButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await searchButton.click();            
        } catch (error: any) {
            console.error(`❌ Failed to search as registered user: ${error.message}`);
            throw new Error(error.message);
        }
    }

     async verifySearchErrorMessage() {
        try {
            const errorElement = this.page.locator('mat-error.mat-mdc-form-field-error');
            await expect(errorElement).toBeVisible({ timeout: 3000 });
            
        } catch (error: any) {
            console.error(`❌ Failed to verify error message: ${error.message}`);
            throw new Error('Register flow failed: error message is not displayed');
        }
    }

     async verifyOrdersPageIsLoaded() {
        try {
            // Get current URL
            const currentUrl = this.page.url();

            // Check if URL contains '/mypage/orders'
            if (!currentUrl.includes('/mypage/orders')) {
                throw new Error(`Redirect URL is incorrect. Expected to contain '/mypage/orders', Actual: ${currentUrl}`);
            }
            
        } catch (error: any) {
            console.error(`❌ Failed to verify MyOrders page: ${error.message}`);
            throw new Error(error.message);
        }
    }

    // For countries requiring sendCode, proceed to next step
    async verifyOrderItem() {
        try {
            const sendCodeButton = this.page.locator('button.pill-btn--white, .verification-code__button button:not([disabled])');

            try {
                await expect(sendCodeButton).toBeVisible({ timeout: 1000 });
                // Proceed to next step (login) for sendCode countries
                return;
            }
                catch{
                    const searchButton = this.page.locator('button[data-an-la="order look up:search"]');
                    await expect(searchButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
                    await searchButton.click();

                    const areaOrderItem = this.page.locator('div.order-item').first();
                    await expect(areaOrderItem).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            }
        } catch (error: any){
            console.error(`❌ Failed to verify guest order: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async verifyMyPageIsLoaded() {
        try {
            // Check MyPage elements
            const myPageTitle = this.page.locator('.my-g-profile-and-your-message');
            await expect(myPageTitle).toBeVisible({ timeout: TIMEOUTS.STANDARD });
        } catch (error: any) {
            console.error(`❌ MyPage verification failed: ${error.message}`);
            throw new Error(error.message);
        }
    }

    

    // If click fails, refresh and retry once
    async navigateToProfileSetting() {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            if (attempt > 1) {
              await this.page.reload();
              await this.page.waitForLoadState('domcontentloaded');
            }

            const editProfileLink = this.page.locator(this.getLocator('editProfileLink'));
            await expect(editProfileLink).toBeVisible({ timeout: 5000 });
            await expect(editProfileLink).toBeEnabled({ timeout: 5000 });
            await editProfileLink.click();
            await this.verifyProfileSettingPageIsLoaded();

            return;

          } catch (error: any) {
            if (attempt === 2) {
              throw new Error(`Failed to navigate to Profile Setting: ${error.message}`);
            }
          }
        }
     }

    // ===== 2. Tab Management and Address List Management =====

    async verifyProfileSettingPageIsLoaded() {
        try {
            // Check page loading state
            await this.page.waitForLoadState('domcontentloaded');

            // Verify URL
            const currentUrl = this.page.url();

            if (!currentUrl.includes('profile-setting') && !currentUrl.includes('mypage')) {
                throw new Error(`Unexpected URL: ${currentUrl}`);
            }

            // Verify add address button
            const addAddressButton = this.page.locator(this.getLocator('addAddressButton'));
            await expect(addAddressButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
        } catch (error: any) {
            console.error(`❌ Profile Setting page verification failed: ${error.message}`);
            throw new Error(`Profile Setting page verification failed: ${error.message}`);
        }
    }

    async switchToDeliveryTab() {
        try {
            const deliveryTab = this.page.locator(this.getLocator('deliveryTab'));
            await expect(deliveryTab).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await deliveryTab.click();
        } catch (error: any) {
            console.error(`❌ Failed to switch to Delivery tab: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async switchToBillingTab() {
        try {
            const billingTab = this.page.locator(this.getLocator('billingTab'));
            await expect(billingTab).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await billingTab.click();
        } catch (error: any) {
            console.error(`❌ Failed to switch to Billing tab: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async getSavedAddressesCount(): Promise<number> {
        try {
            // Load all addresses before counting (view more)
            await this.loadAllAddresses();

            // Check if address cards exist
            const addressCards = this.page.locator('.address__card');
            const count = await addressCards.count();

            return count;
        } catch (error: any) {
            console.error(`❌ Failed to get saved addresses count: ${error.message}`);
            throw error;
        }
    }

    async loadAllAddresses() {
        try {
            const viewMoreButton = this.page.locator(this.getLocator('viewMoreButton'));
            const isVisible = await viewMoreButton.isVisible();

            if (isVisible) {
                await viewMoreButton.click();
            }
        } catch (error: any) {
            console.error(`❌ Failed to load all addresses: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async clickEditAddress(index: number) {
        try {
            const editButtons = this.page.locator(this.getLocator('editAddressButton'));
            const editButton = editButtons.nth(index);

            await expect(editButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await editButton.click();
        } catch (error: any) {
            console.error(`❌ Failed to click edit button for address ${index + 1}: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async removeAddress(index: number) {
        try {
            // Click remove button
            const removeButtons = this.page.locator(this.getLocator('removeAddressButton'));
            const removeButton = removeButtons.nth(index);

            await expect(removeButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await removeButton.click();

            // Click confirm button
            const confirmButton = this.page.locator(this.getLocator('removeConfirmButton'));
            await expect(confirmButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await confirmButton.click();

            // Wait for deletion to complete - wait until address count decreases
            const initialCount = await this.getSavedAddressesCount();

            // Wait up to 10 seconds for deletion completion
            for (let i = 0; i < 20; i++) {
                await this.page.waitForTimeout(500); // Wait 0.5 seconds
                const currentCount = await this.getSavedAddressesCount();

                if (currentCount < initialCount) {
                    break;
                }
            }
        } catch (error: any) {
            console.error(`❌ Failed to delete address ${index + 1}: ${error.message}`);
            throw new Error(error.message);
        }
    }

    // ===== 3. Complete Address Addition Flow =====

    async clickAddAddress() {
        try {
            const addAddressButton = this.page.locator(this.getLocator('addAddressButton'));
            await expect(addAddressButton).toBeVisible({ timeout: TIMEOUTS.STANDARD });
            await addAddressButton.click();
        } catch (error: any) {
            console.error(`❌ Failed to click Add Address button: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async verifyAddressDialogIsOpen() {
        try {
            const dialogTitle = this.page.locator(this.getLocator('dialogTitle'));
            await expect(dialogTitle).toBeVisible({ timeout: TIMEOUTS.STANDARD });
        } catch (error: any) {
            console.error(`❌ Address dialog verification failed: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async fillAddressForm(addressData: any, country: string = 'uk') {
        try {
            for (const [fieldName, value] of Object.entries(addressData)) {
                if (value) {
                    const field = this.page.locator(`form.address-form [formcontrolname="${fieldName}"]`);

                    if (await field.isVisible({ timeout: 2000 })) {
                        await this.fillFieldByType(field, String(value));
                    }
                }
            }
        } catch (error: any) {
            console.error(`❌ Failed to fill address form: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async saveAddress() {
        try {
            let saveButton;

            // Check new address Save button
            const newAddressSaveButton = this.page.locator(this.getLocator('saveButton'));
            if (await newAddressSaveButton.isVisible({ timeout: 3000 })) {
                saveButton = newAddressSaveButton;
            } else {
                // Check edit mode Save button (Billing/Delivery)
                // Check Delivery edit button first, then Billing if not found
                const deliveryEditButton = this.page.locator(this.getLocator('editSaveButton'));
                const billingEditButton = this.page.locator(this.getLocator('editBillingSaveButton'));

                if (await deliveryEditButton.isVisible({ timeout: 3000 })) {
                    saveButton = deliveryEditButton;
                } else if (await billingEditButton.isVisible({ timeout: 3000 })) {
                    saveButton = billingEditButton;
                } else {
                    throw new Error('No save button found: neither new address nor edit mode save button is visible');
                }
            }

            await saveButton.click();

            // Wait for dialog to disappear
            try {
                await this.page.waitForFunction(() => {
                    const dialog = document.querySelector('form.address-form');
                    return !dialog;
                }, { timeout: 3000 });
            } catch (timeoutError) {
                // Dialog may still be visible
            }
            
        } catch (error: any) {
            console.error(`❌ Failed to save address: ${error.message}`);
            throw new Error(error.message);
        }
    }

    // ===== 5. Verification and Utilities =====

    async verifyAddressAdded(expectedData: any) {
        try {
            for (const [fieldName, expectedValue] of Object.entries(expectedData)) {
                if (expectedValue && String(expectedValue).trim()) {
                    const field = this.page.locator(`form.address-form [formcontrolname="${fieldName}"]`);
                    if (await field.isVisible({ timeout: 2000 })) {
                        const actualValue = await this.getFieldValue(field);
                        if (actualValue.trim().toLowerCase() !== String(expectedValue).trim().toLowerCase()) {
                            throw new Error(`❌ Field '${fieldName}': expected '${expectedValue}', got '${actualValue}'`);
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error(`❌ Address addition verification failed: ${error.message}`);
            throw error;
        }
    }

    async verifyAddressUpdated(expectedData: any, tabType: 'delivery' | 'billing' = 'delivery') {
        try {
            for (const [fieldName, expectedValue] of Object.entries(expectedData)) {
                if (expectedValue && String(expectedValue).trim()) {
                    const field = this.page.locator(`form.address-form [formcontrolname="${fieldName}"]`);
                    if (await field.isVisible({ timeout: 2000 })) {
                        const actualValue = await this.getFieldValue(field);
                        if (actualValue.trim().toLowerCase() !== String(expectedValue).trim().toLowerCase()) {
                            throw new Error(`❌ Field '${fieldName}': expected '${expectedValue}', got '${actualValue}'`);
                        }
                    }
                }
            }

            await this.page.locator('button.modal__close').click();
        } catch (error: any) {
            console.error(`❌ Address update verification failed: ${error.message}`);
            throw error;
        }
    }
    
    // ===== Internal Utilities =====

    private async getFieldType(field: Locator): Promise<'autocomplete' | 'dropdown' | 'input'> {
        try {
            const tagName = await field.evaluate(el => el.tagName.toLowerCase());
            const className = await field.getAttribute('class') || '';
            const role = await field.getAttribute('role') || '';
            
            if (className.includes('mat-mdc-autocomplete-trigger') || className.includes('autocomplete')) {
                return 'autocomplete';
            } else if (tagName === 'mat-select' || className.includes('mat-select') || role === 'combobox') {
                return 'dropdown';
            } else {
                return 'input';
            }
        } catch (error: any) {
            console.error(`❌ Failed to get field type: ${error.message}`);
            throw error;
        }
    }

    private async getFieldValue(field: Locator): Promise<string> {
        try {
            const fieldType = await this.getFieldType(field);
            
            switch (fieldType) {
                case 'autocomplete':
                case 'input':
                    return await field.inputValue();
                case 'dropdown':
                    return (await field.textContent()) || '';
            }
        } catch (error: any) {
            console.error(`❌ Failed to get field value: ${error.message}`);
            throw error;
        }
    }

    private async fillFieldByType(fieldElement: Locator, value: string): Promise<void> {
        try {
            const fieldType = await this.getFieldType(fieldElement);
            
            switch (fieldType) {
                case 'autocomplete':
                    await fieldElement.fill(value);
                    const suggestionPanel = this.page.locator('.mat-autocomplete-panel, .cdk-overlay-pane');
                    await suggestionPanel.locator('mat-option').first().click();
                    break;
                    
                case 'dropdown':
                    await fieldElement.focus();
                    await this.page.waitForTimeout(500);
                    await fieldElement.click();
            
                    const optionsPanel = this.page.locator('mat-select-panel, .mat-select-panel, .cdk-overlay-pane');
                    await expect(optionsPanel).toBeVisible({ timeout: TIMEOUTS.STANDARD });
                    
                    const option = this.page.locator(`mat-option:has-text("${value}"), .mat-option:has-text("${value}")`).first();
                    
                    if (await option.isVisible({ timeout: 3000 })) {
                        await option.click();
                    } else {
                        throw new Error(`Option "${value}" not found in dropdown`);
                    }
                    
                    await expect(optionsPanel).not.toBeVisible({ timeout: 3000 });
                    break;
                    
                default:
                    await fieldElement.fill(value);
                    break;
            }
        } catch (error: any) {
            console.error(`❌ Failed to fill field with value ${value}: ${error.message}`);
            throw error;
        }
    }

    // @param maxRetries Maximum retry count (default: existing address count + 3)
    async cleanupAllAddresses(maxRetries?: number): Promise<void> {
        const initialAddressCount = await this.getSavedAddressesCount();

        if (initialAddressCount === 0) {
            return;
        }

        const maxTryCount = maxRetries || (initialAddressCount + 3);

        for (let i = 0; i < maxTryCount; i++) {
            const currentCount = await this.getSavedAddressesCount();
            if (currentCount === 0) {
                break;
            }

            await this.removeAddress(0);
            await this.page.waitForTimeout(1000);
        }

        const finalCount = await this.getSavedAddressesCount();
        if (finalCount > 0) {
            console.warn(`⚠️ Warning: ${finalCount} addresses still remain after cleanup`);
        }
    }
}


