const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const CREATOR = 'joeljamestech';

// Middleware
app.use(express.json());

// Helper function to send vertical JSON
function sendVerticalJson(res, obj, status = 200) {
    let jsonString = JSON.stringify(obj, null, 0);
    jsonString = jsonString.replace(/,/g, ',\n');
    res.status(status).setHeader('Content-Type', 'application/json');
    res.send(jsonString);
}

// Root endpoint
app.get('/', (req, res) => {
    sendVerticalJson(res, {
        creator: CREATOR,
        message: 'Welcome to Joel XMD API!',
        endpoints: [
            '/dlytmp3',
            '/dlytmp4',
            '/meme',
            '/gpt',
            '/deepseek'
        ]
    });
});

// dlytmp3 - YouTube Audio Downloader
app.get('/dlytmp3', async (req, res) => {
    const url = req.query.url || 'https://youtube.com/watch?v=50VNCymT-Cs';

    try {
        const info = await ytdl.getInfo(url);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        if (!audioFormats.length) throw new Error('No audio formats found.');

        sendVerticalJson(res, {
            creator: CREATOR,
            title: info.videoDetails.title,
            format: 'mp3',
            audio_url: audioFormats[0].url
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 400);
    }
});

// dlytmp4 - YouTube Video Downloader
app.get('/dlytmp4', async (req, res) => {
    const url = req.query.url || 'https://youtube.com/watch?v=50VNCymT-Cs';

    try {
        const info = await ytdl.getInfo(url);
        const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
        if (!videoFormats.length) throw new Error('No video formats found.');

        sendVerticalJson(res, {
            creator: CREATOR,
            title: info.videoDetails.title,
            format: 'mp4',
            video_url: videoFormats[0].url
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 400);
    }
});

// meme - Random Meme Fetcher
app.get('/meme', async (req, res) => {
    try {
        const response = await axios.get('https://meme-api.com/gimme');
        const meme = response.data;

        sendVerticalJson(res, {
            creator: CREATOR,
            title: meme.title,
            subreddit: meme.subreddit,
            post_link: meme.postLink,
            image_url: meme.url
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// gpt - OpenAI Chatbot
app.post('/gpt', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return sendVerticalJson(res, { creator: CREATOR, error: 'Missing prompt' }, 400);

    try {
        const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(config);

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });

        sendVerticalJson(res, {
            creator: CREATOR,
            prompt: prompt,
            response: response.data.choices[0].message.content
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// deepseek - DeepSeek AI Search
app.post('/deepseek', async (req, res) => {
    const { query } = req.body;
    if (!query) return sendVerticalJson(res, { creator: CREATOR, error: 'Missing query' }, 400);

    try {
        const response = await axios.post('https://api.deepseek.com/search', { query }, {
            headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }
        });

        sendVerticalJson(res, {
            creator: CREATOR,
            query: query,
            results: response.data
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Joel XMD API is running on port ${PORT}`);
});
