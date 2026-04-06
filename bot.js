require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");
const { HOTEL, ROOMS, SERVICES, NEARBY, POLICIES } = require("./data");

// ─── Bot yaratish ────────────────────────────────────────────
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const ADMIN_ID = process.env.ADMIN_CHAT_ID;

// ─── Yordamchi: session boshlash ────────────────────────────
function initSession(ctx) {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.booking) ctx.session.booking = {};
}

// ═══════════════════════════════════════════════════════════════
//  ASOSIY MENYU KLAVIATURASI
// ═══════════════════════════════════════════════════════════════
function mainMenu() {
  return Markup.keyboard([
    ["🛏 Xona turlari", "🎯 Xizmatlar"],
    ["📅 Bron qilish", "📍 Manzil & Aloqa"],
    ["ℹ️ Mehmonxona haqida", "📋 Qoidalar"],
  ]).resize();
}

// ═══════════════════════════════════════════════════════════════
//  /start
// ═══════════════════════════════════════════════════════════════
bot.start((ctx) => {
  initSession(ctx);
  const name = ctx.from.first_name || "Mehmon";
  ctx.replyWithPhoto(
    { url: "https://oldtashkenthotel.uz/images/hotel-main.jpg" },
    {
      caption:
        `🌟 *Xush kelibsiz, ${name}!*\n\n` +
        `${HOTEL.name}\n` +
        `${HOTEL.stars} | Reyting: ${HOTEL.rating}\n\n` +
        `Toshkentning qoq markazida, ${HOTEL.rooms_total} ta xona,\n` +
        `SPA, basseyn, restoran va ko'p narsa sizni kutmoqda!\n\n` +
        `Quyidagi menyudan tanlang 👇`,
      parse_mode: "Markdown",
      ...mainMenu(),
    }
  ).catch(() => {
    // Agar rasm yuklanmasa, matnsiz yuborish
    ctx.reply(
      `🌟 *Xush kelibsiz, ${name}!*\n\n` +
        `${HOTEL.name}\n` +
        `${HOTEL.stars} | Reyting: ${HOTEL.rating}\n\n` +
        `Toshkentning qoq markazida joylashgan,\n` +
        `${HOTEL.rooms_total} ta xona, SPA, basseyn, restoran!\n\n` +
        `Quyidagi menyudan tanlang 👇`,
      { parse_mode: "Markdown", ...mainMenu() }
    );
  });
});

// ═══════════════════════════════════════════════════════════════
//  XONA TURLARI
// ═══════════════════════════════════════════════════════════════
bot.hears("🛏 Xona turlari", (ctx) => {
  const buttons = ROOMS.map((r) =>
    [Markup.button.callback(`${r.emoji} ${r.name}`, `room_${r.id}`)]
  );
  ctx.reply(
    `🛏 *Xona turlarini tanlang:*\n\nMehmonxonada jami *${HOTEL.rooms_total} ta* xona mavjud.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard(buttons),
    }
  );
});

// Xona detail
ROOMS.forEach((room) => {
  bot.action(`room_${room.id}`, (ctx) => {
    ctx.answerCbQuery();
    const features = room.features.join("\n");
    const text =
      `${room.emoji} *${room.name}*\n\n` +
      `👥 Sig'im: ${room.capacity}\n` +
      `💰 Narx: *${room.price}*\n\n` +
      `📝 ${room.description}\n\n` +
      `*Jihozlar:*\n${features}`;

    ctx.editMessageText(text, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📅 Shu xonani bron qilish", `book_room_${room.id}`)],
        [Markup.button.callback("⬅️ Orqaga", "back_rooms")],
      ]),
    });
  });
});

bot.action("back_rooms", (ctx) => {
  ctx.answerCbQuery();
  const buttons = ROOMS.map((r) =>
    [Markup.button.callback(`${r.emoji} ${r.name}`, `room_${r.id}`)]
  );
  ctx.editMessageText(
    `🛏 *Xona turlarini tanlang:*\n\nMehmonxonada jami *${HOTEL.rooms_total} ta* xona mavjud.`,
    { parse_mode: "Markdown", ...Markup.inlineKeyboard(buttons) }
  );
});

// ═══════════════════════════════════════════════════════════════
//  XIZMATLAR
// ═══════════════════════════════════════════════════════════════
bot.hears("🎯 Xizmatlar", (ctx) => {
  ctx.reply("🎯 *Xizmat turini tanlang:*", {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("🍳 Ovqatlanish", "svc_food")],
      [Markup.button.callback("🏊 Sport & Dam olish", "svc_recreation")],
      [Markup.button.callback("🛎 Umumiy Xizmatlar", "svc_general")],
    ]),
  });
});

["food", "recreation", "general"].forEach((key) => {
  bot.action(`svc_${key}`, (ctx) => {
    ctx.answerCbQuery();
    const s = SERVICES[key];
    const list = s.items.map((i) => `• ${i}`).join("\n");
    ctx.editMessageText(`${s.emoji} *${s.name}*\n\n${list}`, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Orqaga", "back_services")],
      ]),
    });
  });
});

bot.action("back_services", (ctx) => {
  ctx.answerCbQuery();
  ctx.editMessageText("🎯 *Xizmat turini tanlang:*", {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("🍳 Ovqatlanish", "svc_food")],
      [Markup.button.callback("🏊 Sport & Dam olish", "svc_recreation")],
      [Markup.button.callback("🛎 Umumiy Xizmatlar", "svc_general")],
    ]),
  });
});

// ═══════════════════════════════════════════════════════════════
//  MANZIL & ALOQA
// ═══════════════════════════════════════════════════════════════
bot.hears("📍 Manzil & Aloqa", async (ctx) => {
  await ctx.reply(
    `📍 *Bizning manzilimiz:*\n\n` +
      `🏨 ${HOTEL.name}\n` +
      `📌 ${HOTEL.address}\n\n` +
      `📞 Tel: ${HOTEL.phone}\n` +
      `💬 WhatsApp: ${HOTEL.phone}\n` +
      `🌐 Sayt: ${HOTEL.website}\n\n` +
      `✈️ Aeroportdan: ~4 km (12 daqiqa)\n` +
      `🏙️ Markazdan: ~3.4 km\n\n` +
      `*Yaqin joylar:*\n` +
      NEARBY.map((n) => `${n.emoji} ${n.name} — ${n.distance}`).join("\n"),
    { parse_mode: "Markdown" }
  );
  // Xarita yuborish
  await ctx.replyWithLocation(HOTEL.location.lat, HOTEL.location.lon);
});

// ═══════════════════════════════════════════════════════════════
//  MEHMONXONA HAQIDA
// ═══════════════════════════════════════════════════════════════
bot.hears("ℹ️ Mehmonxona haqida", (ctx) => {
  ctx.reply(
    `${HOTEL.name}\n` +
      `${HOTEL.stars} | ${HOTEL.rating}\n\n` +
      `📖 *Biz haqimizda:*\n` +
      `Old Tashkent Hotel & Spa — Toshkentning Yakkasaroy tumanida joylashgan ` +
      `zamonaviy 3 yulduzli mehmonxona. ${HOTEL.floors} qavatli bino, ${HOTEL.rooms_total} ta xona.\n\n` +
      `Mehmonxonada milliy uslub va zamonaviy qulaylik uyg'unlashgan. ` +
      `Aeroportdan atigi 12 daqiqada!\n\n` +
      `*Asosiy afzalliklar:*\n` +
      `🏊 SPA, basseyn, sauna\n` +
      `🍳 Ajoyib bufet nonushta\n` +
      `☕ Donli qahva (avtomat)\n` +
      `🅿️ Bepul avtoturargoh\n` +
      `📶 Bepul Wi-Fi (hamma joyda)\n` +
      `✈️ Transfer xizmati\n` +
      `🌿 Xususiy bog' va teras\n\n` +
      `*Mehmonlar sharhlari:*\n` +
      `⭐ "Nonushta ajoyib, xona toza, xodimlar mehribon"\n` +
      `⭐ "Aeroport yaqin, basseyn yaxshi, transfer tez"\n` +
      `⭐ "Toza, zamonaviy, xodimlari juda yordamchi"`,
    { parse_mode: "Markdown" }
  );
});

// ═══════════════════════════════════════════════════════════════
//  QOIDALAR
// ═══════════════════════════════════════════════════════════════
bot.hears("📋 Qoidalar", (ctx) => {
  const policies = POLICIES.map((p) => `• ${p}`).join("\n");
  ctx.reply(
    `📋 *Mehmonxona qoidalari:*\n\n${policies}\n\n` +
      `ℹ️ Bron bekor qilish shartlari tanlangan tarif turiga bog'liq. ` +
      `Bron paytida aniqroq ma'lumot olishingiz mumkin.`,
    { parse_mode: "Markdown" }
  );
});

// ═══════════════════════════════════════════════════════════════
//  BRON QILISH — STEP-BY-STEP
// ═══════════════════════════════════════════════════════════════

// Bron qilishni boshlash (menyu tugmasi)
bot.hears("📅 Bron qilish", (ctx) => startBooking(ctx));

// Xona sahifasidan bron boshlash
ROOMS.forEach((room) => {
  bot.action(`book_room_${room.id}`, (ctx) => {
    ctx.answerCbQuery();
    initSession(ctx);
    ctx.session.booking = { room_id: room.id, room_name: room.name };
    ctx.session.step = "checkin";
    ctx.reply(
      `📅 *${room.name}* uchun bron:\n\n` +
        `*1-qadam:* Kelish sanangizni kiriting\n` +
        `📌 Format: KK.OO.YYYY (masalan: 25.07.2025)`,
      { parse_mode: "Markdown", ...Markup.removeKeyboard() }
    );
  });
});

function startBooking(ctx) {
  initSession(ctx);
  ctx.session.booking = {};
  ctx.session.step = "room_select";

  const buttons = ROOMS.map((r) =>
    [Markup.button.callback(`${r.emoji} ${r.name}`, `bselect_${r.id}`)]
  );
  ctx.reply("📅 *Bron qilish*\n\n*1-qadam:* Xona turini tanlang:", {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons),
  });
}

// Xona tanlash (bron oqimida)
ROOMS.forEach((room) => {
  bot.action(`bselect_${room.id}`, (ctx) => {
    ctx.answerCbQuery();
    initSession(ctx);
    ctx.session.booking.room_id = room.id;
    ctx.session.booking.room_name = room.name;
    ctx.session.step = "checkin";
    ctx.editMessageText(
      `✅ Tanlandi: *${room.name}*\n\n` +
        `*2-qadam:* Kelish sanangizni kiriting\n` +
        `📌 Format: KK.OO.YYYY (masalan: 25.07.2025)`,
      { parse_mode: "Markdown" }
    );
  });
});

// ─── Matn xabarlari (step handler) ──────────────────────────
bot.on("text", async (ctx) => {
  initSession(ctx);
  const step = ctx.session.step;
  const text = ctx.message.text;

  // Menyu tugmalarini o'tkazib yuborish
  const menuButtons = ["🛏 Xona turlari","🎯 Xizmatlar","📅 Bron qilish","📍 Manzil & Aloqa","ℹ️ Mehmonxona haqida","📋 Qoidalar"];
  if (menuButtons.includes(text)) return;

  // ── Bron jarayoni ──
  if (step === "checkin") {
    if (!isValidDate(text)) {
      return ctx.reply("❌ Noto'g'ri format. Iltimos qaytadan kiriting:\n📌 KK.OO.YYYY (masalan: 25.07.2025)");
    }
    ctx.session.booking.checkin = text;
    ctx.session.step = "checkout";
    return ctx.reply(
      `✅ Kelish sanasi: *${text}*\n\n*3-qadam:* Ketish sanangizni kiriting\n📌 Format: KK.OO.YYYY`,
      { parse_mode: "Markdown" }
    );
  }

  if (step === "checkout") {
    if (!isValidDate(text)) {
      return ctx.reply("❌ Noto'g'ri format. Iltimos qaytadan kiriting:\n📌 KK.OO.YYYY");
    }
    ctx.session.booking.checkout = text;
    ctx.session.step = "guests";
    return ctx.reply(
      `✅ Ketish sanasi: *${text}*\n\n*4-qadam:* Mehmonlar sonini kiriting\n📌 Masalan: 2 katta, 1 bola`,
      { parse_mode: "Markdown" }
    );
  }

  if (step === "guests") {
    ctx.session.booking.guests = text;
    ctx.session.step = "name";
    return ctx.reply(
      `✅ Mehmonlar: *${text}*\n\n*5-qadam:* To'liq ismingizni kiriting`,
      { parse_mode: "Markdown" }
    );
  }

  if (step === "name") {
    ctx.session.booking.name = text;
    ctx.session.step = "phone";
    return ctx.reply(
      `✅ Ism: *${text}*\n\n*6-qadam:* Telefon raqamingizni kiriting\n📌 Masalan: +998901234567`,
      { parse_mode: "Markdown" }
    );
  }

  if (step === "phone") {
    ctx.session.booking.phone = text;
    ctx.session.step = "wishes";
    return ctx.reply(
      `✅ Telefon: *${text}*\n\n*7-qadam (ixtiyoriy):* Maxsus xohishingiz bormi?\n` +
        `Masalan: baland qavat, tinch xona, erta kirish...\n\n_(Xohish bo'lmasa "Yo'q" yozing)_`,
      { parse_mode: "Markdown" }
    );
  }

  if (step === "wishes") {
    ctx.session.booking.wishes = text === "Yo'q" ? "—" : text;
    ctx.session.step = null;

    const b = ctx.session.booking;
    const summary =
      `📋 *Bron ma'lumotlari:*\n\n` +
      `🛏 Xona: ${b.room_name}\n` +
      `📅 Kelish: ${b.checkin}\n` +
      `📅 Ketish: ${b.checkout}\n` +
      `👥 Mehmonlar: ${b.guests}\n` +
      `👤 Ism: ${b.name}\n` +
      `📞 Telefon: ${b.phone}\n` +
      `💬 Xohish: ${b.wishes}`;

    await ctx.reply(summary, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("✅ Tasdiqlash va yuborish", "confirm_booking")],
        [Markup.button.callback("❌ Bekor qilish", "cancel_booking")],
      ]),
    });
  }
});

// ─── Bron tasdiqlash ────────────────────────────────────────
bot.action("confirm_booking", async (ctx) => {
  ctx.answerCbQuery();
  initSession(ctx);
  const b = ctx.session.booking;
  const user = ctx.from;

  const adminMsg =
    `🔔 *YANGI BRON SO'ROVI!*\n\n` +
    `🛏 Xona: ${b.room_name}\n` +
    `📅 Kelish: ${b.checkin}\n` +
    `📅 Ketish: ${b.checkout}\n` +
    `👥 Mehmonlar: ${b.guests}\n` +
    `👤 Ism: ${b.name}\n` +
    `📞 Telefon: ${b.phone}\n` +
    `💬 Xohish: ${b.wishes}\n\n` +
    `─────────────────\n` +
    `Telegram: @${user.username || "yo'q"}\n` +
    `User ID: ${user.id}\n` +
    `Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

  // Adminga yuborish
  if (ADMIN_ID) {
    await bot.telegram.sendMessage(ADMIN_ID, adminMsg, {
      parse_mode: "Markdown",
    }).catch(() => {});
  }

  ctx.session.booking = {};

  await ctx.editMessageText(
    `✅ *Bron so'rovingiz qabul qilindi!*\n\n` +
      `Xodimlarimiz tez orada *${b.phone}* raqamiga qo'ng'iroq qiladi va bronni tasdiqlaydi.\n\n` +
      `⏰ Ish vaqti: 09:00 – 22:00\n` +
      `📞 Savollar uchun: ${HOTEL.phone}`,
    { parse_mode: "Markdown" }
  );

  await ctx.reply("Bosh menyuga qaytish:", mainMenu());
});

// ─── Bron bekor qilish ──────────────────────────────────────
bot.action("cancel_booking", async (ctx) => {
  ctx.answerCbQuery();
  initSession(ctx);
  ctx.session.booking = {};
  ctx.session.step = null;
  await ctx.editMessageText("❌ Bron bekor qilindi.");
  ctx.reply("Bosh menyuga qaytdingiz:", mainMenu());
});

// ═══════════════════════════════════════════════════════════════
//  YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════
function isValidDate(str) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(str);
}

// ─── Noma'lum xabarlar ──────────────────────────────────────
bot.on("message", (ctx) => {
  ctx.reply(
    "Iltimos, quyidagi menyudan tanlang 👇",
    mainMenu()
  );
});

// ═══════════════════════════════════════════════════════════════
//  BOTNI ISHGA TUSHIRISH
// ═══════════════════════════════════════════════════════════════
bot.launch()
  .then(() => console.log("✅ Old Tashkent Hotel Bot ishga tushdi!"))
  .catch((err) => console.error("❌ Bot xatosi:", err));

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
