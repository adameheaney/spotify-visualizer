const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3001;

// Replace with your own credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/player/currently-playing';

let accessToken = ''; // Store your access token here
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend

// Step 1: Get Spotify Access Token using Authorization Code Flow
app.get('/login', (req, res) => {
  const scope = 'user-read-playback-state user-library-read';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
  res.redirect(authUrl);
});

// Step 2: Exchange authorization code for access token
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Save the access token
    accessToken = tokenResponse.data.access_token;
    res.send('Spotify authentication successful! You can now get the current song.');
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).send('Authentication failed.');
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
