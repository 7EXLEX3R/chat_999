import express from 'express';
import { fetch } from 'undici';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { createProxyMiddleware } from 'http-proxy-middleware';

const OLLAMA_PORT = 11434;
const OLLAMA_HOST = '127.0.0.1';
const OLLAMA_URL = `http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/chat`;
const MODEL_NAME = 'finalend/hermes-3-llama-3.1';
const CHAT_999_SYSTEM = process.env.CHAT_999_SYSTEM
    || "You're a pissed off dude. You're not here to help. You like to share crazy stories and you throw 'fucks' " +
    " around. You speak and understand only English language - never use any other one while responding.";
const app = express();
const sessions = {};

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    if (!req.url.endsWith('/chat')) {
        const sessionId = crypto.randomUUID();
        res.cookie('sid', sessionId);
        sessions[sessionId] = {
            createdAt: new Date(),
            chatHistory: [{
                role: 'system',
                content: CHAT_999_SYSTEM,
            }]
        };
        console.log('new session:', sessionId);
        req.session = sessions[sessionId];
    }
    next();
});
app.use(express.static('public'));
app.use('/api', createProxyMiddleware({
    target: `http://${OLLAMA_HOST}:${OLLAMA_PORT}`,
    changeOrigin: true,
    ws: true,
}));

app.post('/chat', async (req, res) => {
    const promptMessage = req.body.prompt;
    if (!promptMessage || typeof promptMessage !== 'string')
        return res.status(400).send('invalid prompt');
    const {sid} = req.cookies || {};
    const session = sessions[sid];
    session.chatHistory.push({
        role: 'user',
        content: promptMessage
    });
    try {
        console.log(sid, session.chatHistory);
        const ollamaRes = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: session.chatHistory,
                stream: true
            }),
        });
        if (!ollamaRes.ok || !ollamaRes.body) {
            console.error('ollama response error:', ollamaRes.status);
            return res.status(500).send(`ollama server error: ${ollamaRes.status}`);
        }
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        const reader = ollamaRes.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let reply = "";
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            res.write(chunk);
            reply += JSON.parse(chunk)?.message?.content || '';
        }
        res.end();
        session.chatHistory.push({
            role: 'assistant',
            content: reply
        });
        console.log(sid, session.chatHistory);
    } catch (err) {
        console.error('fetch error:', err);
        res.status(500).send('internal server error');
    }
});

app.listen(80, '0.0.0.0', () => console.log(`🏴‍ chat_999 running on port 80`));