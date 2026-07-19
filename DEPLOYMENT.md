# Deployment Guide - Coopvest Admin Dashboard

## Quick Deploy to Vercel

### Option 1: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd admin-dashboard
vercel

# For production deployment
vercel --prod
```

### Option 2: Via GitHub (Automatic Deploy)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
6. Click "Deploy"

## Environment Variables

Create a `.env.local` file for local development:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Get your Project URL and keys from Settings > API
4. Run the database migrations in `/backend/migrations/`

## Database Migrations

Run these migrations in your Supabase SQL editor:

1. `backend/migrations/007_payment_proofs.sql` - For payment proofs table
2. Apply any other migrations from the backend folder

## After Deployment

1. Add your production URL to Supabase Authentication > URL Configuration
2. Configure CORS if needed
3. Set up custom domain (optional)
