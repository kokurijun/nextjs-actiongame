// ログインチェック
const userId = localStorage.getItem("userId");
if (!userId) {
  alert("ログインしてください");
  window.location.href = "/";
}

// 左上にユーザー名表示
const userName = localStorage.getItem("userName");

// HTML に user-info がある場合のみ表示
document.addEventListener("DOMContentLoaded", () => {
  const userInfoBox = document.getElementById("user-info");

  if (userInfoBox) {
    // ユーザー名が取得できなくても「ユーザー名：」は表示される
    userInfoBox.textContent = `ユーザー名：${userName || ""}`;
    console.log("ユーザー名を表示しました:", userName);
  } else {
    console.log("user-info が HTML に見つかりません");
  }
});

//ログアウト処理
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");

  alert("ログアウトしました");
  window.location.href = "/";
}

// 他のスクリプトやHTMLから使えるようにする
window.logout = logout;
