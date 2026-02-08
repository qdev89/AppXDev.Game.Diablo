// ============================================================
// DYNASTY BRUHHH DUNGEON - Weapon Evolution System
// ============================================================
// Combine two Lv3+ weapons into a powerful evolved super-weapon

const EVOLUTIONS = [
    {
        id: 'wildfire_blade', name: '🔥 Wildfire Blade',
        req: ['fire_sword', 'wood_vine'], el: 'FIRE',
        type: 'melee', desc: 'Screen-wide fire wave',
        dmg: 40, cd: 1.0, range: 100, arc: 360, tier: 3,
        vfx: 'fireWave'
    },
    {
        id: 'frozen_tempest', name: '❄️ Frozen Tempest',
        req: ['water_bolt', 'metal_rain'], el: 'WATER',
        type: 'aoe', desc: 'Ice crystal explosion',
        dmg: 35, cd: 2.0, range: 120, tier: 3,
        vfx: 'iceBurst'
    },
    {
        id: 'volcanic_guard', name: '🌋 Volcanic Guard',
        req: ['earth_wall', 'fire_pillar'], el: 'EARTH',
        type: 'shield', desc: 'Lava armor + eruption',
        dmg: 20, cd: 0.4, range: 50, tier: 3,
        vfx: 'lavaShield'
    },
    {
        id: 'iron_roots', name: '⚔️ Iron Roots',
        req: ['metal_blade', 'wood_vine'], el: 'METAL',
        type: 'orbital', desc: 'Metallic vine chains',
        dmg: 18, cd: 0.2, range: 70, count: 5, tier: 3,
        vfx: 'metalVines'
    },
    {
        id: 'tsunami_fist', name: '🌊 Tsunami Fist',
        req: ['water_wave', 'earth_quake'], el: 'WATER',
        type: 'aoe', desc: 'Ground-pound wave',
        dmg: 50, cd: 3.5, range: 150, tier: 3,
        vfx: 'tsunamiWave'
    },
];

// Track discovered evolutions
const discoveredEvolutions = new Set();

function checkEvolutions() {
    for (const evo of EVOLUTIONS) {
        // Check if player has both weapons at Lv3+
        const w1 = G.weapons.find(w => w.id === evo.req[0] && w.level >= 3);
        const w2 = G.weapons.find(w => w.id === evo.req[1] && w.level >= 3);
        if (w1 && w2 && !G.weapons.find(w => w.id === evo.id)) {
            return evo;
        }
    }
    return null;
}

function getEvolutionChoice() {
    const evo = checkEvolutions();
    if (!evo) return null;
    return {
        def: {
            ...evo,
            isEvolution: true
        },
        isUpgrade: false,
        level: 1,
        isEvolution: true
    };
}

function applyEvolution(evoDef) {
    // Remove the two base weapons
    G.weapons = G.weapons.filter(w => !evoDef.req.includes(w.id));

    // Add evolved weapon
    const evoWeapon = createWeapon(evoDef);
    evoWeapon.level = 3; // Start at Lv3
    evoWeapon.isEvolved = true;
    G.weapons.push(evoWeapon);

    // Epic feedback
    triggerFlash('#ffffff', 0.6);
    triggerChromatic(3);
    shake(6, 0.3);
    spawnParticles(P.x, P.y, '#ffdd00', 30, 100);
    spawnParticles(P.x, P.y, '#ffffff', 20, 60);

    // Element particles
    const el = evoDef.el || 'FIRE';
    spawnElementParticles(P.x, P.y, el, 20, 80);

    // Track discovery
    if (!discoveredEvolutions.has(evoDef.id)) {
        discoveredEvolutions.add(evoDef.id);
        // Show discovery popup
        G.evolutionPopup = {
            name: evoDef.name,
            desc: evoDef.desc,
            timer: 3.0
        };
    }

    SFX.levelUp();
    SFX.combo50();
}

// Update evolution popup (call from main update)
function updateEvolutionPopup(dt) {
    if (G.evolutionPopup) {
        G.evolutionPopup.timer -= dt;
        if (G.evolutionPopup.timer <= 0) {
            G.evolutionPopup = null;
        }
    }
}

// Draw evolution popup
function drawEvolutionPopup() {
    if (!G.evolutionPopup) return;
    const ep = G.evolutionPopup;
    const alpha = Math.min(ep.timer, 1);

    ctx.globalAlpha = alpha;

    // Background
    ctx.fillStyle = 'rgba(20, 10, 40, 0.85)';
    const bw = 240, bh = 60;
    const bx = (GAME_W - bw) / 2, by = GAME_H * 0.15;
    ctx.fillRect(bx, by, bw, bh);

    // Gold border
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Inner glow line
    ctx.strokeStyle = 'rgba(255,221,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    // Text
    drawText('⚡ WEAPON EVOLVED! ⚡', GAME_W / 2, by + 8, {
        font: 'bold 11px monospace', fill: '#ffdd00', align: 'center'
    });
    drawText(ep.name, GAME_W / 2, by + 24, {
        font: 'bold 10px monospace', fill: '#ffffff', align: 'center'
    });
    drawText(ep.desc, GAME_W / 2, by + 40, {
        font: '8px monospace', fill: '#aaaacc', align: 'center'
    });

    ctx.globalAlpha = 1;
}
