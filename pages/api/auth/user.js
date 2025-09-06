export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/discordUser=([^;]+)/);
  if (!match) {
    return res.status(401).json({ error: "غير مسجل الدخول" });
  }
  try {
    const user = JSON.parse(decodeURIComponent(match[1]));
    res.status(200).json({ user });
  } catch {
    res.status(400).json({ error: "كوكي غير صالح" });
  }
}
