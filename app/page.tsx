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

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.userName);

    window.location.href = "/actiongame/html/title.html";
  } else {
    alert("ログイン失敗");
  }
};

  return (
    <div style={{ padding: 40 }}>
      <h1>ログイン</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザー名"
      /><br/>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
      /><br/>

      <button onClick={handleLogin}>ログイン</button>

      <p>
      <a href="/register">新規登録はこちら</a>
      </p>


    </div>

    
  );
}
