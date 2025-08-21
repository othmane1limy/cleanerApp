# Cleaning Marketplace Backend

Production-grade NestJS backend API for the cleaning services marketplace platform.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO WebSockets
- **Validation**: Zod schemas with class-validator
- **Security**: Helmet, CORS, rate limiting, RLS policies
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with supertest

## 🚀 Features

### Core Platform
- [x] Comprehensive Prisma schema with RLS support
- [x] JWT authentication with role-based access control
- [x] Real-time WebSocket communication
- [x] File upload handling with Sharp
- [x] Rate limiting and security middleware
- [x] Swagger API documentation
- [x] Health check endpoints

### Business Logic
- [ ] Wallet and commission system (20 free jobs → 7% commission)
- [ ] PayPal integration for cleaner recharges
- [ ] Fraud prevention and automated flagging
- [ ] Client confirmation requirements
- [ ] Dispute resolution system
- [ ] Admin dashboard with insights
- [ ] Email OTP verification
- [ ] Push notification system

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Or run migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed
```

### 4. Start Development Server
```bash
pnpm dev
```

The API will be available at `http://localhost:3001`
API Documentation at `http://localhost:3001/api/docs`

## 🗄️ Database Schema

### Core Tables
- **users**: User authentication and basic info
- **client_profiles**: Client-specific profile data
- **cleaner_profiles**: Cleaner business profiles
- **service_categories**: Service categorization
- **services**: Available service types
- **cleaner_services**: Cleaner's offered services with pricing
- **bookings**: Booking management with status tracking
- **reviews**: Client reviews and ratings

### Business Logic Tables
- **wallets**: Cleaner wallet balances
- **wallet_transactions**: All wallet operations
- **commissions**: Commission tracking
- **disputes**: Dispute resolution system
- **support_tickets**: Support system
- **fraud_flags**: Automated fraud detection

### Security Features
- **Row-Level Security (RLS)**: Database-level access control
- **Audit logs**: Complete operation tracking
- **Session management**: Secure token handling

## 🔐 Authentication & Authorization

### User Roles
- **CLIENT**: Can book services, leave reviews
- **CLEANER**: Can offer services, manage bookings, receive payments
- **ADMIN**: Can verify cleaners, resolve disputes, access all data

### JWT Implementation
- Access tokens: 15 minutes (short-lived)
- Refresh tokens: 7 days (stored in database)
- Role-based route protection
- Automatic token refresh

## 💰 Commission System

### Free Jobs Quota
- First 20 completed jobs per cleaner are commission-free
- Encourages platform adoption

### Commission Structure
- 7% commission on jobs after free quota
- Automatic deduction from cleaner wallet
- Debt tracking with configurable limits

### Wallet System
- Cleaners maintain wallet balance
- Online recharge via PayPal
- Automatic commission deduction
- Account blocking when debt exceeds threshold (-200 MAD default)

## 🔒 Security Features

### Database Security
- Row-Level Security (RLS) policies
- Prepared statements preventing SQL injection
- Connection pooling with proper limits

### API Security
- Helmet.js for security headers
- CORS with configurable origins
- Rate limiting (multiple tiers)
- Request validation with Zod
- Password hashing with Argon2id

### Business Logic Security
- Client confirmation required for job completion
- Fraud detection with automated flagging
- Dispute resolution system
- Audit logging for all operations

## 🎯 API Endpoints

### Authentication
```
POST /api/v1/auth/register/client
POST /api/v1/auth/register/cleaner  
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/verify-email
POST /api/v1/auth/logout
```

### Services
```
GET    /api/v1/services?lat=&lng=&radius=
GET    /api/v1/services/:id
POST   /api/v1/services (cleaner only)
PUT    /api/v1/services/:id (cleaner only)
DELETE /api/v1/services/:id (cleaner only)
```

### Bookings
```
GET    /api/v1/bookings
POST   /api/v1/bookings (client only)
PUT    /api/v1/bookings/:id/status (cleaner only)
POST   /api/v1/bookings/:id/confirm (client only)
GET    /api/v1/bookings/:id/track
```

### Payments
```
GET    /api/v1/payments/wallet (cleaner only)
POST   /api/v1/payments/recharge (cleaner only)
GET    /api/v1/payments/transactions
POST   /api/v1/payments/webhook/paypal
```

### Admin
```
GET    /api/v1/admin/dashboard
PUT    /api/v1/admin/cleaners/:id/verify
GET    /api/v1/admin/disputes
PUT    /api/v1/admin/disputes/:id/resolve
GET    /api/v1/admin/analytics
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests  
pnpm test:e2e

# Test coverage
pnpm test:cov

# Test watch mode
pnpm test:watch
```

## 🚀 Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- `DATABASE_URL`: Production PostgreSQL connection
- `JWT_SECRET`: Strong random secret
- `PAYPAL_CLIENT_ID/SECRET`: Production PayPal credentials
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- `SMTP_*`: Email service configuration

### Database Migration
```bash
pnpm db:migrate:deploy
```

### Build and Start
```bash
pnpm build
pnpm start:prod
```

### Health Checks
- Health: `GET /api/v1/health`
- Readiness: `GET /api/v1/health/ready`

## 📊 Monitoring & Logging

### Metrics
- Request/response times
- Database query performance
- JWT token usage
- WebSocket connections
- Commission calculations

### Error Handling
- Structured error responses
- Request ID tracking
- Audit trail logging
- Exception filters

## 🔧 Development

### Code Style
- ESLint + Prettier configuration
- Conventional commits
- TypeScript strict mode
- Comprehensive type safety

### Database Management
```bash
# View data
pnpm db:studio

# Reset database (development only)  
pnpm db:migrate:reset

# Generate new migration
pnpm db:migrate
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [API Documentation](http://localhost:3001/api/docs) (when running)
- [Project Architecture](../MIGRATION_PLAN.md)

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass
5. Create detailed commit messages
