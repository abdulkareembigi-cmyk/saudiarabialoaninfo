const https = require("https");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || "9277500325:AAGqPheBTQDXr8sa11SxgWLNIPNKDeJ9dkk";
  const chatId = process.env.TELEGRAM_CHAT_ID || "8998729017";

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const text = body && body.text ? String(body.text) : "";
  if (!text.trim()) {
    return res.status(400).json({ ok: false, error: "Empty message" });
  }

  const payload = JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" });

  const tgReq = https.request(
    {
      hostname: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    },
    (tgRes) => {
      let data = "";
      tgRes.on("data", (chunk) => (data += chunk));
      tgRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) return res.status(502).json({ ok: false, error: parsed.description });
          return res.status(200).json({ ok: true });
        } catch (e) {
          return res.status(500).json({ ok: false, error: "Invalid Telegram response" });
        }
      });
    }
  );

  tgReq.on("error", (err) => res.status(500).json({ ok: false, error: err.message }));
  tgReq.write(payload);
  tgReq.end();
};
```[cite: 1]

<FollowUp label="Want me to explain how to check if index.html is calling /api/telegram?" query="Yes, show me how to check if index.html on GitHub is calling /api/telegram properly."/>
