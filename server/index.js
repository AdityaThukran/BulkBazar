/**
 * BulkBazar — AI Backend Proxy Server
 * Production-ready Express server that:
 * 1. Proxies all Gemini API calls server-side (API key never exposed to browser)
 * 2. Serves the React production build in production mode
 * 3. Handles CORS, rate limiting, and error logging
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// CORS: allow local React dev server and the production domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5001',
  process.env.CLIENT_ORIGIN, // Set this to your production domain e.g. https://bulkbazar.in
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

// Simple rate limiter — max 30 AI requests per minute per IP
const requestCounts = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 1000;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }

  entry.count++;
  requestCounts.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({
      error: 'Too many AI requests. Please wait 60 seconds before trying again.',
    });
  }

  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI Proxy — POST /api/gemini
// ─────────────────────────────────────────────────────────────────────────────
const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

app.post('/api/gemini', rateLimiter, async (req, res) => {
  const { systemPrompt, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing required field: prompt' });
  }

  if (!GEMINI_KEY) {
    console.error('[AI Proxy] GEMINI_KEY not set in environment variables!');
    return res.status(500).json({ error: 'Server AI configuration error. Contact admin.' });
  }

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = data?.error?.message || `Gemini API returned ${geminiRes.status}`;
      console.error('[AI Proxy] Gemini error:', errMsg);
      return res.status(geminiRes.status).json({ error: errMsg });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return res.status(500).json({ error: 'Gemini returned an empty response.' });
    }

    return res.json({ text });

  } catch (err) {
    console.error('[AI Proxy] Network error calling Gemini:', err.message);
    return res.status(500).json({ error: 'Failed to reach AI service. Check your network.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!GEMINI_KEY,
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Serve React production build (production mode only)
// ─────────────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '../build');
  app.use(express.static(buildPath));

  // All non-API routes → serve React's index.html (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 BulkBazar AI Proxy Server running on port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Gemini AI: ${GEMINI_KEY ? '✅ Configured' : '❌ GEMINI_KEY not set!'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`   Proxy target for React dev: http://localhost:${PORT}`);
  }
});
