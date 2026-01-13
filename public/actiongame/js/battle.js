export let battleState = null;

export function getBattleState() {
    return battleState;
}

// ログ追加関数
function addLog(message) {
    if (!battleState) return;
    battleState.logs.push(message);
    if (battleState.logs.length > 4) {
        battleState.logs.shift(); // 古いログを削除
    }
}

// グローバル汚染を避けるためにexport変数を使用しますが、
// draw.jsとの互換性のためにwindowにも紐付けることが推奨される場合は維持します。
// 今回は main.js が window.battleState を参照している前提があったので、
// 互換性のため window.battleState も更新しつつ、export変数も用意します。

export function startBattle(enemy, setGameState, player) {
    battleState = {
        enemy: enemy,
        player: player, // playerへの参照を保持
        turn: "player",
        logs: [`${enemy.name} があらわれた！`], // ログ履歴
        turnCount: 0,
        actionWait: 0,
        playerDefending: false
    };

    // 他のファイルからの参照用
    window.battleState = battleState;
    setGameState("battle");
    console.log("バトル開始！");
}

export function updateBattle(player, setGameState) {
    if (!battleState) return;

    if (battleState.actionWait > 0) {
        battleState.actionWait--;
        return;
    }

    // 敵のターン処理
    if (battleState.turn === "enemy") {
        executeEnemyTurn(player, setGameState);
    }
}

function executeEnemyTurn(player, setGameState) {
    battleState.turnCount++; // ターン経過

    const enemy = battleState.enemy;
    const type = enemy.type || "slime";
    let damage = enemy.attack;
    let actionName = "攻撃";

    // --- 敵ごとの行動パターン ---
    if (type === "slime") {
        // スライム: 30%の確率で何もしない
        if (Math.random() < 0.3) {
            addLog(`${enemy.name} は様子を見ている...`);
            endEnemyTurn();
            return;
        }
    } else if (type === "orc") {
        // オーク: 3ターンごとに強力な攻撃 (1.5倍)
        if (battleState.turnCount % 3 === 0) {
            damage = Math.floor(damage * 1.5);
            actionName = "渾身の一撃";
        }
    } else if (type === "dragon") {
        // ドラゴン: 2ターンごとに炎の息 (全体攻撃イメージだが単体、ダメージ2倍)
        if (battleState.turnCount % 2 === 0) {
            damage = damage * 2;
            actionName = "炎の息";
        }
        // HPが減ると回復 (1回だけとか制限つけたほうがいいが今回は簡易実装)
        if (enemy.hp < enemy.maxHp * 0.3 && Math.random() < 0.2) {
            const heal = 20;
            enemy.hp += heal;
            if (enemy.hp > enemy.maxHp) enemy.hp = enemy.maxHp;
            addLog(`${enemy.name} は傷を癒やした！ (HP+${heal})`);
            endEnemyTurn();
            return;
        }
    }

    // 通常攻撃実行
    let finalDamage = damage;
    if (battleState.playerDefending) {
        finalDamage = Math.floor(damage * 0.5);
        addLog(`${enemy.name} の攻撃！ だが防御している！`);
    } else {
        addLog(`${enemy.name} の ${actionName}！`);
    }

    player.hp -= finalDamage;
    addLog(`あなたに ${finalDamage} のダメージ！`);

    if (player.hp <= 0) {
        player.hp = 0;
        addLog("あなたは負けました...");
        // ログを見せるために少し長めに待機
        battleState.actionWait = 120;

        setTimeout(() => {
            setGameState("gameover");
            window.location.href = "gameover.html";
        }, 2000);
        return;
    }

    endEnemyTurn();
}

function endEnemyTurn() {
    battleState.actionWait = 60;
    battleState.turn = "player";
}

export function onBattleClick(e, canvas, player, enemies, setGameState) {
    if (!battleState || battleState.turn !== "player" || battleState.actionWait > 0) return;

    const rect = canvas.getBoundingClientRect();
    const windowX = 50;
    const windowY = canvas.height - 150;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // ターン開始時に防御フラグはリセット（持続は1ターン）
    // ただしここでリセットすると防御選んだ瞬間に消えるので注意
    // 防御の効果は「次の敵の攻撃」に対するものなので、
    // 敵の攻撃が終わったあと(endEnemyTurn)でリセットするか、
    // プレイヤーがアクションを選んだ時点でリセットして、防御なら再度立てるのが自然。

    // ここではクリックされたら一旦リセット
    battleState.playerDefending = false;

    const btnW = 100;
    const btnH = 40;
    // draw.jsの配置に合わせる (windowX + 500)
    const startX = windowX + 500;
    const startY = windowY + 20;

    // ヘルパー: ボタン範囲判定
    const isClicked = (bx, by) => {
        return mouseX >= bx && mouseX <= bx + btnW &&
            mouseY >= by && mouseY <= by + btnH;
    };

    // --- たたかう ---
    if (isClicked(startX, startY)) {
        const damage = player.attack;
        battleState.enemy.hp -= damage;

        addLog(`あなたの攻撃！ ${battleState.enemy.name} に ${damage} のダメージ！`);
        checkBattleEnd(enemies, setGameState);
    }

    // --- まほう ---
    else if (isClicked(startX + 110, startY)) {
        if (player.mp >= 5) {
            player.mp -= 5;
            const damage = Math.floor(20 + Math.random() * 10); // 20-30ダメージ
            battleState.enemy.hp -= damage;
            addLog(`ファイアボール！ ${battleState.enemy.name} に ${damage} のダメージ！`);
            checkBattleEnd(enemies, setGameState);
        } else {
            addLog("MPが足りない！");
            // ターン消費なしにするか、失敗としてターン経過させるか。
            // ここでは再選択可能にする（returnするだけ）
            return;
        }
    }

    // --- ぼうぎょ ---
    else if (isClicked(startX, startY + 50)) {
        battleState.playerDefending = true;
        addLog("あなたは身を守っている！");
        endPlayerTurn();
    }

    // --- にげる ---
    else if (isClicked(startX + 110, startY + 50)) {
        addLog("うまく逃げ切れた！");
        battleState.turn = "none";
        setTimeout(() => {
            endBattle(false, enemies, setGameState);
        }, 1000);
    }
}

function checkBattleEnd(enemies, setGameState) {
    battleState.actionWait = 40;

    if (battleState.enemy.hp <= 0) {
        battleState.enemy.hp = 0;
        addLog(`${battleState.enemy.name} を倒した！`);
        battleState.actionWait = 100;
        setTimeout(() => {
            endBattle(true, enemies, setGameState);
        }, 1000);
    } else {
        battleState.turn = "enemy";
    }
}

function endPlayerTurn() {
    battleState.actionWait = 40;
    battleState.turn = "enemy";
}

function endBattle(win, enemies, setGameState) {
    if (win) {
        // 敵を削除
        const index = enemies.indexOf(battleState.enemy);
        if (index > -1) {
            enemies.splice(index, 1);
        }
    } else {
        // 逃げた場合: 無敵時間とノックバック
        if (battleState.player) {
            battleState.player.invincibleTime = 180; // 3秒
            battleState.player.invincible = true;
            battleState.player.x -= 50;
        }
    }

    setGameState("play");
    battleState = null;
    window.battleState = null;
}
