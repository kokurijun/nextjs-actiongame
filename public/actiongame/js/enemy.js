export class Enemy {
    constructor(x, y, range = 100, speed = 1) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.speed = speed;
        this.direction = 1;

        // 画像読み込み
        this.img = new Image();
        this.img.src = "../img/キャラクター2(仮).png";

        this.width = 32;   // 適宜調整
        this.height = 64;  // 適宜調整

        this.startX = x;
    }

    update() {
        // ←→ パトロール移動
        this.x += this.direction * this.speed;

        if (this.x > this.startX + this.range) this.direction = -1;
        if (this.x < this.startX - this.range) this.direction = 1;
    }

    draw(ctx, cameraX = 0) {
        ctx.drawImage(
            this.img,
            this.x - cameraX,
            this.y,
            this.width,
            this.height
        );
    }
}
