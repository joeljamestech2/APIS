const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const CREATOR = 'joeljamestech';

app.use(express.json());
app.use(express.static('src')); // serve static files like 404.html

// Helper: send vertically formatted JSON
function sendVerticalJson(res, obj, status = 200) {
    let jsonString = JSON.stringify(obj, null, 0).replace(/,/g, ',\n');
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send(jsonString);
}

// Root
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

// dlytmp3
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
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// dlytmp4
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
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// meme
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

// GPT POST
app.post('/gpt', async (req, res) => {
    const prompt = req.body.prompt || 'hi';
    try {
        const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(config);
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });
        sendVerticalJson(res, {
            creator: CREATOR,
            info: prompt,
            message: response.data.choices[0].message.content
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// GPT GET fallback
app.get('/gpt', (req, res) => {
    sendVerticalJson(res, {
        creator: CREATOR,
        message: 'Send a POST request with { "prompt": "your message" }'
    });
});

// DeepSeek POST
app.post('/deepseek', async (req, res) => {
    const query = req.body.query || 'hi';
    try {
        const response = await axios.post('https://api.deepseek.com/search', { query }, {
            headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        sendVerticalJson(res, {
            creator: CREATOR,
            info: query,
            message: response.data
        });
    } catch (err) {
        sendVerticalJson(res, { creator: CREATOR, error: err.message }, 500);
    }
});

// DeepSeek GET fallback
app.get('/deepseek', (req, res) => {
    sendVerticalJson(res, {
        creator: CREATOR,
        message: 'Send a POST request with { "query": "your question" }'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Joel XMD API running on port ${PORT}`);
});
