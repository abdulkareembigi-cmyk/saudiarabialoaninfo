export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || "9277500325:AAGqPheBTQDXr8sa11SxgWLNIPNKDeJ9dkk";
  const chatId = process.env.TELEGRAM_CHAT_ID || "8998729017";
  const text = req.body && req.body.text ? String(req.body.text) : "";

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
}
```

<ElicitationsGroup message="Agar file banane ya chalane mein koi masla aaye to batayein:">
  <Elicitation label="Add file nahi mil raha" query="GitHub repository mein Add file ka option kahan hota hai aur usay kaise kholte hain?"/>
  <Elicitation label="Vercel deploy nahi hua" query="GitHub mein api/telegram.js add karne ke baad Vercel par khud redeploy nahi ho raha, kya karoon?"/>
  <Elicitation label="Bot ko /start bhejna" query="Telegram bot ko /start kaise bhejte hain aur kya uske bina message nahi aata?"/>
</ElicitationsGroup>
