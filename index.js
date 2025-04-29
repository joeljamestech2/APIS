const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const CREATOR = 'joeljamestech';
const FALLBACK_URL = 'https://youtube.com/watch?v=50VNCymT-Cs';

app.use(express.json());

// Vertical JSON formatter
function sendVerticalJson(res, obj, status = 200) {
    let jsonString = JSON.stringify(obj, null, 0).replace(/,/g, ',\n');
    res.status(status).setHeader('Content-Type', 'application/json');
    res.send(jsonString);
}

// Root
app.get('/', (req, res) => {
    sendVerticalJson(res, {
        creator: CREATOR,
        message: 'Welcome to Joel XMD API!',
        endpoints: ['/dlytmp3', '/dlytmp4', '/meme', '/gpt', '/deepseek']
    });
});

// dlytmp3
app.get('/dlytmp3', async (req, res) => {
    const url = req.query.url || FALLBACK_URL;
    try {
        const info = await ytdl.getInfo(url);
        const audio = ytdl.filterFormats(info.formats, 'audioonly')[0];
        if (!audio) throw new Error('Audio format not found');

        sendVerticalJson(res, {
            creator: CREATOR,
            title: info.videoDetails.title,
            format: 'mp3',
            audio_url: audio.url
        });
    } catch (err) {
        sendVerticalJson(res, {
            creator: CREATOR,
            error: err.message
        }, 500);
    }
});

// dlytmp4
app.get('/dlytmp4', async (req, res) => {
    const url = req.query.url || FALLBACK_URL;
    try {
        const info = await ytdl.getInfo(url);
        const video = ytdl.filterFormats(info.formats, 'videoandaudio')[0];
        if (!video) throw new Error('Video format not found');

        sendVerticalJson(res, {
            creator: CREATOR,
            title: info.videoDetails.title,
            format: 'mp4',
            video_url: video.url
        });
    } catch (err) {
        sendVerticalJson(res, {
            creator: CREATOR,
            error: err.message
        }, 500);
    }
});

// meme (using meme-api.com)
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
        sendVerticalJson(res, {
            creator: CREATOR,
            error: 'Failed to fetch meme'
        }, 500);
    }
});

// gpt
app.post('/gpt', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return sendVerticalJson(res, {
            creator: CREATOR,
            error: 'Missing prompt'
        }, 400);
    }

    try {
        const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(config);

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });

        sendVerticalJson(res, {
            creator: CREATOR,
            prompt: prompt,
            response: result.data.choices[0].message.content
        });
    } catch (err) {
        sendVerticalJson(res, {
            creator: CREATOR,
            error: 'Failed to connect to GPT',
            details: err.message
        }, 500);
    }
});

// deepseek
app.post('/deepseek', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return sendVerticalJson(res, {
            creator: CREATOR,
            error: 'Missing query'
        }, 400);
    }

    try {
        const result = await axios.post('https://api.deepseek.com/search', { query }, {
            headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }
        });

        sendVerticalJson(res, {
            creator: CREATOR,
            query: query,
            results: result.data
        });
    } catch (err) {
        sendVerticalJson(res, {
            creator: CREATOR,
            error: 'Failed to fetch deepseek results',
            details: err.message
        }, 500);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Joel XMD API is running on port ${PORT}`);
});
