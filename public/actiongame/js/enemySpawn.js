// マップごとの敵配置データ
export const enemySpawnData = {
    map1: [
        { x: 200, y: 512, range: 120, speed: 1, type: "slime" },
        { x: 2315, y: 512, range: 64, speed: 1, type: "slime" }
    ],
    map2: [
        { x: 400, y: 512, range: 200, speed: 1, type: "slime" },
        { x: 1860, y: 64, range: 75, speed: 1, type: "orc" },
        { x: 3120, y: 448, range: 200, speed: 1, type: "orc" },
        { x: 4700, y: 448, range: 105, speed: 1, type: "orc" }
    ]
};

// マップに応じて敵を生成する関数
import { Enemy } from "./enemy.js";

export function spawnEnemiesForMap(mapName, enemiesArray) {
    enemiesArray.length = 0; // 一旦クリア

    const data = enemySpawnData[mapName] || [];
    for (const e of data) {
        enemiesArray.push(new Enemy(e.x, e.y, e.range, e.speed, e.type));
    }
}
