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
    // N002: Kill Streak System
    killStreak: 0,              // Current kill streak count
    killStreakTimer: 0,          // Time since last kill (resets streak at 3s)
    killStreakTier: 0,           // Current streak tier index
    killStreakXpMult: 1,         // Current XP bonus from streak
    killStreakAnnounce: null,    // { text, color, timer } for center announcements
    // N004: Blood Moon Events
    bloodMoon: false,           // Is Blood Moon active?
    bloodMoonTimer: 0,          // Time remaining for Blood Moon
    bloodMoonCooldown: 0,       // Cooldown before next Blood Moon can trigger
    bloodMoonWaves: 0,          // Extra enemy waves spawned
    bloodMoonRewardMult: 1.5,   // XP/gold bonus during Blood Moon
    // P001: Physics Hazards
    hazards: [],
    // Mouse tracking
    mouse: { x: 0, y: 0, moved: false },
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

// N002: Kill Streak Tiers
const KILL_STREAK_TIERS = [
    { threshold: 25, text: '🔥 KILLING SPREE!', xpMult: 1.1, color: '#ffaa00' },
    { threshold: 50, text: '💀 RAMPAGE!', xpMult: 1.2, color: '#ff6600' },
    { threshold: 100, text: '⚡ MASSACRE!', xpMult: 1.3, color: '#ff3300' },
    { threshold: 200, text: '🌟 UNSTOPPABLE!', xpMult: 1.5, color: '#ff00ff' },
    { threshold: 500, text: '👑 GODLIKE!', xpMult: 2.0, color: '#ffd700' }
];

// N003: Elite Enemy Modifiers
const ELITE_MODIFIERS = [
    { id: 'shielded', icon: '🛡️', label: 'Shielded', color: '#4488ff', desc: '50% DR for first 3 hits' },
    { id: 'berserker', icon: '⚡', label: 'Berserker', color: '#ff2222', desc: 'Enrages below 30% HP' },
    { id: 'splitting', icon: '🧬', label: 'Splitting', color: '#44dd44', desc: 'Splits into 2 on death' },
    { id: 'vampiric', icon: '🧛', label: 'Vampiric', color: '#aa44cc', desc: 'Heals 10% of dmg dealt' },
    { id: 'teleporter', icon: '💫', label: 'Teleporter', color: '#44dddd', desc: 'Blinks every 3s' },
    { id: 'molten', icon: '🔥', label: 'Molten', color: '#ff6600', desc: 'Fire AoE on death' }
];
const P = {
    x: 1000, y: 1000, w: 12, h: 14,
    vx: 0, vy: 0, speed: 100,
    hp: 100, maxHp: 100, xp: 0, xpNeeded: 25, level: 1,
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
window.addEventListener('keyup', e => {
    keys[e.key] = false; keys[e.code] = false;
    // P008: Release Omega charge on F key up
    if ((e.code === 'KeyF' || e.key === 'f' || e.key === 'F') && typeof releaseOmegaAttack === 'function') {
        releaseOmegaAttack();
    }
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    const sx = (t.clientX - r.left) / r.width * GAME_W;
    const sy = (t.clientY - r.top) / r.height * GAME_H;
    if (G.state === 'MENU') {
        // M003: Check daily challenge button
        if (typeof DailyState !== 'undefined' && G._dailyBtnArea) {
            const b = G._dailyBtnArea;
            if (sx >= b.x && sx <= b.x + b.w && sy >= b.y && sy <= b.y + b.h) {
                DailyState.generateChallenge();
                G.state = 'DAILY_PREVIEW';
                SFX.menuClick();
                return;
            }
        }
        // Persistence Menu Clicks (Continue / New Game)
        if (G.menuButtons && typeof G.menuButtons === 'object') {
            const bCont = G.menuButtons.continue;
            const bNew = G.menuButtons.newGame;
            if (bCont && sx >= bCont.x && sx <= bCont.x + bCont.w && sy >= bCont.y && sy <= bCont.y + bCont.h) {
                if (typeof loadRunState === 'function') {
                    SFX.menuClick();
                    if (loadRunState()) return;
                }
            }
            if (bNew && sx >= bNew.x && sx <= bNew.x + bNew.w && sy >= bNew.y && sy <= bNew.y + bNew.h) {
                if (typeof clearRunState === 'function') clearRunState();
                transitionTo('HERO_SELECT');
                if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction();
                return;
            }
            return;
        }
        transitionTo('HERO_SELECT');
        if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction();
        return;
    }
    if (G.state === 'HERO_SELECT') { if (typeof handleHeroSelectClick === 'function') handleHeroSelectClick(sx, sy); return; }
    if (G.state === 'BONDING') { handleBondingClick(sx, sy); return; }
    if (G.state === 'GAME_OVER') { transitionTo('MENU'); return; }
    if (G.state === 'LEVEL_UP') { handleLevelUpClick(sx, sy); return; }
    // K001: Shop touch support
    if (G.state === 'SHOP') { if (typeof handleShopClick === 'function') handleShopClick(sx, sy); return; }
    // K001: Door choice touch support
    if (G.state === 'PLAYING' && G.roomState === 'DOOR_CHOICE') { if (typeof handleDoorChoiceClick === 'function') handleDoorChoiceClick(sx, sy); return; }
    // K002: Blessing choice touch support
    if (G.state === 'BLESSING_CHOICE') { if (typeof handleBlessingChoiceClick === 'function') handleBlessingChoiceClick(sx, sy); return; }
    // N006: Stage Clear Blessing touch support
    if (G.state === 'BLESSING_SELECT') { if (typeof handleBlessingSelectClick === 'function') handleBlessingSelectClick(sx, sy); return; }
    // S003: Relic choice touch support
    if (G.state === 'RELIC_CHOICE') { if (typeof handleRelicChoiceClick === 'function') handleRelicChoiceClick(sx, sy); return; }
    // L003: Victory screen touch support
    if (G.state === 'VICTORY') {
        // Top half = continue (endless), bottom half = return to menu
        if (sy < GAME_H * 0.65) {
            G.finalBoss = null;
            if (typeof nextFloor === 'function') nextFloor();
            SFX.menuClick();
        } else {
            G.state = 'MENU';
            SFX.menuClick();
        }
        return;
    }
    // Pause menu touch support
    if (G.state === 'PAUSED') {
        // Calculate pause menu item positions (must match drawPauseMenu layout)
        const menuW = 200, menuH = 180;
        const menuX = GAME_W / 2 - menuW / 2;
        const menuY = GAME_H / 2 - menuH / 2;
        const itemH = 28;
        const startY = menuY + 38;
        for (let i = 0; i < 4; i++) {
            const iy = startY + i * itemH;
            if (sx >= menuX + 8 && sx <= menuX + menuW - 8 && sy >= iy && sy <= iy + itemH - 4) {
                if (typeof handlePauseMenuSelect === 'function') handlePauseMenuSelect(i);
                return;
            }
        }
        return;
    }
    // M003: Daily Challenge preview touch support
    if (G.state === 'DAILY_PREVIEW') {
        if (typeof DailyState !== 'undefined') DailyState.startChallenge();
        return;
    }
    // M002: Achievements touch — tap to close
    if (G.state === 'ACHIEVEMENTS') {
        G.state = G._preAchievementState || 'PLAYING';
        SFX.menuClick();
        return;
    }
    // Mobile pause button detection (during PLAYING state)
    if (G.state === 'PLAYING' && G._pauseBtnArea) {
        const pb = G._pauseBtnArea;
        if (sx >= pb.x && sx <= pb.x + pb.w && sy >= pb.y && sy <= pb.y + pb.h) {
            G.state = 'PAUSED';
            G.pauseMenuIdx = 0;
            SFX.menuClick();
            return;
        }
    }
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

// Mouse Move Tracking
canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    G.mouse.x = (e.clientX - r.left) / r.width * GAME_W;
    G.mouse.y = (e.clientY - r.top) / r.height * GAME_H;
    G.mouse.moved = true;
}, { passive: false });

canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width * GAME_W;
    const my = (e.clientY - r.top) / r.height * GAME_H;
    if (G.state === 'MENU') {
        // M003: Check daily challenge button
        if (typeof DailyState !== 'undefined' && G._dailyBtnArea) {
            const b = G._dailyBtnArea;
            if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                DailyState.generateChallenge();
                G.state = 'DAILY_PREVIEW';
                SFX.menuClick();
                return;
            }
        }

        // --- Persistence Menu Clicks ---
        if (G.menuButtons && typeof G.menuButtons === 'object') {
            const bCont = G.menuButtons.continue;
            const bNew = G.menuButtons.newGame;
            // Continue
            if (bCont && mx >= bCont.x && mx <= bCont.x + bCont.w && my >= bCont.y && my <= bCont.y + bCont.h) {
                if (typeof loadRunState === 'function') {
                    SFX.menuClick();
                    if (loadRunState()) return; // Success load
                }
            }
            // New Game
            if (bNew && mx >= bNew.x && mx <= bNew.x + bNew.w && my >= bNew.y && my <= bNew.y + bNew.h) {
                if (typeof clearRunState === 'function') clearRunState();
                transitionTo('HERO_SELECT');
                if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction();
                return;
            }
            // If viewing continue menu, block default start
            return;
        }

        transitionTo('HERO_SELECT');
        if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction();
    }
    else if (G.state === 'HERO_SELECT') { if (typeof handleHeroSelectClick === 'function') handleHeroSelectClick(mx, my); }
    else if (G.state === 'BONDING') handleBondingClick(mx, my);
    else if (G.state === 'GAME_OVER') transitionTo('MENU');
    else if (G.state === 'LEVEL_UP') handleLevelUpClick(mx, my);
    // K001: Shop & Door choice clicks
    else if (G.state === 'SHOP') { if (typeof handleShopClick === 'function') handleShopClick(mx, my); }
    else if (G.state === 'PLAYING' && G.roomState === 'DOOR_CHOICE') { if (typeof handleDoorChoiceClick === 'function') handleDoorChoiceClick(mx, my); }
    // K002: Blessing choice clicks
    else if (G.state === 'BLESSING_CHOICE') { if (typeof handleBlessingChoiceClick === 'function') handleBlessingChoiceClick(mx, my); }
    // N006: Stage Clear Blessing clicks
    else if (G.state === 'BLESSING_SELECT') { if (typeof handleBlessingSelectClick === 'function') handleBlessingSelectClick(mx, my); }
    // S003: Relic choice clicks
    else if (G.state === 'RELIC_CHOICE') { if (typeof handleRelicChoiceClick === 'function') handleRelicChoiceClick(mx, my); }
    // P001: Purge Shrine clicks
    else if (G.state === 'PURGE_SHRINE') { if (typeof handlePurgeShrineClick === 'function') handlePurgeShrineClick(mx, my); }
});

// --- Dodge Roll (Space key) ---
window.addEventListener('keydown', e => {
    if (e.code === 'Space' && G.state === 'PLAYING' && P.dodgeCd <= 0 && P.dodgeTimer <= 0) {
        e.preventDefault();
        P.dodgeTimer = 0.25;
        // T-03: Apply mount dodge CD bonus (Shadow Steed: -0.2s)
        P.dodgeCd = Math.max(0.3, 1.0 + (P.dodgeCdBonus || 0));
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
    // --- P008: Omega Attack Charge (F key — hold to charge) ---
    if ((e.code === 'KeyF' || e.key === 'f' || e.key === 'F') && G.state === 'PLAYING') {
        e.preventDefault();
        if (typeof startOmegaCharge === 'function') startOmegaCharge();
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
        } else if (G.state === 'ACHIEVEMENTS') {
            G.state = G._preAchievementState || 'PLAYING';
            SFX.menuClick();
        } else if (G.state === 'DAILY_PREVIEW') {
            G.state = 'MENU';
            SFX.menuClick();
        }
    }
    // --- M003: Daily Challenge start (Enter on preview) ---
    if (G.state === 'DAILY_PREVIEW' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        if (typeof DailyState !== 'undefined') DailyState.startChallenge();
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

    // --- M002: Achievements Toggle (TAB key) ---
    if (e.code === 'Tab') {
        e.preventDefault();
        if (G.state === 'ACHIEVEMENTS') {
            G.state = G._preAchievementState || 'PLAYING';
            SFX.menuClick();
        } else if (G.state === 'PLAYING' || G.state === 'PAUSED') {
            G._preAchievementState = G.state;
            G.state = 'ACHIEVEMENTS';
            SFX.menuClick();
        }
    }

    // --- L003: Victory Screen Controls ---
    if (G.state === 'VICTORY') {
        if (e.code === 'Space') {
            e.preventDefault();
            // Continue in endless mode -> Go to next floor (Blessing Select)
            G.finalBoss = null;
            if (typeof nextFloor === 'function') nextFloor();
            SFX.menuClick();
        }
        if (e.code === 'Escape') {
            e.preventDefault();
            G.state = 'MENU';
            SFX.menuClick();
        }
    }

    // --- Quick Select: Stage Clear Blessings (1/2/3 keys) ---
    if (G.state === 'BLESSING_SELECT' && G.blessingChoices && G.blessingChoices.length > 0) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= G.blessingChoices.length) {
            e.preventDefault();
            if (typeof selectStageClearBlessing === 'function') {
                selectStageClearBlessing(G.blessingChoices[keyNum - 1]);
            }
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
    // N001: Pool cap — prevent GC pressure
    if (G.dmgNums.length >= 50) G.dmgNums.shift();
    // Support string labels ("CRIT!", "EXECUTE!", etc.)
    const isStr = typeof val === 'string';
    const numVal = isStr ? 0 : Math.round(val);
    const label = isStr ? val : null;
    // N001: Font size by magnitude (small 1-10, med 10-50, large 50-200, huge 200+)
    let sz = 8;
    if (big) sz = 12;
    else if (!isStr && numVal >= 200) sz = 14;
    else if (!isStr && numVal >= 50) sz = 11;
    else if (!isStr && numVal >= 10) sz = 9;
    G.dmgNums.push({ x, y, val: numVal, label, color, big: !!big, sz, life: 1.0, vy: -40 - (big ? 15 : 0) });
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
