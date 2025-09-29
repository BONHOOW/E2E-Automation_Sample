# E2E-Automation Sample Project

> **포트폴리오 프로젝트** - Playwright를 활용한 E2E 테스트 자동화 프레임워크

## 프로젝트 개요

이 프로젝트는 **Playwright**를 기반으로 한 E2E(End-to-End) 테스트 자동화 프레임워크입니다. 
다양한 웹 애플리케이션의 주요 사용자 플로우를 자동화하여 품질 보증을 수행합니다.

## 기술 스택

- **테스트 프레임워크**: Playwright
- **언어**: TypeScript
- **패턴**: Page Object Model (POM)
- **리포팅**: HTML 리포트, Playwright Trace
  > ※ DB 내보내기 등 민감한 리포팅 항목은 보안상 Sample에서 제외하였습니다.

## 프로젝트 구조

```
E2E-Automation_Sample/
├── tests/e2e/           # E2E 테스트 스펙 파일들
│   ├── Prod_BC_01.spec.ts      # BC Page 기능 테스트
│   ├── Prod_Cart_01.spec.ts    # 장바구니 기능 테스트
│   ├── Prod_Checkout_01.spec.ts # Checkout 프로세스 테스트
│   ├── Prod_Home_01.spec.ts    # 홈페이지 테스트
│   ├── Prod_Login_01.spec.ts   # 로그인 테스트
│   ├── Prod_MyAccount_01.spec.ts # 마이페이지 테스트
│   ├── Prod_Payment_01.spec.ts # 결제 리스트 검증 테스트
│   ├── Prod_PD_01.spec.ts      # 상품 상세 테스트
│   ├── Prod_PF_01.spec.ts      # 상품 필터 테스트
│   ├── Prod_Reward_01.spec.ts  # 리워드 테스트
│   └── Prod_Search_01.spec.ts  # 검색 테스트
├── pages/               # Page Object Model 클래스들
│   ├── Common.ts        # 공통 페이지 객체
│   ├── Home.ts          # 홈페이지 객체
│   ├── Login.ts         # 로그인 페이지 객체
│   ├── Cart.ts          # 장바구니 페이지 객체
│   ├── Checkout/        # 결제 관련 페이지 객체들
│   └── ...
├── data/                # 테스트 데이터
│   ├── default.json     # 기본 설정
│   ├── JP.json          # 일본 지역 데이터
│   ├── MyAccount/       # 계정 관련 데이터
│   └── ...
├── playwright.config.ts # Playwright 설정
├── package.json         # 프로젝트 의존성
└── install.bat          # 자동 설치 스크립트
```

## 빠른 시작

### 1. 자동 설치 (Windows)
```bash
# install.bat 실행으로 모든 의존성 자동 설치
install.bat
```

### 2. 수동 설치
```bash
# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install --with-deps
```

### 3. 테스트 실행
```bash
# 모든 테스트 실행
npm run test

# 브라우저에서 테스트 실행 (디버깅용)
npm run test:headed

# 특정 테스트 파일 실행
npx playwright test tests/e2e/Prod_Login_01.spec.ts

# UI 모드로 실행
npx playwright test --ui
```

## 주요 기능

### 구현된 테스트 시나리오
- **사용자 인증**: 로그인/로그아웃 플로우
- **상품 탐색**: 검색, 필터링, 상품 상세보기
- **장바구니 관리**: 상품 추가/삭제, 수량 변경
- **결제 프로세스**: 주문 생성, 결제 정보 입력
- **마이페이지**: 주문 내역, 계정 관리
- **리워드 시스템**: 포인트 적립/사용

### 보안 고려사항
- **민감한 정보 보호**: 실제 계정 정보는 샘플 데이터로 대체
- **환경 변수 분리**: `.env` 파일을 통한 설정 관리
- **테스트 데이터 격리**: 프로덕션 환경과 분리된 테스트 데이터 사용

### 테스트 리포팅
- **HTML 리포트**: 상세한 테스트 결과 및 스크린샷
- **실패 시 디버깅**: 자동 스크린샷 및 비디오 녹화
- **트레이스 뷰어**: 테스트 실행 과정 시각화

## 포트폴리오 하이라이트

- **확장 가능한 구조**: Page Object Model 패턴으로 유지보수성 향상
- **다국가 지원**: 다양한 지역별 테스트 데이터 관리
- **자동화된 설치**: 원클릭 환경 설정
- **포괄적인 테스트 커버리지**: 주요 사용자 여정 전체 커버
- **현대적인 도구 활용**: Playwright의 최신 기능 활용

## 참고사항

> **보안상 실제 운영 환경의 계정 정보나 민감한 데이터는 포함되어 있지 않습니다.**
> 모든 테스트 데이터는 샘플 데이터로 구성되어 있으며, 실제 서비스 테스트 시에는 
> 적절한 환경 변수 설정이 필요합니다.

## 관련 기술

- **Playwright**: Microsoft에서 개발한 최신 E2E 테스트 도구
- **TypeScript**: 타입 안정성을 통한 코드 품질 향상
- **Page Object Model**: 테스트 코드의 재사용성과 유지보수성 향상 