import { Page, Locator, expect } from '@playwright/test';
import { DELAYS, TIMEOUTS, Utils } from './Utils';

export class SCPPage {
  readonly page: Page;
  private utils: Utils;
  
  // Samsung Care+ 관련 locators 
    // 1.BC Page
  readonly scpOption: Locator; // 맨처음 옵션 선택
  readonly scpOptionPayment: Locator; // 추가 payment 옵션 선택
  readonly scpPopupAddBtn: Locator;
  readonly scpOptionPaymentWatch: Locator;
  

  // 2.Cart Page
  readonly scpAddBtn: Locator; // SC+ add 버튼
  readonly scpOptionList: Locator;
  readonly scpPriceArea: Locator;



  constructor(page: Page) {
    this.page = page;
    this.utils = new Utils(page);
    
    // 1.BC Page
    this.scpOption = page.locator(`.hubble-product__options-list-wrap:not([style*="hidden"]) .js-smc,
.wearable-option.option-care li:not(.depth-two) button:not([an-la*='none']),
.smc-list .insurance__item--yes`);
    this.scpOptionPayment = page.locator(`.hubble-product__options-payment .s-option-box[aria-disabled="false"],
.wearable-option.option-care li.depth-two[aria-disabled="false"]`);
    this.scpOptionPaymentWatch = page.locator(`.hubble-product__options-payment .s-option-box,.wearable-option.option-care li.depth-two`);

    this.scpPopupAddBtn = page.locator(`button[an-la="samsung care:confirm"],button[data-an-la="samsung care:add to cart"],app-samsung-care-v2 .modal__footer button[type="submit"],button[data-an-la="samsung care:confirm"]`);

    // 2.Cart Page
    this.scpAddBtn = page.locator('.hubble-product__options-payment .s-option-box:visible, .wearable-option.option-care li.depth-two:visible');

    this.scpPriceArea = page.locator(`
      [data-pimsubtype='samsung-care'] .action-text,
      [data-pimsubtype='insurance'] .action-text,
      [data-pimsubtype='insurance'] .as-price,
      p.shopping-c-i-h-c-offer-r-p,
      [data-visubtype='samsung care'] .free-price,
      [data-modeldisplay*='Samsung Care+'] .action-text,
      .as-price.hasNewKZTradeIn,
      div[data-modeldisplay*="SC+"] > div[class*="item__actions"] > div,
      div[data-modeldisplay="Samsung Care"] span[class*="free-price"],
      div[data-modeldisplay="SMC"] div[class*="price"],
      div[data-modeldisplay*='优惠换屏'] div[class*='smc']
    `);


  this.scpOptionList = page.locator(`app-samsung-care-v2 mat-radio-group mat-radio-button div.option-box__price,
    .service-list-selector[ng-if*='displaySmcProduct'],
    app-samsung-care mat-radio-group mat-radio-button`);
    
    }

  // ===== Main Methods =====
  /**
   * Add Samsung Care+ - Main method for BC
   */
  async addSCPOptionsInBC() {
    try {
      const firstScpOption = this.scpOption.first();
      await expect(firstScpOption).toBeVisible({ timeout: TIMEOUTS.SHORT });
      await firstScpOption.click();
      
      try{
        const visibleOption = await this.scpOptionPayment.filter({ has: this.page.locator(':visible') }).first();
        await visibleOption.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        await visibleOption.click();
      } catch (error) {
        const visibleOption = await this.scpOptionPaymentWatch.filter({ has: this.page.locator(':visible') }).first();
        await visibleOption.click();
      }
      
    } catch (error: any) {
      throw error;
    }
  }


  async addSCPOptionsInCart(type: string) {
    try {
      await this.page.waitForTimeout(DELAYS.STANDARD);
      let scpOptionList: Locator | null = null;
      
      if (type === 'standard') {
        // For standard: find object that doesn't contain '/'
        const allOptions = this.scpOptionList.filter({ has: this.page.locator(':visible') });
        for (let i = 0; i < await allOptions.count(); i++) {
          const option = allOptions.nth(i);
          const text = await option.textContent();
          if (text && !text.includes('/')) {
            scpOptionList = option;
            break;
          }
        }
      } else {
        // For subscription: find object that contains '/'
        const allOptions = this.scpOptionList.filter({ has: this.page.locator(':visible') });
        for (let i = 0; i < await allOptions.count(); i++) {
          const option = allOptions.nth(i);
          const text = await option.textContent();
          if (text && text.includes('/')) {
            scpOptionList = option;
            break;
          }
        }
      }
      
      if (scpOptionList) {
        await scpOptionList.click();
      } else {
        const availableOptions = await this.scpOptionList.filter({ has: this.page.locator(':visible') }).count();
        throw new Error(`Option '${type}' is not visible. Available options: ${availableOptions}`);
      }

      const addSCPBtn = this.scpPopupAddBtn.first();
      await expect(addSCPBtn).toBeVisible({ timeout: TIMEOUTS.SHORT });
      await addSCPBtn.click();
        
    } catch (error: any) {
      throw error;
    }
  }

  async addSCPPopupInBC() {
    try {
      const addSCPBtn = this.scpPopupAddBtn.first();
      await this.page.waitForTimeout(DELAYS.STANDARD);
      await expect(addSCPBtn).toBeVisible({ timeout: TIMEOUTS.STANDARD });
      await addSCPBtn.click();
        
    } catch (error: any) {
      throw error;
    }
  }
  
  /**
   * Verify price area (check if SCP is added in cart)
   */
  async verifySCPPriceArea(line: number) {
    await this.page.waitForTimeout(DELAYS.STANDARD);
    
    try {
      await expect(this.scpPriceArea).toBeVisible({ timeout: TIMEOUTS.SHORT });
      const priceText = await this.scpPriceArea.textContent();
        
      return true;

    } catch (error: any) {
      throw new Error(`Samsung Care+ price area verification failed: ${error.message}`);
    }
  }
} 