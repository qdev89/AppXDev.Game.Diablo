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
    state: 'MENU', // MENU, BONDING, PLAYING, LEVEL_UP, PAUSED, GAME_OVER
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
    yinYang: { yin: 0, yang: 0, state: 'NEUTRAL', timer: 0 }
};

// --- Player ---
const P = {
    x: 1000, y: 1000, w: 12, h: 14,
    vx: 0, vy: 0, speed: 100,
    hp: 100, maxHp: 100, xp: 0, xpNeeded: 20, level: 1,
    element: 'METAL', facing: 1, // 1=right, -1=left
    invincible: 0, damageFlash: 0
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
    if (G.state === 'MENU') { G.state = 'BONDING'; return; }
    if (G.state === 'BONDING') { handleBondingClick(sx, sy); return; }
    if (G.state === 'GAME_OVER') { G.state = 'BONDING'; return; }
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
    if (G.state === 'MENU') { G.state = 'BONDING'; if (typeof initAudioOnInteraction === 'function') initAudioOnInteraction(); }
    else if (G.state === 'BONDING') handleBondingClick(mx, my);
    else if (G.state === 'GAME_OVER') G.state = 'BONDING';
    else if (G.state === 'LEVEL_UP') handleLevelUpClick(mx, my);
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
