import { Page, Locator } from '@playwright/test';

export class Reward {
    private page: Page;

    // Reward locators
    private optionJoinRewardsLocator: Locator;
    private orderSummaryArea: Locator;

    constructor(page: Page) {
        this.page = page;
        this.optionJoinRewardsLocator = page.locator(`
            //input[@data-an-la="checkout:samsung rewards t&c agreements"]/.. |
            //input[@name='rewardsProgramOptIn' or @name='CHECKOUT_OPTIONS_rewardsProgramOptIn']/..
        `);
        this.orderSummaryArea = page.locator('.order-summary-wrapper.fixed.ng-star-inserted');
    }

    /**
     * Verifies reward messages in cart page
     */
    async verifyRewardMessagesInCart(config: any): Promise<void> {
        try {
            await this.page.waitForTimeout(3000);

            const pageText = await this.orderSummaryArea.textContent();
            if (!pageText) {
                throw new Error('Could not get order summary text content');
            }

            const messages = [
                { text: config.RewardSummary.tieringMessage, name: 'Tiering Message' },
                { text: config.RewardSummary.rewardsbenefit, name: 'Rewards Benefit' }
            ];

            for (const message of messages) {
                if (!pageText.includes(message.text)) {
                    throw new Error(`${message.name} not display on cart order summary`);
                }

                // Find the part of the page that contains the specified text
                const startIndex = pageText.indexOf(message.text);
                const contextStart = Math.max(0, startIndex - 50);
                const contextEnd = Math.min(pageText.length, startIndex + message.text.length + 50);
                const foundText = pageText.substring(contextStart, contextEnd);
                console.log(`📄 Found in page: "...${foundText}..."`);
                console.log(`✅ ${message.name} verified`);
            }

            // Estimated Rewards Points 검증
            // const regex = new RegExp(config.RewardSummary.EstimatedRewardsPoints);
            // if (!regex.test(pageText)) {
            //     throw new Error('Estimated Rewards Points not display on cart order summary');
            // }
            // console.log('✅ Estimated Rewards Points verified');

        } catch (error: any) {
            console.error(`❌ Failed to verify reward messages in cart: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verifies reward messages in checkout page
     */
    async verifyRewardMessagesInCheckout(config: any): Promise<void> {
        try {
            await this.page.waitForTimeout(3000);

            const pageText = await this.orderSummaryArea.first().textContent();
            if (!pageText) {
                throw new Error('Could not get order summary text content');
            }

            const messages = [
                { text: config.RewardSummary.tieringMessage, name: 'Tiering Message' }
            ];

            for (const message of messages) {
                if (!pageText.includes(message.text)) {
                    throw new Error(`${message.name} not display on checkout order summary`);
                }

                // Find the part of the page that contains the specified text
                const startIndex = pageText.indexOf(message.text);
                const contextStart = Math.max(0, startIndex - 50);
                const contextEnd = Math.min(pageText.length, startIndex + message.text.length + 50);
                const foundText = pageText.substring(contextStart, contextEnd);
                console.log(`📄 Found in page: "...${foundText}..."`);
                console.log(`✅ ${message.name} verified`);
            }

            const regex = new RegExp(config.RewardSummary.EstimatedRewardsPoints);
            const match = pageText.match(regex);
            if (!match) {
                throw new Error('Estimated Rewards Points not display on checkout order summary');
            }

            // Print the matched part and surrounding context
            const matchIndex = pageText.indexOf(match[0]);
            const contextStart = Math.max(0, matchIndex - 50);
            const contextEnd = Math.min(pageText.length, matchIndex + match[0].length + 50);
            const foundText = pageText.substring(contextStart, contextEnd);
            console.log(`📄 Found in page: "...${foundText}..."`);
            console.log('✅ Estimated Rewards Points verified');

        } catch (error: any) {
            console.error(`❌ Failed to verify reward messages in checkout: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verifies that rewards option is displayed
     */
    async verifyRewardsOption(utils: any): Promise<void> {
        try {
            await this.optionJoinRewardsLocator.first().scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(2000);

            const isVisible = await this.optionJoinRewardsLocator.first().isVisible();
            if (!isVisible) {
                throw new Error('Enroll rewards option is not display on the Checkout');
            }
        } catch (error: any) {
            console.error(`❌ Failed to verify rewards option: ${error.message}`);
            throw error;
        }
    }
}
