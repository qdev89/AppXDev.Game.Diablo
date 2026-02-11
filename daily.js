// ============================================================
// DYNASTY BRUHHH DUNGEON — Daily Challenge System (M003)
// ============================================================

const DAILY_SAVE_KEY = 'dbd_daily';

// --- Seeded Random Number Generator (Mulberry32) ---
function seededRNG(seed) {
    let s = seed | 0;
    return function () {
        s = s + 0x6D2B79F5 | 0;
        let t = Math.imul(s ^ s >>> 15, 1 | s);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// --- Get today's seed ---
function getDailySeed() {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    // Simple hash
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
    }
    return { seed: hash, dateStr: dateStr };
}

// --- Daily Challenge Modifiers ---
const DAILY_MODIFIERS = [
    {
        id: 'speed_rush', name: '⚡ Speed Rush', desc: 'All movement +40%, enemy spawns +50%', icon: '⚡',
        apply: () => { P.speed *= 1.4; G.spawnRate *= 0.66; }
    },
    {
        id: 'glass_cannon', name: '💥 Glass Cannon', desc: 'Double damage but half HP', icon: '💥',
        apply: () => { P.maxHp = Math.floor(P.maxHp * 0.5); P.hp = P.maxHp; }
    },
    {
        id: 'horde_mode', name: '🧟 Horde Mode', desc: 'Enemies spawn 2x faster, +30% more per wave', icon: '🧟',
        apply: () => { G.spawnRate *= 0.5; G.enemiesPerWave = Math.floor(G.enemiesPerWave * 1.3); }
    },
    {
        id: 'treasure_hunter', name: '💎 Treasure Hunter', desc: 'Double gold drops, more shop rooms', icon: '💎',
        apply: () => { G._dailyTreasureHunter = true; }
    },
    {
        id: 'elemental_chaos', name: '🌀 Elemental Chaos', desc: 'All enemies have random elements', icon: '🌀',
        apply: () => { G._dailyElementalChaos = true; }
    },
    {
        id: 'boss_rush', name: '🐉 Boss Rush', desc: 'Elite enemies every 3 rooms, +50% XP', icon: '🐉',
        apply: () => { G._dailyBossRush = true; }
    },
    {
        id: 'frugal', name: '🪙 Frugal', desc: 'No gold drops, start with 200 gold', icon: '🪙',
        apply: () => { G.gold = 200; G._dailyFrugal = true; }
    },
    {
        id: 'blessing_rain', name: '🎁 Blessing Rain', desc: 'Blessing rooms appear every 2 rooms', icon: '🎁',
        apply: () => { G._dailyBlessingRain = true; }
    },
    {
        id: 'one_hp', name: '❤️ One HP Warrior', desc: 'Start with 1 HP but heal on kill', icon: '❤️',
        apply: () => { P.hp = 1; P.maxHp = 1; G._dailyHealOnKill = true; }
    },
    {
        id: 'titan_foes', name: '🗿 Titan Foes', desc: 'Enemies have 2x HP but drop 2x XP', icon: '🗿',
        apply: () => { G._dailyTitanFoes = true; }
    },
];

// --- Daily Challenge State ---
const DailyState = {
    active: false,
    seed: 0,
    dateStr: '',
    rng: null,
    heroId: '',
    modifiers: [],
    bestFloor: 0,
    bestKills: 0,
    bestTime: 0,
    attempted: false,
    completed: false,

    init() {
        this.load();
    },

    load() {
        try {
            const data = JSON.parse(localStorage.getItem(DAILY_SAVE_KEY) || '{}');
            const today = getDailySeed();

            if (data.dateStr === today.dateStr) {
                // Same day — restore state
                this.bestFloor = data.bestFloor || 0;
                this.bestKills = data.bestKills || 0;
                this.bestTime = data.bestTime || 0;
                this.attempted = data.attempted || false;
                this.completed = data.completed || false;
            }
            // Different day — fresh challenge
        } catch (e) { /* localStorage not available */ }
    },

    save() {
        try {
            localStorage.setItem(DAILY_SAVE_KEY, JSON.stringify({
                dateStr: this.dateStr,
                bestFloor: this.bestFloor,
                bestKills: this.bestKills,
                bestTime: this.bestTime,
                attempted: this.attempted,
                completed: this.completed
            }));
        } catch (e) { /* localStorage not available */ }
    },

    // Generate today's challenge
    generateChallenge() {
        const today = getDailySeed();
        this.seed = today.seed;
        this.dateStr = today.dateStr;
        this.rng = seededRNG(this.seed);

        // Select hero (seeded)
        const heroIds = ['berserker', 'strategist', 'archer', 'guardian'];
        this.heroId = heroIds[Math.abs(this.seed) % heroIds.length];

        // Select 2 modifiers (seeded, no duplicates)
        const modPool = [...DAILY_MODIFIERS];
        this.modifiers = [];
        for (let i = 0; i < 2 && modPool.length > 0; i++) {
            const idx = Math.abs(Math.floor(this.rng() * modPool.length)) % modPool.length;
            this.modifiers.push(modPool.splice(idx, 1)[0]);
        }
    },

    // Start daily challenge run
    startChallenge() {
        this.generateChallenge();
        this.active = true;
        this.attempted = true;

        // Force hero selection
        G.selectedHero = this.heroId;

        // Start game with seeded RNG
        startGame();

        // Apply modifiers
        for (const mod of this.modifiers) {
            mod.apply();
        }

        // Tag the run
        G._dailyChallenge = true;
        G._dailySeed = this.seed;

        this.save();
    },

    // End daily challenge (called on game over / victory)
    endChallenge(floor, kills, time) {
        if (!this.active) return;

        if (floor > this.bestFloor) this.bestFloor = floor;
        if (kills > this.bestKills) this.bestKills = kills;
        if (time > this.bestTime || this.bestTime === 0) this.bestTime = time;

        this.active = false;
        this.save();
    },

    // Format time
    fmtTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + String(sec).padStart(2, '0');
    },

    // Draw daily challenge button on menu
    drawMenuButton(ctx, GAME_W, GAME_H) {
        const btnW = 180;
        const btnH = 30;
        const btnX = GAME_W / 2 - btnW / 2;
        const btnY = GAME_H - 80;

        // Pulsing glow
        const pulse = 0.6 + Math.sin(Date.now() / 400) * 0.4;

        ctx.save();
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8 * pulse;

        // Background
        ctx.fillStyle = 'rgba(0, 40, 20, 0.85)';
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 6);
        ctx.fill();

        // Border
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Text
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('📅 DAILY CHALLENGE', GAME_W / 2, btnY + 13);

        // Sub-text
        ctx.font = '7px monospace';
        ctx.fillStyle = this.attempted ? '#888' : '#00cc66';
        ctx.fillText(
            this.attempted ? 'Best: Floor ' + this.bestFloor + ' | ' + this.bestKills + ' kills' : 'New challenge available!',
            GAME_W / 2, btnY + 24
        );

        ctx.restore();

        // Store hit area for click detection
        G._dailyBtnArea = { x: btnX, y: btnY, w: btnW, h: btnH };
    },

    // Draw challenge info screen (before starting)
    drawChallengePreview(ctx, GAME_W, GAME_H) {
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        ctx.fillRect(0, 0, GAME_W, GAME_H);

        // Title
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('📅 DAILY CHALLENGE', GAME_W / 2, 40);

        // Date
        ctx.font = '10px monospace';
        ctx.fillStyle = '#888';
        ctx.fillText(this.dateStr, GAME_W / 2, 58);

        // Hero assignment
        const heroDef = getHeroDef(this.heroId);
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('HERO: ' + (heroDef ? heroDef.name : this.heroId).toUpperCase(), GAME_W / 2, 90);

        ctx.font = '9px monospace';
        ctx.fillStyle = '#888';
        ctx.fillText(heroDef ? heroDef.subtitle : '', GAME_W / 2, 105);

        // Modifiers
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#ff6644';
        ctx.fillText('MODIFIERS', GAME_W / 2, 135);

        let y = 155;
        for (const mod of this.modifiers) {
            // Modifier card
            const cardW = 260;
            const cardH = 36;
            const cardX = GAME_W / 2 - cardW / 2;

            ctx.fillStyle = 'rgba(80, 20, 20, 0.6)';
            ctx.beginPath();
            ctx.roundRect(cardX, y, cardW, cardH, 4);
            ctx.fill();

            ctx.strokeStyle = '#ff4422';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Icon + Name
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(mod.icon + ' ' + mod.name, cardX + 10, y + 15);

            // Description
            ctx.font = '7px monospace';
            ctx.fillStyle = '#cc8866';
            ctx.fillText(mod.desc, cardX + 10, y + 28);

            y += cardH + 6;
        }

        // Best scores (if attempted)
        if (this.attempted) {
            y += 10;
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#aaa';
            ctx.fillText('PERSONAL BEST', GAME_W / 2, y);
            y += 16;
            ctx.font = '9px monospace';
            ctx.fillStyle = '#ffd700';
            ctx.fillText(
                'Floor ' + this.bestFloor + ' | ' + this.bestKills + ' Kills | ' + this.fmtTime(this.bestTime),
                GAME_W / 2, y
            );
        }

        // Start button
        const startY = GAME_H - 60;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';

        const startPulse = 0.7 + Math.sin(Date.now() / 300) * 0.3;
        ctx.fillStyle = `rgba(0, 255, 136, ${startPulse})`;
        ctx.fillText('[ PRESS ENTER TO BEGIN ]', GAME_W / 2, startY);

        // Back hint
        ctx.font = '8px monospace';
        ctx.fillStyle = '#666';
        ctx.fillText('Press ESC to go back', GAME_W / 2, startY + 18);
    },

    // Draw daily challenge HUD indicator during gameplay
    drawHUD(ctx, GAME_W) {
        if (!this.active) return;

        ctx.save();
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#00ff88';
        ctx.fillText('📅 DAILY CHALLENGE', GAME_W - 8, 10);

        // Show active modifiers
        let y = 20;
        for (const mod of this.modifiers) {
            ctx.font = '6px monospace';
            ctx.fillStyle = '#ff8866';
            ctx.fillText(mod.icon + ' ' + mod.name, GAME_W - 8, y);
            y += 9;
        }
        ctx.restore();
    }
};

// Initialize
DailyState.init();
