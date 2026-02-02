import { draw, setMap, getCurrentMap } from './draw.js';
import { progression } from './progression.js'; // 🔹 追加
import { loadMap } from './map.js';
import { Player } from './player.js';
import { spawnEnemiesForMap } from "./enemySpawn.js";
import { isHit } from './collision.js';

import { Enemy } from './enemy.js';
import { startBattle, updateBattle, onBattleClick } from './battle.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new Player(100, canvas.height - 100);
const bullets = [];
const enemies = [];

// キー操作フラグ
let rightPressed = false;
let leftPressed = false;
let jump = false;

// camera variables
let cameraX = 0;
const cameraSpeed = 5;

// clearCount is now managed by progression.js
// let clearCount = 0;
// localStorage.setItem("clearCount", clearCount);


// ゲーム初期化
function init() {
    player.x = 100;
    player.y = canvas.height - 88;
    player.jumpflg = false;
    player.fall = false;
    player.nowpoint = 0;

    // 🔽 progressionからステータスを適用
    progression.init();
    player.maxHp = progression.data.maxHp;
    player.maxMp = progression.data.maxMp;
    player.attack = progression.data.attack;

    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.invincible = false;
    player.invincibleTime = 0;

    enemies.length = 0;
    rightPressed = false;
    leftPressed = false;
    jump = false;
}

// キーボード
document.addEventListener("keydown", (e) => {

    // デフォルトのスクロールを防ぐ
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    if ((e.key === " " || e.key === "w" || e.key === "ArrowUp") && !player.jumpflg && !player.fall) jump = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
});


// GameOver, GameClear時のマウスクリック
canvas.addEventListener("click", (e) => {
    // バトル中のクリック
    if (gameState === "battle") {
        onBattleClick(e, canvas, player, enemies, (newState) => {
            gameState = newState;
            // バトル終了時にキー入力をリセット
            if (newState === "play") {
                rightPressed = false;
                leftPressed = false;
                jump = false;
            }
        });
        return;
    }

    if (gameState !== "gameclear") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // RESTART ボタン
    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 20 && mouseY <= canvas.height / 2 + 70) {
        restartGame();
    }

    // TITLE ボタン
    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 90 && mouseY <= canvas.height / 2 + 140) {
        goToTitle();
    }
});

async function restartGame() {
    // 🔽 マップを再読み込み
    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    const map = await loadMap(randomMap);
    setMap(map);
    init();
    spawnEnemiesForMap(randomMap, enemies);

    // 🔽 プレイヤー初期化
    player.x = 100;
    player.y = canvas.height - 88;
    player.dead = false;
    player.goal = false;
    player.jumpflg = false;
    player.fall = false;

    // 🔽 ゲーム状態リセット
    gameState = "play";
}


function goToTitle() {
    alert("タイトル画面に戻ります。");
    player.x = 100;
    player.y = canvas.height - 124;
    player.dead = false;
    gameState = "play";
    window.location.href = "title.html";
}


// ゲーム状態
let gameState = "play";

// ゲーム更新
function update() {
    // 無敵時間の更新
    if (player.invincibleTime > 0) {
        player.invincibleTime--;
        player.invincible = true;
    } else {
        player.invincible = false;
    }

    // ゲームオーバー時は動作停止
    if (gameState !== "play") return;

    const currentMap = getCurrentMap();

    // プレイヤーの移動処理
    player.move(leftPressed, rightPressed, canvas.width, jump, currentMap);
    jump = false;

    // ゲームオーバー判定
    if (player.dead) {
        gameState = "gameover";
        progression.reset(); // 🔹 ゲームオーバー時にリセット
        window.location.href = "gameover.html";

        return;
    }

    // ゲームクリア判定
    if (player.goal) {
        gameState = "gameclear";
        progression.addClearCount(); // 🔹 クリア回数加算
        console.log("クリア！ 総クリア回数:", progression.data.totalClears);

        return;
    }

    // カメラの追従
    const centerX = canvas.width / 2;

    // マップの端では止める
    const mapPixelWidth = currentMap.width * currentMap.tilewidth;
    if (cameraX < 0) cameraX = 0;

    console.log("キャラクター位置_x:", player.x);
    console.log("キャラクター位置_y:", player.y);
    if (cameraX > mapPixelWidth - canvas.width) {
        cameraX = mapPixelWidth - canvas.width;
    }

    // 敵の移動
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();

        // --- プレイヤーと敵の当たり判定 ---
        if (isHit(player, enemies[i])) {
            // 無敵時間中はバトルしない
            if (player.invincible) continue;

            startBattle(enemies[i], (newState) => gameState = newState, player);
        }
    }
}

// ゲームループ
function gameLoop() {
    if (gameState === "battle") {
        updateBattle(player, (newState) => gameState = newState);
    } else {
        update();
    }
    draw(ctx, player, enemies, gameState);
    requestAnimationFrame(gameLoop);
}


// --- 用意しているマップ ---
const availableMaps = ["map1", "map2", "map3", "map4"];

// --- ゲーム開始 ---
async function startGame() {
    // マップをランダムで選ぶ
    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];

    // マップを読み込み
    const map = await loadMap(randomMap);
    setMap(map);
    init();
    spawnEnemiesForMap(randomMap, enemies);
    gameLoop();
}

startGame();
