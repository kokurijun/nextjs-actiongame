export const enemyTypes = {
    slime: { name: "スライム", hp: 20, maxHp: 20, attack: 5, exp: 10, img: "../img/キャラクター2(仮).png" },
    orc: { name: "オーク", hp: 40, maxHp: 40, attack: 10, exp: 35, img: "../img/キャラクター2(仮).png" },
    dragon: { name: "ドラゴン", hp: 100, maxHp: 100, attack: 20, exp: 100, img: "../img/キャラクター2(仮).png" }
};

export class Enemy {
    constructor(x, y, range = 100, speed = 0.5, type = "slime", multiplier = 1) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.speed = speed;
        this.direction = 1;
        this.type = type;

        const data = enemyTypes[type] || enemyTypes["slime"];

        // 画像読み込み
        this.img = new Image();
        this.img.src = data.img;

        this.width = 32;   // 適宜調整
        this.height = 64;  // 適宜調整

        this.startX = x;

        // バトル用パラメータ
        this.maxHp = Math.floor(data.maxHp * multiplier);
        this.hp = this.maxHp;
        this.attack = Math.floor(data.attack * multiplier);
        this.name = data.name;
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
