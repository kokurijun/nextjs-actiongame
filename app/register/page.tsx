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
      setMessage("サーバーエラーが発生しました");
      return;
    }

    if (!res.ok) {
      setMessage(data.error || "登録に失敗しました");
      return;
    }

    alert("登録が完了しました！");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "28px",
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🔵 ヘッダー部分 */}
        <div
          style={{
            width: "calc(100% + 56px)", // 左右padding分
            marginLeft: "-28px",
            marginRight: "-28px",
            marginTop: "-28px",
            padding: "16px 0",
            background: "#09b303bb",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px 12px 0 0",
            marginBottom: "25px",
          }}
        >
          新規登録
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#09b303bb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            登録
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", color: "red", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <a
            href="/"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            ログイン画面に戻る
          </a>
        </p>
      </div>
    </div>
  );
}
