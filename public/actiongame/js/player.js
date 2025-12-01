import { isCollidingWithMap } from "./collision.js";

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 64;
        this.speed = 5;
        this.image = new Image();
        this.image.src = "../img/キャラクター1(仮).png";
        this.jump = false;
        this.jumpflg = false;
        this.fall = false;
        this.nowpoint = 0;
    }

    move(leftPressed, rightPressed, canvasWidth, jump, map) {
        const tileSize = map.tilewidth;
        const gravity = 5;

        let nextX = this.x;
        let nextY = this.y;

        // --- 横移動 ---
    if (rightPressed) {
        const nextX = this.x + this.speed;
        if (!isCollidingWithMap(map, nextX, this.y, this.width, this.height)) {
            this.x = nextX;
        }
    } else if (leftPressed && this.x > 0) {
        const nextX = this.x - this.speed;
        if (!isCollidingWithMap(map, nextX, this.y, this.width, this.height)) {
            this.x = nextX;
        }
    }

    // --- ジャンプ開始 ---
    if (jump && !this.jumpflg && !this.fall) {
        this.jumpflg = true;
        this.jumpPower = 28; // 初期上昇力
    }

    // --- 上昇処理 ---
    if (this.jumpflg) {
        const nextY = this.y - this.jumpPower;
        if (!isCollidingWithMap(map, this.x, nextY, this.width, this.height)) {
            this.y = nextY;
            this.jumpPower -= 2; // 徐々に上昇力減衰
            if (this.jumpPower <= 0) {
                this.jumpflg = false;
                this.fall = true;
            }
        } else {
            // 天井に当たったら落下開始
            this.jumpflg = false;
            this.fall = true;
        }
    }

    // --- 落下処理 ---
    if (!this.jumpflg) {
        const nextY = this.y + gravity;
        if (!isCollidingWithMap(map, this.x, nextY, this.width, this.height, this)) {
            this.y = nextY;
            this.fall = true;
        } else {
            // 地面に着地
            this.fall = false;

            // タイルの上にぴったり座標を合わせる
            while (!isCollidingWithMap(map, this.x, this.y + 1, this.width, this.height)) {
                this.y += 1;
            }
        }
    }
}

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // 🔹 カメラの位置を考慮してプレイヤーを描画
    drawWithCamera(ctx, cameraX) {
        ctx.drawImage(this.image, this.x - cameraX, this.y, this.width, this.height);
    }
}
