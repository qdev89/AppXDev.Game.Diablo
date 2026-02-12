// ============================================================
// DYNASTY BRUHHH DUNGEON - Post-Processing FX Pipeline
// ============================================================
// CRT scanlines, vignette, bloom, chromatic aberration, screen flash

// Offscreen canvas for bloom
let bloomCanvas, bloomCtx;
function initPostFX() {
    bloomCanvas = document.createElement('canvas');
    bloomCanvas.width = GAME_W;
    bloomCanvas.height = GAME_H;
    bloomCtx = bloomCanvas.getContext('2d');
}

// Track post-fx state
const PostFX = {
    chromaticAb: 0,      // chromatic aberration intensity (0-3px)
    screenFlash: 0,       // white flash alpha (0-1)
    screenFlashColor: '#ffffff',
    slowMo: 1.0,          // time scale (1.0 = normal)
    speedLines: 0,        // speed line intensity  
    darken: 0,            // screen darken (0-0.8)
};

// Trigger FX helpers
function triggerChromatic(intensity) { PostFX.chromaticAb = Math.max(PostFX.chromaticAb, intensity); }
function triggerFlash(color, intensity) { PostFX.screenFlash = intensity || 0.4; PostFX.screenFlashColor = color || '#ffffff'; }
function triggerSpeedLines(intensity) { PostFX.speedLines = Math.max(PostFX.speedLines, intensity); }

// --- MAIN POST-FX PASS ---
function applyPostFX() {
    // Decay FX values
    PostFX.chromaticAb *= 0.9;
    if (PostFX.chromaticAb < 0.1) PostFX.chromaticAb = 0;
    PostFX.screenFlash *= 0.85;
    if (PostFX.screenFlash < 0.01) PostFX.screenFlash = 0;
    PostFX.speedLines *= 0.92;
    if (PostFX.speedLines < 0.01) PostFX.speedLines = 0;

    // 1. CRT Scanlines
    drawScanlines();

    // 2. Vignette
    drawVignette();

    // 3. Chromatic Aberration (on hit)
    if (PostFX.chromaticAb > 0.2) {
        drawChromaticAberration(PostFX.chromaticAb);
    }

    // 4. Speed Lines (combo milestones)
    if (PostFX.speedLines > 0.1) {
        drawSpeedLines(PostFX.speedLines);
    }

    // N004: Blood Moon red tint
    if (G.bloodMoon) {
        const bmPulse = 0.08 + Math.sin(G.time * 2) * 0.03;
        ctx.globalAlpha = bmPulse;
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.globalAlpha = 1;
    }

    // 5. Screen Flash
    if (PostFX.screenFlash > 0.01) {
        ctx.globalAlpha = PostFX.screenFlash;
        ctx.fillStyle = PostFX.screenFlashColor;
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.globalAlpha = 1;
    }

    // 6. Screen Darken (boss entrance, death)
    if (PostFX.darken > 0) {
        ctx.globalAlpha = PostFX.darken;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.globalAlpha = 1;
    }
}

// --- CRT Scanlines ---
function drawScanlines() {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let y = 0; y < GAME_H; y += 2) {
        ctx.fillRect(0, y, GAME_W, 1);
    }
}

// --- Vignette ---
function drawVignette() {
    const grd = ctx.createRadialGradient(
        GAME_W / 2, GAME_H / 2, GAME_W * 0.3,
        GAME_W / 2, GAME_H / 2, GAME_W * 0.75
    );
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, GAME_W, GAME_H);
}

// --- Chromatic Aberration ---
function drawChromaticAberration(intensity) {
    // Simple approximation: draw colored tinted overlays with offset
    const offset = Math.ceil(intensity);
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.15 * (intensity / 3);

    // Red channel offset right
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(offset, 0, GAME_W, GAME_H);

    // Blue channel offset left  
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(-offset, 0, GAME_W, GAME_H);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
}

// --- Speed Lines ---
function drawSpeedLines(intensity) {
    const cx = GAME_W / 2, cy = GAME_H / 2;
    ctx.globalAlpha = intensity * 0.4;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 / 24) * i + G.time * 0.5;
        const innerR = GAME_W * 0.25;
        const outerR = GAME_W * 0.7;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// --- BLOOM GLOW (additive on bright elements) ---
function drawGlow(x, y, radius, color, intensity) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = intensity;

    const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
}

// --- WEAPON TRAIL ---
function drawTrail(points, color, width) {
    if (points.length < 2) return;

    for (let i = 1; i < points.length; i++) {
        const t = i / points.length; // 0 = old, 1 = new
        ctx.globalAlpha = t * 0.6;
        ctx.strokeStyle = color;
        ctx.lineWidth = width * t;
        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// --- ELEMENT PARTICLES ---
const ELEMENT_PARTICLE_CONFIG = {
    FIRE: { colors: ['#ff6622', '#ff4400', '#ffaa00', '#ffcc44'], gravity: -30, size: [1, 3], life: [0.3, 0.8] },
    WATER: { colors: ['#2266ff', '#44aaff', '#88ccff', '#aaddff'], gravity: 20, size: [1, 2], life: [0.4, 0.9] },
    WOOD: { colors: ['#22cc44', '#44ff66', '#88ff88', '#aaffaa'], gravity: -10, size: [1, 3], life: [0.5, 1.0] },
    METAL: { colors: ['#aabbcc', '#ccddee', '#ffffff', '#8899aa'], gravity: 50, size: [1, 2], life: [0.2, 0.5] },
    EARTH: { colors: ['#aa8833', '#886622', '#ccaa44', '#665522'], gravity: 80, size: [2, 4], life: [0.3, 0.6] },
};

function spawnElementParticles(x, y, element, count, speed) {
    const config = ELEMENT_PARTICLE_CONFIG[element] || ELEMENT_PARTICLE_CONFIG.FIRE;
    for (let i = 0; i < count; i++) {
        const a = rng(0, Math.PI * 2);
        const s = rng(speed * 0.3, speed);
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        G.particles.push({
            x, y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s + (config.gravity || 0) * 0.5,
            life: rng(config.life[0], config.life[1]),
            decay: rng(1.0, 2.0),
            color,
            size: rng(config.size[0], config.size[1]),
            glow: true
        });
    }
}

// --- DEATH EXPLOSION ---
function spawnDeathExplosion(x, y, color, lightColor, size) {
    // Pixel shatter - 8-16 fragments
    const fragCount = Math.floor(size * 2) + 8;
    for (let i = 0; i < fragCount; i++) {
        const a = rng(0, Math.PI * 2);
        const s = rng(30, 80 + size * 10);
        G.particles.push({
            x: x + rng(-size / 2, size / 2),
            y: y + rng(-size / 2, size / 2),
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 20,
            life: 1.0,
            decay: rng(1.5, 3.0),
            color: Math.random() > 0.5 ? color : lightColor,
            size: rng(1, 3),
            glow: false
        });
    }

    // White flash ring
    G.particles.push({
        x, y, vx: 0, vy: 0,
        life: 0.3, decay: 3.0,
        color: '#ffffff',
        size: size * 3,
        isRing: true
    });

    // Screen flash
    triggerFlash(lightColor, 0.15);
}

// --- AMBIENT PARTICLES ---
const ambientParticles = [];
function initAmbientParticles() {
    for (let i = 0; i < 40; i++) {
        ambientParticles.push({
            x: rng(0, 2000),
            y: rng(0, 2000),
            vx: rng(-5, 5),
            vy: rng(-8, -2),
            size: rng(0.5, 1.5),
            alpha: rng(0.1, 0.3),
            color: Math.random() > 0.5 ? '#ffeecc' : '#aaccff',
        });
    }
}

function updateAmbientParticles(dt) {
    for (const p of ambientParticles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = 0.1 + Math.sin(G.time * 2 + p.x * 0.01) * 0.15;

        // Wrap around arena
        if (p.x < 0) p.x = G.arenaW;
        if (p.x > G.arenaW) p.x = 0;
        if (p.y < 0) p.y = G.arenaH;
        if (p.y > G.arenaH) p.y = 0;
    }
}

function drawAmbientParticles() {
    for (const p of ambientParticles) {
        if (p.x < G.camX - 10 || p.x > G.camX + GAME_W + 10) continue;
        if (p.y < G.camY - 10 || p.y > G.camY + GAME_H + 10) continue;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

// --- FLOOR TILE SYSTEM ---
const BIOMES = [
    { name: 'Stone Dungeon', floor: '#1a1a22', tile: '#222233', accent: '#2a2a3a', wallColor: '#333344', torch: '#ff8833' },
    { name: 'Crimson Cavern', floor: '#1a1111', tile: '#221818', accent: '#331a1a', wallColor: '#442222', torch: '#ff4422' },
    { name: 'Jade Temple', floor: '#111a11', tile: '#182218', accent: '#1a331a', wallColor: '#224422', torch: '#44ff88' },
    { name: 'Shadow Realm', floor: '#110d1a', tile: '#1a1522', accent: '#221a33', wallColor: '#332244', torch: '#aa44ff' },
];

function getBiome() {
    return BIOMES[(Math.floor((G.floor - 1) / 5)) % BIOMES.length];
}

function drawFloorTiles() {
    const biome = getBiome();

    // Base floor
    ctx.fillStyle = biome.floor;
    ctx.fillRect(0, 0, G.arenaW, G.arenaH);

    // Tile grid
    const tileSize = 32;
    const sx = Math.floor(G.camX / tileSize) * tileSize;
    const sy = Math.floor(G.camY / tileSize) * tileSize;

    for (let x = sx; x < G.camX + GAME_W + tileSize; x += tileSize) {
        for (let y = sy; y < G.camY + GAME_H + tileSize; y += tileSize) {
            // Checkerboard pattern
            const isAlt = ((x / tileSize + y / tileSize) % 2) === 0;
            ctx.fillStyle = isAlt ? biome.tile : biome.accent;
            ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

            // Occasional crack/detail (deterministic from position)
            const hash = ((x * 73856093) ^ (y * 19349663)) & 0xffff;
            if (hash < 800) {
                ctx.fillStyle = biome.floor;
                const cx = x + (hash % 20) + 6;
                const cy = y + ((hash >> 5) % 20) + 6;
                ctx.fillRect(cx, cy, 3 + (hash % 4), 1);
                if (hash < 300) ctx.fillRect(cx + 1, cy + 1, 1, 2);
            }
        }
    }

    // Arena border — thick stone wall
    ctx.fillStyle = biome.wallColor;
    ctx.fillRect(0, 0, G.arenaW, 4);          // top
    ctx.fillRect(0, G.arenaH - 4, G.arenaW, 4); // bottom
    ctx.fillRect(0, 0, 4, G.arenaH);          // left
    ctx.fillRect(G.arenaW - 4, 0, 4, G.arenaH); // right

    // Torch glow along walls (every 200px)
    const torchSpacing = 200;
    for (let tx = torchSpacing; tx < G.arenaW; tx += torchSpacing) {
        // Top wall torch
        if (tx > G.camX - 50 && tx < G.camX + GAME_W + 50) {
            drawTorch(tx, 8);
        }
        // Bottom wall torch
        if (tx > G.camX - 50 && tx < G.camX + GAME_W + 50) {
            drawTorch(tx, G.arenaH - 12);
        }
    }
    for (let ty = torchSpacing; ty < G.arenaH; ty += torchSpacing) {
        if (ty > G.camY - 50 && ty < G.camY + GAME_H + 50) {
            drawTorch(8, ty);
            drawTorch(G.arenaW - 12, ty);
        }
    }
}

function drawTorch(x, y) {
    const biome = getBiome();
    // Torch base
    ctx.fillStyle = '#554433';
    ctx.fillRect(x - 1, y, 2, 4);

    // Flame (animated)
    const flicker = Math.sin(G.time * 12 + x * 0.1) * 0.5 + 0.5;
    const flicker2 = Math.cos(G.time * 9 + y * 0.1) * 0.3;

    ctx.fillStyle = biome.torch;
    ctx.fillRect(x - 1 + flicker2, y - 2, 2, 2);
    ctx.fillStyle = '#ffee88';
    ctx.fillRect(x, y - 3 - flicker, 1, 1);

    // Glow
    drawGlow(x, y - 2, 25 + flicker * 5, biome.torch, 0.15 + flicker * 0.05);
}

// Init on load
initAmbientParticles();
