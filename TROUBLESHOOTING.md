# Troubleshooting Guide for CleanFinder App

## Authentication Issues

### 1. Database Error When Testing Login/Signup

**Problem**: Supabase returns database errors during authentication
**Root Cause**: Missing environment variables and database schema issues

**Solution**:
1. Create a `.env` file in your project root with:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Get these values from your Supabase dashboard:
   - Go to Settings > API
   - Copy "Project URL" and "anon public" key

3. Restart your development server after adding the `.env` file

### 2. Cannot Add Users Manually in Supabase Auth

**Problem**: Manual user creation fails in Supabase dashboard
**Root Cause**: RLS policies and foreign key constraints

**Solution**:
1. Apply the updated database schema from `supabase-schema.sql`
2. Check that all tables have proper RLS policies
3. Verify foreign key relationships are correct

### 3. Database Schema Issues

**Problem**: Foreign key constraint violations
**Root Cause**: Incorrect column references in RLS policies

**Solution**:
The schema has been updated to fix:
- RLS policies for `cleaner_services` and `cleaner_images`
- Proper foreign key relationships
- Consistent column naming

## Database Setup Steps

### 1. Create Tables
Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor

### 2. Enable RLS
All tables have RLS enabled with appropriate policies

### 3. Create Indexes
Performance indexes are created for better query performance

### 4. Set Up Triggers
Automatic timestamp updates are configured

## Common Error Messages and Solutions

### "relation does not exist"
- Ensure all tables are created from the schema
- Check table names match exactly

### "foreign key constraint violation"
- Verify RLS policies allow the operation
- Check that referenced records exist

### "permission denied"
- RLS policies are blocking the operation
- Check user authentication status
- Verify policy conditions

## Testing Authentication

### 1. Test User Registration
```javascript
// Test with a simple user
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  userType: 'client',
  userData: {
    first_name: 'Test',
    last_name: 'User',
    phone: '+1234567890'
  }
}
```

### 2. Test User Login
```javascript
// Test login with created user
const loginResult = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password123'
})
```

### 3. Check Database Records
- Verify user appears in `auth.users`
- Check profile record in `client_profiles` or `cleaner_profiles`

## Environment Setup Checklist

- [ ] `.env` file created with Supabase credentials
- [ ] Development server restarted
- [ ] Database schema applied
- [ ] RLS policies configured
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Profile creation works

## Support

If issues persist:
1. Check Supabase logs in dashboard
2. Verify environment variables are loaded
3. Test with a fresh database
4. Check browser console for errors
