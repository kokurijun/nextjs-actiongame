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
}

