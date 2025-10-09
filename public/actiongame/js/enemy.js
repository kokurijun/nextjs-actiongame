class Enemy {

    // 敵の情報
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 2;
        this.image = new Image();
        this.image.src = "../img/キャラクター2.png";

    }

    // 敵の移動処理
    update() {
        this.x -= this.speed;
    }


    // 敵の描画処理
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
