import { test as base, TestInfo } from '@playwright/test';
import { Home } from './pages/Home';
import { LoginPage } from './pages/Login';
import { BC } from './pages/BC';
import { PD } from './pages/PD';
import { AddonPage } from './pages/Addon';
import { Cart } from './pages/Cart';
import { SCPPage } from './pages/SCP';
import { Gnb } from './pages/Gnb';
import { Common } from './pages/Common';
import { Checkout } from './pages/Checkout/Checkout';
import { Utils } from './pages/Utils';
import { MyAccount } from './pages/MyAccount';
import { TradeInBC } from './pages/TradeIn/TradeInBC';
import { TradeInCart } from './pages/TradeIn/TradeInCart';
import { Payment } from './pages/Payment';
import { Reward } from './pages/Reward';
import { SSFlex } from './pages/SSFlex';
import { PF } from './pages/PF';
import { SignUp } from './pages/SignUp';

// Fixture type definitions
type TestFixtures = {
  config: any;
  home: Home;
  login: LoginPage;
  bc: BC;
  pd: PD;
  pf: PF;
  addon: AddonPage;
  cart: Cart;
  scp: SCPPage;
  ssflex: SSFlex;
  gnb: Gnb;
  common: Common;
  checkout: Checkout;
  utils: Utils;
  myAccount: MyAccount;
  tradeInBC: TradeInBC;
  tradeInCart: TradeInCart;
  payment: Payment;
  reward: Reward;
  signUp: SignUp;
  tradeInData: {
    siteCode: string;
    devices: any[];
    phone: any;      // phone type device
    watch: any;      // watch type device
    tablet: any;     // tablet type device
  };
};

// Custom fixtures definition
export const test = base.extend<TestFixtures>({
  // Configuration data fixture
  config: async ({ }, use: (config: any) => Promise<void>, testInfo: TestInfo) => {
    const config = testInfo.project.metadata;
    
    // Add NA check logic
    const testName = testInfo.title;
    const siteCode = config.siteCode;
    
    if (siteCode) {
      const naTests = config.naTests || [];
      if (naTests.includes(testName)) {
        // console.log(`NA Check: Test ${testName} (${siteCode}) will be marked as NA`);
        // Mark test as skipped
        test.skip(true, 'NA processing');
        return;
      }
    }
    
    await use(config);
  },

  // Page Object fixtures
  home: async ({ page }, use) => {
    const home = new Home(page);
    await use(home);
  },

  login: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },

  bc: async ({ page, tradeInData, config }, use) => {
    const bc = new BC(page, tradeInData, config);
    await use(bc);
  },

  pd: async ({ page, config }, use) => {
    const pd = new PD(page, config);
    await use(pd);
  },

  pf: async ({ page, gnb }, use) => {
    const pf = new PF(page, gnb);
    await use(pf);
  },

  addon: async ({ page }, use) => {
    const addon = new AddonPage(page);
    await use(addon);
  },

  cart: async ({ page, tradeInData }, use) => {
    const cart = new Cart(page, tradeInData);
    await use(cart);
  },

  scp: async ({ page }, use) => {
    const scp = new SCPPage(page);
    await use(scp);
  },

  gnb: async ({ page }, use) => {
    const gnb = new Gnb(page);
    await use(gnb);
  },

  common: async ({ page }, use) => {
    const common = new Common(page);
    await use(common);
  },

  checkout: async ({ page }, use) => {
    const checkout = new Checkout(page);
    await use(checkout);
  },

  utils: async ({ page }, use) => {
    const utils = new Utils(page);
    await use(utils);
  },

  myAccount: async ({ page, config }, use) => {
    const myAccount = new MyAccount(page, config);
    await use(myAccount);
  },

  payment: async ({ page }, use) => {
    const payment = new Payment(page);
    await use(payment);
  },

  reward: async ({ page }, use) => {
    const reward = new Reward(page);
    await use(reward);
  },

  signUp: async ({ page }, use) => {
    const signUp = new SignUp(page);
    await use(signUp);
  },

  // TradeInBC fixture for BC page
  tradeInBC: async ({ page }, use) => {
    const tradeInBC = new TradeInBC(page);
    await use(tradeInBC);
  },

  // TradeInCart fixture for Cart page
  tradeInCart: async ({ page }, use) => {
    const tradeInCart = new TradeInCart(page);
    await use(tradeInCart);
  },
  ssflex: async ({ page }, use) => {
    const ssflex = new SSFlex(page);
    await use(ssflex);
  },

  // TradeIn data fixture
  tradeInData: async ({ config }, use) => {
    const siteCode = config.siteCode;
    const devices = config.tradeInDevices || [];

    // Separate devices by type using find method
    const phone = devices.find((d: any) => d.type === 'phone');
    const watch = devices.find((d: any) => d.type === 'watch');
    const tablet = devices.find((d: any) => d.type === 'tablet');

    await use({
      siteCode,
      devices,
      phone,      // phone type device (or undefined)
      watch,      // watch type device (or undefined)
      tablet      // tablet type device (or undefined)
    });
  },
});


export { expect } from '@playwright/test';