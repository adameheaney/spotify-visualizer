const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const port = 3001;

// Replace with your own credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const FRONTEND_URL = "http://localhost:5173"; // Replace with your frontend URL
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/player/currently-playing';

let accessToken = ''; // Store your access token here
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend

// Redirect user to Spotify login
app.get('/login', (req, res) => {
    const scope = 'user-read-playback-state user-read-currently-playing';
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}`;
    res.redirect(authUrl);
});

// Handle Spotify callback
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) return res.status(400).send('No authorization code provided');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = response.data;

        // Redirect back to frontend with the access token
        res.redirect(`${FRONTEND_URL}/callback?access_token=${access_token}`);
    } catch (error) {
        console.error('Error exchanging token:', error.response?.data || error);
        res.status(500).send('Error during authentication');
    }
});

// Step 3: Get the current song playing for the authenticated user
app.get('/current-song', async (req, res) => {
  if (!accessToken) {
    return res.status(401).send('You must authenticate first.');
  }

  try {
    const response = await axios.get(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data) {
      const song = response.data.item;
      res.json({
        id: song.id,
        name: song.name,
        artist: song.artists.map((artist) => artist.name).join(', '),
        album: song.album.name,
        image: song.album.images[0].url,
        timestamp: response.data.timestamp,
        progress: response.data.progress_ms,
        is_playing: response.data.is_playing,
      });
    } else {
      res.status(404).send('No song is currently playing.');
    }
  } catch (error) {
    console.error('Error fetching current song:', error);
    res.status(500).send('Error retrieving current song.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, process.env.SPOTIFY_REDIRECT_URI);
});
