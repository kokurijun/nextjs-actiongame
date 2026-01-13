import { drawMap } from "./map.js";

let currentMap = null;
let cameraX = 0;

export function setMap(map) {
    currentMap = map;
}

export function getCurrentMap() {
    return currentMap;
}

export function draw(ctx, player, enemies, gameState) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // --- マップのスクロール制御 ---
    // --- 通常プレイ画面 ---
    if (gameState === "play") {
        if (currentMap) {
            const mapPixelWidth = currentMap.width * currentMap.tilewidth;

            // プレイヤー中心でスクロール
            cameraX = player.x - ctx.canvas.width / 2;

            // マップ端の制限
            if (cameraX < 0) cameraX = 0;
            if (cameraX > mapPixelWidth - ctx.canvas.width) {
                cameraX = mapPixelWidth - ctx.canvas.width;
            }

            // --- マップ描画 ---
            drawMap(ctx, currentMap, cameraX);
        }

        // --- プレイヤー描画 ---
        player.drawWithCamera(ctx, cameraX);

        // --- 敵描画 ---
        enemies.forEach(enemy => {
            enemy.draw(ctx, cameraX);
        });
    }
    // --- ゲームクリア画面 ---
    if (gameState === "gameclear") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME CLEAR", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);

        ctx.fillStyle = "#ff5555";
        ctx.fillRect(ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 20, 200, 50);
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText("次のステージへ", ctx.canvas.width / 2, ctx.canvas.height / 2 + 55);

        ctx.fillStyle = "#5555ff";
        ctx.fillRect(ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 90, 200, 50);
        ctx.fillStyle = "white";
        ctx.fillText("タイトルに戻る", ctx.canvas.width / 2, ctx.canvas.height / 2 + 125);
    }

    // --- バトル画面 ---
    if (gameState === "battle") {
        // 背景のマップ等はそのまま描画（プレイ中の状態を維持）
        if (currentMap) {
            const mapPixelWidth = currentMap.width * currentMap.tilewidth;
            // カメラ位置は更新しない（固定）
            drawMap(ctx, currentMap, cameraX);
        }
        // プレイヤー描画
        if (player.invincible) {
            // 点滅させる (0.5秒おきとか、フレームで割って透明度変える)
            // 簡易的に透明度を下げる
            ctx.globalAlpha = 0.5;
        }
        player.drawWithCamera(ctx, cameraX);
        // 透明度リセット
        ctx.globalAlpha = 1.0;
        enemies.forEach(enemy => {
            enemy.draw(ctx, cameraX);
        });

        // バトルUI描画
        drawBattle(ctx, player, window.battleState);
    }
}

export function drawBattle(ctx, player, battleState) {
    if (!battleState) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // 半透明の背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, width, height);

    // バトルウィンドウ
    const windowX = 50;
    const windowY = height - 150;
    const windowW = width - 100;
    const windowH = 130;

    ctx.fillStyle = "#222";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.fillRect(windowX, windowY, windowW, windowH);
    ctx.strokeRect(windowX, windowY, windowW, windowH);

    // テキスト設定
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";

    // ログ表示 (最大4行)
    const logs = battleState.logs || [];
    logs.forEach((log, index) => {
        ctx.fillText(log, windowX + 20, windowY + 30 + (index * 25));
    });

    // プレイヤーHP / MP
    ctx.textAlign = "right";
    ctx.fillText(`Player HP: ${player.hp} / ${player.maxHp}`, width - 60, windowY + 40);
    ctx.fillText(`MP: ${player.mp} / ${player.maxMp}`, width - 60, windowY + 70);

    // 敵情報
    if (battleState.enemy) {
        ctx.fillText(`${battleState.enemy.name} HP: ${battleState.enemy.hp} / ${battleState.enemy.maxHp}`, width - 60, windowY + 100);
    }

    ctx.textAlign = "left"; // 戻す

    // コマンドボタン (プレイヤーのターンのみ表示)
    if (battleState.turn === "player") {
        const btnW = 100;
        const btnH = 40;
        // ボタン位置を右にずらす (350 -> 500)
        const startX = windowX + 500;
        const startY = windowY + 20;

        ctx.textAlign = "center"; // 文字を中央揃え
        const textOffsetY = 28;   // Y座標調整

        // たたかう (左上)
        ctx.fillStyle = "#444";
        ctx.fillRect(startX, startY, btnW, btnH);
        ctx.strokeRect(startX, startY, btnW, btnH);
        ctx.fillStyle = "white";
        ctx.fillText("たたかう", startX + btnW / 2, startY + textOffsetY);

        // まほう (右上)
        ctx.fillStyle = "#444";
        ctx.fillRect(startX + 110, startY, btnW, btnH);
        ctx.strokeRect(startX + 110, startY, btnW, btnH);
        ctx.fillStyle = "white";
        ctx.fillText("まほう", startX + 110 + btnW / 2, startY + textOffsetY);

        // ぼうぎょ (左下)
        ctx.fillStyle = "#444";
        ctx.fillRect(startX, startY + 50, btnW, btnH);
        ctx.strokeRect(startX, startY + 50, btnW, btnH);
        ctx.fillStyle = "white";
        ctx.fillText("ぼうぎょ", startX + btnW / 2, startY + 50 + textOffsetY);

        // にげる (右下)
        ctx.fillStyle = "#444";
        ctx.fillRect(startX + 110, startY + 50, btnW, btnH);
        ctx.strokeRect(startX + 110, startY + 50, btnW, btnH);
        ctx.fillStyle = "white";
        ctx.fillText("にげる", startX + 110 + btnW / 2, startY + 50 + textOffsetY);

        ctx.textAlign = "left"; // 戻す
    }
}

