# CleanFinder - Car Cleaning Service App

A modern car cleaning service booking application built with React, Supabase, and Tailwind CSS.

## Features

- 🔐 **User Authentication**: Login and signup for clients and cleaners
- 🗺️ **Service Discovery**: Map and list views for finding cleaners
- 📱 **Mobile & Garage Services**: Support for both mobile and fixed-location services
- ⭐ **Reviews & Ratings**: Customer feedback system
- 📅 **Booking Management**: Complete booking workflow
- 🌍 **Multi-language Support**: French and Arabic
- 📍 **Location Services**: GPS-based cleaner discovery

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cleanerApp-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > API
3. Copy your Project URL and anon public key

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Database Setup

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL commands to create all tables and policies

### 6. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:4028`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── lib/               # External service integrations
├── pages/             # Application pages
├── styles/            # Global styles and Tailwind
└── utils/             # Utility functions
```

## Authentication Flow

### User Types
- **Clients**: Can book cleaning services
- **Cleaners**: Can offer services and manage bookings

### Registration Process
1. User selects account type (client/cleaner)
2. Fills in required information
3. Account created in Supabase Auth
4. Profile created in respective table
5. User redirected to login

### Login Process
1. User enters email/password
2. Supabase authenticates credentials
3. User redirected based on type:
   - Clients → Home page
   - Cleaners → Dashboard

## Troubleshooting

### Common Issues

1. **"Database Error" during login/signup**
   - Check environment variables are set correctly
   - Verify database schema is applied
   - Restart development server

2. **Cannot add users manually in Supabase**
   - Check RLS policies are configured
   - Verify foreign key relationships

3. **Authentication not working**
   - Run the test script: `test-supabase.js`
   - Check browser console for errors
   - Verify Supabase project settings

### Testing Authentication

Use the test script in your browser console:

```javascript
// Copy and paste the contents of test-supabase.js
// This will help diagnose connection issues
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling

## Database Schema

The app uses the following main tables:

- `auth.users` - User authentication (managed by Supabase)
- `client_profiles` - Client information
- `cleaner_profiles` - Cleaner information
- `cleaner_services` - Services offered by cleaners
- `bookings` - Service bookings
- `reviews` - Customer reviews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:

1. Check the troubleshooting guide
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment configuration

## License

This project is licensed under the MIT License.
