# Quick Deploy to Railway - 5 Steps

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

## Step 2: Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

## Step 3: Add Environment Variables
Copy these to Railway Dashboard → Variables:

```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Note**: Copy the actual values from your local `.env` files:
- `server/.env` for backend variables
- `.env` for frontend variables

## Step 4: Update CLIENT_URL
After first deploy:
1. Copy your Railway URL: `https://your-app.up.railway.app`
2. Add to Railway variables: `CLIENT_URL=https://your-app.up.railway.app`

## Step 5: Configure Stripe Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-app.up.railway.app/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret
5. Add to Railway: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Done! 🚀
Your app is live at: `https://your-app.up.railway.app`

## Test Payment
Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

For detailed guide, see: `RAILWAY_DEPLOYMENT.md`
