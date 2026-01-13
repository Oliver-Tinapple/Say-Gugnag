const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3000;

// Store all connected WebSocket clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New WebSocket client connected. Total clients:', clients.size);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected. Total clients:', clients.size);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast to all connected clients
function broadcastUpdate(key, value) {
    const message = JSON.stringify({ type: 'update', key, value });
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
async function initDatabase() {
    try {
        // Main table for current text
        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_text (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // History table for ALL changes (never deleted)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS text_history (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) NOT NULL,
                value TEXT NOT NULL,
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // IP logging table for video player visitors
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ip_logs (
                id SERIAL PRIMARY KEY,
                ip VARCHAR(45) NOT NULL,
                user_agent TEXT,
                referer TEXT,
                page VARCHAR(255),
                visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert default values if table is empty
        const { rows } = await pool.query('SELECT COUNT(*) FROM site_text');
        if (parseInt(rows[0].count) === 0) {
            const defaultTexts = [
                ['main_header', 'SAY GUGNAG'],
                ['button_text', 'CLICK TO SAY GUGNAG'],
                ['top_marquee', '⚠️ Warning: Screaming this word at the top of your lungs will result in PAIN⚠️'],
                ['spinning_text', '🌟 THE WORD YOUR TEACHER LOVES 🌟'],
                ['badge1', '⭐ FAVORITE WORD AMONGST YAHOO USERS ⭐'],
                ['badge2', '💯 100% APPROVED BY ZERO TEACHERS 💯'],
                ['badge3', '🔥 UNDER CONSTRUCTION 🔥'],
                ['footer_copyright', '© 2024 "GUGNAG DANIALS" ENTERPRISES™'],
                ['popup_checkbox', 'turn off popups like a bitch'],
            ];

            for (const [key, value] of defaultTexts) {
                await pool.query(
                    'INSERT INTO site_text (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
                    [key, value]
                );
            }
        }

        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// API Routes

// Get all text content
app.get('/api/text', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT key, value FROM site_text');
        const textData = {};
        rows.forEach(row => {
            textData[row.key] = row.value;
        });
        res.json(textData);
    } catch (err) {
        console.error('Error fetching text:', err);
        res.status(500).json({ error: 'Failed to fetch text' });
    }
});

// Reset all text to defaults (MUST come before /:key route)
app.post('/api/text/reset-all', async (_req, res) => {
    try {
        const defaultTexts = [
            ['main_header', 'SAY GUGNAG'],
            ['button_text', 'CLICK TO SAY GUGNAG'],
            ['top_marquee', '⚠️ Warning: Screaming this word at the top of your lungs will result in PAIN⚠️'],
            ['spinning_text', '🌟 THE WORD YOUR TEACHER LOVES 🌟'],
            ['badge1', '⭐ FAVORITE WORD AMONGST YAHOO USERS ⭐'],
            ['badge2', '💯 100% APPROVED BY ZERO TEACHERS 💯'],
            ['badge3', '🔥 UNDER CONSTRUCTION 🔥'],
            ['footer_copyright', '© 2024 "GUGNAG DANIALS" ENTERPRISES™'],
            ['popup_checkbox', 'turn off popups like a bitch'],
        ];

        for (const [key, value] of defaultTexts) {
            await pool.query(
                'INSERT INTO site_text (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
                [key, value]
            );
        }

        res.json({ success: true, message: 'All text reset to defaults' });
    } catch (err) {
        console.error('Error resetting text:', err);
        res.status(500).json({ error: 'Failed to reset text' });
    }
});

// Update text content
app.post('/api/text/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
        return res.status(400).json({ error: 'Value is required' });
    }

    try {
        // Update current text
        await pool.query(
            'INSERT INTO site_text (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
            [key, value]
        );

        // Save to history (NEVER deleted)
        await pool.query(
            'INSERT INTO text_history (key, value) VALUES ($1, $2)',
            [key, value]
        );

        // Broadcast update to all connected WebSocket clients
        broadcastUpdate(key, value);

        res.json({ success: true, key, value });
    } catch (err) {
        console.error('Error updating text:', err);
        res.status(500).json({ error: 'Failed to update text' });
    }
});

// Get change history
app.get('/api/history', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM text_history ORDER BY changed_at DESC LIMIT 100'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Shop page
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

// Trust proxy for Railway (to get real IP)
app.set('trust proxy', true);

// Video player page - logs visitor IP
app.get('/video', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';

    try {
        await pool.query(
            'INSERT INTO ip_logs (ip, user_agent, referer, page) VALUES ($1, $2, $3, $4)',
            [ip, userAgent, referer, '/video']
        );
        console.log(`[IP LOGGED] ${ip} visited /video`);
    } catch (err) {
        console.error('Error logging IP:', err);
    }

    res.sendFile(path.join(__dirname, 'video.html'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
initDatabase().then(() => {
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
        console.log('WebSocket server ready');
    });
});
