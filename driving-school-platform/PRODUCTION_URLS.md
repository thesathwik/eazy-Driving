# Production Deployment URLs

## Frontend (Vercel)
**Production URL:** https://driving-school-platform-fno5m5nmx-thesathwiks-projects.vercel.app

**Alternative URLs** (all point to the same deployment):
- https://driving-school-platform-dx17bjit3-thesathwiks-projects.vercel.app
- https://driving-school-platform-qmprxs3fi-thesathwiks-projects.vercel.app
- https://driving-school-platform-5phjf3585-thesathwiks-projects.vercel.app

## Backend (Railway)
**API URL:** https://eazy-driving-production.up.railway.app
**API Base:** https://eazy-driving-production.up.railway.app/api

## Important: Update Railway Environment Variable

You need to update the Railway environment variable to allow CORS from your Vercel frontend:

### Steps to Update Railway CORS:

1. Go to https://railway.app/dashboard
2. Select your `eazydriving-backend` project
3. Go to **Variables** tab
4. Find `CLIENT_URL` variable
5. Update its value to: `https://driving-school-platform-fno5m5nmx-thesathwiks-projects.vercel.app`
6. Save the changes
7. Railway will automatically redeploy with the new settings

## Testing Your Deployment

Once Railway is updated, test these endpoints:

### 1. Backend Health Check
```bash
curl https://eazy-driving-production.up.railway.app/health
```

### 2. Test Registration (via API)
```bash
curl -X POST https://eazy-driving-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@example.com",
    "password": "password123",
    "phone": "0412345678",
    "role": "learner"
  }'
```

### 3. Frontend Test
Visit: https://driving-school-platform-fno5m5nmx-thesathwiks-projects.vercel.app

Try to:
- Browse instructors
- Sign up as a learner
- Log in
- Book a lesson

## Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://eazy-driving-production.up.railway.app/api
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyDVUrVvTwCAn2F4uWgJ9jI26e8GAdF79eo
```

### Backend (Railway Variables)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://eazydriving_adm:Sathwik%4016@eazydriving-cluster.ytb75lf.mongodb.net/eazydriving?retryWrites=true&w=majority
JWT_SECRET=eazydriving_secret_key_change_in_production_2024
JWT_EXPIRE=7d
CLIENT_URL=https://driving-school-platform-fno5m5nmx-thesathwiks-projects.vercel.app
```

## Custom Domain (Optional)

To add a custom domain like `eazydriving.com`:

### For Vercel:
1. Go to your project settings in Vercel
2. Add a custom domain
3. Update DNS records as instructed by Vercel

### For Railway:
1. Go to project settings
2. Add custom domain
3. Update DNS A record to point to Railway's IP

## Monitoring

- **Vercel Deployment Logs:** https://vercel.com/dashboard
- **Railway Deployment Logs:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com/

## Next Steps

1. ✅ Frontend deployed to Vercel
2. ✅ Backend deployed to Railway
3. ⚠️  **Update CLIENT_URL in Railway** (required for CORS)
4. Test all functionality
5. (Optional) Add custom domain
6. (Optional) Set up monitoring and analytics
7. (Optional) Add email notifications for bookings

## Cost Breakdown

- **Vercel:** $0/month (Hobby plan)
- **Railway:** $0-5/month (Free tier with $5 credit)
- **MongoDB Atlas:** $0/month (M0 Free tier)
- **Total:** $0-5/month

Your platform is now LIVE! 🎉
