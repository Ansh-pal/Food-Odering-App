# Deployment Guide

This guide helps you deploy the Food Ordering App so everyone can access it online.

## Quick Summary

| Component | Service | Cost | Setup Time |
|-----------|---------|------|------------|
| Frontend (React) | Vercel | Free | 2 minutes |
| Backend (Node.js) | Railway | Free tier | 5 minutes |
| Database (MongoDB) | MongoDB Atlas | Free tier | 5 minutes |
| **Total** | **All Free** | **Free/month** | **~12 minutes** |

---

## Step-by-Step Deployment

### **Step 1: Set Up MongoDB Atlas (Database)**

1. Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **"Start Free"** and sign up with your GitHub account
3. **Create a Free Cluster:**
   - Choose AWS as provider
   - Select a region closest to you
   - Click **"Create Cluster"**
   - Wait 2-3 minutes for cluster to deploy

4. **Set Up Database Access:**
   - Go to **"Database Access"** (left sidebar)
   - Click **"Add New Database User"**
   - Username: `admin`
   - Password: Generate a strong password and **copy it** (you'll need it)
   - Click **"Add User"**

5. **Allow Network Access:**
   - Go to **"Network Access"** (left sidebar)
   - Click **"Add IP Address"**
   - Select **"Allow access from anywhere"** (0.0.0.0/0)
   - Confirm

6. **Get Connection String:**
   - Go to **"Databases"** (left sidebar)
   - Click **"Connect"** button on your cluster
   - Choose **"Drivers"**
   - Copy the connection string (looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/food_ordering_app?retryWrites=true&w=majority`)
   - **Replace `<password>` with the password you created**

**Example Final String:**
```
mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/food_ordering_app?retryWrites=true&w=majority
```

---

### **Step 2: Deploy Backend to Railway**

1. Visit [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Click **"GitHub"** and authorize Railway to access your GitHub
5. Select your **`food-ordering-app`** repository
6. Railway will auto-detect it's a Node.js project
7. Click **"Deploy Now"**

8. **Configure Environment Variables:**
   - After deployment starts, go to **"Variables"** tab
   - Add the following variables:
     ```
     MONGO_URI=[paste your MongoDB Atlas connection string from Step 1]
     JWT_SECRET=your-super-secret-key-change-this-12345
     NODE_ENV=production
     PORT=3000
     CORS_ORIGIN=[your Vercel frontend URL - you'll update this after Step 3]
     ```
   - Save and redeploy

9. **Get Your Backend URL:**
   - Go to **"Deployments"** tab
   - Look for the URL (e.g., `https://food-ordering-api-prod.railway.app`)
   - **Copy this URL** - you'll need it for Step 3

---

### **Step 3: Deploy Frontend to Vercel**

1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"New Project"**
5. Find and click on **`food-ordering-app`** repository
6. **Configure Settings:**
   - **Framework Preset:** Select **"Create React App"**
   - **Root Directory:** Change to **`frontend`** (click "Edit" if needed)
   - Click **"Environment Variables"**
   - Add variable:
     ```
     Key: REACT_APP_API_BASE_URL
     Value: [paste your Railway backend URL from Step 2]
     ```
   - Example: `https://food-ordering-api-prod.railway.app/api/v1`
7. Click **"Deploy"**
8. Wait for deployment to complete (~2-3 minutes)

9. **Get Your Frontend URL:**
   - After deployment completes, you'll see your live URL (e.g., `https://food-ordering-app.vercel.app`)
   - **Copy this URL**

10. **Update Backend CORS (Go back to Railway):**
    - Go back to Railway
    - Update `CORS_ORIGIN` variable with your Vercel URL
    - Example: `https://food-ordering-app.vercel.app`
    - Redeploy backend

---

## ✅ Deployment Complete!

Your app is now live:
- **Frontend:** https://food-ordering-app.vercel.app
- **Backend:** https://food-ordering-api-prod.railway.app/api/v1
- **Database:** MongoDB Atlas (managed)

---

## How to Use the Deployed App

1. Open the frontend URL in your browser
2. Log in with one of these demo users:
   - **Admin:** nick.fury / password: admin123
   - **Manager:** captain.marvel / password: manager123
   - **Member:** thanos / password: member123
3. Browse restaurants, create orders, and test all features
4. Share the frontend URL with anyone - they can use it immediately!

---

## Troubleshooting

### **Frontend shows "Cannot reach backend"**
- Check CORS_ORIGIN in Railway matches your Vercel URL
- Verify REACT_APP_API_BASE_URL in Vercel has correct backend URL
- Redeploy both services

### **Backend returns "Database connection error"**
- Verify MongoDB connection string in Railway is correct
- Check MongoDB Atlas "Network Access" allows 0.0.0.0/0
- Verify database user credentials are correct

### **Changes don't appear after pushing to GitHub**
- Vercel and Railway auto-redeploy on git push
- Wait 1-2 minutes for deployment to complete
- Check deployment logs in each service

---

## Advanced: Custom Domain (Optional)

- **Vercel:** Go to Project Settings → Domains → Add your domain
- **Railway:** Go to Project Settings → Domain → Add custom domain

---

## Redeploying After Code Changes

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
2. Vercel and Railway will **automatically redeploy** within 1-2 minutes
3. Your changes will be live on your deployment URLs

---

## Cost Breakdown (Monthly)

- **Vercel:** Free (up to 100 GB bandwidth)
- **Railway:** Free tier ($5/month credits, sufficient for testing)
- **MongoDB Atlas:** Free tier (512 MB storage, sufficient for testing)
- **Total:** Free or ~$5/month

---

## Production Tweaks (Optional)

After initial deployment works, consider:
1. Enable HTTPS (automatic with Vercel & Railway)
2. Set up monitoring in Railway dashboard
3. Configure MongoDB backups in Atlas
4. Add error tracking (Sentry integration available)
5. Scale database if needed (paid Atlas tier)

---

For questions or issues, refer to:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
