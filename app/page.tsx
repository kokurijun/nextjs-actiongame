"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/actiongame/html/title.html";
    } else {
      alert("ログインに失敗しました");
    }
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
          position: "relative",
        }}
      >
        {/* 🔵 ヘッダー部分 */}
        <div
          style={{
            width: "calc(100% + 56px)", // 左右 padding 分広げる
            marginLeft: "-28px",
            marginRight: "-28px",
            marginTop: "-28px",
            padding: "16px 0",
            background: "#1976d2",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px 12px 0 0",
            marginBottom: "25px",
          }}
        >
          ログイン
        </div>

        {/* 🔲 入力フォーム */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        {/* 🔵 ログインボタン */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          ログイン
        </button>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <a
            href="/register"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            新規登録はこちら
          </a>
        </p>
      </div>
    </div>
  );
}
