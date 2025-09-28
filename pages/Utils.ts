import { Page, Locator, expect } from '@playwright/test';

// Common constants definition
export const DELAYS = {
  SHORT: 1000,      // 1000ms
  STANDARD: 3000,   // 3000ms
  LONG: 5000,       // 5000ms 
} as const;

export const TIMEOUTS = {
  SHORT: 5000,      // 5000ms (maintained)
  STANDARD: 10000,  // 10000ms (most commonly used, maintained)
  LONG: 15000,      // 15000ms (unified from 8000, 15000ms → 15000ms)
} as const;

export class Utils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Click element (wait then click)
   */
  async scrollClick(locator: Locator) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 15000 });
      await this.waitFor('STANDARD'); // 3초 딜레이  

      await expect(locator).toBeEnabled({ timeout: TIMEOUTS.SHORT });
      await locator.click();
    } catch (error: any) {
      throw new Error(`Failed to click element: ${locator.toString()}`);
    }
  }

  /**
     * Click button with complete CSS selector
     * @param selector - Complete CSS selector string (e.g., 'button[data-an-la="submit"]')
     */
  async clickButton(selector: string) {
    try {
      const button = this.page.locator(selector);
      await button.waitFor({ state: 'visible', timeout: TIMEOUTS.STANDARD });
      await expect(button).toBeEnabled({ timeout: TIMEOUTS.SHORT });
      await button.click();

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
     * Universal function to check if specific element is visible
     * @param selector - CSS selector of element to check
     * @param description - Description of element (for logging)
     * @throws Error if element is not visible
     */
  async isElementVisible(selector: string, description: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await expect(element).toBeVisible({ timeout: TIMEOUTS.STANDARD });
      return true;
    } catch (error: any) {
      // Throw error to make test fail
      throw new Error(`${description} is not visible: ${error.message}`);
    }
  }

  /**
   * 강제 딜레이 함수
   * @param ms - 딜레이 시간 (밀리초)
   */
  async delay(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * 미리 정의된 딜레이 사용
   * @param delayType - 'SHORT', 'STANDARD', 'LONG' 중 하나
   */
  async waitFor(delayType: 'SHORT' | 'STANDARD' | 'LONG'): Promise<void> {
    await this.page.waitForTimeout(DELAYS[delayType]);
  }

} 
