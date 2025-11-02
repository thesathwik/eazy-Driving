# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the EAZYDRIVING platform.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "New Project"
5. Name your project (e.g., "EAZYDRIVING Platform")
6. Click "Create"

## Step 2: Enable Required APIs

You need to enable these APIs for the platform:

1. In the Google Cloud Console, go to **APIs & Services** → **Library**

2. Search for and enable each of these APIs (click "Enable" for each):
   - **Maps Embed API** - For displaying the map in the service area
   - **Maps JavaScript API** - For future interactive map features
   - **Places API** - For location autocomplete functionality

## Step 3: Create an API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API key**
3. Your API key will be created and displayed
4. **Copy this key** - you'll need it in the next step

## Step 4: Secure Your API Key (IMPORTANT!)

**Never commit your API key to Git!** Always restrict it:

1. Click on your newly created API key in the Credentials page
2. Click "Edit API key"

3. **Application restrictions:**
   - Select "HTTP referrers (websites)"
   - Click "Add an item" and add these referrers:
     ```
     http://localhost:3000/*
     http://localhost:3000
     https://driving-school-platform-*.vercel.app/*
     https://your-custom-domain.com/*
     ```

4. **API restrictions:**
   - Select "Restrict key"
   - Select only these APIs:
     - Maps Embed API
     - Maps JavaScript API
     - Places API

5. Click **Save**

## Step 5: Add API Key to Your Project

1. Open the `.env` file in the project root
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```
3. Save the file

## Step 6: Restart the Development Server

If your development server is running, **restart it** for the environment variable to take effect:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## Step 7: Test the Map

1. Sign up as an instructor
2. Go through the profile completion steps
3. On Step 4 (Service Area), you should see the Google Map loaded
4. Try switching between Map and Satellite views

## For Vercel Deployment

To add the API key to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `REACT_APP_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google Maps API key
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application

## Troubleshooting

### Map not showing
- Check that you've enabled all three required APIs
- Verify your API key is correctly copied to `.env`
- Make sure you've restarted the development server
- Check browser console for errors

### "This page can't load Google Maps correctly"
- Your API key restrictions might be too strict
- Verify your domain/localhost is added to the HTTP referrers
- Make sure Maps Embed API is enabled

### Billing Warning
- Google Maps requires billing to be enabled
- You get $200 free credit per month
- For this platform's usage, you'll likely stay within the free tier

## Free Tier Limits

Google Maps provides generous free tier:
- **$200 free credit per month**
- Maps Embed API: 28,000 loads per month for free
- For most small-to-medium platforms, this is more than enough!

## Security Best Practices

✅ **DO:**
- Keep your API key in `.env` (never commit to Git)
- Use HTTP referrer restrictions
- Restrict to only needed APIs
- Monitor usage in Google Cloud Console

❌ **DON'T:**
- Commit API keys to version control
- Share API keys publicly
- Use unrestricted API keys in production
- Forget to set up billing (required even for free tier)

## Support

If you encounter issues:
1. Check the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
2. Review the [Google Cloud Console](https://console.cloud.google.com/) for error messages
3. Check your browser's developer console for errors
