# CV Builder Backend API

## Production Deployment Guide with Render (FREE)

### Step 1: Set up MongoDB Atlas Database

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account
   - Create a new cluster (use the free M0 tier)

2. **Configure Database**
   - Cluster Name: `cv-builder-cluster`
   - Region: Choose closest to your users
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Set up Database User**
   - Go to "Database Access" → "Add New Database User"
   - Authentication Method: Password
   - Username: `cv-builder-admin`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add: `0.0.0.0/0` (Allow access from anywhere)
   - Comment: "Render deployment access"

5. **Get Connection String**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://cv-builder-admin:<password>@cv-builder-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

### Step 2: Deploy Backend to Render (FREE)

1. **Create Render Account**
   - Go to [Render.com](https://render.com/)
   - Sign up with GitHub account (recommended)

2. **Deploy Web Service**
   - Click "New +" → "Web Service"
   - **Connect GitHub repository:** Select your `cv-builder` repository
   - **Configuration:**
     ```
     Name: cv-builder-api
     Region: Oregon (US West)
     Branch: main (or master)
     Root Directory: server
     Runtime: Node
     Build Command: npm install
     Start Command: npm start
     Instance Type: Free
     ```

3. **Configure Environment Variables in Render**
   - In your Render dashboard, go to your service → Environment
   - Add these environment variables:

   ```bash
   NODE_ENV=production
   PORT=10000

   # MongoDB Atlas connection (replace with your actual values)
   MONGODB_URI=mongodb+srv://cv-builder-admin:YOUR_PASSWORD@cv-builder-cluster.xxxxx.mongodb.net/cv-builder?retryWrites=true&w=majority

   # Client URL (your Netlify frontend)
   CLIENT_URL=https://free-cv-builder.netlify.app

   # Session security - generate a strong random string
   SESSION_SECRET=your-super-strong-production-secret-key-here

   # GitHub OAuth (you'll get these from GitHub OAuth app)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=https://cv-builder-api-fexd.onrender.com/api/auth/github/callback

   # GitHub API Token (Optional - for higher rate limits)
   # Generate at: https://github.com/settings/tokens (no scopes needed for public repos)
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - **Your API URL will be:** `https://cv-builder-api-fexd.onrender.com`
   - **Note:** Free tier goes to sleep after 15 minutes of inactivity, but wakes up automatically

### Step 3: Create GitHub OAuth Application

1. **Go to GitHub OAuth App Creation**
   - GitHub → Settings → Developer settings → OAuth Apps → "New OAuth App"

2. **Fill in OAuth App Details:**
   ```
   Application name: CV Builder
   Homepage URL: https://free-cv-builder.netlify.app
   Application description: Free CV Builder with GitHub integration
   Authorization callback URL: https://cv-builder-api-fexd.onrender.com/api/auth/github/callback
   ```

3. **Register Application**
   - Click "Register application"
   - **Copy the Client ID** (you'll need this)
   - **Generate a Client Secret** and copy it immediately

4. **Add OAuth Credentials to Render**
   - Go back to Render dashboard → your service → Environment
   - Update these variables with your actual values:
     ```bash
     GITHUB_CLIENT_ID=your_actual_client_id_from_github
     GITHUB_CLIENT_SECRET=your_actual_client_secret_from_github
     ```

### Step 3.5: Create GitHub Personal Access Token (Optional - Recommended)

This step increases GitHub API rate limits from 60/hour to 5000/hour for star count fetching:

1. **Go to GitHub Personal Access Tokens**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → "Generate new token (classic)"

2. **Configure Token Settings:**
   ```
   Note: CV Builder API Token
   Expiration: No expiration (or choose your preference)
   Scopes: ❌ NO SCOPES NEEDED (leave all unchecked for public repo access)
   ```

3. **Generate Token**
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)
   - Token will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Add Token to Render Environment:**
   - Go to Render dashboard → your service → Environment
   - Add this variable:
     ```bash
     GITHUB_TOKEN=ghp_your_actual_token_from_github
     ```

> **Note:** This token is optional but highly recommended. Without it, you may hit rate limits if many users visit your site simultaneously.

### Step 4: Update Frontend Environment

1. **Update your frontend environment file:**
   ```bash
   # File: client/.env.production
   VITE_API_URL=https://cv-builder-api-fexd.onrender.com
   ```

2. **Commit and push changes** - Netlify will auto-deploy

### Step 5: Test Your Deployment

1. **Check API Health:**
   - Visit: `https://cv-builder-api-fexd.onrender.com/`
   - Should see API documentation

2. **Test Health Endpoint:**
   - Visit: `https://cv-builder-api-fexd.onrender.com/health`
   - Should return `{"status":"OK",...}`

3. **Test on Frontend:**
   - Visit: `https://free-cv-builder.netlify.app`
   - Click the star button
   - Should open GitHub OAuth → authorize → auto-star repository

## 🆓 Render Free Tier Benefits

- **$0/month** - Completely free for personal projects
- **750 hours/month** - More than enough for this app
- **Auto-scaling** from 0 to multiple instances
- **Custom domains** supported
- **HTTPS** included automatically
- **GitHub integration** - auto-deploys on push

## ⚠️ Render Free Tier Limitations

- **Cold starts:** Service sleeps after 15 minutes of inactivity
- **Wake-up time:** ~15-30 seconds when first request comes in
- **750 hours/month limit** (but restarts monthly)

## 🚀 Production Tips

1. **Keep the service warm** by setting up a simple ping service (optional)
2. **Monitor usage** in Render dashboard to stay within limits
3. **Upgrade to paid plan** ($7/month) for 24/7 uptime when needed

## Local Development

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings (use port 5000 for local)
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - API documentation
- `GET /health` - Health check
- `GET /api/auth/github` - Start GitHub OAuth
- `GET /api/auth/status` - Check auth status
- `GET /api/auth/repo/stars` - Get star count
- `POST /api/auth/repo/star` - Star repository
- `DELETE /api/auth/repo/star` - Unstar repository

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | `production` | ✅ |
| `PORT` | Server port | `10000` | ✅ |
| `MONGODB_URI` | Database connection | MongoDB Atlas string | ✅ |
| `CLIENT_URL` | Frontend URL | `https://free-cv-builder.netlify.app` | ✅ |
| `SESSION_SECRET` | Session encryption | Random strong string | ✅ |
| `GITHUB_CLIENT_ID` | OAuth Client ID | From GitHub OAuth app | ✅ |
| `GITHUB_CLIENT_SECRET` | OAuth Client Secret | From GitHub OAuth app | ✅ |
| `GITHUB_CALLBACK_URL` | OAuth callback | `https://cv-builder-api-fexd.onrender.com/api/auth/github/callback` | ✅ |
| `GITHUB_TOKEN` | API rate limits | Personal Access Token | ⚡ Optional (Recommended) |

## Troubleshooting

### Common Issues:

1. **503 Service Unavailable** - Service is waking up from sleep (wait 30 seconds)
2. **CORS Errors** - Check `CLIENT_URL` environment variable
3. **GitHub OAuth Failed** - Verify callback URL matches exactly
4. **Database Connection Failed** - Check MongoDB Atlas IP whitelist and credentials

### Need Help?

- Check Render service logs in dashboard
- Verify all environment variables are set
- Test database connection separately
- Ensure GitHub OAuth app settings match your URLs