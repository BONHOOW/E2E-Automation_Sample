import { Page, Locator, expect } from '@playwright/test';
import { DELAYS, TIMEOUTS, Utils } from './Utils';

export class SSFlex {
    readonly cbxTermAndConditions: Locator;
    readonly ssflexcpArea: Locator;
    readonly addToSSFlexBtn: Locator;
    readonly removeSSFlexBtn: Locator;
    readonly ssflexModal: Locator;
    readonly btnConfirmSSFlexPopup: Locator;

    constructor(page: Page) {
        this.cbxTermAndConditions = page.locator('.hubble-upgrade-popup__check-list .checkbox-v2');
        this.ssflexcpArea = page.locator(`app-samsung-upgrade-v2.modal`);
        this.addToSSFlexBtn = page.locator('[data-an-la="samsung flex:add to cart"]');
        this.removeSSFlexBtn = page.locator(`.s-btn-encased.is-delete[an-la="upgrade program:remove"],
.action-button.ng-star-inserted[data-an-tr="cart-product-remove"],
.is-delete[an-la="eup:remove"],
[data-modeldisplay="Samsung Upgrade"] [data-an-la="remove item"]`);
        this.ssflexModal = page.locator('.hubble-upgrade-popup');
        this.btnConfirmSSFlexPopup = page.locator('[an-la="upgrade program:confirm"]');
    }

    async addSSFlexInCart() {
        try {
          await expect(this.ssflexcpArea).toBeVisible({ timeout: TIMEOUTS.SHORT });
          
            // Handle terms and conditions checkbox
            try {
                const termCheckboxes = this.cbxTermAndConditions;
                const checkboxCount = await termCheckboxes.count();
                
                for (let i = 0; i < checkboxCount; i++) {
                const checkbox = termCheckboxes.nth(i);
                const isVisible = await checkbox.isVisible();
                
                if (isVisible) {
                    // Scroll to center of the element
                    await checkbox.scrollIntoViewIfNeeded();
                    
                    // Calculate offset for precise clicking (similar to the Groovy code)
                    const box = await checkbox.boundingBox();
                    if (box) {
                    const xOffset = Math.round(12 - box.width / 2);
                    const yOffset = Math.round(12 - box.height / 2);
                    
                    // Click with offset
                    await checkbox.click({ 
                        position: { x: xOffset, y: yOffset },
                        force: true 
                    });
                    } else {
                    // Fallback to regular click if bounding box is not available
                    await checkbox.click({ force: true });
                    }
                }
                }
          } catch (checkboxError: any) {
            throw new Error(`Unable to check terms and conditions: ${checkboxError.message}`);
          }

          await expect(this.addToSSFlexBtn).toBeVisible({ timeout: TIMEOUTS.SHORT });
          await this.addToSSFlexBtn.click();

        } catch (error: any) {
          throw error;
        }

      }

      async waitForOpenedSSFlexPopup() {
        await expect(this.ssflexModal).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }

      async clickConfirmSSFlexPopup() {
        await expect(this.btnConfirmSSFlexPopup).toBeVisible({ timeout: TIMEOUTS.SHORT });
        await this.btnConfirmSSFlexPopup.click();
      }



      async verifySSFlexRemoveBtn() {
        await expect(this.removeSSFlexBtn).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }



}
