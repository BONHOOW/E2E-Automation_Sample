import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import defaultConfig from './data/default.json';
import dotenv from 'dotenv';

const fixtureDir = path.resolve(__dirname, 'data');
const files = fs.readdirSync(fixtureDir).filter(f => f.endsWith('.json') && f !== 'default.json');


const commonUse = {
  baseURL: defaultConfig.baseUrl,
  headless: true,
  channel: 'chrome',
  launchOptions: {
    args: [
      '--start-maximized',
      '--incognito',
      '--window-size=1920,1080',
    ],
  },
  viewport: { width: 1920, height: 1080 },
  extraHTTPHeaders: {
    'User-Agent': 'D2CEST-AUTO-70a4cf16 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36.D2CEST-AUTO-70a4cf16',
  },
};


dotenv.config();

const projects = files.map(file => {
  const config = require(`./data/${file}`);
  const siteCode = config.siteCode || file.replace('.json', '').toUpperCase();
  const siteCodeLower = siteCode.toLowerCase();

  // TradeIn 데이터 로드 - siteCode를 대문자로 변환
  const tradeInJson = require('./data/tradeIn/tradeIn.json');
  const tradeInDevices = tradeInJson.tradeInData[siteCode.toUpperCase()] || [];

  // 체크아웃 데이터 로드 - siteCode를 소문자로 변환 (Checkout.json의 키와 일치)
  const checkoutJson = require('./data/Checkout/Checkout.json');
  const checkoutLocatorJson = require('./data/Checkout/CheckoutLocator.json');

  // 체크아웃 데이터 가져오기 (소문자로 변환)
  const checkoutData = checkoutJson[siteCodeLower];
  // 체크아웃 로케이터 데이터 가져오기 (국가별)
  const checkoutLocators = checkoutLocatorJson[siteCodeLower];

  // MyAccount 데이터 로드 - siteCode를 소문자로 변환
  const myAccountJson = require('./data/MyAccount/MyAccount.json');
  const myAccountLocatorJson = require('./data/MyAccount/MyAccountLocator.json');

  // MyAccount 데이터 가져오기 (소문자로 변환)
  const myAccountData = myAccountJson[siteCodeLower];
  // MyAccount 로케이터 데이터 가져오기 
  const myAccountLocators = myAccountLocatorJson;

  // NA 설정 로드
  const naConfigJson = require('./data/naConfig.json');
  const naTests = naConfigJson[siteCode.toUpperCase()] || [];

  return {
    name: config.name || config.siteCode || file.replace('.json', ''),
    use: {
      ...commonUse,
      actionTimeout: 60000,  // 30초 → 60초로 증가
      navigationTimeout: 60000,  // 네비게이션 타임아웃 추가},
    },
    // testMatch: [
    //   `**/*_${siteCode.toUpperCase()}.spec.ts`,  // 1순위: _AU, _UK, _JP 등
    //   '**/Prod_*[!_][!_][!_].spec.ts',          // 2순위: Prod_로 시작하고 언더스코어가 3개인 파일
    //   '**/!(*_*).spec.ts'                       // 3순위: 언더스코어가 없는 파일
    // ],
    metadata: {
      ...defaultConfig,
      ...config,
      // 프로젝트별 환경 변수에서 SSO 정보 로드
      SSOID: process.env[`${siteCode}_SSO_ID`],
      SSOPW: process.env[`${siteCode}_SSO_PW`],
      SSOID_REWARD: process.env[`${siteCode}_SSO_ID_REWARD`],
      SSOPW_REWARD: process.env[`${siteCode}_SSO_PW_REWARD`],
      // TradeIn 데이터 자동 로드
      tradeInDevices,
      checkoutData,
      checkoutLocators,
      myAccountData,
      myAccountLocators,
      // NA 설정 자동 로드
      naTests
    }
  };
});

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true, // 병렬 실행 활성화
  workers: 8,          // 워커 수를 8로 설정하여 병렬 처리 성능 향상
  timeout: 900000, // 전체 테스트 타임아웃 100초로 설정
  projects,
  reporter: [
    ['list'],
    ['html', { open: 'on-failure' }]
    // ['./database/reporter.ts'] // Database reporter is not available
  ],
  use: {
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false, // viewport만 캡처
    },
    trace: 'retain-on-failure',
    // video: 'retain-on-failure',
  },
});
