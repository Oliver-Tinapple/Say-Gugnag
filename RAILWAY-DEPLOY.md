# Railway Deployment Guide - Gugnag Websight

## What's New: Live Editing for Everyone!

Anyone can now click on text to edit it! Changes are saved to a database and everyone sees the updates.

---

## Deployment Steps

### 1. Push to GitHub (if not already)

```bash
cd "Say Gugnag"
git init
git add .
git commit -m "Add editable text with database"
git branch -M main
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/say-gugnag.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `say-gugnag` repository
5. Railway will auto-detect Node.js and deploy!

### 3. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a free PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically added to your app

That's it! Railway will automatically connect your app to the database.

### 4. Configure Custom Domain (Optional)

1. In Railway project → Settings → Domains
2. Click "Generate Domain" for a free Railway domain
3. Or click "Custom Domain" to add your own

---

## How the Editable System Works

### For Users:
- **Click any text** on the website to edit it
- Text will highlight with a green border
- Press **Enter** to save, or **Escape** to cancel
- Changes are instant and everyone sees them!

### What's Editable:
- Main header ("SAY GUGNAG")
- Button text
- Top marquee (warning message)
- Spinning text
- All 3 badges
- Footer copyright
- Popup checkbox label

### Technical Details:
- **Backend**: Express.js server ([server.js](server.js))
- **Database**: PostgreSQL (free on Railway)
- **API**: Simple REST API for getting/updating text
- **Frontend**: [editable.js](editable.js) makes elements clickable to edit

---

## Environment Variables

Railway automatically sets these:

- `PORT` - Port number for the server
- `DATABASE_URL` - PostgreSQL connection string (added when you add the database)
- `NODE_ENV` - Set to `production` automatically

No manual configuration needed!

---

## Local Testing (Optional)

If you want to test locally before deploying:

1. Install dependencies:
```bash
npm install
```

2. Set up a local PostgreSQL database or use Railway's database URL:
```bash
export DATABASE_URL="your-railway-database-url"
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000

**Note**: Since you use Railway for testing (per your setup), you probably don't need local testing!

---

## File Structure

```
/Users/olivertinapple/Desktop/Say Gugnag/
├── index.html          (Main page - now with editable text!)
├── style.css           (Terrible styling)
├── script.js           (Audio playback + chaos effects)
├── editable.js         (NEW: Makes text editable)
├── server.js           (NEW: Backend server)
├── favicon.png         (Gugnag logo)
├── package.json        (Updated with backend dependencies)
├── sully sounds/       (Audio files)
├── backup/             (Backup of working version)
└── README.md           (Original readme)
```

---

## Troubleshooting

### Database not connecting
- Make sure you added a PostgreSQL database in Railway
- Check that `DATABASE_URL` environment variable exists in Railway settings

### Text not saving
- Check Railway logs for errors
- Make sure the database table was created (check logs on first deploy)

### Audio files not loading
- Make sure the `sully sounds/` folder is committed to git
- Check Railway logs for 404 errors

---

## Cost

- **Railway Free Tier**: $5 credit per month
- This project uses very minimal resources
- Should stay well within free tier limits!

---

Enjoy your editable chaos websight! 🤪🎄
