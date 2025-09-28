@echo off
chcp 65001 >nul
echo ========================================
echo    E2E-Automation Playwright 프로젝트 설치
echo ========================================
echo.

:: Node.js 설치 확인
echo [1/5] Node.js 설치 확인 중...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo    https://nodejs.org 에서 Node.js를 설치해주세요.
    pause
    exit /b 1
)
echo ✅ Node.js 확인 완료
echo.

:: npm install
echo [2/5] npm 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install 실패
    pause
    exit /b 1
)
echo ✅ npm 의존성 설치 완료
echo.

:: Playwright 브라우저 설치
echo [3/5] Playwright 브라우저 설치 중...
call npx playwright install --with-deps
if %errorlevel% neq 0 (
    echo ❌ Playwright 브라우저 설치 실패
    pause
    exit /b 1
)
echo ✅ Playwright 브라우저 설치 완료
echo.

:: 환경 변수 파일 설정
echo [4/5] 환경 변수 파일 설정 중...
if exist .env (
    echo ⚠️  .env 파일이 이미 존재합니다.
    set /p choice="덮어쓰시겠습니까? (y/N): "
    if /i "%choice%"=="y" (
        copy .env.example .env >nul
        echo ✅ .env 파일이 업데이트되었습니다.
    ) else (
        echo ℹ️  기존 .env 파일을 유지합니다.
    )
) else (
    if exist .env.example (
        copy .env.example .env >nul
        echo ✅ .env 파일이 생성되었습니다.
    ) else (
        echo ⚠️  .env.example 파일이 없습니다.
    )
)
echo.

:: 설치 완료 메시지
echo [5/5] 설치 완료!
echo ========================================
echo ✅ 모든 설치가 완료되었습니다!
echo.
echo 📝 다음 단계:
echo    1. .env 파일을 열어서 환경 변수를 설정하세요
echo    2. npm run test 로 테스트를 실행해보세요
echo    3. npm run test:headed 로 브라우저에서 테스트를 확인하세요
echo.
echo 🚀 사용 가능한 명령어:
echo    npm run test          - 모든 테스트 실행
echo    npm run test:headed   - 브라우저에서 테스트 실행
echo    npm run test:report   - 테스트 리포트 보기
echo.
echo 💡 특정 국가만 테스트하려면:
echo    npx playwright test --project=AU
echo    npx playwright test --project=UK
echo    npx playwright test --project=FR
echo    npx playwright test --project=SG
echo ========================================
pause 