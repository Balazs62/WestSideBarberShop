# Netlify Deployment Guide

## Overview
This project is a Vite-based React application deployed to Netlify as a static site with client-side authentication.

## Prerequisites
- Netlify account (free tier)
- Git repository (GitHub, GitLab, or Bitbucket)
- Google Cloud Console account (for OAuth)

## Step 1: Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click "Deploy site"

## Step 2: Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

Add the following variables:

```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_APP_URL=https://yourdomain.com
VITE_APP_NAME=BarberShop
```

## Step 3: Set Up Google OAuth

### Create Google OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to: APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth client ID"
5. Application type: Web application
6. Authorized redirect URIs:
   - **Production**: `https://yourdomain.com`
   - **Netlify preview**: `https://your-site-name.netlify.app`
   - **Local development**: `http://localhost:5173`
7. Copy the Client ID and Client Secret
8. Add them to Netlify Environment Variables

### Update Google OAuth Callback

For client-side OAuth, the callback is handled by the Google Identity Services SDK. Make sure your authorized JavaScript origins include:
- `https://yourdomain.com`
- `https://your-site-name.netlify.app`
- `http://localhost:5173`

## Step 4: Custom Domain Setup

### Add Custom Domain

1. In Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Enter your domain (e.g., `barbershop.hu`)
4. Choose "Add domain"

### Configure DNS

Netlify will provide DNS records to add to your domain registrar:

```
A record: @ → 75.2.70.75
A record: @ → 99.83.190.102
```

Or use CNAME if preferred:
```
CNAME: www → your-site-name.netlify.app
```

### Enable HTTPS

Netlify automatically provides SSL certificates for custom domains. Enable HTTPS in Domain settings.

## Step 5: Update Environment Variables for Custom Domain

After setting up your custom domain, update the environment variable:

```
VITE_APP_URL=https://yourdomain.com
```

Redeploy the site to apply changes.

## Step 6: Test Deployment

1. Test on Netlify preview URL
2. Test on custom domain
3. Test Google OAuth login
4. Test booking flow
5. Test on mobile devices

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables for Local Development

Create a `.env.local` file:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=BarberShop
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify build command in Netlify settings
- Check build logs in Netlify Dashboard

### Google OAuth Not Working
- Verify Client ID and Secret are correct
- Check authorized redirect URIs in Google Cloud Console
- Ensure environment variables are set in Netlify
- Check browser console for errors

### Custom Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check Netlify domain settings
- Ensure HTTPS is enabled

### Data Persistence
- Current implementation uses localStorage
- Data is stored in user's browser
- Clearing browser data will reset bookings
- For production, consider migrating to a backend database

## Cost Summary

- **Netlify**: Free tier (100GB bandwidth/month)
- **Google OAuth**: Free (within usage limits)
- **Custom Domain**: Depends on domain registrar (~$10-15/year)
- **Total**: ~$10-15/year (domain cost only)

## Next Steps (Optional)

For a more robust production setup, consider:
1. Migrating to Next.js with server-side rendering
2. Adding Neon PostgreSQL database with Prisma ORM
3. Implementing NextAuth for server-side authentication
4. Adding email notifications
5. Implementing real database persistence
