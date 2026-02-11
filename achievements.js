// ============================================================
// DYNASTY BRUHHH DUNGEON — Achievement System (M002)
// ============================================================

const ACHIEVEMENT_SAVE_KEY = 'dbd_achievements';

// --- Achievement Definitions ---
const ACHIEVEMENTS = {
    // === COMBAT ===
    first_blood: {
        id: 'first_blood', name: 'First Blood',
        desc: 'Kill 10 enemies in a single run',
        category: 'combat', icon: '🗡️', tier: 'bronze',
        check: () => (G.totalKills || 0) >= 10
    },
    slayer: {
        id: 'slayer', name: 'Slayer',
        desc: 'Kill 100 enemies in a single run',
        category: 'combat', icon: '⚔️', tier: 'silver',
        check: () => (G.totalKills || 0) >= 100
    },
    massacre: {
        id: 'massacre', name: 'Massacre',
        desc: 'Kill 500 enemies in a single run',
        category: 'combat', icon: '💀', tier: 'gold',
        check: () => (G.totalKills || 0) >= 500
    },
    combo_apprentice: {
        id: 'combo_apprentice', name: 'Combo Apprentice',
        desc: 'Achieve a 10+ Wu Xing combo',
        category: 'combat', icon: '🔗', tier: 'bronze',
        check: () => (G.maxCombo || G.combo || 0) >= 10
    },
    combo_king: {
        id: 'combo_king', name: 'Combo King',
        desc: 'Achieve a 50+ Wu Xing combo',
        category: 'combat', icon: '👑', tier: 'gold',
        check: () => (G.maxCombo || G.combo || 0) >= 50
    },

    // === EXPLORATION ===
    floor_5: {
        id: 'floor_5', name: 'Deep Enough',
        desc: 'Reach Floor 5',
        category: 'exploration', icon: '🏔️', tier: 'bronze',
        check: () => (G.floor || 1) >= 5
    },
    floor_10: {
        id: 'floor_10', name: 'Into The Abyss',
        desc: 'Reach Floor 10',
        category: 'exploration', icon: '🌋', tier: 'silver',
        check: () => (G.floor || 1) >= 10
    },
    floor_20: {
        id: 'floor_20', name: 'Depth Dweller',
        desc: 'Reach Floor 20',
        category: 'exploration', icon: '🕳️', tier: 'gold',
        check: () => (G.floor || 1) >= 20
    },

    // === MASTERY ===
    tyrant_slayer: {
        id: 'tyrant_slayer', name: 'Tyrant Slayer',
        desc: 'Defeat Đổng Trác, The Tyrant',
        category: 'mastery', icon: '🐉', tier: 'gold',
        check: () => G.state === 'VICTORY'
    },
    speed_demon: {
        id: 'speed_demon', name: 'Speed Demon',
        desc: 'Reach Floor 5 in under 5 minutes',
        category: 'mastery', icon: '⚡', tier: 'silver',
        check: () => (G.floor || 1) >= 5 && (G.runTimer || 999) < 300
    },
    blessing_collector: {
        id: 'blessing_collector', name: 'Blessing Collector',
        desc: 'Collect 10 blessings in one run',
        category: 'mastery', icon: '🎁', tier: 'silver',
        check: () => G.blessings && G.blessings.length >= 10
    },
    gold_hoarder: {
        id: 'gold_hoarder', name: 'Gold Hoarder',
        desc: 'Collect 500 gold in a single run',
        category: 'mastery', icon: '💰', tier: 'silver',
        check: () => (G.gold || 0) >= 500
    },
    elemental_master: {
        id: 'elemental_master', name: 'Elemental Master',
        desc: 'Collect 5 blessings of the same element',
        category: 'mastery', icon: '🌀', tier: 'gold',
        check: () => {
            if (!G.blessings || !G.blessings.length) return false;
            const counts = {};
            for (const b of G.blessings) {
                const el = b.element || 'NONE';
                counts[el] = (counts[el] || 0) + 1;
                if (counts[el] >= 5) return true;
            }
            return false;
        }
    },

    // === SECRET ===
    survivor: {
        id: 'survivor', name: 'Survivor',
        desc: 'Survive for 10 minutes',
        category: 'secret', icon: '🛡️', tier: 'bronze',
        check: () => (G.runTimer || 0) >= 600
    },
    untouchable: {
        id: 'untouchable', name: 'Untouchable',
        desc: 'Reach Floor 3 without taking damage',
        category: 'secret', icon: '✨', tier: 'gold',
        check: () => {
            if (!P) return false;
            return (G.floor || 1) >= 3 && P.hp >= P.maxHp;
        }
    },
    rich_beyond_measure: {
        id: 'rich_beyond_measure', name: 'Rich Beyond Measure',
        desc: 'Collect 2000 gold in a single run',
        category: 'secret', icon: '🏆', tier: 'gold',
        check: () => (G.gold || 0) >= 2000
    },
    total_kills_1000: {
        id: 'total_kills_1000', name: 'Veteran',
        desc: 'Kill 1000 enemies across all runs',
        category: 'secret', icon: '🎖️', tier: 'gold',
        check: () => G._stats && G._stats.totalKills >= 1000
    },
};

// --- Achievement State Manager ---
const AchievementState = {
    unlocked: {},        // { id: timestamp }
    toastQueue: [],      // Pending toast notifications
    toastActive: null,   // Currently showing toast
    toastTimer: 0,
    initialized: false,

    init() {
        this.load();
        this.initialized = true;
    },

    load() {
        try {
            const data = localStorage.getItem(ACHIEVEMENT_SAVE_KEY);
            if (data) {
                this.unlocked = JSON.parse(data);
            }
        } catch (e) { /* localStorage not available */ }
    },

    save() {
        try {
            localStorage.setItem(ACHIEVEMENT_SAVE_KEY, JSON.stringify(this.unlocked));
        } catch (e) { /* localStorage not available */ }
    },

    unlock(id) {
        if (this.unlocked[id]) return; // Already unlocked
        const ach = ACHIEVEMENTS[id];
        if (!ach) return;

        this.unlocked[id] = Date.now();
        this.save();

        // Queue toast notification
        this.toastQueue.push(ach);
    },

    isUnlocked(id) {
        return !!this.unlocked[id];
    },

    getUnlockedCount() {
        return Object.keys(this.unlocked).length;
    },

    getTotalCount() {
        return Object.keys(ACHIEVEMENTS).length;
    },

    getProgress() {
        return this.getUnlockedCount() + '/' + this.getTotalCount();
    },

    // Check all achievements — called periodically
    checkAll() {
        if (!this.initialized) return;
        for (const id in ACHIEVEMENTS) {
            if (!this.unlocked[id]) {
                try {
                    if (ACHIEVEMENTS[id].check()) {
                        this.unlock(id);
                    }
                } catch (e) { /* skip check errors */ }
            }
        }
    },

    // Update toast display
    updateToast(dt) {
        if (this.toastActive) {
            this.toastTimer -= dt;
            if (this.toastTimer <= 0) {
                this.toastActive = null;
            }
        }

        if (!this.toastActive && this.toastQueue.length > 0) {
            this.toastActive = this.toastQueue.shift();
            this.toastTimer = 3.5; // Show for 3.5 seconds
        }
    },

    // Draw toast notification
    drawToast(ctx, GAME_W, GAME_H) {
        if (!this.toastActive) return;

        const ach = this.toastActive;
        const t = this.toastTimer;
        const totalDuration = 3.5;

        // Slide-in/out animation
        let slideX = 0;
        const slideIn = 0.4;
        const slideOut = 0.4;

        if (t > totalDuration - slideIn) {
            // Sliding in
            const p = (totalDuration - t) / slideIn;
            slideX = (1 - p) * 250;
        } else if (t < slideOut) {
            // Sliding out
            const p = t / slideOut;
            slideX = (1 - p) * 250;
        }

        const boxW = 220;
        const boxH = 52;
        const boxX = GAME_W - boxW - 12 + slideX;
        const boxY = 12;

        // Tier colors
        const tierColors = {
            bronze: '#cd7f32',
            silver: '#c0c0c0',
            gold: '#ffd700'
        };
        const borderColor = tierColors[ach.tier] || '#ffd700';

        ctx.save();

        // Glow effect
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 12;

        // Background
        ctx.fillStyle = 'rgba(10, 10, 10, 0.92)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();

        // Border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Icon
        ctx.font = '20px serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(ach.icon, boxX + 8, boxY + boxH / 2);

        // "ACHIEVEMENT UNLOCKED"
        ctx.font = 'bold 7px monospace';
        ctx.fillStyle = borderColor;
        ctx.fillText('🏆 ACHIEVEMENT UNLOCKED', boxX + 36, boxY + 14);

        // Achievement name
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(ach.name, boxX + 36, boxY + 28);

        // Description
        ctx.font = '7px monospace';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText(ach.desc, boxX + 36, boxY + 42);

        ctx.restore();
    },

    // Draw achievement list (for pause menu)
    drawAchievementList(ctx, GAME_W, GAME_H) {
        const categories = ['combat', 'exploration', 'mastery', 'secret'];
        const catNames = { combat: '⚔️ COMBAT', exploration: '🏔️ EXPLORATION', mastery: '🌀 MASTERY', secret: '🔮 SECRET' };
        const tierColors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700' };

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        ctx.fillRect(0, 0, GAME_W, GAME_H);

        // Title
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('🏆 ACHIEVEMENTS ' + this.getProgress(), GAME_W / 2, 28);

        let y = 50;
        const rowH = 16;

        for (const cat of categories) {
            // Category header
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffcc44';
            ctx.fillText(catNames[cat], 30, y);
            y += 4;

            // Achievements in this category
            for (const id in ACHIEVEMENTS) {
                const ach = ACHIEVEMENTS[id];
                if (ach.category !== cat) continue;

                y += rowH;
                const unlocked = this.isUnlocked(id);
                const color = unlocked ? (tierColors[ach.tier] || '#fff') : '#444';

                // Icon
                ctx.font = '10px serif';
                ctx.fillStyle = unlocked ? '#fff' : '#333';
                ctx.fillText(unlocked ? ach.icon : '🔒', 35, y);

                // Name
                ctx.font = (unlocked ? 'bold ' : '') + '8px monospace';
                ctx.fillStyle = color;
                ctx.fillText(unlocked ? ach.name : '???', 55, y);

                // Description
                ctx.font = '7px monospace';
                ctx.fillStyle = unlocked ? '#999' : '#333';
                ctx.fillText(unlocked ? ach.desc : (ach.category === 'secret' ? '???' : ach.desc), 160, y);
            }

            y += 8;
        }

        // Footer
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.fillText('Press TAB or ESC to close', GAME_W / 2, GAME_H - 15);
    }
};

// Initialize on load
AchievementState.init();
