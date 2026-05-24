# Buyzaar Deployment Fixes & Instructions

## 🔴 Issues Found & Fixed

### 1. ✅ **Fixed Hardcoded Reset Password URL**
- **File**: `backend/controllers/authController.js`
- **Issue**: Reset URL was hardcoded to `http://localhost:5173/reset-password/`
- **Fix**: Changed to use `process.env.CLIENT_URL` with fallback to localhost
```javascript
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
```

### 2. ✅ **Fixed Root vercel.json Configuration**
- **File**: `vercel.json` (root)
- **Issue**: Invalid buildCommand and routes for monorepo structure
- **Fix**: Updated to proper configuration with separate project handling
- **Recommendation**: Deploy frontend and backend as separate Vercel projects

### 3. ✅ **Created Root package.json**
- **File**: `package.json` (root)
- **Purpose**: Defines monorepo structure and workspaces
- **Note**: This is for reference; actual deployments use backend and fronend separately

### 4. ✅ **Improved CORS Configuration**
- **File**: `backend/server.js`
- **Issue**: `origin: '*'` with `credentials: true` can cause issues
- **Fix**: Created flexible CORS configuration with specific allowed origins:
  - `http://localhost:3000` (alternate local port)
  - `http://localhost:5173` (frontend dev port)
  - `process.env.CLIENT_URL` (production URL)
  - `https://buyzaar-roan.vercel.app` (production domain)

## 📋 Deployment Checklist

### Before Deploying to Vercel

#### Backend Setup (Vercel Project 1)
1. Create new Vercel project from `backend/` folder
2. Set environment variables in Vercel dashboard:
   ```
   MONGO_URI=mongodb+srv://Lathusan:200276@buyzaar.rfzc0h3.mongodb.net/buyzaar?retryWrites=true&w=majority
   JWT_SECRET=buyzaar_jwt_secret_key_2025
   NODE_ENV=production
   CLIENT_URL=https://buyzaar-roan.vercel.app
   EMAIL_USER=lathusanlathusan40@gmail.com
   EMAIL_PASS=lhhfsawhhrqaioyf
   GOOGLE_CLIENT_ID=41142914974-cjgt8m67cj4nsolkrcul1mcdooqnajrr.apps.googleusercontent.com
   ```
3. Set `vercel.json` in backend folder to use its config (already correct)
4. Deploy and test: `curl https://<your-backend-domain>/`

#### Frontend Setup (Vercel Project 2)
1. Create new Vercel project from `fronend/` folder
2. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://<your-backend-domain>
   ```
3. Set `vercel.json` or use Vercel's auto-detection (already has correct config)
4. Deploy and test API calls

### Local Development

```bash
# Install dependencies
npm install                # root (for reference)
npm install --prefix backend
npm install --prefix fronend

# Run backend
npm run dev --prefix backend  # Runs on http://localhost:5000

# Run frontend
npm run dev --prefix fronend  # Runs on http://localhost:5173

# Backend uses: http://localhost:5173 (via proxy in vite.config.js)
# Frontend uses: VITE_API_URL from .env
```

### Testing After Deployment

- [ ] **Auth Login**: POST `/api/auth/login` → Should return token
- [ ] **Reset Password**: POST `/api/auth/forgot-password` → Should send email with correct URL
- [ ] **Product List**: GET `/api/products` → Should return products from MongoDB
- [ ] **Admin Dashboard**: Should load without CORS errors
- [ ] **Checkout**: Should create order without "Could not connect" error

## 🔐 Production Security Notes

1. **CORS**: Currently allows all origins. For production, restrict to specific domains:
   ```javascript
   origin: ['https://buyzaar-roan.vercel.app', 'https://yourdomain.com']
   ```

2. **Email Credentials**: Use Vercel secrets or environment variables, not hardcoded values

3. **MongoDB Connection**: Ensure IP whitelist includes Vercel IPs (usually unrestricted)

4. **JWT Secret**: Use strong, unique secret in production

## 📝 File Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `backend/controllers/authController.js` | Use CLIENT_URL env var | Fix hardcoded localhost |
| `backend/server.js` | Improved CORS config | Better origin handling |
| `vercel.json` (root) | Updated build config | Proper monorepo structure |
| `package.json` (root) | Created file | Define workspace structure |

## 🚀 Next Steps

1. Push changes: `git add . && git commit -m "Fix deployment issues" && git push`
2. Monitor Vercel deployment logs for any build errors
3. Test all API endpoints against production
4. Set up monitoring/error tracking (e.g., Sentry)

---
**Last Updated**: May 24, 2026
