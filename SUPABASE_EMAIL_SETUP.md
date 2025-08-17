# Supabase Email Verification Setup Guide

## Problem Description
Users are getting stuck in "waiting for verification" status even after clicking the email verification link.

## Root Causes
1. **Email confirmation settings** not properly configured in Supabase
2. **Email templates** not set up correctly
3. **Redirect URLs** not configured properly
4. **Email confirmation flow** not handling the verification correctly

## Solution Steps

### 1. Configure Email Confirmation Settings

Go to your Supabase Dashboard → Authentication → Settings:

**Enable Email Confirmations:**
- ✅ Check "Enable email confirmations"
- ✅ Check "Double confirm changes"

**Email Template Settings:**
- Set "Confirm signup" template
- Set "Confirm signup" redirect URL to: `https://your-domain.com/verify-email?token={{token_hash}}&type=signup`

### 2. Update Email Templates

**Confirm Signup Template:**
```html
<h2>Confirm your signup</h2>
<p>Hi {{ .Email }},</p>
<p>Please confirm your signup by clicking the link below:</p>
<a href="{{ .ConfirmationURL }}">Confirm your signup</a>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Thanks,<br>CleanFinder Team</p>
```

### 3. Configure Redirect URLs

**Add these URLs to your Supabase project:**
- `http://localhost:4028/verify-email` (for development)
- `https://your-domain.com/verify-email` (for production)

### 4. Update Environment Variables

Make sure your `.env` file includes:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Test the Flow

1. **Register a new user**
2. **Check email** for verification link
3. **Click the link** - should redirect to `/verify-email`
4. **Verify the token** - should update user status
5. **Login** - should work after verification

## Troubleshooting

### If users still show "waiting for verification":

1. **Check Supabase logs** in Authentication → Logs
2. **Verify email template** is sending correctly
3. **Check redirect URL** in email template
4. **Test with a fresh user** account

### If verification link doesn't work:

1. **Check the token** in the URL
2. **Verify the route** `/verify-email` exists
3. **Check browser console** for errors
4. **Verify Supabase client** configuration

### If profile creation fails:

1. **Check RLS policies** in database
2. **Verify table structure** matches schema
3. **Check user permissions** in Supabase

## Expected Flow

1. **User registers** → Account created, email sent
2. **User clicks email link** → Redirected to `/verify-email`
3. **Token verified** → User status updated to "confirmed"
4. **Profile created** → User can now login and access app
5. **User logs in** → Redirected to appropriate dashboard

## Important Notes

- **Email verification is required** for security
- **Users cannot login** until email is verified
- **Profile creation** happens after email verification
- **Redirect URLs** must match exactly
- **Email templates** must include proper confirmation URLs

## Testing

Use the test script to verify:
1. **Environment variables** are loaded
2. **Supabase connection** works
3. **Tables exist** and are accessible
4. **Auth methods** are available

Run: `http://localhost:4028/test-supabase`
