// JSONマップを読み込んで、描画に使いやすい形式にする
export async function loadMap(name) {
    const res = await fetch(`../map/${name}.json`);
    const json = await res.json();

    const width = json.width;
    const height = json.height;
    const tilewidth = json.tilewidth;
    const tileheight = json.tileheight;
    const data = json.layers[0].data;

    // 二次元配列に変換
    const data2D = [];
    for (let y = 0; y < height; y++) {
        data2D[y] = [];
        for (let x = 0; x < width; x++) {
            data2D[y][x] = data[y * width + x];
        }
    }

    // 情報をまとめて返す
    return {
        width,
        height,
        tilewidth,
        tileheight,
        data: data2D
    };
}

// ---- マップを描画する関数 ----
export function drawMap(ctx, map, cameraX = 0) {
    if (!map || !map.data) return; // map未読み込み時の安全策

    // タイル画像群を読み込む
    const tileImages = [];
    tileImages[1] = new Image();
    tileImages[1].src = "../img/map_ground1.png";
    tileImages[2] = new Image();
    tileImages[2].src = "../img/map_ground2.png";
    tileImages[3] = new Image();
    tileImages[3].src = "../img/map_renga.png";
    tileImages[4] = new Image();
    tileImages[4].src = "";
    tileImages[5] = new Image();
    tileImages[5].src = "../img/map_goalpole.png";
    tileImages[6] = new Image();
    tileImages[6].src = "../img/map_goalflag2.png";
    tileImages[7] = new Image();
    tileImages[7].src = "../img/map_goalflag1.png";
    tileImages[8] = new Image();
    tileImages[8].src = "";
    tileImages[9] = new Image();
    tileImages[9].src = "../img/map_ice1.png";
    tileImages[10] = new Image();
    tileImages[10].src = "../img/map_ice2.png";
    tileImages[11] = new Image();
    tileImages[11].src = "../img/map_ice3.png";
    tileImages[12] = new Image();
    tileImages[12].src = "../img/map_ice4.png";
    tileImages[13] = new Image();
    tileImages[13].src = "../img/map_ice_renga.png";
    tileImages[14] = new Image();
    tileImages[14].src = "../img/map_ice_block.png";
    tileImages[15] = new Image();
    tileImages[15].src = "../img/map_poison1.png";
    tileImages[16] = new Image();
    tileImages[16].src = "../img/map_poison2.png";
    tileImages[17] = new Image();
    tileImages[17].src = "../img/map_needle.png";

    // 描画
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            const tile = map.data[y][x];
            if (tile > 0 && tileImages[tile]) {
                const drawX = x * map.tilewidth - cameraX;
                const drawY = y * map.tileheight;

                // 画面内に見える範囲のみ描画
                if (drawX + map.tilewidth > 0 && drawX < ctx.canvas.width) {
                    ctx.drawImage(
                        tileImages[tile],
                        drawX,
                        drawY,
                        map.tilewidth,
                        map.tileheight
                    );
                }
            }
        }
    }
}
