async function loadHighScore() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    document.getElementById("highscore").textContent =
      "最高スコア：未ログイン";
    return;
  }

  try {
    const apiURL = `${window.location.origin}/api/getScore`;

    const res = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("highscore").textContent =
        "最高スコア：" + data.score + "回";
    } else {
      document.getElementById("highscore").textContent =
        "最高スコア：取得エラー";
    }
  } catch (err) {
    document.getElementById("highscore").textContent =
      "最高スコア：通信エラー";
  }
}

window.addEventListener("DOMContentLoaded", loadHighScore);
