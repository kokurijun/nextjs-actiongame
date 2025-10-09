// キャンバスの設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// プレイヤーの作成(初期位置)

const player = new Player(100, canvas.height - 100);
const bullets = [];
const enemies = [];
// Title未実装
const scene = ["title", "game", "gameover"];

// シーンの初期化
let currentScene = scene[2];
// プレイヤーで使う変数
let rightPressed = false;
let leftPressed = false;
let jump = false;

//ゲームの初期化
function init() {
    // プレイヤーの初期位置
    player.x = 100;
    player.y = canvas.height - 100;
    player.jumpflg = false;
    player.fall = false;
    player.nowpoint = 0;

    // 敵の初期化
    enemies.length = 0; // 敵の配列を空にする
    while (enemies.length > 0) {
        enemies.pop(); // 敵を削除
    }

    // キーボードの状態をリセット
    rightPressed = false;
    leftPressed = false;
    jump = false;
}

// キーボードのイベントリスナー
//押し込んだとき
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    if ((e.key === " " || e.key === "w") && player.jumpflg === false && player.fall === false) jump = true;
});

//離したとき
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
});

// 敵を追加する関数
function addEnemy() {
    //敵の初期位置（配列化）
    enemies.push(new Enemy(canvas.width - 40, canvas.height - 100));
}

setInterval(addEnemy, 3000); // 3秒ごとに敵を追加

// ゲームの更新処理
function update() {
    // プレイヤーの移動処理
    player.move(leftPressed, rightPressed, canvas.height, jump);
    jump = false;

    // 敵の移動処理
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
    }

    // 当たり判定
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y) {
            // 当たった場合の処理
            enemies.splice(i, 1);               // 敵を削除
            alert("Game Over! \n Enterでリスタート");        // ゲームオーバーのアラート
            init(); // ゲームをリセット
        }
    }
}

// ゲームループ
function gameLoop() {
    update();
    draw(ctx, player, enemies);
    requestAnimationFrame(gameLoop);
}

gameLoop(); // ゲーム開始
