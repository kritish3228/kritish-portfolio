const mysql = require('mysql2/promise');

const MAX_LENGTHS = { name: 100, email: 255, subject: 200, message: 5000 };
const requestsByIp = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
let pool;

function jsonResponse(res, status, body) {
  res.status(status).json(body);
}

function clean(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || 'unknown')
    .split(',')[0].trim();
}

function validate(body) {
  const fields = {
    name: clean(body?.name),
    email: clean(body?.email).toLowerCase(),
    subject: clean(body?.subject),
    message: typeof body?.message === 'string' ? body.message.trim() : '',
  };
  const errors = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (!value) errors.push(`${key} is required`);
    if (value.length > MAX_LENGTHS[key]) errors.push(`${key} is too long`);
  });
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.push('email must be valid');
  }

  return { fields, errors };
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 2,
      enableKeepAlive: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}

async function sendEmail(fields) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_SENDER_EMAIL;
  const to = process.env.CONTACT_RECEIVER_EMAIL;
  if (!apiKey || !from || !to) throw new Error('Email service is not configured');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: fields.email,
      subject: `Portfolio contact: ${fields.subject}`,
      html: `<h2>New portfolio contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(fields.subject)}</p>
        <p><strong>Message:</strong></p><p>${escapeHtml(fields.message).replace(/\n/g, '<br>')}</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Resend request failed with status ${response.status}`);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  }[character]));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });

  const ip = getClientIp(req);
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return jsonResponse(res, 429, { error: 'Too many requests. Please try again later.' });
  requestsByIp.set(ip, [...recent, now]);

  const { fields, errors } = validate(req.body);
  if (errors.length) return jsonResponse(res, 400, { error: errors.join('. ') });

  const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  if (required.some((key) => !process.env[key])) {
    console.error('Contact API database configuration is incomplete');
    return jsonResponse(res, 500, { error: 'The contact service is not configured yet.' });
  }

  let connection;
  try {
    connection = await getPool().getConnection();
    const [result] = await connection.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [fields.name, fields.email, fields.subject, fields.message],
    );

    try {
      await sendEmail(fields);
      await connection.execute('UPDATE contact_messages SET email_sent = TRUE WHERE id = ?', [result.insertId]);
    } catch (emailError) {
      console.error('Contact saved but notification email failed:', emailError.message);
      return jsonResponse(res, 202, { message: 'Your message was saved. Email notification is temporarily delayed.' });
    }

    return jsonResponse(res, 201, { message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact API failed:', error.message);
    return jsonResponse(res, 500, { error: 'Unable to process your message right now.' });
  } finally {
    if (connection) connection.release();
  }
};
