import { Page, Locator, test, expect } from '@playwright/test';
import { DELAYS, TIMEOUTS } from './Utils';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly nextButton: Locator;
  readonly nextButtonforCN: Locator;
  readonly loginButton: Locator;
  readonly notNowButton: Locator;
  readonly privacyButtonforCN: Locator;
  readonly loginButtonforCN: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('input#iptLgnPlnID, input#account');
    this.passwordField = page.locator('input#iptLgnPlnPD, input#password');
    this.nextButton = page.locator('button.MuiButton-containedPrimary');
    this.nextButtonforCN = page.locator('.one-primary.one-button');
    this.loginButton = page.locator(
      'button#signInButton, button[data-an-la="samsung account"], a[data-an-la="samsung account"], button.MuiButton-containedPrimary'
    );
    // Legacy "Not Now" button selector
    this.notNowButton = page.locator('.one-cancel.one-button, .MuiButton-containedSecondary');
    this.privacyButtonforCN = page.locator('img.pop-content-check:not([style*="display: none"])');
    this.loginButtonforCN = page.locator('div.saLoginBtn');
  }

  async verifyEmailFieldVisible() {
    await this.emailField.waitFor({ state: 'visible', timeout: TIMEOUTS.STANDARD });
    await this.page.waitForTimeout(DELAYS.STANDARD);
  }

  async enterEmail(email: string) {
    await this.emailField.fill(email);
    await this.page.waitForTimeout(DELAYS.STANDARD);
  }

  async clickNextButton() {
    await this.nextButton.click();
    await this.page.waitForTimeout(DELAYS.STANDARD);
  }

  async clickNextButtonforCN() {
    await this.nextButtonforCN.click();
    await this.page.waitForTimeout(DELAYS.LONG);
  }

  async clickLoginButtonforCN() {
    await this.loginButtonforCN.click();
    await this.page.waitForTimeout(DELAYS.LONG);
  }

  async verifyPasswordFieldVisible() {
    await this.passwordField.waitFor({ state: 'visible', timeout: TIMEOUTS.STANDARD });
    await this.page.waitForTimeout(DELAYS.STANDARD);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
    await this.page.waitForTimeout(DELAYS.STANDARD);
  }

  async clickLoginButton() {
    await this.loginButton.click();
    await this.page.waitForTimeout(DELAYS.LONG);
  }

  async handleNotNowButton() {
    const selectors = [
      'button.MuiButton-containedSecondary',
      'button.MuiButtonBase-root.MuiButton-containedSecondary',
      'button[type="button"][class*="MuiButton"][class*="Secondary"]',
      'button[class*="MuiButton-containedSecondary"]',
      'button[class*="secondary"]',
      'button[class*="cancel"]',
      '[data-testid="not-now-button"]'
    ];

    try {
      const tryClickNotNow = async () => {
        for (const selector of selectors) {
          const button = this.page.locator(selector);
          const count = await button.count();

          if (count > 0) {
            // Get first button details for debugging
            try {
              const buttonText = await button.first().textContent();
              const buttonClass = await button.first().getAttribute('class');
            } catch (e) {
              // Could not get button details
            }

            try {
              await button.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
              await button.first().click({ force: true });
              await this.page.waitForTimeout(DELAYS.SHORT);
              return true;
            } catch (error) {
              // Click failed, try next selector
            }
          }
        }
        return false;
      };

      // Try up to 2 times (popups may appear twice)
      for (let attempt = 1; attempt <= 2; attempt++) {
        // Wait before each attempt
        if (attempt === 1) {
          await this.page.waitForTimeout(DELAYS.LONG);
        } else {
          await this.page.waitForTimeout(DELAYS.STANDARD);
        }

        const clicked = await tryClickNotNow();
        if (!clicked) {
          break;
        }
      }
    } catch (error) {
      console.error('❌ Not Now button handling error:', (error as Error).message);
    }
  }
  
  

  async verifyLoginSuccess(originalUrl: string) {
    // Check if returned to original URL
    const currentUrl = this.page.url();
    return currentUrl.includes(originalUrl) || currentUrl.includes('samsung.com');
  }

  async login(email: string, password: string): Promise<void> {
    await this.verifyEmailFieldVisible();
    await this.enterEmail(email);
    await this.clickNextButton();

    await this.verifyPasswordFieldVisible();
    await this.enterPassword(password);
    await this.clickLoginButton();

    // Wait for page transition after login
    await this.page.waitForTimeout(DELAYS.LONG);
    await this.handleNotNowButton();
    await this.page.waitForTimeout(DELAYS.LONG);
  }

  // China-specific login flow
  async loginforCN(email: string, password: string): Promise<void> {
    // 1. Click privacy checkbox
    await this.privacyButtonforCN.click();

    // 2. Click account login button
    await this.loginButtonforCN.click();

    // 3. Standard login flow
    await this.verifyEmailFieldVisible();
    await this.enterEmail(email);
    await this.emailField.blur();
    await this.clickNextButtonforCN();

    await this.verifyPasswordFieldVisible();
    await this.enterPassword(password);
    await this.passwordField.blur();
    await this.clickNextButtonforCN();

    await this.page.waitForTimeout(DELAYS.LONG);
    await this.handleNotNowButton();
    await this.page.waitForTimeout(DELAYS.LONG);
  }
} 