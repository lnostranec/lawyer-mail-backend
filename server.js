const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-question', async (req, res) => {
  try {
    const { name, phone, question } = req.body || {};

    if (!name || !phone || !question) {
      return res.status(400).json({ success: false, error: 'Заполните все поля.' });
    }

    await transporter.sendMail({
      from: `"Сайт юриста" <${process.env.SMTP_USER}>`,
      to: process.env.TARGET_EMAIL || process.env.SMTP_USER,
      subject: 'Новый вопрос юристу с сайта',
      text: `Имя: ${name}\nТелефон: ${phone}\n\nВопрос:\n${question}\n`
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Не удалось отправить письмо.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

