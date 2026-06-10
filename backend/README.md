# NPL Predictor Backend API

Production-ready backend for the NPL (Non-Performing Loan) Risk Assessment Platform. Built with NestJS, TypeScript, PostgreSQL, and Prisma.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration & logging
│   ├── common/                 # Shared utilities
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Response & audit interceptors
│   │   ├── middleware/        # Request ID, logging
│   │   └── guards/            # Auth guards
│   ├── db/                    # Database module
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── modules/               # Feature modules
│       ├── health/            # Health checks
│       ├── auth/              # JWT authentication
│       ├── users/             # User management
│       ├── prediction/        # Core prediction logic
│       ├── history/           # Prediction history
│       ├── settings/          # System settings
│       ├── models/            # ML model integration
│       └── admin/             # Admin endpoints
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚀 Features

### Core Features
- ✅ **NPL Risk Prediction** - ML-powered credit risk assessment
- ✅ **Prediction History** - Full audit trail with filtering & pagination
- ✅ **JWT Authentication** - Secure token-based auth with refresh tokens
- ✅ **Role-Based Access Control** - Admin, Manager, Analyst, Viewer roles
- ✅ **Health Monitoring** - System health & ML model status
- ✅ **Settings Management** - Configurable thresholds & preferences

### Security Features
- 🔒 **Helmet.js** - Security headers
- 🔒 **Rate Limiting** - DDoS protection
- 🔒 **CORS** - Strict origin validation
- 🔒 **Input Validation** - class-validator on all inputs
- 🔒 **SQL Injection Protection** - Prisma parameterized queries
- 🔒 **Password Hashing** - bcrypt with configurable rounds
- 🔒 **Audit Logging** - Complete request/response audit trail

### Enterprise Features
- 📊 **Structured Logging** - Winston with daily rotation
- 📈 **Performance Monitoring** - Request tracking & metrics
- 🔄 **Database Transactions** - ACID compliance
- 🎯 **API Versioning** - URL-based versioning
- 📚 **Swagger Documentation** - Auto-generated API docs
- 🐳 **Docker Support** - Production-ready containers

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 14+
- npm or pnpm
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/npl_predictor?schema=public"
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- API: http://localhost:8000/api
- Swagger Docs: http://localhost:8000/api/docs
- Health Check: http://localhost:8000/health

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL + Redis + API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t npl-api:latest .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  npl-api:latest
```

## 📡 API Endpoints

### Health & Status
```
GET  /health                 # Basic health check
GET  /health/detailed        # Detailed system metrics
```

### Authentication
```
POST /api/auth/login         # User login
POST /api/auth/refresh       # Refresh access token
POST /api/auth/logout        # User logout
```

### Predictions
```
POST /api/predict            # Create NPL prediction
GET  /api/history            # Get prediction history (paginated)
GET  /api/history/:id        # Get prediction details
```

### Settings
```
GET  /api/settings           # Get all settings
PUT  /api/settings           # Update settings
```

### Admin
```
GET  /api/admin/models       # Get ML models
POST /api/admin/models/reload # Reload model config
GET  /api/admin/stats        # System statistics
```

## 🔐 Authentication

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@nplpredictor.com",
    "password": "Analyst123!"
  }'
```

### Use Token
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @prediction-request.json
```

## 📊 Database Schema

### Key Tables
- **users** - User accounts with RBAC
- **predictions** - NPL prediction records
- **refresh_tokens** - JWT refresh tokens
- **ml_models** - ML model registry
- **settings** - System configuration
- **audit_logs** - Complete audit trail
- **health_metrics** - System health history

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API port | `8000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Access token expiry | `1d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `BCRYPT_ROUNDS` | Password hash rounds | `12` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:5173` |
| `ML_SERVICE_URL` | ML service endpoint | `http://localhost:5000` |
| `ML_FALLBACK_ENABLED` | Enable rule-based fallback | `true` |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 ML Model Integration

The backend integrates with an external ML service via HTTP:

### Model Service Contract
```typescript
POST /predict
{
  "customer_id": "CUST-001",
  "credit_score": 680,
  "income": 85000,
  // ... other features
}

Response:
{
  "npl_probability": 0.23,
  "confidence": 0.87
}
```

### Fallback Logic
If the ML service is unavailable, the backend uses a rule-based fallback model to ensure high availability.

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Rotate JWT secrets regularly**
3. **Use strong passwords** (12+ chars, mixed case, numbers, symbols)
4. **Enable rate limiting** in production
5. **Use HTTPS** in production
6. **Regular security audits**
7. **Keep dependencies updated**

## 📝 Default Credentials

After running `npm run prisma:seed`:

```
Admin:
  Email: admin@nplpredictor.com
  Password: Admin123!

Analyst:
  Email: analyst@nplpredictor.com
  Password: Analyst123!
```

**⚠️ Change these in production!**

## 🚦 Production Checklist

- [ ] Change default passwords
- [ ] Set strong JWT secrets
- [ ] Configure production DATABASE_URL
- [ ] Enable HTTPS
- [ ] Set up log rotation
- [ ] Configure monitoring
- [ ] Set up backup strategy
- [ ] Review CORS settings
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update API documentation
4. Follow commit message conventions

## 📄 License

Proprietary - Internal use only

## 🆘 Support

For issues or questions, contact the development team.
