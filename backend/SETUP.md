# Backend Setup Guide

This guide will help you set up the production-grade NestJS backend for the cleaning marketplace platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cleaning_marketplace?schema=public"

# JWT Secrets (generate strong secrets!)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-different-from-access"

# Email Configuration (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@cleaningmarketplace.com"

# Other required settings
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Apply database schema
pnpm db:push

# Run migrations (alternative to db:push)
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

## 📚 Database Setup Details

### PostgreSQL Installation

#### Option 1: Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run --name cleaning-postgres \
  -e POSTGRES_USER=cleaning_user \
  -e POSTGRES_PASSWORD=cleaning_pass \
  -e POSTGRES_DB=cleaning_marketplace \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL would be:
# postgresql://cleaning_user:cleaning_pass@localhost:5432/cleaning_marketplace?schema=public
```

#### Option 2: Local Installation
- Install PostgreSQL 14+ on your system
- Create database: `CREATE DATABASE cleaning_marketplace;`
- Create user with appropriate permissions

### Row-Level Security (RLS)

Our database uses PostgreSQL's Row-Level Security for data protection:

```sql
-- RLS is automatically enabled on all tables
-- Policies restrict data access based on user context
-- System operations use elevated privileges when needed
```

The RLS policies ensure:
- Users can only access their own data
- Cleaners can only manage their own services
- Clients can only see active services
- Admins have full access
- System operations can bypass restrictions

## 🔐 Authentication System

### Features Implemented

✅ **Complete JWT Authentication**
- Access tokens (15 min) + Refresh tokens (7 days)
- Secure token storage in database
- Automatic token rotation

✅ **Email Verification**
- 6-digit OTP codes
- 10-minute expiration
- HTML + text email templates

✅ **Role-Based Access Control**
- CLIENT, CLEANER, ADMIN roles
- Guard-protected endpoints
- RLS policy enforcement

✅ **Security Best Practices**
- Argon2id password hashing
- Rate limiting on auth endpoints
- Session management
- Audit logging

### API Endpoints

```bash
# Registration
POST /api/v1/auth/register/client
POST /api/v1/auth/register/cleaner

# Authentication
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout

# Email Verification
POST /api/v1/auth/verify-email
POST /api/v1/auth/resend-verification
```

### Example Usage

#### Register a Client
```bash
curl -X POST http://localhost:3001/api/v1/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+212600000000"
  }'
```

#### Register a Cleaner
```bash
curl -X POST http://localhost:3001/api/v1/auth/register/cleaner \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cleaner@example.com",
    "password": "securepassword123",
    "businessName": "Clean Pro Services",
    "bio": "Professional cleaning service with 5 years experience"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "securepassword123"
  }'
```

## 🛠️ Development Tools

### Database Management
```bash
# View database in browser
pnpm db:studio

# Reset database (development only)
pnpm db:migrate:reset

# Create new migration
pnpm db:migrate
```

### Code Quality
```bash
# Linting
pnpm lint

# Formatting
pnpm format

# Type checking
pnpm typecheck
```

### Testing
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🔍 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Prisma client errors**
   - Run `pnpm db:generate` after schema changes
   - Restart TypeScript server in your editor

3. **Email sending failures**
   - Verify SMTP credentials
   - Check Gmail app passwords if using Gmail
   - Test with a service like Mailtrap for development

4. **TypeScript errors**
   - Install dependencies: `pnpm install`
   - Generate Prisma client: `pnpm db:generate`
   - Restart TypeScript server

### Environment Variables Checklist

- [ ] DATABASE_URL (PostgreSQL connection)
- [ ] JWT_SECRET (strong random string)
- [ ] JWT_REFRESH_SECRET (different from JWT_SECRET)
- [ ] SMTP_* (email configuration)
- [ ] GOOGLE_MAPS_API_KEY (for geolocation)
- [ ] PAYPAL_* (for payments)

## 📈 Performance Considerations

### Database Indexes
Our schema includes optimized indexes for:
- User lookups by email
- Service discovery by location
- Booking queries by user and status
- Real-time location updates

### Caching Strategy
- JWT tokens cached in memory
- Database query result caching ready
- Session storage optimization

### Rate Limiting
- Authentication endpoints: 3-5 requests per 5 minutes
- Token refresh: 10 requests per 5 minutes
- General API: 100 requests per 15 minutes

## 🔒 Security Features

### Data Protection
- Row-Level Security at database level
- Input validation with Zod schemas
- SQL injection prevention with Prisma
- XSS protection with Helmet

### Authentication Security
- Secure password hashing (Argon2id)
- JWT with short-lived access tokens
- Refresh token rotation
- Session management with revocation

### Audit Trail
- All user actions logged
- Authentication events tracked
- Database changes recorded
- Admin activity monitoring

## 📊 Monitoring & Logging

### Health Checks
- `GET /api/v1/health` - Basic health status
- `GET /api/v1/health/ready` - Readiness probe

### Logging
- Structured JSON logs
- Request/response tracking
- Error reporting with context
- Performance metrics collection

## 🚀 Production Deployment

### Environment Setup
1. Set NODE_ENV=production
2. Use strong JWT secrets
3. Configure production database
4. Set up email service (SendGrid, etc.)
5. Configure CORS for your domain

### Database Migration
```bash
pnpm db:migrate:deploy
```

### Build and Start
```bash
pnpm build
pnpm start:prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 🎯 Next Steps

Phase 2 Authentication System is now complete! 

**Ready for Phase 3:**
- User Management Module
- Service Catalog System
- Booking Flow Implementation
- Payment & Wallet System

**To continue development:**
1. Install dependencies and set up database
2. Test authentication endpoints
3. Implement user management features
4. Build service catalog
