const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Enable CORS =====
app.use(cors());

// ===== Serve static files =====
app.use(express.static(__dirname));

// ===== Proxy endpoint =====
app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        console.log('🔄 Proxying:', url);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://zh888.vip',
                'Referer': 'https://zh888.vip/'
            }
        });

        // ===== Copy headers =====
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

        // ===== Pipe response =====
        response.body.pipe(res);
    } catch (error) {
        console.error('❌ Proxy error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ===== Main route =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== Start server =====
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
});
