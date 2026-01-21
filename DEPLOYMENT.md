# How to Publish Your StudentGrade App

There are several ways to publish your StudentGrade app so everyone can access it:

## Option 1: Vercel (Recommended - Easiest)

Vercel is the creator of SvelteKit and has a `vercel.json` file already in your project.

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (or your preferred method)
3. Click "Add New..." > "Project"
4. Import your GitHub repository (you'll need to push to GitHub first)
5. Vercel will auto-detect SvelteKit and configure it
6. Click "Deploy"
7. Your app will be live at a URL like `your-project.vercel.app`

**To update:** Just push to your GitHub repository and Vercel auto-deploys!

## Option 2: GitHub Pages

**Steps:**
1. Update `svelte.config.js` to use the static adapter
2. Push to GitHub
3. Enable GitHub Pages in repository Settings > Pages
4. Select the branch to deploy from

## Option 3: Docker + Cloud Hosting

**Hosting options:**
- Railway (easiest)
- Render
- AWS
- Google Cloud
- Azure

**Steps for Railway:**
1. Create `Dockerfile` in project root
2. Push to GitHub
3. Go to [railway.app](https://railway.app)
4. Connect your GitHub repo
5. Railway auto-detects and deploys

## Option 4: Traditional Web Hosting

You can also deploy to any traditional hosting with Node.js support:
- Heroku
- DigitalOcean
- Linode
- AWS EC2

**Steps:**
1. Build: `bun run build`
2. Upload files to server
3. Run: `node build`

## Quick Start: Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables** (if needed):
   - Go to Vercel dashboard > Project Settings > Environment Variables
   - Add any needed variables

5. **Your app is now live!** 🚀

## Important Notes

- Make sure your API endpoints work from the deployment location
- The `wa-nor-psv.edupoint.com` domain must be accessible from where you're hosting
- Test the full login flow after deployment
- Consider adding CORS headers if needed for API calls

## Custom Domain

After deployment, you can add a custom domain:
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS setup instructions

That's it! Your StudentGrade app is ready to be used by everyone!
