# NPL Predictor Backend - Architecture Documentation

## 🏛️ System Architecture

### High-Level Overview

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST
         │ JSON (snake_case)
         ↓
┌─────────────────────────────────────────┐
│         NestJS Backend API              │
│         (Port 8000)                     │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   API Gateway Layer              │  │
│  │  - CORS, Helmet, Compression     │  │
│  │  - Rate Limiting                 │  │
│  │  - Request ID Generation         │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Authentication & Authorization │  │
│  │  - JWT Strategy                  │  │
│  │  - RBAC Guards                   │  │
│  │  - Refresh Token Management      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Business Logic Modules         │  │
│  │  - Prediction Service            │  │
│  │  - History Service               │  │
│  │  - Settings Service              │  │
│  │  - User Service                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   ML Integration Layer           │  │
│  │  - Model Service                 │  │
│  │  - Preprocessing                 │  │
│  │  - Postprocessing                │  │
│  │  - Fallback Logic                │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Data Access Layer              │  │
│  │  - Prisma ORM                    │  │
│  │  - Repository Pattern            │  │
│  │  - Transaction Management        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │                    │
         ↓                    ↓
┌──────────────┐    ┌──────────────────┐
│  PostgreSQL  │    │   ML Service     │
│  (Port 5432) │    │   (Port 5000)    │
│              │    │   Python/FastAPI │
└──────────────┘    └──────────────────┘
```

## 📂 Directory Structure

```
backend/
├── src/
│   ├── main.ts                          # Application bootstrap
│   ├── app.module.ts                    # Root module
│   │
│   ├── config/                          # Configuration
│   │   ├── env.validation.ts            # Environment validation
│   │   ├── logger.service.ts            # Winston logger
│   │   └── constants.ts                 # App constants
│   │
│   ├── common/                          # Shared code
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global error handler
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts # Response wrapper
│   │   │   └── audit.interceptor.ts     # Audit logging
│   │   ├── middleware/
│   │   │   ├── request-id.middleware.ts # Request tracking
│   │   │   └── logger.middleware.ts     # HTTP logging
│   │   ├── guards/
│   │   │   └── roles.guard.ts           # RBAC guard
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts      # Skip auth
│   │   │   └── roles.decorator.ts       # Required roles
│   │   └── utils/
│   │       └── case-converter.ts        # snake_case ↔ camelCase
│   │
│   ├── db/                              # Database
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts            # Prisma client wrapper
│   │
│   ├── modules/                         # Feature modules
│   │   │
│   │   ├── health/                      # Health checks
│   │   │   ├── health.module.ts
│   │   │   ├── health.controller.ts
│   │   │   ├── health.service.ts
│   │   │   └── dto/
│   │   │       └── health-response.dto.ts
│   │   │
│   │   ├── auth/                        # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts      # JWT validation
│   │   │   │   └── local.strategy.ts    # Login validation
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   │
│   │   ├── users/                       # User management
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts         # CRUD operations
│   │   │
│   │   ├── prediction/                  # Core prediction
│   │   │   ├── prediction.module.ts
│   │   │   ├── prediction.controller.ts
│   │   │   ├── prediction.service.ts    # Business logic
│   │   │   ├── prediction.repository.ts # Data access
│   │   │   └── dto/
│   │   │       ├── prediction-request.dto.ts
│   │   │       └── prediction-response.dto.ts
│   │   │
│   │   ├── history/                     # Prediction history
│   │   │   ├── history.module.ts
│   │   │   ├── history.controller.ts
│   │   │   ├── history.service.ts
│   │   │   └── dto/
│   │   │       ├── history-query.dto.ts
│   │   │       └── prediction-history.dto.ts
│   │   │
│   │   ├── settings/                    # System settings
│   │   │   ├── settings.module.ts
│   │   │   ├── settings.controller.ts
│   │   │   ├── settings.service.ts
│   │   │   └── dto/
│   │   │       └── update-settings.dto.ts
│   │   │
│   │   ├── models/                      # ML integration
│   │   │   ├── models.module.ts
│   │   │   └── model.service.ts         # ML service client
│   │   │
│   │   └── admin/                       # Admin operations
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   │
│   └── integrations/                    # External services (future)
│       ├── ml/                          # ML service integration
│       ├── bank/                        # Core banking integration
│       └── reporting/                   # CBSL reporting
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   ├── migrations/                      # Migration history
│   └── seed.ts                          # Database seeding
│
├── test/                                # E2E tests
├── logs/                                # Application logs
├── .env.example                         # Environment template
├── Dockerfile                           # Production image
├── docker-compose.yml                   # Local development
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 🔄 Request Flow

### Prediction Request Flow

```
1. Frontend → POST /api/predict
   ↓
2. Request ID Middleware (generates UUID)
   ↓
3. Logger Middleware (logs request)
   ↓
4. CORS Middleware (validates origin)
   ↓
5. Rate Limit Guard (checks limits)
   ↓
6. JWT Auth Guard (validates token) [OPTIONAL - currently disabled]
   ↓
7. Validation Pipe (validates DTO)
   ↓
8. PredictionController.predict()
   ↓
9. PredictionService.createPrediction()
   ├─→ Preprocessing (feature engineering)
   ├─→ ModelService.predict()
   │   ├─→ HTTP call to ML service
   │   └─→ Fallback if service unavailable
   ├─→ Postprocessing (business rules)
   └─→ PredictionRepository.create()
       └─→ Prisma (save to PostgreSQL)
   ↓
10. Transform Interceptor (wrap response)
    ↓
11. Audit Interceptor (log to audit_logs)
    ↓
12. Response → Frontend (JSON snake_case)
```

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────┐
│  Login  │
│ Request │
└────┬────┘
     │
     ↓
┌────────────────────┐
│  Local Strategy    │
│  - Validate email  │
│  - Check password  │
│  - Check isActive  │
└────┬───────────────┘
     │
     ↓ (if valid)
┌────────────────────┐
│  JWT Generation    │
│  - Access Token    │
│  - Refresh Token   │
└────┬───────────────┘
     │
     ↓
┌────────────────────┐
│  Store in DB       │
│  - refresh_tokens  │
│  - Update lastLogin│
└────┬───────────────┘
     │
     ↓
┌────────────────────┐
│  Return to Client  │
│  - access_token    │
│  - refresh_token   │
│  - user info       │
└────────────────────┘
```

### Authorization Layers

1. **Route Level**: `@UseGuards(JwtAuthGuard)`
2. **Role Level**: `@Roles('admin', 'manager')`
3. **Resource Level**: User owns resource check
4. **Field Level**: Sensitive data filtering

## 🗄️ Database Design

### Entity Relationships

```
┌──────────┐         ┌────────────────┐         ┌──────────────┐
│  User    │1      N│  Prediction    │1      N│  AuditLog    │
│          │◄────────┤                │◄────────┤              │
│  - id    │         │  - id          │         │  - id        │
│  - email │         │  - userId      │         │  - userId    │
│  - role  │         │  - customerId  │         │  - action    │
└──────────┘         │  - riskLevel   │         │  - resource  │
     │               └────────────────┘         └──────────────┘
     │1
     │
     │N
┌──────────────┐
│RefreshToken  │
│              │
│  - id        │
│  - token     │
│  - userId    │
│  - expiresAt │
└──────────────┘
```

### Key Tables

**users** - Authentication & RBAC
- Stores hashed passwords (bcrypt)
- Role-based access control
- Active/inactive status
- Last login tracking

**predictions** - Core business data
- Complete input features
- Model outputs (probability, risk, confidence)
- Audit trail (userId, timestamps)
- Score breakdown (JSON)

**refresh_tokens** - JWT refresh
- One-to-many with users
- Expiration tracking
- Revocation support

**audit_logs** - Security & compliance
- Every sensitive action
- IP, user agent, request ID
- Sanitized request/response

**settings** - Configuration
- Key-value store
- Category grouping
- Versioning support

**ml_models** - Model registry
- Version tracking
- Metadata & metrics
- Active/production flags

## 🔌 ML Integration Design

### Model Service Interface

```typescript
interface IModelService {
  predict(input: PredictionInput): Promise<PredictionOutput>;
  getMetadata(): Promise<ModelMetadata>;
  healthCheck(): Promise<boolean>;
}
```

### Integration Patterns

**1. HTTP Client Pattern** (Current)
```
Backend → HTTP POST → ML Service (Python)
       ← JSON Response ←
```

**2. Message Queue Pattern** (Future)
```
Backend → Message → Queue → ML Worker
       ← Async Response ← Callback
```

**3. Embedded Model Pattern** (Alternative)
```
Backend → ONNX Runtime → Model
       ← Direct Response
```

### Fallback Strategy

```
try {
  result = await mlService.predict(data);
} catch (error) {
  if (fallbackEnabled) {
    result = ruleBasedPredict(data);
    result.warning = 'Using fallback model';
  } else {
    throw ServiceUnavailableException;
  }
}
```

## 📊 Monitoring & Observability

### Logging Strategy

```
┌──────────────────┐
│  Winston Logger  │
├──────────────────┤
│  Console         │ → Development
│  Daily Rotate    │ → Production logs
│  Error Stream    │ → Error-only logs
│  Exception       │ → Uncaught errors
│  Rejection       │ → Promise rejections
└──────────────────┘
```

### Log Levels
- **error**: System failures, exceptions
- **warn**: Degraded service, fallbacks
- **info**: Business events, requests
- **debug**: Detailed debugging (dev only)

### Audit Trail
- All `/api/predict` requests
- All `/api/auth/*` requests
- All `/api/settings` updates
- All `/api/admin/*` actions

## 🚀 Deployment Architecture

### Development
```
localhost:5173 (Frontend)
localhost:8000 (Backend API)
localhost:5432 (PostgreSQL)
localhost:5000 (ML Service)
```

### Production
```
┌──────────────────┐
│  Load Balancer   │
│  (Nginx/Traefik) │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌─────────┐ ┌─────────┐
│ API #1  │ │ API #2  │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ↓
    ┌────────────┐
    │ PostgreSQL │
    │  (Primary) │
    └─────┬──────┘
          │
    ┌─────┴──────┐
    │ PostgreSQL │
    │ (Replica)  │
    └────────────┘
```

## 🔮 Future Enhancements

### Phase 2 - Advanced Features
- [ ] Multi-model ensemble predictions
- [ ] Real-time model retraining triggers
- [ ] Prediction explanation (SHAP values)
- [ ] Batch prediction API
- [ ] WebSocket for live updates

### Phase 3 - Enterprise Integration
- [ ] Core banking system integration
- [ ] CBSL reporting automation
- [ ] Document processing (OCR)
- [ ] Mobile app backend support
- [ ] Multi-tenancy support

### Phase 4 - AI Enhancement
- [ ] Conversational AI interface
- [ ] Automated recovery recommendations
- [ ] Risk trend analysis
- [ ] Predictive alerts
- [ ] Custom model training

## 📈 Performance Considerations

### Database Optimization
- Indexes on frequently queried fields
- Connection pooling (Prisma)
- Query result caching (Redis)
- Pagination on large result sets

### API Optimization
- Response compression (gzip)
- HTTP/2 support
- Rate limiting per user/IP
- Request timeout handling

### Scalability
- Horizontal scaling (stateless design)
- Database read replicas
- Async job queues (Bull/Redis)
- CDN for static assets

## 🛡️ Security Hardening

### Production Checklist
- ✅ Environment variables (no hardcoded secrets)
- ✅ HTTPS only (redirect HTTP)
- ✅ Helmet.js security headers
- ✅ CORS whitelist
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ JWT expiration
- ✅ Refresh token rotation
- ✅ Audit logging
- ✅ Error message sanitization

### Compliance
- GDPR: Personal data encryption
- PCI-DSS: Financial data security
- SOC 2: Audit trail completeness
- ISO 27001: Security controls

## 📚 API Documentation

Auto-generated Swagger/OpenAPI documentation available at:
```
http://localhost:8000/api/docs
```

### API Design Principles
1. RESTful conventions
2. snake_case for external API
3. camelCase for internal code
4. Versioned endpoints (/api/v1)
5. Consistent error responses
6. Pagination for lists
7. Filter/sort/search support

## 🤝 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Meaningful variable names
- Single responsibility principle

### Testing Strategy
- Unit tests for services
- Integration tests for repositories
- E2E tests for critical flows
- 80%+ code coverage target

### Git Workflow
- Feature branches
- Pull request reviews
- CI/CD pipeline
- Semantic versioning

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Maintainer**: NPL Predictor Team
