
// マップ上での衝突判定を行う関数
export function isCollidingWithMap(map, x, y, width, height, player = null) {
    if (!map || !map.data) return false; // mapが読み込まれていないとき安全に抜ける

    const tileSize = map.tilewidth;
    const mapHeight = map.height;
    const mapWidth = map.width;

    // プレイヤーの矩形の範囲（タイル単位）
    const leftTile = Math.floor(x / tileSize);
    const rightTile = Math.floor((x + width - 1) / tileSize);
    const topTile = Math.floor(y / tileSize);
    const bottomTile = Math.floor((y + height - 1) / tileSize);

    // 範囲外アクセス防止
    for (let ty = topTile; ty <= bottomTile; ty++) {
        for (let tx = leftTile; tx <= rightTile; tx++) {
            if (
                ty >= 0 && ty < mapHeight &&
                tx >= 0 && tx < mapWidth
            ) {
                const tile = map.data[ty][tx];

                const collisionTiles = [
                    1, 2, 3, 4,  // 地面
                    9, 10, 11, 12, 13, 14  // 別の地形
                ];

                // --- 衝突ブロック（地面） ---
                if (collisionTiles.includes(tile)) {
                    return true;
                }

                // --- ゲームオーバーブロック（落下トラップなど） ---
                // タイル15: タイルの下半分とプレイヤーの下半分が重なったらゲームオーバー
                if (tile == 15 && player) {
                    const playerBottomHalf = {
                        x: x,
                        y: y + height * 0.5, // プレイヤーの下半分
                        width: width,
                        height: height * 0.5 // プレイヤーの高さの半分
                    };
                    const tileBottomHalf = {
                        x: tx * tileSize,
                        y: ty * tileSize + tileSize * 0.5, // タイルの下半分
                        width: tileSize,
                        height: tileSize * 0.5  // タイルの高さの半分
                    };

                    if (isHit(playerBottomHalf, tileBottomHalf)) {
                        console.log("💀 プレイヤーがタイル15の深層部に当たりました。ゲームオーバー！");
                        player.dead = true;
                    }
                }
                // その他の罠: 触れたら即アウト
                else if ((tile == 16 || tile == 17 || tile == 99) && player) {
                    console.log("💀 プレイヤーが危険なタイルに当たりました。ゲームオーバー！");
                    player.dead = true;
                }

                // --- ゴールブロック ---
                if ((tile == 5 || tile == 6 || tile == 7) && player) {
                    console.log("🏁 プレイヤーがゴールに到達しました。ゲームクリア！");
                    player.goal = true; // プレイヤーにゴールフラグを立てる
                }
            }
        }
    }

    return false;
}

export function isHit(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
