"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert("サーバーエラーが発生しました");
      return;
    }

    if (!res.ok) {
      alert(data.error || "エラーが発生しました");
      return;
    }

    // 🔥 登録成功 → アラート表示 → ログイン画面へ戻す
    alert("登録が完了しました！");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>新規登録</h1>

      <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
        <div>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginBottom: "12px", padding: "8px", width: "200px" }}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "12px", padding: "8px", width: "200px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          登録
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
