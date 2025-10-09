class Player {

    // プレイヤーの情報
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.image = new Image();
        this.image.src = "../img/キャラクター1.png";
        this.jump = false;
        this.jumpflg = false;
        this.fall = false;
        this.nowpoint = 0;
    }

    // プレイヤーの移動処理
    move(leftPressed, rightPressed, canvasWidth, jump) {
        this.jump = jump;
        if (rightPressed && this.x < canvasWidth - this.width) {    // 右キーが押されているとき
            this.x += this.speed;
        }
        if (leftPressed && this.x > 0) {                     // 左キーが押されているとき
            this.x -= this.speed;
        }
        if (this.jump && this.y > 0) {                       // ジャンプ
            if (this.jump) {
                this.nowpoint = this.y;
                this.jump = false;
                this.jumpflg = true;
            }
        } else if (this.jumpflg) {
            this.y -= this.speed;                                   //5ずつ上に移動
            if (this.jump == false && this.y < this.nowpoint - 200) {
                this.jumpflg = false;
                this.fall = true;
            }
        } else if (this.fall) {                                     // 落下
            this.y += this.speed;                                   //5ずつ下に移動
            if (this.fall && this.y >= this.nowpoint) {
                this.fall = false;
                this.y = this.nowpoint;                             // 落下後の位置を強制的に元に戻す
            }
        }
    }

    // プレイヤーの描画処理
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
