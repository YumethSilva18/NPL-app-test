@echo off
echo ========================================
echo NPL Predictor Backend Setup
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

echo [2/6] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/6] Checking environment file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ============================================
    echo IMPORTANT: Please edit .env file with your configuration
    echo Especially: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
    echo ============================================
    echo.
    pause
)
echo.

echo [4/6] Generating Prisma Client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo.

echo [5/6] Running database migrations...
call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo WARNING: Database migrations failed
    echo Make sure PostgreSQL is running and DATABASE_URL is correct
    echo.
)
echo.

echo [6/6] Seeding database...
call npm run prisma:seed
if %errorlevel% neq 0 (
    echo WARNING: Database seeding failed
    echo.
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server:
echo   npm run start:dev
echo.
echo To start with Docker:
echo   docker-compose up -d
echo.
echo API will be available at:
echo   http://localhost:8000/api
echo.
echo Swagger docs at:
echo   http://localhost:8000/api/docs
echo.
echo Default credentials:
echo   Admin: admin@nplpredictor.com / Admin123!
echo   Analyst: analyst@nplpredictor.com / Analyst123!
echo.
pause
