// ログインチェック
const userId = localStorage.getItem("userId");
if (!userId) {
  alert("ログインしてください");
  window.location.href = "/";
}

// 左上にユーザー名表示
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const userInfoBox = document.getElementById("user-info");

  if (userInfoBox) {
    userInfoBox.textContent = `ユーザー名：${username || ""}`;
  } else {
    console.log("user-info が HTML に見つかりません");
  }
});

// ログアウト処理
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");

  alert("ログアウトしました");
  window.location.href = "/";
}

// グローバル公開
window.logout = logout;
