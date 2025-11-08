# Railway Deployment Guide - Unified Full-Stack App

## Overview
This guide explains how to deploy both frontend (React) and backend (Node.js/Express) together on Railway as a single service.

## Architecture
- **Frontend**: React app built into static files
- **Backend**: Express server serves API routes + static React files
- **Database**: MongoDB Atlas (external)
- **Deployment**: Railway (single service)

## Deployment Steps

### 1. Prepare Your Repository

Ensure you have these files (already created):
- ✅ `railway.json` - Railway configuration
- ✅ `nixpacks.toml` - Build configuration
- ✅ `Procfile` - Start command
- ✅ `.env.production` - Production environment variables

### 2. Push to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Configure for unified Railway deployment"
git push origin main
```

### 3. Deploy to Railway

#### Option A: Deploy via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `DrivingSchool`
5. Railway will auto-detect the configuration

#### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Configure Environment Variables

In Railway Dashboard, go to your project → **Variables** and add:

#### Required Variables:
```bash
# Node Environment
NODE_ENV=production
PORT=5001

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d

# Client URL (your Railway app URL - will update after first deploy)
CLIENT_URL=https://your-app.up.railway.app

# Stripe Keys (Get from your Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Important Notes:**
- Copy actual values from your local `.env` files (don't commit them to Git!)
- For Stripe, get keys from: https://dashboard.stripe.com/apikeys
- For production, use Stripe LIVE keys (start with `sk_live_` and `pk_live_`)
- Keep these values secure and never commit them to version control

### 5. Get Your App URL

After deployment:
1. Railway assigns a URL like: `https://your-app.up.railway.app`
2. Copy this URL
3. Update the `CLIENT_URL` environment variable with this URL
4. Railway will auto-redeploy

### 6. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter: `https://your-app.up.railway.app/api/payment/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **webhook signing secret**
6. Update `STRIPE_WEBHOOK_SECRET` in Railway

## How It Works

### Build Process
1. Railway runs `npm run build:full`:
   - Builds React app → `build/` folder
   - Installs server dependencies
2. Creates production-ready bundle

### Runtime
1. Express server starts on port specified by Railway
2. API routes available at: `/api/*`
3. Static React files served for all other routes
4. React Router handles client-side routing

### Request Flow
```
https://your-app.up.railway.app/
  ↓
Express Server
  ↓
Is it /api/* ? → YES → API Route Handler
              → NO  → Serve React App (index.html)
```

## Testing

### Local Production Test
```bash
# Build the React app
npm run build

# Start server in production mode
npm run start:prod

# Test at http://localhost:5001
```

### After Railway Deployment
1. Visit: `https://your-app.up.railway.app`
2. Check homepage loads
3. Test API: `https://your-app.up.railway.app/api/health`
4. Test booking flow with Stripe payment

## Monitoring

### Railway Dashboard
- View deployment logs
- Monitor CPU/Memory usage
- Check build status
- View environment variables

### Check Logs
```bash
# Via Railway CLI
railway logs
```

## Troubleshooting

### Build Fails
**Issue**: Build command fails
**Solution**: Check Railway build logs. Common issues:
- Missing dependencies
- Build out of memory (upgrade Railway plan)
- Environment variables not set

### App Not Loading
**Issue**: White screen or errors
**Solution**:
- Check server logs: `railway logs`
- Verify `NODE_ENV=production` is set
- Ensure build folder exists

### API Routes Not Working
**Issue**: 404 on `/api/*` routes
**Solution**:
- Check route order in `server.js`
- API routes must be defined BEFORE static file serving
- Verify CORS settings

### Stripe Webhook Fails
**Issue**: Webhook signature verification failed
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure raw body parser is correctly configured
- Check webhook URL in Stripe dashboard

### Database Connection Failed
**Issue**: Cannot connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Test connection string locally

## Project Structure

```
driving-school-platform/
├── build/                    # React production build (generated)
├── public/                   # React public files
├── src/                      # React source code
├── server/
│   ├── src/
│   │   ├── server.js        # Express server (serves API + static files)
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── models/
│   └── package.json         # Server dependencies
├── package.json             # Root + React dependencies
├── railway.json             # Railway configuration
├── nixpacks.toml           # Build configuration
├── Procfile                # Start command
└── .env.production         # Production environment variables
```

## Commands Reference

```bash
# Local Development
npm start                    # Start React dev server (port 3000)
npm run server:dev          # Start Express dev server (port 5001)

# Production Build
npm run build               # Build React app
npm run build:full         # Build React + install server deps
npm run start:prod         # Start server in production mode

# Deployment
railway login              # Login to Railway
railway up                # Deploy to Railway
railway logs              # View logs
railway open              # Open app in browser
```

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | Your secret key |
| `CLIENT_URL` | Frontend URL | `https://app.railway.app` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |

## Security Checklist

- [ ] Switch to Stripe LIVE keys for production
- [ ] Use strong `JWT_SECRET` in production
- [ ] Configure MongoDB IP whitelist properly
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Review CORS settings
- [ ] Add rate limiting for API routes
- [ ] Set up monitoring and alerts

## Cost Estimation

**Railway Pricing:**
- Hobby Plan: $5/month
- Includes:
  - 500 hours execution time
  - 8GB RAM
  - 100GB bandwidth
  - Custom domain support

## Next Steps After Deployment

1. ✅ Verify app is live
2. ✅ Test all features
3. ✅ Configure custom domain (optional)
4. ✅ Set up Stripe webhook
5. ✅ Switch to Stripe live keys
6. ✅ Set up monitoring
7. ✅ Configure backup strategy

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Stripe Docs: https://stripe.com/docs

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] App URL received
- [ ] CLIENT_URL updated
- [ ] Stripe webhook configured
- [ ] Test payment completed
- [ ] All features tested
- [ ] Production ready! 🚀

---

**Last Updated**: 2025-01-08
**Deployment Type**: Unified Full-Stack (Frontend + Backend)
**Platform**: Railway
