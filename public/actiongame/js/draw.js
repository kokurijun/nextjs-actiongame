function draw(ctx, player, enemies) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面クリア

    // プレイヤーを描画
    player.draw(ctx);

    // 敵を描画
    enemies.forEach((enemy) => {
        enemy.draw(ctx);
    });
}
