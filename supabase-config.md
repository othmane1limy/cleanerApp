# Supabase Configuration Setup

## Environment Variables Required

To fix the authentication issues, you need to create a `.env` file in your project root with the following variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How to Get These Values

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the "Project URL" and paste it as `VITE_SUPABASE_URL`
5. Copy the "anon public" key and paste it as `VITE_SUPABASE_ANON_KEY`

## Example .env File

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Important Notes

- The `.env` file should be in your project root (same level as `package.json`)
- Never commit the `.env` file to version control
- Restart your development server after adding the `.env` file
- Make sure your Supabase project has the correct database schema applied
