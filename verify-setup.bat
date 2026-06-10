@echo off
REM NPL Predictor - Setup Verification Script
REM This script verifies that everything is properly configured

echo ========================================
echo NPL Predictor - Setup Verification
echo ========================================
echo.

REM Check Node.js
echo [1/8] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
) else (
    node --version
    echo [OK] Node.js is installed
)
echo.

REM Check npm
echo [2/8] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
) else (
    npm --version
    echo [OK] npm is installed
)
echo.

REM Check PostgreSQL
echo [3/8] Checking PostgreSQL installation...
psql --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] PostgreSQL command not found in PATH
    echo Make sure PostgreSQL is installed and running
) else (
    psql --version
    echo [OK] PostgreSQL is installed
)
echo.

REM Check Backend Directory
echo [4/8] Checking backend directory...
if exist "backend\package.json" (
    echo [OK] Backend directory found
) else (
    echo [ERROR] Backend directory not found!
    pause
    exit /b 1
)
echo.

REM Check Backend Dependencies
echo [5/8] Checking backend dependencies...
if exist "backend\node_modules" (
    echo [OK] Backend dependencies are installed
) else (
    echo [WARNING] Backend dependencies not installed
    echo Run: cd backend ^&^& npm install
)
echo.

REM Check Frontend Directory
echo [6/8] Checking frontend directory...
if exist "frontend (2)\package.json" (
    echo [OK] Frontend directory found
) else (
    echo [ERROR] Frontend directory not found!
    pause
    exit /b 1
)
echo.

REM Check Frontend Dependencies
echo [7/8] Checking frontend dependencies...
if exist "frontend (2)\node_modules" (
    echo [OK] Frontend dependencies are installed
) else (
    echo [WARNING] Frontend dependencies not installed
    echo Run: cd "frontend (2)" ^&^& npm install
)
echo.

REM Check Backend .env
echo [8/8] Checking backend configuration...
if exist "backend\.env" (
    echo [OK] Backend .env file exists
) else (
    echo [WARNING] Backend .env file not found
    echo Run: cd backend ^&^& copy .env.example .env
    echo Then edit .env with your configuration
)
echo.

echo ========================================
echo Verification Summary
echo ========================================
echo.
echo Next Steps:
echo 1. If any dependencies are missing, install them
echo 2. Configure backend\.env file
echo 3. Run database migrations: cd backend ^&^& npm run prisma:migrate
echo 4. Seed database: cd backend ^&^& npm run prisma:seed
echo 5. Start backend: cd backend ^&^& npm run start:dev
echo 6. Start frontend: cd "frontend (2)" ^&^& npm run dev
echo.
echo For detailed instructions, see INTEGRATION_GUIDE.md
echo.

pause
