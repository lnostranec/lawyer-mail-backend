const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendToTelegram(text) {
  return new Promise((resolve, reject) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      reject(new Error('Telegram not configured'));
      return;
    }

    const body = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

    const url = new URL(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`);

    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.ok) resolve();
          else reject(new Error(j.description || 'Telegram API error'));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.post('/api/send-question', async (req, res) => {
  try {
    const { name, phone, question } = req.body || {};

    if (!name || !phone || !question) {
      return res.status(400).json({ success: false, error: 'Заполните все поля.' });
    }

    const text =
      '<b>Новый вопрос с сайта</b>\n\n' +
      '<b>Имя:</b> ' + escapeHtml(name) + '\n' +
      '<b>Телефон:</b> ' + escapeHtml(phone) + '\n\n' +
      '<b>Вопрос:</b>\n' + escapeHtml(question);

    await sendToTelegram(text);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Не удалось отправить в Telegram.' });
  }
});

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});