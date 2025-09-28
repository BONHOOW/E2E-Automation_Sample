# WW_E2E Playwright Test Project

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
```

Required environment variables:
- `BASE_URL`: Your test environment URL
- `USERNAME`: Test user username
- `PASSWORD`: Test user password
- `HEADLESS`: Browser headless mode (true/false)
- `SLOW_MO`: Browser slow motion in milliseconds

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/e2e/homeToCart.spec.ts

# Run with UI mode
npx playwright test --ui
```

## Project Structure
- `tests/e2e/`: E2E test files
- `pages/`: Page Object Model classes
- `data/`: Test data files
- `helpers/`: Helper functions 