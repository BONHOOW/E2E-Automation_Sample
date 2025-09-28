export class PaymentModes {
    // Payment locators
    static readonly PAYMENT_TITLE_SELECTOR = '[data-activestepname="CHECKOUT_STEP_PAYMENT"] mat-expansion-panel .payment-title';
    static readonly ALL_PAYMENT_MODES_SELECTOR = `
        app-payment-mode-credit-card,
        app-payment-mode-paypal,
        app-payment-mode-adyen-paypal,
        payment-mode-cybersource-paypal,
        app-payment-mode-samsung-pay,
        app-payment-mode-masterpass,
        app-payment-mode-paypal-credit,
        app-payment-mode-glow,
        app-payment-mode-klarna,
        app-payment-mode-klarna-de,
        app-payment-mode-adyen-klarna,
        app-payment-mode-google-pay,
        app-payment-mode-adyen-alipay,
        app-payment-mode-latitude,
        app-payment-mode-afterpay,
        app-payment-mode-afterpay-installment,
        app-payment-mode-commerz,
        app-payment-mode-findomestic,
        payment-mode-cofidis-installment,
        app-payment-mode-mobile-pay,
        app-payment-mode-floa3x4x,
        app-payment-mode-floa-nx,
        app-payment-mode-adyen-bancontact,
        app-payment-mode-affirm,
        app-payment-mode-mbway,
        app-payment-mode-multibanco,
        app-payment-mode-santander,
        app-payment-mode-bizum,
        app-payment-lacaixa,
        app-payment-mode-oney,
        app-payment-mode-adyen-ideal,
        app-payment-mode-pago-efectivo,
        app-payment-mode-safetypay,
        app-payment-mode-mercado-pago-credit,
        app-payment-mode-ewallet-napasa,
        app-payment-mode-buynow-paylater,
        app-payment-mode-cybersource-credit-installment,
        app-payment-mode-flexi-card,
        app-payment-mode-finance-now,
        app-payment-mode-kbank-credit-card,
        app-payment-mode-2cp2p,
        app-payment-mode-twoc2p-card-based-installment,
        app-cod-payment,
        app-payment-mode-ipay88,
        app-payment-mode-ipay88-ewallet,
        app-payment-mode-ipay88-installment,
        app-payment-mode-walley-b2b,
        app-payment-mode-adyen-swish,
        app-payment-mode-mercadopagopse,
        app-payment-mode-addi-pay,
        app-payment-mode-cmi-credit-card,
        app-payment-mode-eip-installment,
        app-payment-mode-fatourati,
        app-payment-mode-wafacash-pay,
        app-payment-mode-midtrans-credit-debit-card,
        app-payment-mode-midtrans-credit-card-inst,
        app-payment-mode-bank-transfer,
        app-payment-mode-kredivo,
        app-payment-mode-gopay,
        app-payment-mode-hcid,
        app-payment-mode-ipay88-sop,
        app-payment-mode-cybersource-credit-card,
        app-payment-mode-installment,
        app-payment-mode-paydollar,
        app-payment-mode-wechat-pay,
        app-payment-mode-neweb-pay,
        app-payment-mode-installment-mor,
        app-payment-mode-twoc2p-bnpl-wallets,
        app-payment-mode-twint,
        app-payment-mode-heidi-pay,
        app-payment-mode-simple-pay,
        app-payment-mode-cofidis,
        app-payment-mode-kueski-pay,
        app-payment-mode-mercado-checkout-pro,
        app-payment-mode-mercado-checkout-bnpl,
        app-payment-mode-flow-webpay,
        app-payment-mode-flowonepay,
        app-payment-mode-flow-khipu,
        app-payment-mode-flow-mach,
        app-payment-mode-simpaisa-ewallet,
        app-payment-mode-alfa-installments,
        app-payment-mode-credit-guradcc,
        app-payment-mode-checkout-dot-com,
        app-payment-mode-masterpass,
        app-payment-mode-iyzico-bank,
        app-payment-mode-iyzico-wallet,
        app-payment-mode-iyzico-credit,
        app-payment-mode-zippay,
        app-payment-mode-tbi-bank,
        app-payment-mode-ngenius-samsung-pay,
        app-payment-mode-pointspay,
        app-payment-mode-ae-installment,
        app-payment-mode-tabby-pay,
        app-payment-mode-tamara,
        app-payment-mode-paygate,
        app-payment-mode-float,
        app-payment-mode-pay-just-now,
        app-payment-mode-paymob,
        app-payment-mode-cybersource-credit-card-hk,
        app-payment-mode-razer-installment,
        app-payment-mode-flow-yape,
        app-payment-mode-indodana,
        app-payment-mode-mercado-cash,
        app-payment-mode-payu-google-pay,
        app-payment-mode-homecredit-installment,
        app-ws-pay,
        corvus-pay,
        payment-mode-credit-card-installment,
        app-payment-mode-iris,
        app-payment-mode-kaspipay,
        app-payment-mode-halyke-pay,
        app-payment-mode-brokerage-installment,
        app-payment-mode-platon-payment-mode,
        app-card-on-delivery-payment,
        app-privat-bank,
        app-payment-mode-p24-fast-bank-transfer,
        app-payment-mode-p24-blik,
        paypo-payment,
        app-payment-mode-pl-santander,
        app-payment-mode-inbank,
        app-payment-mode-payu-installment,
        app-payment-mode-ro-pay-utraditional-bank,
        app-payment-mode-tbi-credit-online,
        app-payment-mode-tbi-bnpl,
        app-payment-mode-adyen-klarna-installment,
        app-payment-mode-jp-gmo,
        app-payment-mode-paidy,
        app-payment-mode-gmo-paypay,
        app-payment-mode-gmo-docomo,
        app-payment-mode-halyk-epay-samsung-pay,
        app-payment-mode-poli,
        app-payment-mode-payfortcreditcard,
        app-payment-mode-vipps,
        app-payment-mode-billie-b2b,
        app-payment-mode-moyasar-samsung-pay,
        app-payment-mode-iyzico-bank,
        .mat-expansion-panel .payment-mode-simpaisaVoucher-disclaimer2,
        .mat-expansion-panel .payment-mode-midtrans-card,
        app-payment-mode-kzbnpl,
        app-payment-mode-windcave,
        app-payment-mode-finance-now-purple-visa,
        app-payment-mode-dvedo-installments,
        app-payment-mode-simpaisa-voucher
    `;
    static readonly COMMON: string[] = [
        "app-payment-mode-samsung-pay",
        "app-payment-mode-glow",
        "app-payment-mode-klarna",
        "app-payment-mode-klarna-de",
        "app-payment-mode-adyen-klarna",
        "app-payment-mode-adyen-alipay",
        "app-payment-mode-afterpay",
        "app-payment-mode-afterpay-installment",
        "app-payment-mode-commerz",
        "app-payment-mode-findomestic",
        "app-payment-mode-mobile-pay",
        "app-payment-mode-floa3x4x",
        "app-payment-mode-floa-nx",
        "payment-mode-cybersource-paypal",
        "app-payment-mode-affirm",
        "app-payment-mode-mbway",
        "app-payment-mode-multibanco",
        "app-payment-mode-santander",
        "app-payment-mode-bizum",
        "app-payment-mode-oney",
        "app-payment-mode-pago-efectivo",
        "app-payment-mode-safetypay",
        "app-payment-mode-ewallet-napasa",
        "app-payment-mode-buynow-paylater",
        "app-payment-mode-flexi-card",
        "app-payment-mode-2cp2p",
        "app-payment-mode-ipay88",
        "app-payment-mode-addi-pay",
        "app-payment-mode-eip-installment",
        "app-payment-mode-fatourati",
        "app-payment-mode-wafacash-pay",
        "app-payment-mode-kredivo",
        "app-payment-mode-gopay",
        "app-payment-mode-hcid",
        "app-payment-mode-paydollar",
        "app-payment-mode-wechat-pay",
        "app-payment-mode-neweb-pay",
        "app-payment-mode-installment-mor",
        "app-payment-mode-twoc2p-bnpl-wallets",
        "app-payment-mode-twint",
        "app-payment-mode-heidi-pay",
        "app-payment-mode-kueski-pay",
        "app-payment-mode-mercado-checkout-pro",
        "app-payment-mode-mercado-checkout-bnpl",
        "app-payment-mode-flow-webpay",
        "app-payment-mode-flowonepay",
        "app-payment-mode-flow-khipu",
        "app-payment-mode-flow-mach",
        "app-payment-mode-simpaisa-ewallet",
        "app-payment-mode-alfa-installments",
        "app-payment-mode-credit-guradcc",
        "app-payment-mode-iyzico-wallet",
        "app-payment-mode-iyzico-credit",
        "app-payment-mode-zippay",
        "app-payment-mode-tbi-bank",
        "app-payment-mode-ngenius-samsung-pay",
        "app-payment-mode-pointspay",
        "app-payment-mode-ae-installment",
        "app-payment-mode-tabby-pay",
        "app-payment-mode-tamara",
        "app-payment-mode-paygate",
        "app-payment-mode-float",
        "app-payment-mode-pay-just-now",
        "app-payment-mode-paymob",
        "app-payment-mode-flow-yape",
        "app-payment-mode-indodana",
        "app-payment-mode-mercado-cash",
        "app-payment-mode-payu-google-pay",
        "app-payment-mode-homecredit-installment",
        "app-ws-pay",
        "corvus-pay",
        "app-payment-mode-iris",
        "app-payment-mode-kaspipay",
        "app-payment-mode-halyke-pay",
        "app-payment-mode-brokerage-installment",
        "app-payment-mode-platon-payment-mode",
        "app-payment-mode-card-on-delivery-payment",
        "app-privat-bank",
        "app-payment-mode-p24-fast-bank-transfer",
        "paypo-payment",
        "app-payment-mode-pl-santander",
        "app-payment-mode-inbank",
        "app-payment-mode-payu-installment",
        "app-payment-mode-ro-pay-utraditional-bank",
        "app-payment-mode-tbi-bnpl",
        "app-payment-mode-adyen-klarna-installment",
        "app-payment-mode-jp-gmo",
        "app-payment-mode-paidy",
        "app-payment-mode-gmo-paypay",
        "app-payment-mode-gmo-docomo",
        "app-payment-mode-halyk-epay-samsung-pay",
        "app-payment-mode-vipps",
        "app-payment-mode-moyasar-samsung-pay",
        "app-payment-mode-iyzico-bank",
        "app-payment-mode-windcave",
        "app-payment-mode-dvedo-installments"
    ];

    static readonly CREDITCARD: string[] = [
        "app-payment-mode-credit-card",
        "app-payment-mode-adyen-bancontact",
        "app-payment-mode-mercado-pago-credit",
        "app-payment-mode-kbank-credit-card",
        "app-payment-mode-cmi-credit-card",
        "app-payment-mode-checkout-dot-com"
    ];

    static readonly PAYPAL: string[] = [
        "app-payment-mode-paypal",
        "app-payment-mode-paypal-credit",
        "app-payment-mode-adyen-paypal"
    ];

    static readonly ONERADIO: string[] = [
        "app-payment-mode-finance-now",
        "app-payment-mode-ipay88-ewallet",
        "app-payment-mode-ipay88-installment",
        "app-payment-mode-razer-installment",
        "app-payment-mode-tbi-credit-online"
    ];

    static readonly ONEMATSELECT: string[] = [
        "payment-mode-cofidis-installment",
        "app-payment-mode-mercadopagopse",
        "app-payment-mode-bank-transfer"
    ];

    /**
     * 모든 결제 모드 셀렉터를 반환합니다.
     */
    static getAllPaymentModes(): string[] {
        return [
            ...this.COMMON,
            ...this.CREDITCARD,
            ...this.PAYPAL,
            ...this.ONERADIO,
            ...this.ONEMATSELECT
        ];
    }

    /**
     * 모든 결제 모드 셀렉터를 쉼표로 구분된 문자열로 반환합니다.
     */
    static getPaymentModesSelector(): string {
        return this.getAllPaymentModes().join(', ');
    }

    /**
     * 결제 모드 로케이터 셀렉터를 반환합니다.
     */
    static getPaymentModesLocatorSelector(): string {
        return this.ALL_PAYMENT_MODES_SELECTOR;
    }

    // 이 위로 추가 삭제 수정 금지
    
    // Common payment mode locators
    static readonly BTN_PAY_NOW_SELECTOR = `
        app-payment-modes button[data-an-tr="checkout-payment-detail"],
        app-payment-modes button.pill-btn.pill-btn--blue,
        app-payment-modes #samsungPayContainer button,
        app-payment-modes button[type="submit"]
    `;
    
    static readonly TERMS_AND_CONDITIONS_SELECTOR = 'app-payment-modes-terms-and-conditions .mdc-checkbox';
    
    // Credit card payment mode locators
    static readonly PAYMENT_CREDIT_CARD_FIELDS_SELECTOR = `
        app-payment-mode-credit-card .card-container iframe,
        app-payment-mode-credit-card .card-container input:not([type="hidden"]),
        app-payment-mode-adyen-bancontact .adyen-checkout__card-input iframe,
        app-payment-mode-adyen-bancontact .adyen-checkout__card-input input[aria-required="true"],
        app-payment-mode-mercado-pago-credit #customCard-container iframe,
        app-payment-mode-mercado-pago-credit #customCard-container input.ng-valid,
        app-payment-mode-kbank-credit-card .card-container iframe,
        app-payment-mode-cmi-credit-card input[aria-required="true"],
        app-payment-mode-checkout-dot-com .payment-container iframe,
        app-payment-mode-checkout-dot-com .payment-container input[aria-required="true"]
    `;
    
    // Credit card test data
    static readonly CREDIT_CARD_DATA = {
        cardNumber: "4444 3333 2222 1111",
        holderName: "Auto Test",
        expiryDate: "03/30",
        cvv: "737"
    };
    
    // Valid sites for special handling
    static readonly VALID_SITES = [
        "IQ_KU", "IQ_AR", "AE", "AE_AR", "EG", "OM", "OM_AR",
        "BH", "BH_AR", "KW", "KW_AR", "QA", "QA_AR", "SA", "SA_EN"
    ];
    
    // PayPal payment mode locators
    static readonly PAYPAL_IFRAME_SELECTOR = '.paypal-buttons iframe.component-frame';
    static readonly PAYPAL_PAY_BUTTON_SELECTOR = `
        .paypal-button-row div[role="link"][aria-label="PayPal"],
        .paypal-button-row div[aria-label="PayPal Checkout"],
        [data-an-la="payment:continue to paypal:paypal"]
    `;
    
    // Google Pay payment mode locators
    static readonly GOOGLE_PAY_BUTTON_SELECTOR = 'button.gpay-card-info-container';
    
}