import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const discordLoginUrl = 
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI)}` +
    `&response_type=code&scope=identify%20email`;

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <header style={{ marginBottom: "40px", borderBottom: "2px solid #007bff", paddingBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: 60 }} />
          <div>
            <h1 style={{ color: "#007bff", fontSize: "28px", textShadow: "0 0 10px rgba(0,123,255,0.5)" }}>SLS FREEROOM</h1>
            <span>سرفر FiveM للعب الحر</span>
          </div>
        </div>
      </header>

      {!user ? (
        <a href={discordLoginUrl} style={{
          display: "inline-block",
          backgroundColor: "#5865F2",
          color: "#fff",
          padding: "15px 25px",
          borderRadius: "8px",
          fontWeight: "bold",
          textDecoration: "none"
        }}>
          تسجيل الدخول عبر ديسكورد
        </a>
      ) : (
        <div>
          <h2>مرحبا، {user.username}#{user.discriminator}</h2>
          <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ borderRadius: "50%", width: "100px" }} />
          <p>تم تسجيل الدخول بحساب ديسكورد الخاص بك.</p>
        </div>
      )}
    </div>
  );
}
