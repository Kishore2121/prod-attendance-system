#!/usr/bin/env pwsh
# ============================================================
# Deployment Helper Script
# Run after GitHub repo is created and code is pushed
# ============================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " ATTENDANCE SYSTEM - DEPLOYMENT GUIDE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "STEP 1: MongoDB Atlas (Free Database)" -ForegroundColor Yellow
Write-Host "--------------------------------------"
Write-Host "1. Go to: https://cloud.mongodb.com"
Write-Host "2. Sign up / Log in (free)"
Write-Host "3. Create a FREE cluster (M0 Sandbox)"
Write-Host "4. Database Access -> Add user (remember username & password)"
Write-Host "5. Network Access -> Add IP: 0.0.0.0/0 (allow all)"
Write-Host "6. Connect -> Drivers -> Copy connection string"
Write-Host "   It looks like: mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/attendance-system"
Write-Host ""

Write-Host "STEP 2: Deploy Backend to Render (Free)" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
Write-Host "1. Go to: https://render.com"
Write-Host "2. Sign up with GitHub"
Write-Host "3. New -> Web Service -> Connect your GitHub repo"
Write-Host "4. Settings:"
Write-Host "   - Name: attendance-system-api"
Write-Host "   - Root Directory: backend"
Write-Host "   - Runtime: Node"
Write-Host "   - Build Command: npm install"
Write-Host "   - Start Command: npm start"
Write-Host "   - Instance Type: Free"
Write-Host "5. Environment Variables (add these):"
Write-Host "   NODE_ENV = production"
Write-Host "   MONGODB_URI = <your-atlas-connection-string>"
Write-Host "   JWT_SECRET = <any-long-random-string>"
Write-Host "   JWT_EXPIRES_IN = 7d"
Write-Host "   CORS_ORIGIN = https://<your-vercel-app>.vercel.app"
Write-Host "6. Click 'Create Web Service' and wait for deploy"
Write-Host "7. Copy the Render URL (e.g., https://attendance-system-api.onrender.com)"
Write-Host ""

Write-Host "STEP 3: Deploy Frontend to Vercel (Free)" -ForegroundColor Yellow
Write-Host "------------------------------------------"
Write-Host "1. Go to: https://vercel.com"
Write-Host "2. Sign up with GitHub"
Write-Host "3. Import your GitHub repo"
Write-Host "4. Settings:"
Write-Host "   - Framework Preset: Angular"
Write-Host "   - Root Directory: frontend"
Write-Host "   - Build Command: npx ng build --configuration production"
Write-Host "   - Output Directory: dist/attendance-system/browser"
Write-Host "5. IMPORTANT: Before deploying, update this file:"
Write-Host "   frontend/src/environments/environment.prod.ts"
Write-Host "   Set apiUrl to your Render backend URL + /api"
Write-Host "6. Deploy and share the Vercel URL with colleagues!"
Write-Host ""

Write-Host "STEP 4: Update CORS on Render" -ForegroundColor Yellow
Write-Host "------------------------------"
Write-Host "After both are deployed, update the CORS_ORIGIN"
Write-Host "env var on Render to your Vercel frontend URL"
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " Share the Vercel URL with your team! " -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
