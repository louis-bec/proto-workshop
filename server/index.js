require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configuration
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = '1h';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/postgres',
});

async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );`);
}

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Helper to create JWT
function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'password too short (min 6)' });

    const existing = await pool.query('SELECT id FROM app_users WHERE username = $1', [username]);
    if (existing.rows.length) return res.status(409).json({ error: 'username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const insert = await pool.query('INSERT INTO app_users (username, password_hash) VALUES ($1, $2) RETURNING id, username', [username, hash]);
    const user = insert.rows[0];
    const token = signToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 3600_000 });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const result = await pool.query('SELECT id, username, password_hash FROM app_users WHERE username = $1', [username]);
    if (!result.rows.length) return res.status(401).json({ error: 'invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = signToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 3600_000 });
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// Protected user profile example
app.get('/api/me', async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const result = await pool.query('SELECT id, username, created_at FROM app_users WHERE id = $1', [payload.sub]);
      if (!result.rows.length) return res.status(404).json({ error: 'user not found' });
      res.json(result.rows[0]);
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
  } catch (err) {
    console.error('Me error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

ensureSchema().then(() => {
  app.listen(PORT, () => console.log(`Auth server listening on :${PORT}`));
}).catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
