require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allows frontend to communicate with backend
app.use(express.json());  // Parses incoming JSON

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Route to get Spotify authorization URL
app.get('/login', (req, res) => {
    const scope = 'user-read-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}`;
    res.json({ authUrl });
});

// Route to exchange authorization code for access token
app.post('/callback', async (req, res) => {
    const { code } = req.body;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        res.json(response.data);  // Sends access_token & refresh_token
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tokens' });
    }
});

// Route to get currently playing song
app.get('/current-track', async (req, res) => {
    const { access_token } = req.headers;
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get track' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
