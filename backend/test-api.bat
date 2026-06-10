@echo off
echo ========================================
echo NPL Predictor API Test Suite
echo ========================================
echo.
echo Make sure the backend is running on http://localhost:8000
echo.
pause

echo [1] Testing Health Endpoint...
curl -s http://localhost:8000/health
echo.
echo.

echo [2] Testing Detailed Health...
curl -s http://localhost:8000/health/detailed
echo.
echo.

echo [3] Testing Login...
curl -s -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"analyst@nplpredictor.com\",\"password\":\"Analyst123!\"}" ^
  > token.json
type token.json
echo.
echo.

echo [4] Testing Prediction (Sample Data)...
curl -s -X POST http://localhost:8000/api/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"customer_id\":\"CUST-TEST-001\",\"credit_score\":720,\"income\":95000,\"loan_amount\":250000,\"loan_term\":360,\"employment_years\":8,\"debt_to_income_ratio\":0.32,\"loan_to_value_ratio\":0.80,\"interest_rate\":4.75,\"payment_history_score\":88,\"previous_defaults\":0,\"age\":35,\"collateral_value\":312500,\"account_age\":96,\"utilization_ratio\":0.35,\"monthly_installment\":1304}"
echo.
echo.

echo [5] Testing History...
curl -s http://localhost:8000/api/history
echo.
echo.

echo [6] Testing Settings...
curl -s http://localhost:8000/api/settings
echo.
echo.

echo [7] Testing API Documentation...
echo Opening Swagger docs in browser...
start http://localhost:8000/api/docs
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Check the responses above to verify everything is working.
echo.
pause
