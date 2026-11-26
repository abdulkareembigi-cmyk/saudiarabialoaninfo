module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || "9277500325:AAGqPheBTQDXr8sa11SxgWLNIPNKDeJ9dkk";
  const chatId = process.env.TELEGRAM_CHAT_ID || "8998729017";

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const text = body && body.text ? String(body.text) : "";
  if (!text.trim()) {
    return res.status(400).json({ ok: false, error: "Empty message" });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML"
      })
    });

    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(502).json({ ok: false, error: data.description || "Telegram error" });
    }

    return res.status(200).json({ ok: true, result: data.result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
};
```[cite: 1]

<FollowUp label="Want me to explain how to check Vercel function logs if the error continues?" query="Yes, show me how to check Vercel function logs if the 500 error still happens after updating api/telegram.js."/>
