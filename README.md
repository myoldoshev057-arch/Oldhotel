# 🏨 Old Tashkent Hotel & Spa — Telegram Bot

Node.js + Telegraf.js bilan yozilgan professional mehmonxona boti.

---

## ⚡ Xususiyatlar

- 🛏 Barcha xona turlari va jihozlari
- 🎯 Xizmatlar (restoran, SPA, basseyn va boshqalar)
- 📅 **Bron qilish** (7 bosqichli forma → adminga xabar)
- 📍 Xarita + manzil + aloqa
- ℹ️ Mehmonxona haqida + sharhlar
- 📋 Qoidalar
- 🌐 3 tilda (kengaytirish mumkin)

---

## 🚀 RENDER.COM DA DEPLOY QILISH (BEPUL)

### 1-qadam: Fayllarni GitHub ga yuklash

```bash
git clone https://github.com/SIZNING_REPO
cd oldtashkent-bot
git add .
git commit -m "Add telegram bot"
git push
```

### 2-qadam: Render.com da ro'yxatdan o'tish

1. https://render.com ga kiring
2. "New +" → "Web Service" tanlang
3. GitHub repo ni ulang
4. Quyidagi sozlamalarni kiriting:

| Sozlama | Qiymat |
|---------|--------|
| **Name** | oldtashkent-bot |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node bot.js` |
| **Instance Type** | Free |

### 3-qadam: Environment Variables qo'shish

Render.com → Environment bo'limiga:

```
BOT_TOKEN=7xxxxxxxxxx:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_CHAT_ID=123456789
```

### 4-qadam: "Create Web Service" bosing → Deploy tayyor! ✅

---

## 🔑 BOT_TOKEN olish

1. Telegramda @BotFather ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting
4. Token ko'chiring

---

## 👤 ADMIN_CHAT_ID olish

1. @userinfobot ga `/start` yuboring
2. U sizning ID raqamingizni beradi
3. Shu raqamni ADMIN_CHAT_ID ga kiriting

---

## 🖥 Lokal ishga tushirish (test uchun)

```bash
npm install
cp .env.example .env
# .env faylini to'ldiring
node bot.js
```

---

## 📁 Fayl tuzilmasi

```
oldtashkent-bot/
├── bot.js        ← Asosiy bot kodi
├── data.js       ← Mehmonxona ma'lumotlari
├── package.json
├── .env.example
└── README.md
```

---

## ✏️ Ma'lumotlarni yangilash

`data.js` faylida narxlar, xonalar, xizmatlarni osongina o'zgartirishingiz mumkin.

---

*Old Tashkent Hotel & Spa Bot — 2025*
