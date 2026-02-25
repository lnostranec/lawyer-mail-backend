# Lawyer Mail Backend

Небольшой Node.js‑бэкенд для отправки писем с формы «Задать вопрос юристу».

## Стек

- Node.js
- Express
- Nodemailer
- dotenv

## Установка локально

```bash
npm install
npm start
```

Сервер по умолчанию поднимается на порту `3000`.

## Переменные окружения

Настройки берутся из переменных окружения (локально можно использовать файл `.env`, пример — `.env.example`):

```env
SMTP_HOST=smtp.gmail.com          # SMTP‑сервер почты
SMTP_PORT=465                     # порт SMTP (обычно 465 или 587)
SMTP_SECURE=true                  # true для 465, false для 587
SMTP_USER=your_email@example.com  # логин почты
SMTP_PASS=your_password_or_app    # пароль или app‑password
TARGET_EMAIL=recipient@example.com# куда отправлять письма
PORT=3000                         # порт сервера
```

## Эндпоинт

`POST /api/send-question`

Тело запроса в формате JSON:

```json
{
  "name": "Имя пользователя",
  "phone": "+7 900 000-00-00",
  "question": "Текст вопроса юристу"
}
```

Ответ:

```json
{ "success": true }
```

или

```json
{ "success": false, "error": "Описание ошибки" }
```

