# Anyone Can Edit! - How It Works

## For Users

Just **click on any text** to edit it!

- Header, button, marquees, badges - all editable
- Text highlights green when you click it
- Press **Enter** to save
- Press **Escape** to cancel
- Everyone sees the changes instantly!
- **Auto-reset**: Changes reset to defaults after 60 seconds
- **Countdown**: A 30-second countdown appears in the top-right corner

## Files Added

1. **[server.js](server.js)** - Backend server with database
2. **[editable.js](editable.js)** - Makes text clickable to edit
3. **Updated [package.json](package.json)** - Added backend dependencies

## How to Deploy

See [RAILWAY-DEPLOY.md](RAILWAY-DEPLOY.md) for full instructions.

Quick version:
1. Push to GitHub
2. Deploy on Railway
3. Add PostgreSQL database in Railway
4. Done!

## API Endpoints

- `GET /api/text` - Get all text content
- `POST /api/text/:key` - Update specific text
- `POST /api/text/reset-all` - Reset all text to defaults (auto-called after 60 seconds)

Simple and works with Railway's free PostgreSQL database!
