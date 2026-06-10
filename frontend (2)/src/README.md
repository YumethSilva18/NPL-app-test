

# NPL Predictor AI Dashboard

A professional, enterprise-grade banking dashboard for AI-powered Non-Performing Loan (NPL) risk assessment.

## Features

### Core Functionality
- **Risk Assessment**: Comprehensive loan application evaluation with 16 banking-specific fields
- **Prediction History**: Filterable table with search, risk level, and decision filters
- **System Status**: Real-time API health monitoring and model performance metrics
- **Settings**: Configurable risk thresholds and notification preferences

### Professional Features
- **Decision Hints**: Approve, Review, Escalate, Decline recommendations
- **Toast Notifications**: Success, error, and info feedback
- **Export Functionality**: CSV and JSON export for predictions and history
- **Prediction Details Modal**: Full breakdown of assessment with score details
- **Real-time Health Monitoring**: API response time and system status

### UI/UX
- **Sidebar Navigation**: Persistent navigation with 4 main sections
- **Dark Theme**: Premium banking-grade dark interface
- **Responsive Design**: Works on desktop and mobile
- **Professional Typography**: Inter font with clear hierarchy
- **Color-coded Risk Levels**: Green (Low), Amber (Medium), Red (High)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Backend**: FastAPI (Python)

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ with FastAPI backend running

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend Setup

Ensure your FastAPI backend is running at `http://127.0.0.1:8000` with the following endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/predict` - Prediction endpoint

### Expected API Schema

**Request (POST /api/predict):**
```json
{
  "customer_id": "CUST-2024-001",
  "credit_score": 680,
  "income": 85000,
  "loan_amount": 320000,
  "loan_term": 360,
  "employment_years": 7,
  "debt_to_income_ratio": 0.38,
  "loan_to_value_ratio": 0.85,
  "interest_rate": 5.25,
  "payment_history_score": 82,
  "previous_defaults": 0,
  "age": 38,
  "collateral_value": 376000,
  "account_age": 84,
  "utilization_ratio": 0.42,
  "monthly_installment": 1765
}
```

**Response:**
```json
{
  "npl_probability": 0.23,
  "risk_level": "Medium",
  "confidence": 0.89,
  "recommendation": "Review application carefully. Moderate risk indicators present."
}
```

**Health Check Response (GET /api/health):**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "v1.0.0"
}
```

## CORS Configuration

Add CORS middleware to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── PredictionForm.tsx
│   │   │   └── InputField.tsx
│   │   ├── history/
│   │   │   ├── HistoryTable.tsx
│   │   │   └── HistoryFilters.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatCard.tsx
│   │   ├── results/
│   │   │   ├── ResultPanel.tsx
│   │   │   └── PredictionDetailModal.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Toast.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── StatusPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── prediction.ts
│   └── App.tsx
├── index.css
├── package.json
└── README.md
```

## Key Components

### Dashboard
Main view with risk assessment form and result panel. Displays real-time predictions with decision hints.

### History
Filterable table of past predictions with search, risk level, and decision filters. Includes CSV export functionality.

### System Status
Real-time API health monitoring, model information, activity logs, and performance metrics.

### Settings
Configuration for API endpoints, risk thresholds, and notification preferences.

## Demo Data

Some features use demo data clearly marked with "Demo Data" badges:
- Prediction history entries
- Model training date and accuracy
- Performance metrics in status page

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

1. Update `API_BASE_URL` in `src/services/api.ts` to your production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Ensure backend CORS allows your production domain

## License

Proprietary - Internal Banking Use Only

## Support

For issues or questions, contact the development team.

