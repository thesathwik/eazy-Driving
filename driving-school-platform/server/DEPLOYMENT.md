# Deploy EAZYDRIVING Backend to Production

This guide will help you deploy the backend to **Railway** with **MongoDB Atlas** database.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Railway account (free)

---

## Part 1: Set Up MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose **FREE** tier (M0 Sandbox)
4. Select your cloud provider (AWS recommended)
5. Choose a region close to your users (e.g., Sydney for Australia)
6. Name your cluster: `eazydriving-cluster`
7. Click **Create Cluster** (takes 3-5 minutes)

### Step 2: Configure Database Access

1. In Atlas dashboard, go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `eazydriving_admin`
5. Password: Click **Autogenerate Secure Password** and **COPY IT**
   - Example: `xK9mP2nL5qR8sT4v`
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is safe for Railway/Render deployments
4. Click **Confirm**

### Step 4: Get Connection String

1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://eazydriving_admin:<password>@eazydriving-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you copied earlier
7. Add database name after `.net/`:
   ```
   mongodb+srv://eazydriving_admin:xK9mP2nL5qR8sT4v@eazydriving-cluster.xxxxx.mongodb.net/eazydriving?retryWrites=true&w=majority
   ```
8. **SAVE THIS CONNECTION STRING** - you'll need it for Railway

---

## Part 2: Deploy Backend to Railway

### Step 1: Push Code to GitHub

1. Initialize Git in your server folder (if not already):
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial backend setup"
   ```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `eazydriving-backend`
   - Make it **Private**
   - Don't initialize with README
   - Click **Create repository**

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/eazydriving-backend.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project**
4. Choose **Deploy from GitHub repo**
5. Select your `eazydriving-backend` repository
6. Railway will automatically detect it's a Node.js app

### Step 3: Configure Environment Variables

1. In Railway dashboard, click your project
2. Go to **Variables** tab
3. Add these environment variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://eazydriving_admin:YOUR_PASSWORD@eazydriving-cluster.xxxxx.mongodb.net/eazydriving?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_NOW
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

   **Important**:
   - Replace `MONGODB_URI` with your connection string from MongoDB Atlas
   - Generate a strong `JWT_SECRET` (at least 32 characters)
   - Update `CLIENT_URL` with your Vercel URL (we'll get this later)

### Step 4: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Click **Deployments** to see progress
3. Once deployed, click **Settings** → **Generate Domain**
4. Your API will be at: `https://your-project.railway.app`
5. **SAVE THIS URL** - this is your backend API URL!

### Step 5: Test Your Deployment

Test the health endpoint:
```bash
curl https://your-project.railway.app/health
```

You should see:
```json
{
  "success": true,
  "message": "EAZYDRIVING API is running",
  "environment": "production"
}
```

---

## Part 3: Connect Frontend to Backend

### Update Frontend Environment Variables

1. In your React app, create/update `.env`:
   ```env
   REACT_APP_API_URL=https://your-project.railway.app/api
   ```

2. Update your API calls in the frontend to use this URL:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

### Deploy Frontend to Vercel

1. In your frontend directory:
   ```bash
   cd ../  # back to root
   vercel
   ```

2. Follow prompts:
   - Set up and deploy: **Yes**
   - Which scope: Your account
   - Link to existing project: **No**
   - Project name: `eazydriving-platform`
   - Directory: `./`
   - Override settings: **No**

3. After deployment, Vercel will give you a URL like:
   `https://eazydriving-platform.vercel.app`

4. Go back to Railway and update `CLIENT_URL` environment variable with this Vercel URL

---

## Part 4: Verify Everything Works

### Test Registration
```bash
curl -X POST https://your-project.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "0412345678",
    "role": "instructor"
  }'
```

### Test Login
```bash
curl -X POST https://your-project.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Check MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click **Browse Collections**
3. You should see:
   - Database: `eazydriving`
   - Collections: `users`, `instructors`, `learners`, etc.
   - Your test user should appear in the `users` collection

---

## Troubleshooting

### Backend Won't Start
- Check Railway logs: Click **View Logs** in deployment
- Verify `MONGODB_URI` is correct in Railway variables
- Ensure all required environment variables are set

### Can't Connect to Database
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify database user has correct password
- Check connection string has database name: `.../eazydriving?...`

### Frontend Can't Connect
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check CORS `CLIENT_URL` in Railway matches your Vercel URL
- Ensure Railway domain is public and accessible

---

## Free Tier Limits

### MongoDB Atlas Free Tier (M0):
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared CPU
- ✅ Good for 100-1000 users
- ✅ No credit card required

### Railway Free Tier:
- ✅ $5 credit per month
- ✅ 500 hours of usage
- ✅ 100 GB bandwidth
- ✅ Good for development and small production apps
- ⚠️ May need upgrade for heavy traffic

### When to Upgrade:
- Database size > 500 MB
- More than 1000 active users
- High traffic (>100k requests/month)
- Need better performance

---

## Production Checklist

Before going live:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Backend pushed to GitHub
- [ ] Railway project created and deployed
- [ ] All environment variables set in Railway
- [ ] Railway domain generated and tested
- [ ] Frontend deployed to Vercel
- [ ] Frontend connected to Railway backend
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Test instructor profile creation works
- [ ] Check MongoDB collections have data

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check MongoDB Atlas logs (Database → Logs)
3. Verify all environment variables
4. Test endpoints with curl/Postman
5. Check CORS configuration

---

## Security Notes

🔒 **Keep these SECRET**:
- MongoDB connection string (contains password)
- JWT_SECRET
- Any API keys

🔐 **Production Best Practices**:
- Use strong passwords (16+ characters)
- Rotate JWT_SECRET regularly
- Monitor MongoDB Atlas for unusual activity
- Set up alerts in Railway for errors
- Enable 2FA on MongoDB Atlas and Railway accounts

---

## Costs

### Current Setup (FREE):
- MongoDB Atlas: $0/month (M0 tier)
- Railway: $0-5/month (free tier)
- Vercel: $0/month (hobby tier)

**Total: $0-5/month** 🎉

You now have a production-ready backend that real users can access!
