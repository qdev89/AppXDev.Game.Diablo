// ============================================================
// DYNASTY BRUHHH DUNGEON - Core Engine
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// --- Constants ---
const GAME_W = 480, GAME_H = 320;
const TILE = 4; // pixel scale
const ELEMENTS = {
    WOOD: { name: 'Wood', color: '#2d8f2d', light: '#5aff5a', symbol: '木' },
    FIRE: { name: 'Fire', color: '#cc2222', light: '#ff5555', symbol: '火' },
    EARTH: { name: 'Earth', color: '#aa7722', light: '#ddaa44', symbol: '土' },
    METAL: { name: 'Metal', color: '#8888aa', light: '#ccccee', symbol: '金' },
    WATER: { name: 'Water', color: '#2244aa', light: '#5588ff', symbol: '水' }
};
const EL_KEYS = Object.keys(ELEMENTS);
const GENERATING = { WOOD: 'FIRE', FIRE: 'EARTH', EARTH: 'METAL', METAL: 'WATER', WATER: 'WOOD' };
const OVERCOMING = { WOOD: 'EARTH', FIRE: 'METAL', EARTH: 'WATER', METAL: 'WOOD', WATER: 'FIRE' };

// --- Game State ---
const G = {
    state: 'MENU', // MENU, HERO_SELECT, BONDING, PLAYING, LEVEL_UP, PAUSED, GAME_OVER
    dt: 0, time: 0, lastTime: 0, fps: 60,
    floor: 1, score: 0, combo: 0, maxCombo: 0,
    camX: 0, camY: 0, shakeX: 0, shakeY: 0, shakeDur: 0,
    hitStop: 0,
    enemies: [], bullets: [], particles: [], pickups: [], dmgNums: [],
    weapons: [],
    levelUpChoices: [],
    arenaW: 2000, arenaH: 2000,
    spawnTimer: 0, spawnRate: 1.5, enemiesPerWave: 8,
    enemiesKilled: 0, enemiesNeeded: 30,
    portalActive: false, portal: null,
    yinYang: { yin: 0, yang: 0, state: 'NEUTRAL', timer: 0 },
    // Phase E: New systems
    selectedHero: null,       // Hero ID string
    allies: [],               // AI companion entities
    sacredBeast: null,        // Active sacred beast
    equipment: { armor: null, talisman: null, mount: null },
    skillEffects: [],          // Persistent skill VFX (shockwaves, auras, beams, etc.)
    totalKills: 0,            // Persistent kill counter for run
    chainTimer: 0,            // Chain kill timer
    chainCount: 0,            // Current chain count
    chainBest: 0,             // Best chain this run
    killMilestone: 0,         // Last announced milestone
    treasureRoom: null,
    archerBullets: [],
    bondingTab: 0,
    // Phase G: Entourage System
    morale: 0,                // Morale meter 0-100
    moraleDecayTimer: 0,      // Timer for morale decay (every 5s)
    allyAura: { dmgReduction: 0, atkSpd: 0, critBonus: 0 }, // Active ally aura buffs
    // Phase H: Brotherhood Combos & Language
    brotherhoodGauge: 0,      // Brotherhood combo gauge 0-100
    brotherhoodCooldown: 0,   // Cooldown between combo activations
    lang: 'vi',               // Language setting: 'vi' or 'en'
    // Phase K: Difficulty Tiers
    difficulty: 0,              // Selected difficulty index (0-3)
    difficultyUnlocked: [true, false, false, false], // Which tiers are unlocked
};

// --- Difficulty Tiers (K004) ---
const DIFFICULTY_TIERS = [
    {
        id: 'apprentice', icon: '🟢', hpMult: 1.0, spdMult: 1.0, rewardMult: 1.0,
        name: { vi: 'Học Nghề', en: 'Apprentice' }, unlockFloor: 0, color: '#44dd44'
    },
    {
        id: 'warrior', icon: '🟡', hpMult: 1.5, spdMult: 1.15, rewardMult: 1.5,
        name: { vi: 'Chiến Binh', en: 'Warrior' }, unlockFloor: 10, color: '#ffaa00'
    },
    {
        id: 'master', icon: '🔴', hpMult: 2.0, spdMult: 1.3, rewardMult: 2.0,
        name: { vi: 'Đại Sư', en: 'Master' }, unlockFloor: 15, color: '#ff4444'
    },
    {
        id: 'legend', icon: '💀', hpMult: 3.0, spdMult: 1.5, rewardMult: 3.0,
        name: { vi: 'Huyền Thoại', en: 'Legend' }, unlockFloor: 20, color: '#cc44ff'
    }
];

// --- Player ---
const P = {
    x: 1000, y: 1000, w: 12, h: 14,
    vx: 0, vy: 0, speed: 100,
    hp: 100, maxHp: 100, xp: 0, xpNeeded: 20, level: 1,
    element: 'METAL', facing: 1,
    invincible: 0, damageFlash: 0,
    dodgeTimer: 0, dodgeCd: 0, dodgeDx: 0, dodgeDy: 0,
    // Phase E: MP & Musou
    heroId: 'berserker',
    mp: 100, mpMax: 100, mpRegen: 3, mpRegenDelay: 0,
    musou: 0, musouMax: 100,
    tacticalCd: 0, ultimateActive: 0,
    shieldWall: 0,  // Shield wall timer (Vanguard)
    rageModeTimer: 0, // Rage mode timer (Berserker)
};

// --- Input ---
const keys = {};
const touch = { active: false, sx: 0, sy: 0, cx: 0, cy: 0, dx: 0, dy: 0 };

window.addEventListener('keydown', e => { keys[e.key] = true; keys[e.code] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; keys[e.code] = false; });

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    const sx = (t.clientX - r.left) / r.width * GAME_W;
    const sy = (t.clientY - r.top) / r.height * GAME_H;
    if (G.state === 'MENU') { transitionTo('HERO_SELECT'); return; }
    if (G.state === 'HERO_SELECT') { if (typeof handleHeroSelectClick === 'function') handleHeroSelectClick(sx, sy); return; }
    if (G.state === 'BONDING') { handleBondingClick(sx, sy); return; }
    if (G.state === 'GAME_OVER') { transitionTo('BONDING'); return; }
    if (G.state === 'LEVEL_UP') { handleLevelUpClick(sx, sy); return; }
    touch.active = true; touch.sx = sx; touch.sy = sy; touch.cx = sx; touch.cy = sy;
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!touch.active) return;
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    touch.cx = (t.clientX - r.left) / r.width * GAME_W;
    touch.cy = (t.clientY - r.top) / r.height * GAME_H;
}, { passive: false });

canvas.addEventListener('touchend', e => { e.preventDefault(); touch.active = false; touch.dx = 0; touch.dy = 0; }, { passive: false });

canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width * GAME_W;
    const my = (e.clientY - r.top) / r.height * GAME_H;
    if (G.state === 'MENU') { transitionTo('HERO_SELECT'); if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction(); }
    else if (G.state === 'HERO_SELECT') { if (typeof handleHeroSelectClick === 'function') handleHeroSelectClick(mx, my); }
    else if (G.state === 'BONDING') handleBondingClick(mx, my);
    else if (G.state === 'GAME_OVER') transitionTo('BONDING');
    else if (G.state === 'LEVEL_UP') handleLevelUpClick(mx, my);
    // K001: Shop & Door choice clicks
    else if (G.state === 'SHOP') { if (typeof handleShopClick === 'function') handleShopClick(mx, my); }
    else if (G.state === 'PLAYING' && G.roomState === 'DOOR_CHOICE') { if (typeof handleDoorChoiceClick === 'function') handleDoorChoiceClick(mx, my); }
    // K002: Blessing choice clicks
    else if (G.state === 'BLESSING_CHOICE') { if (typeof handleBlessingChoiceClick === 'function') handleBlessingChoiceClick(mx, my); }
});

// --- Dodge Roll (Space key) ---
window.addEventListener('keydown', e => {
    if (e.code === 'Space' && G.state === 'PLAYING' && P.dodgeCd <= 0 && P.dodgeTimer <= 0) {
        e.preventDefault();
        P.dodgeTimer = 0.25;
        P.dodgeCd = 1.0;
        P.invincible = 0.3;
        P.dodgeDx = P.vx !== 0 || P.vy !== 0 ? P.vx : P.facing * 150;
        P.dodgeDy = P.vy || 0;
        const len = Math.hypot(P.dodgeDx, P.dodgeDy);
        if (len > 0) { P.dodgeDx = (P.dodgeDx / len) * 280; P.dodgeDy = (P.dodgeDy / len) * 280; }
        spawnParticles(P.x, P.y, '#ffffff', 6, 30);
        SFX.menuClick();
    }
    // --- Tactical Skill (E key) ---
    if ((e.code === 'KeyE' || e.key === 'e' || e.key === 'E') && G.state === 'PLAYING') {
        e.preventDefault();
        if (typeof fireTacticalSkill === 'function') fireTacticalSkill();
    }
    // --- Ultimate / Musou (Q key) ---
    if ((e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q') && G.state === 'PLAYING') {
        e.preventDefault();
        if (typeof fireUltimateSkill === 'function') fireUltimateSkill();
    }
    // --- Brotherhood Combo (R key) ---
    if ((e.code === 'KeyR' || e.key === 'r' || e.key === 'R') && G.state === 'PLAYING') {
        e.preventDefault();
        if (typeof executeBrotherhoodCombo === 'function') executeBrotherhoodCombo();
    }
    // --- Pause/Resume (ESC key) ---
    if (e.code === 'Escape') {
        e.preventDefault();
        if (G.state === 'PLAYING') {
            G.state = 'PAUSED';
            G.pauseMenuIdx = 0;
            SFX.menuClick();
        } else if (G.state === 'PAUSED') {
            G.state = 'PLAYING';
            SFX.menuClick();
        }
    }
    // --- Navigate pause menu with arrow keys ---
    if (G.state === 'PAUSED') {
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
            G.pauseMenuIdx = Math.max(0, (G.pauseMenuIdx || 0) - 1);
            SFX.menuClick();
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            G.pauseMenuIdx = Math.min(3, (G.pauseMenuIdx || 0) + 1);
            SFX.menuClick();
        }
        if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            if (typeof handlePauseMenuSelect === 'function') handlePauseMenuSelect(G.pauseMenuIdx || 0);
        }
    }
    // --- Language Toggle (L key) ---
    if ((e.code === 'KeyL' || e.key === 'l' || e.key === 'L') && (G.state === 'MENU' || G.state === 'HERO_SELECT' || G.state === 'PLAYING' || G.state === 'PAUSED')) {
        e.preventDefault();
        G.lang = G.lang === 'vi' ? 'en' : 'vi';
        if (typeof setLang === 'function') setLang(G.lang);
    }

    // --- L002: Minimap Toggle (M key) ---
    if ((e.code === 'KeyM' || e.key === 'm' || e.key === 'M') && G.state === 'PLAYING') {
        e.preventDefault();
        G.showMinimap = !G.showMinimap;
    }

    // --- L003: Victory Screen Controls ---
    if (G.state === 'VICTORY') {
        if (e.code === 'Space') {
            e.preventDefault();
            // Continue in endless mode
            G.state = 'PLAYING';
            G.finalBoss = null; // Clear so victory doesn't retrigger
            G.floorAnnounce = { text: '♾ ENDLESS MODE ♾', sub: 'The fight continues...', timer: 2, color: '#ffd700' };
            SFX.menuClick();
        }
        if (e.code === 'Escape') {
            e.preventDefault();
            G.state = 'MENU';
            SFX.menuClick();
        }
    }

    // --- Quick Select: Level-Up choices (1/2/3 keys) ---
    if (G.state === 'LEVEL_UP' && G.levelUpChoices && G.levelUpChoices.length > 0) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= G.levelUpChoices.length) {
            e.preventDefault();
            if (typeof selectLevelUpChoice === 'function') {
                selectLevelUpChoice(G.levelUpChoices[keyNum - 1]);
            }
        }
    }

    // --- Quick Select: Hero Select (1-5 keys) ---
    if (G.state === 'HERO_SELECT') {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= HEROES.length) {
            e.preventDefault();
            G.selectedHero = HEROES[keyNum - 1].id;
            if (typeof startGame === 'function') startGame();
        }
    }
});

// --- Resize ---
function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_W * dpr;
    canvas.height = GAME_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resize);
resize();

// --- Utility ---
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function rng(min, max) { return Math.random() * (max - min) + min; }
function rngInt(min, max) { return Math.floor(rng(min, max + 1)); }
function rngEl() { return EL_KEYS[rngInt(0, 4)]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function shake(amount, dur) { G.shakeDur = Math.max(G.shakeDur, dur); G.shakeX = rng(-amount, amount); G.shakeY = rng(-amount, amount); }
function hitStop(dur) { G.hitStop = Math.max(G.hitStop, dur); }

function spawnDmgNum(x, y, val, color, big) {
    G.dmgNums.push({ x, y, val: Math.round(val), color, big: !!big, life: 1.0, vy: -40 });
}

function spawnParticles(x, y, color, count, speed) {
    for (let i = 0; i < count; i++) {
        const a = rng(0, Math.PI * 2);
        const s = rng(speed * 0.3, speed);
        G.particles.push({
            x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
            life: 1.0, decay: rng(1.5, 3), color, size: rng(1, 3)
        });
    }
}

// --- Text Rendering (outlined for readability) ---
function drawText(text, x, y, { font = 'bold 12px monospace', fill = '#fff', align = 'left', outline = true, outlineColor = '#000', outlineWidth = 3 } = {}) {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    if (outline) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
}

function drawBar(x, y, w, h, pct, fgColor, bgColor = '#222', borderColor = '#555') {
    ctx.fillStyle = bgColor; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = fgColor; ctx.fillRect(x, y, w * clamp(pct, 0, 1), h);
    ctx.strokeStyle = borderColor; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}

// --- Camera ---
function updateCamera() {
    G.camX = lerp(G.camX, P.x - GAME_W / 2, 0.1);
    G.camY = lerp(G.camY, P.y - GAME_H / 2, 0.1);
    G.camX = clamp(G.camX, 0, G.arenaW - GAME_W);
    G.camY = clamp(G.camY, 0, G.arenaH - GAME_H);
    if (G.shakeDur > 0) {
        G.shakeDur -= G.dt;
        G.shakeX = rng(-3, 3) * (G.shakeDur / 0.2);
        G.shakeY = rng(-3, 3) * (G.shakeDur / 0.2);
    } else { G.shakeX = 0; G.shakeY = 0; }
}
