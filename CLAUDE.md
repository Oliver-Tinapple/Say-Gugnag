# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Say Gugnag" is a deliberately chaotic, retro-styled website built as a Christmas gift. It features a button that plays audio files saying "Gugnag" with random pitch variations, along with intentionally over-the-top effects (snowfall, cursor trails, screen shake, confetti, Konami code easter egg).

## Development & Deployment

**All testing is done through Railway - no local dev servers.**

To deploy:
1. Push changes to GitHub
2. Railway auto-deploys from the connected repo

## Architecture

### Backend (server.js)
- Express.js server serving static files and REST API
- PostgreSQL database (via `pg`) storing editable text content
- WebSocket server (via `ws`) for real-time sync between clients
- Two tables: `site_text` (current content) and `text_history` (permanent change log)

### Frontend
- **index.html**: Static HTML with intentionally retro elements (marquees, blink tags)
- **script.js**: Chaos effects (confetti, screen shake, cursor trails, random alerts, Konami code)
- **editable.js**: Real-time editable text system - any visitor can click text to edit, changes sync via WebSocket, auto-resets to defaults after 5 minutes of inactivity
- **style.css**: Retro styling with Comic Sans, rainbow gradients, animations

### API Endpoints
- `GET /api/text` - Fetch all editable text content
- `POST /api/text/:key` - Update specific text (also records to history)
- `POST /api/text/reset-all` - Reset all text to defaults
- `GET /api/history` - View change history (last 100 entries)
- `GET /api/health` - Health check

### Audio
Audio files are in `sully sounds/` directory - 8 WAV files with different pitch variations, randomly selected on button click.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required for Railway)
- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Set to "production" for SSL database connections
