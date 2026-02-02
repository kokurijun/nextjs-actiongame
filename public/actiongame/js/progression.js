
// RPG進行管理モジュール
// プレイヤーのレベル、経験値、ステータス、およびゲーム全体の進行度（クリア回数）を管理します。

const STORAGE_KEY = 'action_game_progression_v1';

export const progression = {
    // 状態データ
    data: {
        level: 1,
        exp: 0,
        nextLevelExp: 100,
        totalClears: 0,
        
        // 基礎ステータス (レベル1時点)
        baseHp: 100,
        baseMp: 20,
        baseAttack: 15,

        // 現在のステータス (レベル補正後)
        maxHp: 100,
        maxMp: 20,
        attack: 15
    },

    // 初期化・ロード
    init() {
        this.load();
        this.updateStats(); // ロードしたデータに基づいてステータス再計算
    },

    // データのロード
    load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // 既存データとマージ（新しいプロパティが増えた場合などのため）
                this.data = { ...this.data, ...parsed };
                console.log("セーブデータをロードしました:", this.data);
            } catch (e) {
                console.error("セーブデータの読み込みに失敗しました:", e);
            }
        }
    },

    // データのセーブ
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    },

    // クリア回数加算
    addClearCount() {
        this.data.totalClears++;
        this.save();
        console.log("マップクリア！ 現在のクリア回数:", this.data.totalClears);
    },

    // 経験値獲得
    // 戻り値: { leveledUp: boolean, logMessage: string }
    gainExp(amount) {
        this.data.exp += amount;
        let leveledUp = false;
        let levelUpCount = 0;

        // レベルアップ判定 (余剰分も考慮してループ)
        while (this.data.exp >= this.data.nextLevelExp) {
            this.data.exp -= this.data.nextLevelExp;
            this.data.level++;
            levelUpCount++;
            leveledUp = true;
            
            // 次の必要経験値を増加 (例: 1.2倍づつ増える簡易計算)
            this.data.nextLevelExp = Math.floor(this.data.nextLevelExp * 1.2);
        }

        if (leveledUp) {
            this.updateStats();
            this.save();
            return {
                leveledUp: true,
                logMessage: levelUpCount > 1 
                    ? `なんと レベルが ${levelUpCount} 上がった！ (Lv.${this.data.level})` 
                    : `レベルが上がった！ (Lv.${this.data.level})`
            };
        } else {
            this.save();
            return {
                leveledUp: false,
                logMessage: null
            };
        }
    },

    // ステータス再計算
    updateStats() {
        // 簡易計算式: レベルアップごとに 10% 増加など
        const levelFactor = 1 + (this.data.level - 1) * 0.1;
        
        this.data.maxHp = Math.floor(this.data.baseHp * levelFactor);
        this.data.maxMp = Math.floor(this.data.baseMp * levelFactor);
        this.data.attack = Math.floor(this.data.baseAttack * levelFactor);
    },

    // 敵の強さ倍率を取得 (クリア回数に基づく)
    getEnemyDifficultyMultiplier() {
        // クリア回数ごとに 20% 強化
        return 1 + (this.data.totalClears * 0.2);
    },

    // リセット（デバッグ用・最初から遊ぶ用）
    reset() {
        localStorage.removeItem(STORAGE_KEY);
        this.data = {
            level: 1,
            exp: 0,
            nextLevelExp: 50,
            totalClears: 0,
            baseHp: 100,
            baseMp: 20,
            baseAttack: 15,
            maxHp: 100,
            maxMp: 20,
            attack: 15
        };
        this.save();
    }
};
