// ============================================================
// DYNASTY BRUHHH DUNGEON - Weapons & Combat
// ============================================================

// --- Weapon Definitions ---
window.WEAPON_DEFS = [
    // ===== HERO SIGNATURE WEAPONS (unique starting weapons) =====
    {
        id: 'fire_halberd', name: '🔴 Sky Piercer', el: 'FIRE', type: 'melee',
        desc: 'Lu Bu\'s legendary halberd — wide devastating sweep',
        dmg: 15, cd: 0.9, range: 48, arc: 120, tier: 1, heroOnly: 'berserker',
        evolvesTo: 'fire_halberd_evo', evolutionReq: { passive: 'atk_speed', level: 5 }
    },
    {
        id: 'wood_fan', name: '🟢 Feather Fan', el: 'WOOD', type: 'projectile',
        desc: 'Zhuge Liang\'s fan — fires 3 wind blades in spread',
        dmg: 10, cd: 1.0, range: 140, speed: 180, spread: 3, spreadAngle: 25, tier: 1, heroOnly: 'strategist',
        evolvesTo: 'wood_fan_evo', evolutionReq: { passive: 'xp_gain', level: 5 }
    },
    {
        id: 'metal_twin', name: '🪙 Twin Blades', el: 'METAL', type: 'orbital',
        desc: 'Zhou Yu\'s dual swords — fast spinning orbit',
        dmg: 6, cd: 0.3, range: 40, count: 2, tier: 1, heroOnly: 'assassin',
        evolvesTo: 'metal_twin_evo', evolutionReq: { passive: 'move_spd', level: 5 }
    },
    {
        id: 'earth_spear', name: '🟤 Dragon Spear', el: 'EARTH', type: 'melee',
        desc: 'Zhao Yun\'s spear — long reach forward thrust',
        dmg: 16, cd: 0.7, range: 55, arc: 45, tier: 1, heroOnly: 'vanguard',
        evolvesTo: 'earth_spear_evo', evolutionReq: { passive: 'max_hp', level: 5 }
    },
    {
        id: 'water_scepter', name: '🔵 Dark Scepter', el: 'WATER', type: 'projectile',
        desc: 'Sima Yi\'s scepter — homing frost bolts',
        dmg: 15, cd: 1.0, range: 160, speed: 150, homing: true, tier: 1, heroOnly: 'mystic',
        evolvesTo: 'water_scepter_evo', evolutionReq: { passive: 'pickup_range', level: 5 }
    },
    {
        id: 'wood_shuriken', name: '🌟 Wind Shuriken', el: 'WOOD', type: 'thrown',
        desc: 'Huang Zhong\'s shuriken — 3-fan spread + pierce',
        dmg: 10, cd: 0.7, range: 170, speed: 220, spread: 3, spreadAngle: 30,
        pierce: 1, tier: 1, heroOnly: 'ranger',
        evolvesTo: 'wood_shuriken_evo', evolutionReq: { passive: 'atk_speed', level: 5 }
    },

    // ===== GENERIC WEAPONS (loot/level-up pool) =====
    {
        id: 'fire_sword', name: '🔴 Fire Sword', el: 'FIRE', type: 'melee', desc: 'Forward fire slash',
        dmg: 12, cd: 0.8, range: 40, arc: 90, tier: 1
    },
    {
        id: 'metal_blade', name: '🪙 Blade Storm', el: 'METAL', type: 'orbital', desc: 'Spinning blades orbit you',
        dmg: 8, cd: 0.3, range: 50, count: 3, tier: 1
    },
    {
        id: 'water_bolt', name: '🔵 Chain Frost', el: 'WATER', type: 'projectile', desc: 'Bounces between 3 enemies + slows',
        dmg: 13, cd: 1.0, range: 160, speed: 240, chain: 3, slowPct: 0.3, slowDur: 1.5, tier: 1
    },
    {
        id: 'wood_vine', name: '🟢 Root Zone', el: 'WOOD', type: 'aoe', desc: 'Healing vines damage nearby foes',
        dmg: 5, cd: 2.0, range: 60, duration: 3, tier: 1
    },
    {
        id: 'earth_wall', name: '🟤 Earth Shield', el: 'EARTH', type: 'shield', desc: 'Damage aura + defense up',
        dmg: 3, cd: 0.5, range: 35, tier: 1
    },
    {
        id: 'fire_pillar', name: '🔴 Fire Pillar', el: 'FIRE', type: 'projectile', desc: 'Erupting flame pillars',
        dmg: 20, cd: 1.8, range: 120, speed: 0, tier: 2
    },
    {
        id: 'metal_rain', name: '🪙 Arrow Rain', el: 'METAL', type: 'aoe', desc: 'Raining metal shards',
        dmg: 10, cd: 2.5, range: 100, tier: 2
    },
    {
        id: 'water_wave', name: '🔵 Tidal Wave', el: 'WATER', type: 'melee', desc: 'Wide water sweep',
        dmg: 18, cd: 1.5, range: 60, arc: 180, tier: 2
    },
    {
        id: 'wood_heal', name: '🟢 Life Surge', el: 'WOOD', type: 'heal', desc: 'Heal 20% HP over time',
        dmg: 0, cd: 8, healPct: 0.2, tier: 1
    },
    {
        id: 'earth_quake', name: '🟤 Earthquake', el: 'EARTH', type: 'aoe', desc: 'Ground slam, stuns nearby',
        dmg: 25, cd: 3.0, range: 80, tier: 2
    },
    // Thrown weapons (Ranger pool)
    {
        id: 'fire_kunai', name: '🔴 Flame Kunai', el: 'FIRE', type: 'thrown', desc: 'Piercing flame kunai + burn DOT',
        dmg: 9, cd: 0.5, range: 130, speed: 260, spread: 2, spreadAngle: 15,
        pierce: 2, burnDot: 3, tier: 1
    },
    {
        id: 'metal_crossbow', name: '🪙 Repeating Crossbow', el: 'METAL', type: 'thrown', desc: 'Rapid-fire piercing crossbow bolts',
        dmg: 9, cd: 0.3, range: 140, speed: 300, spread: 2, spreadAngle: 12,
        pierce: 1, tier: 2
    },

    // ===== EVOLVED WEAPONS (Tier 3) =====
    {
        id: 'fire_halberd_evo', name: '🔥 Inferno Dragon', el: 'FIRE', type: 'melee',
        desc: 'Lu Bu\'s ultimate halberd — leaves a trail of fire',
        dmg: 45, cd: 0.8, range: 70, arc: 160, tier: 3
    },
    {
        id: 'wood_fan_evo', name: '🌪️ Storm Lord\'s Call', el: 'WOOD', type: 'projectile',
        desc: 'Summons giant tornadoes',
        dmg: 35, cd: 0.9, range: 180, speed: 100, count: 5, spreadAngle: 60, tier: 3
    },
    {
        id: 'metal_twin_evo', name: '⚔️ Blade Master\'s Flow', el: 'METAL', type: 'orbital',
        desc: 'Massive web of blades',
        dmg: 25, cd: 0.2, range: 80, count: 8, tier: 3
    },
    {
        id: 'earth_spear_evo', name: '🏔️ Mountain Crusher', el: 'EARTH', type: 'melee',
        desc: 'Shockwaves on every hit',
        dmg: 50, cd: 0.6, range: 90, arc: 80, tier: 3
    },
    {
        id: 'water_scepter_evo', name: '❄️ Frost Archon\'s Gaze', el: 'WATER', type: 'projectile',
        desc: 'Blizzard storm',
        dmg: 40, cd: 1.2, range: 200, speed: 120, homing: true, tier: 3
    },
    {
        id: 'wood_shuriken_evo', name: '🍃 Wind Shadow', el: 'WOOD', type: 'thrown',
        desc: '8-way shuriken burst',
        dmg: 28, cd: 0.5, range: 250, spread: 8, spreadAngle: 360, pierce: 5, tier: 3
    },

    // Passives
    { id: 'atk_speed', name: '⚡ Swift Strikes', type: 'passive', desc: '+20% attack speed', stat: 'atkSpd', val: 0.2 },
    { id: 'max_hp', name: '❤️ Vitality', type: 'passive', desc: '+25 max HP', stat: 'maxHp', val: 25 },
    { id: 'move_spd', name: '🏃 Fleet Foot', type: 'passive', desc: '+15% move speed', stat: 'moveSpd', val: 0.15 },
    { id: 'pickup_range', name: '🧲 Magnet', type: 'passive', desc: '+50% pickup range', stat: 'pickupRange', val: 0.5 },
    { id: 'xp_gain', name: '📚 Scholar', type: 'passive', desc: '+25% XP gain', stat: 'xpGain', val: 0.25 },
];

// Active weapon instances on player
window.createWeapon = function (def) {
    return {
        ...def, timer: 0, level: 1, angle: 0,
        orbitAngle: Math.random() * Math.PI * 2,
        comboStep: 0, comboReset: 0
    };
}

// Check if weapon can evolve
window.checkEvolution = function () {
    for (const w of G.weapons) {
        if (w.level >= 5 && w.evolvesTo) {
            const req = w.evolutionReq;
            // Simplified check: require passive to be somewhat leveled (e.g. > 0)
            if (req && window.passives[req.passive] >= 0.2) {
                return { weapon: w, evolutionId: w.evolvesTo };
            }
        }
    }
    return null;
}

window.getEvolutionChoice = function () {
    const evo = window.checkEvolution();
    if (evo) {
        const evoDef = window.WEAPON_DEFS.find(d => d.id === evo.evolutionId);
        if (evoDef) {
            return {
                def: evoDef,
                isUpgrade: true,
                isEvolution: true,
                oldWeapon: evo.weapon,
                level: 1
            };
        }
    }
    return null;
}

window.applyEvolution = function (def) {
    // Find the base weapon to remove
    const baseId = def.id.replace('_evo', ''); // Naive check, or use logic
    // Better: find the weapon that evolved to this
    const oldWIndex = G.weapons.findIndex(w => w.evolvesTo === def.id);

    if (oldWIndex >= 0) {
        const oldW = G.weapons[oldWIndex];
        // Remove old weapon
        G.weapons.splice(oldWIndex, 1);

        // Add new evolved weapon
        const newW = window.createWeapon(def);
        newW.level = 1; // Evolved weapons start at level 1 (but are powerful)
        G.weapons.push(newW);

        // VFX
        if (typeof spawnParticles === 'function') spawnParticles(P.x, P.y, '#ff00ff', 50, 100);
        if (typeof SHAKE_SCREEN === 'function') SHAKE_SCREEN(10); // visual flair
        if (typeof SFX !== 'undefined') SFX.levelUp(); // reusable sfx

        // Announcement
        G.floorAnnounce = {
            text: '✨ EVOLUTION! ✨',
            subtitle: def.name,
            timer: 3.0,
            color: '#ff00ff'
        };
    }
}

// --- Passive Stats ---
// --- Passive Stats ---
window.passives = { atkSpd: 0, maxHp: 0, moveSpd: 0, pickupRange: 0, xpGain: 0 };

window.applyPassive = function (def) {
    window.passives[def.stat] = (window.passives[def.stat] || 0) + def.val;
    if (def.stat === 'maxHp') { P.maxHp += def.val; P.hp = Math.min(P.hp + def.val, P.maxHp); }
}

// --- Weapon Update ---
function updateWeapons(dt) {
    const auraAtkSpd = (G.allyAura && G.allyAura.atkSpd) ? G.allyAura.atkSpd : 0;
    const spdMult = 1 + (window.passives ? window.passives.atkSpd : 0) + auraAtkSpd;
    for (const w of G.weapons) {
        w.timer -= dt * spdMult;
        if (w.comboReset > 0) w.comboReset -= dt;
        if (w.comboReset <= 0) w.comboStep = 0; // Reset combo if idle too long

        if (w.type === 'orbital') {
            w.orbitAngle += dt * 3;
        }
        if (w.timer <= 0) {
            w.timer = w.cd;
            fireWeapon(w);
        }
    }
}

function fireWeapon(w) {
    const el = ELEMENTS[w.el] || ELEMENTS.METAL;
    switch (w.type) {
        case 'melee': fireMelee(w, el); break;
        case 'projectile': fireProjectile(w, el); break;
        case 'thrown': fireThrown(w, el); break;
        case 'orbital': fireOrbital(w, el); break;
        case 'aoe': fireAoE(w, el); break;
        case 'shield': fireShield(w, el); break;
        case 'heal': fireHeal(w); break;
    }
}

function fireMelee(w, el) {
    // 1. Determine Aim Angle
    let aimAngle = 0;
    if (G.mouse && G.mouse.moved) {
        aimAngle = Math.atan2(G.mouse.y + G.camY - P.y, G.mouse.x + G.camX - P.x);
        // Update P.facing based on aim for consistency
        if (Math.abs(Math.cos(aimAngle)) > 0.1) P.facing = Math.cos(aimAngle) > 0 ? 1 : -1;
    } else {
        // Fallback to movement or facing
        if (Math.abs(P.vx) > 10 || Math.abs(P.vy) > 10) {
            aimAngle = Math.atan2(P.vy, P.vx);
        } else {
            aimAngle = P.facing > 0 ? 0 : Math.PI;
        }
    }

    // 2. Combo Logic
    const step = w.comboStep || 0;
    let dmgMult = 1;
    let rangeMult = 1;
    let arcMult = 1;
    let vfxType = 'slash'; // slash, backslash, thrust

    // Combo Steps: 1 (Slash) -> 2 (Backslash) -> 3 (Finisher)
    if (step === 0) {
        // Normal slash
    } else if (step === 1) {
        vfxType = 'backslash';
        dmgMult = 1.2;
    } else if (step === 2) {
        vfxType = 'thrust';
        dmgMult = 2.0; rangeMult = 1.3; arcMult = 1.5;
        shake(4, 0.15); // Big impact
    }

    w.comboStep = (step + 1) % 3;
    w.comboReset = 1.5; // 1.5s to continue combo

    const arcRad = (w.arc || 90) * arcMult * Math.PI / 180;
    const range = (w.range + w.level * 5) * rangeMult;
    const finalDmg = w.dmg * (1 + w.level * 0.3) * dmgMult;

    // 3. Hit Detection
    let hitCount = 0;
    for (const e of G.enemies) {
        const dx = e.x - P.x, dy = e.y - P.y;
        const d = Math.hypot(dx, dy);
        if (d > range) continue;
        const angle = Math.atan2(dy, dx);
        let diff = angle - aimAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        if (Math.abs(diff) < arcRad / 2) {
            damageEnemy(e, finalDmg, w.el);
            hitCount++;

            // Impact VFX on hit
            spawnParticles(e.x, e.y, el.light, 3, 40);
            // Pushback
            const push = 100 * (step === 2 ? 3 : 1);
            e.vx += Math.cos(angle) * push;
            e.vy += Math.sin(angle) * push;
        }
    }

    // P001: Hazards on Melee Finishers or Evolved Weapons
    if (window.Physics) {
        // Fire Halberd Evo / Finisher -> Scorched Earth
        if (w.id === 'fire_halberd_evo' || (w.el === 'FIRE' && step === 2)) {
            window.Physics.spawnHazard(P.x + Math.cos(aimAngle) * range * 0.5, P.y + Math.sin(aimAngle) * range * 0.5, 'SCORCHED', range * 0.6);
        }
        // Earth Spear Evo -> Mud
        if (w.id === 'earth_spear_evo') {
            window.Physics.spawnHazard(P.x + Math.cos(aimAngle) * range * 0.5, P.y + Math.sin(aimAngle) * range * 0.5, 'MUD', range * 0.5);
        }
    }

    // 4. VFX Spawn
    G.bullets.push({
        x: P.x, y: P.y, type: vfxType, // Use centralized player pos, handle offset in renderer
        angle: aimAngle, arc: arcRad, range, color: el.light,
        el: w.el, life: 0.2, maxLife: 0.2, weaponId: w.id,
        comboStep: step
    });

    // Audio & Juice
    if (hitCount > 0) {
        shake(2 + step, 0.1);
        // Play hit sound (future)
        triggerFlash(el.light, 0.05);
    }
    triggerChromatic(step === 2 ? 3 : 1);

    // ===== HERO-SPECIFIC MELEE VFX =====
    if (w.id === 'fire_halberd') {
        // Sky Piercer — Flame explosion + ember shower + ground fire
        shake(4, 0.12);
        triggerChromatic(2);
        if (typeof triggerFlash === 'function') triggerFlash('#ff4400', 0.08);
        // Fire explosion ring
        G.skillEffects.push({
            type: 'shockwave', x: P.x + P.facing * 20, y: P.y,
            radius: 5, maxRadius: range * 0.7, speed: 250,
            color: '#ff4400', alpha: 0.6, lineWidth: 3, timer: 0.35
        });
        // Ember shower (12 particles rising)
        for (let i = 0; i < 12; i++) {
            const a = (aimAngle || 0) + (Math.random() - 0.5) * arcRad;
            const spd = 40 + Math.random() * 80;
            G.skillEffects.push({
                type: 'ember',
                x: P.x + Math.cos(a) * (range * 0.3 + Math.random() * range * 0.5),
                y: P.y + Math.sin(a) * (range * 0.3 + Math.random() * range * 0.5),
                vx: Math.cos(a) * spd * 0.3,
                vy: -(30 + Math.random() * 50),
                color: ['#ff2200', '#ff6600', '#ff8800', '#ffd700'][i % 4],
                alpha: 0.9, timer: 0.5 + Math.random() * 0.4,
                size: 2 + Math.random() * 2
            });
        }
        // Ground fire trail
        G.skillEffects.push({
            type: 'fire_aura', x: P.x + P.facing * 15, y: P.y,
            radius: range * 0.4, color: '#ff4400', alpha: 0.4,
            timer: 0.5
        });
        spawnParticles(P.x + P.facing * 20, P.y, '#ff4400', 10, 60);
        spawnParticles(P.x + P.facing * 20, P.y, '#ffd700', 6, 40);

        // P001: Ensure Physics Hazard for base halberd too if high level
        if (w.level >= 3 && window.Physics) {
            window.Physics.spawnHazard(P.x + Math.cos(aimAngle) * range * 0.5, P.y + Math.sin(aimAngle) * range * 0.5, 'SCORCHED', range * 0.4);
        }

    } else if (w.id === 'earth_spear') {
        // Dragon Spear — Linear thrust trail + ground crack
        shake(3, 0.08);
        // Thrust line effect
        G.skillEffects.push({
            type: 'speed_line', x: P.x, y: P.y,
            angle: aimAngle || 0, length: 0, maxLength: 40,
            speed: 400, color: '#ddaa44', alpha: 0.5, timer: 0.15
        });
        // Impact crack at tip
        G.skillEffects.push({
            type: 'crack', x: P.x + Math.cos(aimAngle) * range * 0.7, y: P.y + Math.sin(aimAngle) * range * 0.7,
            angle: (aimAngle || 0) + (Math.random() - 0.5) * 0.5,
            length: 0, maxLength: 20, speed: 100,
            color: '#ddaa44', alpha: 0.6, timer: 0.3
        });
        G.skillEffects.push({
            type: 'impact_flash', x: P.x + Math.cos(aimAngle) * range * 0.6, y: P.y + Math.sin(aimAngle) * range * 0.6,
            radius: 8, color: '#ffcc44', alpha: 0.5, timer: 0.12
        });
        spawnParticles(P.x + Math.cos(aimAngle) * range * 0.5, P.y + Math.sin(aimAngle) * range * 0.5, '#ddaa44', 6, 35);
    } else {
        // Generic melee — standard particles
        spawnElementParticles(P.x + Math.cos(aimAngle) * 20, P.y + Math.sin(aimAngle) * 20, w.el, 6, 45);
    }
}

// Hero Element Mapping for Resonance
const HERO_ELEMENTS = {
    'berserker': 'FIRE',
    'strategist': 'WOOD',
    'assassin': 'METAL',
    'vanguard': 'EARTH',
    'mystic': 'WATER',
    'ranger': 'WOOD' // Huang Zhong associated with wind/wood here
};

function getHeroElement() {
    return HERO_ELEMENTS[P.heroId] || 'METAL'; // Default generic
}

function fireProjectile(w, el) {
    let nearest = null, nearDist = w.range + w.level * 20;
    for (const e of G.enemies) {
        const d = dist(P, e);
        if (d < nearDist) { nearDist = d; nearest = e; }
    }
    if (!nearest) return;

    const baseA = Math.atan2(nearest.y - P.y, nearest.x - P.x);
    const spd = w.speed || 200;
    const dmg = w.dmg * (1 + w.level * 0.3);

    // M005: Elemental Resonance Tint
    const heroEl = getHeroElement();
    const resonanceColor = ELEMENTS[heroEl].light; // Tint with hero element

    // Spread shot (e.g., Feather Fan fires 3 projectiles in a fan)
    const count = w.spread || 1;
    const spreadRad = (w.spreadAngle || 0) * Math.PI / 180;
    for (let i = 0; i < count; i++) {
        let a = baseA;
        if (count > 1) {
            a = baseA - spreadRad / 2 + (spreadRad / (count - 1)) * i;
        }
        G.bullets.push({
            x: P.x, y: P.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            dmg: dmg, el: w.el,
            color: w.el === heroEl ? w.color : resonanceColor,
            life: 2, type: 'bullet', r: 3 + w.level, pierce: w.level >= 3 ? 2 : 0,
            homing: w.homing || false, homingTarget: w.homing ? nearest : null,
            weaponId: w.id
        });
    }

    // P001: Projectile Hazards (Puddles / Steam)
    if (window.Physics) {
        if (w.id === 'water_scepter_evo') {
            window.Physics.spawnHazard(nearest.x, nearest.y, 'PUDDLE', 60);
        } else if (w.id === 'fire_pillar' || w.el === 'FIRE') {
            // 10% chance to leave scorched earth at target
            if (Math.random() < 0.15) window.Physics.spawnHazard(nearest.x, nearest.y, 'SCORCHED', 20);
        }
    }

    // ===== HERO-SPECIFIC PROJECTILE VFX =====
    if (w.id === 'wood_fan') {
        // Feather Fan — Wind gust + leaf trail at origin
        G.skillEffects.push({
            type: 'wind_cone', x: P.x, y: P.y,
            facing: P.facing, angle: spreadRad + 0.2,
            radius: 3, maxRadius: 30, speed: 150,
            color: '#44ff44', alpha: 0.25, timer: 0.25
        });
        for (let i = 0; i < 4; i++) {
            G.skillEffects.push({
                type: 'leaf', x: P.x, y: P.y,
                vx: Math.cos(baseA) * (30 + Math.random() * 40),
                vy: Math.sin(baseA) * (30 + Math.random() * 40) - 10,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 8,
                color: i % 2 === 0 ? '#44ff44' : '#88ff66',
                alpha: 0.6, timer: 0.4, size: 2 + Math.random() * 1.5
            });
        }
    } else if (w.id === 'water_scepter') {
        // Dark Scepter — Dark energy pulse
        G.skillEffects.push({
            type: 'impact_flash', x: P.x, y: P.y,
            radius: 10, color: '#4466ff', alpha: 0.4, timer: 0.15
        });
        spawnParticles(P.x, P.y, '#5588ff', 4, 25);
    } else if (w.id === 'fire_pillar' || w.el === 'FIRE') {
        // Fire projectiles — Muzzle flash + embers
        G.skillEffects.push({
            type: 'impact_flash', x: P.x + P.facing * 10, y: P.y,
            radius: 12, color: '#ff6600', alpha: 0.5, timer: 0.1
        });
        for (let i = 0; i < 3; i++) {
            G.skillEffects.push({
                type: 'ember',
                x: P.x + P.facing * 8, y: P.y,
                vx: (Math.random() - 0.5) * 30,
                vy: -(20 + Math.random() * 30),
                color: i === 0 ? '#ffd700' : '#ff4400',
                alpha: 0.7, timer: 0.3 + Math.random() * 0.2,
                size: 1.5 + Math.random()
            });
        }
    }
}

// --- Phase H: Thrown Weapons (Shuriken / Kunai / Crossbow) ---
function fireThrown(w, el) {
    // Ranger Eagle Eye passive: +30% range
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
    const rangeBonus = (hero && hero.passive.stat === 'eagleEye') ? 1.3 : 1;

    let nearest = null, nearDist = (w.range + w.level * 25) * rangeBonus;
    for (const e of G.enemies) {
        const d = dist(P, e);
        if (d < nearDist) { nearDist = d; nearest = e; }
    }
    if (!nearest) return;
    const baseA = Math.atan2(nearest.y - P.y, nearest.x - P.x);
    const spd = w.speed || 220;
    const dmg = w.dmg * (1 + w.level * 0.3);

    // Eagle Eye: DMG scales +1% per 10px distance
    let distBonus = 1;
    if (hero && hero.passive.stat === 'eagleEye') {
        distBonus = 1 + Math.min(nearDist * 0.001, 0.5); // Max +50%
    }

    const count = w.spread || 1;
    const spreadRad = (w.spreadAngle || 0) * Math.PI / 180;
    for (let i = 0; i < count; i++) {
        let a = baseA;
        if (count > 1) {
            a = baseA - spreadRad / 2 + (spreadRad / (count - 1)) * i;
        }
        G.bullets.push({
            x: P.x, y: P.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            dmg: dmg * distBonus, el: w.el, color: el.light,
            life: 2.5, type: 'thrown_star', r: 3 + w.level,
            pierce: (w.pierce || 0) + (w.level >= 4 ? 1 : 0),
            spin: 0, spinSpeed: 12 + Math.random() * 6,
            burnDot: w.burnDot || 0,
            weaponId: w.id
        });
    }

    // P001: Hazards for Thrown
    if (window.Physics && w.el === 'FIRE' && Math.random() < 0.2) {
        window.Physics.spawnHazard(nearest.x, nearest.y, 'SCORCHED', 25);
    }


    // === VFX per weapon ===
    if (w.id === 'wood_shuriken') {
        // Shuriken — Green wind trail + leaf burst
        G.skillEffects.push({
            type: 'wind_cone', x: P.x, y: P.y,
            facing: P.facing, angle: spreadRad + 0.3,
            radius: 3, maxRadius: 25, speed: 180,
            color: '#88ff22', alpha: 0.2, timer: 0.2
        });
        for (let i = 0; i < 3; i++) {
            G.skillEffects.push({
                type: 'leaf', x: P.x, y: P.y,
                vx: Math.cos(baseA) * (50 + Math.random() * 40),
                vy: Math.sin(baseA) * (50 + Math.random() * 40) - 8,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 10,
                color: i % 2 === 0 ? '#88ff22' : '#aacc44',
                alpha: 0.5, timer: 0.35, size: 1.5 + Math.random()
            });
        }
        spawnParticles(P.x + P.facing * 8, P.y, '#88ff22', 3, 30);
    } else if (w.id === 'fire_kunai') {
        // Kunai — Red flash + fire embers
        G.skillEffects.push({
            type: 'impact_flash', x: P.x + P.facing * 8, y: P.y,
            radius: 8, color: '#ff4400', alpha: 0.5, timer: 0.08
        });
        for (let i = 0; i < 2; i++) {
            G.skillEffects.push({
                type: 'ember',
                x: P.x + P.facing * 6, y: P.y,
                vx: (Math.random() - 0.5) * 20,
                vy: -(15 + Math.random() * 25),
                color: i === 0 ? '#ffd700' : '#ff4400',
                alpha: 0.6, timer: 0.25 + Math.random() * 0.15,
                size: 1 + Math.random()
            });
        }
    } else if (w.id === 'metal_crossbow') {
        // Crossbow — Metal flash + spark
        G.skillEffects.push({
            type: 'impact_flash', x: P.x + P.facing * 10, y: P.y,
            radius: 6, color: '#ccccee', alpha: 0.6, timer: 0.06
        });
        spawnParticles(P.x + P.facing * 8, P.y, '#ccccee', 2, 20);
    }
}

function fireOrbital(w, el) {
    const orbCount = (w.count || 3) + Math.floor(w.level / 2);
    const range = w.range + w.level * 8;
    const dmg = w.dmg * (1 + w.level * 0.25);
    for (let i = 0; i < orbCount; i++) {
        const a = w.orbitAngle + (Math.PI * 2 / orbCount) * i;
        const ox = P.x + Math.cos(a) * range;
        const oy = P.y + Math.sin(a) * range;

        // P001: Orbital Hazards (Metal Storm = sparks)
        // Check occasionally to not spam
        if (window.Physics && w.id === 'metal_twin_evo' && Math.random() < 0.05) {
            window.Physics.spawnHazard(ox, oy, 'ELECTRIFIED', 20);
        }

        for (const e of G.enemies) {
            if (dist({ x: ox, y: oy }, e) < 15) {
                damageEnemy(e, dmg, w.el);
                // Hit spark on contact
                if (w.id === 'metal_twin') {
                    G.skillEffects.push({
                        type: 'impact_flash', x: e.x, y: e.y,
                        radius: 8, color: '#ccccff', alpha: 0.7, timer: 0.1
                    });
                    spawnParticles(e.x, e.y, '#ccccff', 3, 25);
                }
            }
        }
        // Twin Blades — trailing sparkle at each orbit point
        if (w.id === 'metal_twin' && Math.random() < 0.4) {
            G.skillEffects.push({
                type: 'sparkle', x: ox, y: oy,
                angle: a, orbRadius: 0, speed: 0,
                color: '#ffffff', alpha: 0.6, timer: 0.15
            });
        }
    }
}

// --- Weapon Implementation ---

function fireAoE(w, el) {
    const range = w.range + w.level * 10;
    const dmg = w.dmg * (1 + w.level * 0.3);
    for (const e of G.enemies) {
        if (dist(P, e) < range) {
            damageEnemy(e, dmg, w.el);
        }
    }

    // P001: AOE Hazards
    if (window.Physics) {
        if (w.id === 'wood_vine') { // Root Zone
            window.Physics.spawnHazard(P.x, P.y, 'OVERGROWN', range);
        } else if (w.id === 'earth_quake') { // Earthquake -> Mud
            window.Physics.spawnHazard(P.x, P.y, 'MUD', range);
        } else if (w.el === 'FIRE') {
            window.Physics.spawnHazard(P.x, P.y, 'SCORCHED', range * 0.8);
        }
    }

    G.bullets.push({
        x: P.x, y: P.y, type: 'aoe_ring', r: range, color: el.light,
        el: w.el, life: 0.4, maxLife: 0.4
    });
    shake(3, 0.1);
    triggerFlash(el.light, 0.15);
    triggerChromatic(1.5);
    spawnElementParticles(P.x, P.y, w.el, 8, 50);
}

function fireShield(w, el) {
    const range = w.range + w.level * 5;
    const dmg = w.dmg * (1 + w.level * 0.2);
    for (const e of G.enemies) {
        if (dist(P, e) < range) {
            damageEnemy(e, dmg, w.el);
        }
    }
}

function fireHeal(w) {
    const heal = P.maxHp * (w.healPct + w.level * 0.05);
    P.hp = Math.min(P.hp + heal, P.maxHp);
    spawnParticles(P.x, P.y - 5, '#5aff5a', 8, 30);
    spawnDmgNum(P.x, P.y - 10, heal, '#5aff5a', false);
}

// --- Damage Enemy ---
function damageEnemy(e, dmg, el) {
    if (e.dead) return;

    // Get Blessing Stats (K002)
    const bStats = (window.getBlessingStats) ? window.getBlessingStats() : {};

    // Element bonus
    let mult = 1;
    if (GENERATING[el] === e.el) mult = 0.8;
    if (OVERCOMING[el] === e.el) mult = 1.5;
    if (GENERATING[e.el] === el) mult = 1.3;

    // Phase E: Hero passive multipliers
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
    const heroEl = getHeroElement(); // M005: Get hero element for resonance

    // M005: Elemental Resonance Effects
    // 1. FIRE Resonance: 10% chance to burn
    if (heroEl === 'FIRE' && Math.random() < 0.1) {
        e.burn = (e.burn || 0) + 2;
        spawnDmgNum(e.x, e.y - 30, 'BURN', '#ff4400', false);
    }
    // 2. WATER Resonance: 10% chance to slow (chill)
    if (heroEl === 'WATER' && Math.random() < 0.1) {
        e.slow = (e.slow || 0) + 1.5;
        spawnDmgNum(e.x, e.y - 30, 'CHILL', '#44aaff', false);
    }
    // 3. WOOD Resonance: 2% chance to life leech
    if (heroEl === 'WOOD' && Math.random() < 0.02) {
        const healAmt = Math.ceil(P.maxHp * 0.01) || 1;
        P.hp = Math.min(P.hp + healAmt, P.maxHp);
        spawnDmgNum(P.x, P.y - 10, `+${healAmt}`, '#44ff44', false);
        spawnParticles(P.x, P.y, '#44ff44', 5, 20);
    }
    // 4. METAL Resonance: Crit Chance (stacking with Assassin)
    const baseCrit = (hero && hero.passive.stat === 'critChance') ? 0.20 : 0;
    const metalCrit = (heroEl === 'METAL') ? 0.15 : 0;
    const auraCrit = (G.allyAura && G.allyAura.critBonus) ? G.allyAura.critBonus : 0;
    const blessCrit = bStats.critChance || 0; // Blessing crit

    // 5. EARTH Resonance: Extra knockback
    let knockBonus = (heroEl === 'EARTH') ? 1.5 : 1.0;
    knockBonus *= (1 + (bStats.knockbackMult || 0)); // Blessing knockback

    // Phase H: Ranger Eagle Eye — DMG scales with distance
    if (hero && hero.passive.stat === 'eagleEye') {
        const d = Math.hypot(e.x - P.x, e.y - P.y);
        mult *= 1 + Math.min(d * 0.002, 0.3); // Max +30%
    }

    // Berserker: Rage mode = 2x damage
    if (P.rageModeTimer > 0) mult *= 2;

    // Berserker: Combo rage passive (+2% per combo, max 50%)
    if (hero && hero.passive.stat === 'comboRage') {
        mult *= 1 + Math.min(G.combo * 0.02, 0.5);
    }

    // Blessing Damage Multiplier (includes Cursed/Archetype bonuses)
    if (bStats.dmgMult) mult *= (1 + bStats.dmgMult);

    // Assassin / Blessing Crit chance calculation
    let isCrit = false;
    if (Math.random() < baseCrit + metalCrit + auraCrit + blessCrit) {
        mult *= 3; // Standard 300% crit dmg? Or 200%? Let's keep 3x for impact.
        isCrit = true;
    }

    // Phase G: Morale damage bonus
    const morale = G.morale || 0;
    if (morale >= 80) mult *= 1.20;
    else if (morale >= 60) mult *= 1.10;
    else if (morale >= 30) mult *= 1.05;

    // L001: Armor Break bonus (from SHATTER combo)
    if (e._armorBroken > 0) mult *= 2;

    // L001: Forge Strike buff (from FORGE STRIKE combo — +50% dmg)
    if (G._forgeBuff > 0) mult *= 1.5;
    // Duo: Frozen Bonus Dmg
    if (bStats.hasFrozenBonus && (e.slow > 0 || e.frozen > 0)) {
        mult *= (1 + bStats.frozenBonusVal);
    }

    const finalDmg = dmg * mult;

    // N003: Shielded modifier — 50% DR for first 3 hits
    let reducedDmg = finalDmg;
    if (e.modifiers && e.modifiers.includes('shielded') && e._shieldHits > 0) {
        reducedDmg = finalDmg * 0.5;
        e._shieldHits--;
        spawnDmgNum(e.x, e.y - 18, 'SHIELDED!', '#4488ff', false);
        if (e._shieldHits <= 0) {
            spawnDmgNum(e.x, e.y - 25, 'SHIELD BREAK!', '#ff4400', true);
            spawnParticles(e.x, e.y, '#4488ff', 12, 50);
        }
    }

    e.hp -= reducedDmg;
    e.flash = 0.1;
    // Apply Knockback
    const kx = (e.x - P.x) * 0.3 * knockBonus;
    const ky = (e.y - P.y) * 0.3 * knockBonus;
    e.knockX = isNaN(kx) ? 0 : kx;
    e.knockY = isNaN(ky) ? 0 : ky;

    // --- On-Hit Effects (Blessings) ---
    if (bStats.hasPoison) { e.poison = (e.poison || 0) + bStats.poisonDuration; e.poisonDps = Math.max(e.poisonDps || 0, bStats.poisonDps); }
    if (bStats.hasBurn) { e.burn = (e.burn || 0) + bStats.burnDuration; e.burnDps = Math.max(e.burnDps || 0, bStats.burnDps); }
    if (bStats.hasBleed) { e.bleed = (e.bleed || 0) + bStats.bleedDuration; e.bleedDps = Math.max(e.bleedDps || 0, bStats.bleedDps); }
    if (bStats.hasSlow) { e.slow = (e.slow || 0) + 2; } // Generic slow
    if (bStats.lifesteal > 0) {
        const heal = Math.ceil(reducedDmg * bStats.lifesteal) || 1;
        P.hp = Math.min(P.hp + heal, P.maxHp);
        spawnDmgNum(P.x, P.y - 12, '+' + heal, '#ff4444', false);
    }
    if (bStats.hasStun && Math.random() < bStats.stunChance) {
        e.stun = (e.stun || 0) + bStats.stunDuration;
        spawnDmgNum(e.x, e.y - 20, 'STUN!', '#ffff00', true);
    }
    if (bStats.hasFreeze && Math.random() < bStats.freezeChance) {
        e.frozen = (e.frozen || 0) + bStats.freezeDuration;
        spawnDmgNum(e.x, e.y - 20, 'FROZEN!', '#88ccff', true);
    }
    // Duo: Burn Stun
    if (bStats.hasBurnStun && (e.burn > 0) && Math.random() < bStats.burnStunChance) {
        e.stun = (e.stun || 0) + 1.0;
        spawnDmgNum(e.x, e.y - 20, 'STUN!', '#ffff00', true);
    }
    // Execute
    if (bStats.executeThreshold > 0 && e.type !== 'boss' && e.hp < e.maxHp * bStats.executeThreshold) {
        e.hp = 0;
        spawnDmgNum(e.x, e.y - 30, 'EXECUTE!', '#ff0000', true);
        shake(5, 0.2);
    }

    const elDef = ELEMENTS[el] || ELEMENTS.METAL;
    const dmgColor = isCrit ? '#ff4400' : mult > 1.2 ? '#ffff00' : elDef.light;
    spawnDmgNum(e.x + rng(-5, 5), e.y - 8, Math.ceil(reducedDmg), dmgColor, isCrit || mult > 1.2);
    spawnElementParticles(e.x, e.y, el, 3, 35);
    SFX.hit();

    if (isCrit) {
        spawnDmgNum(e.x, e.y - 20, 'CRIT!', '#ff4400', true);
        shake(3, 0.08);
        SFX.hitHeavy();
    }
}

function killEnemy(e) {
    e.dead = true;
    // K004: Apply difficulty reward multiplier
    const _rewardMult = (typeof DIFFICULTY_TIERS !== 'undefined' && DIFFICULTY_TIERS[G.difficulty]) ? DIFFICULTY_TIERS[G.difficulty].rewardMult : 1;
    G.score += Math.floor(10 * _rewardMult);
    G.combo++;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.enemiesKilled++;

    // N002: Kill Streak System
    G.killStreak++;
    G.killStreakTimer = 0; // Reset kill timer (decays in game loop, resets at 3s)
    // Check for tier promotions
    if (typeof KILL_STREAK_TIERS !== 'undefined') {
        for (let ti = KILL_STREAK_TIERS.length - 1; ti >= 0; ti--) {
            const tier = KILL_STREAK_TIERS[ti];
            if (G.killStreak >= tier.threshold && G.killStreakTier <= ti) {
                G.killStreakTier = ti + 1;
                G.killStreakXpMult = tier.xpMult;
                G.killStreakAnnounce = { text: tier.text, color: tier.color, timer: 2.5 };
                // VFX burst for streak milestone
                shake(4, 0.2);
                triggerFlash(tier.color, 0.25);
                triggerChromatic(2);
                if (typeof triggerSpeedLines === 'function') triggerSpeedLines(1);
                spawnParticles(P.x, P.y, tier.color, 20, 70);
                spawnDmgNum(P.x, P.y - 30, tier.text.replace(/[^\w\s!]/g, '').trim(), tier.color, true);
                break;
            }
        }
    }

    // K002: Apply blessing on-kill effects (heal, explosion, spreading burn)
    if (typeof applyBlessingOnKill === 'function') applyBlessingOnKill(e);

    // Phase E: Musou gauge fill
    const musouGain = e.type === 'fodder' ? 1 : e.type === 'elite' ? 8 : e.type === 'boss' ? 25 : e.type === 'miniboss' ? 15 : 3;
    P.musou = clamp((P.musou || 0) + musouGain, 0, P.musouMax || 100);

    // N003: Death-trigger modifiers
    if (e.modifiers && e.modifiers.length > 0) {
        // Splitting: Spawn 2 smaller copies
        if (e.modifiers.includes('splitting') && !e._splitChild) {
            for (let si = 0; si < 2; si++) {
                const angle = Math.random() * Math.PI * 2;
                const sx = e.x + Math.cos(angle) * 15;
                const sy = e.y + Math.sin(angle) * 15;
                const child = typeof spawnEnemy === 'function' ? spawnEnemy(sx, sy, e.type === 'elite' ? 'grunt' : 'elite') : null;
                if (child) {
                    child._splitChild = true; // prevent infinite recursion
                    child.modifiers = [];
                    child.hp = child.maxHp * 0.5;
                    child.r = Math.max(3, e.r - 2);
                }
            }
            spawnDmgNum(e.x, e.y - 15, 'SPLIT!', '#44dd44', true);
            spawnParticles(e.x, e.y, '#44dd44', 12, 40);
        }
        // Molten: Leave fire AoE on death
        if (e.modifiers.includes('molten')) {
            // Add a fire pool to bullets as an AoE hazard
            G.bullets.push({
                x: e.x, y: e.y, type: 'aoe_ring', r: 30,
                color: '#ff6600', el: 'FIRE',
                life: 3, maxLife: 3, dmg: e.dmg * 0.3,
                _moltenPool: true
            });
            spawnDmgNum(e.x, e.y - 15, 'MOLTEN!', '#ff6600', true);
            spawnParticles(e.x, e.y, '#ff6600', 15, 50);
            shake(2, 0.1);
        }
    }

    // Phase G: Morale gain on kill
    G.morale = clamp((G.morale || 0) + (e.type === 'miniboss' ? 15 : e.type === 'boss' ? 25 : 1), 0, 100);
    if (G.combo > 0 && G.combo % 10 === 0) G.morale = clamp(G.morale + 2, 0, 100);

    // Phase H: Brotherhood gauge charge on kill
    const comboCharge = e.type === 'miniboss' ? 15 : e.type === 'boss' ? 25 : e.type === 'elite' ? 8 : 5;
    if (typeof chargeBrotherhoodGauge === 'function') chargeBrotherhoodGauge(comboCharge);

    // Mini-boss kill rewards
    if (e.type === 'miniboss') {
        // Celebration
        G.floorAnnounce = { text: '\u2694 ' + (e.generalName || 'GENERAL') + ' DEFEATED! \u2694', timer: 2.5 };
        triggerFlash(e.generalColor || '#ffd700', 0.3);
        shake(5, 0.3);
        triggerChromatic(2);
        triggerSpeedLines(1);
        spawnElementParticles(e.x, e.y, e.el, 20, 100);
        spawnParticles(e.x, e.y, '#ffd700', 15, 60);

        // Guaranteed equipment drop
        const equipTypes = ['armor', 'talisman', 'mount'];
        const eqType = equipTypes[Math.floor(Math.random() * 3)];
        const quality = G.floor >= 10 ? 'rare' : G.floor >= 5 ? 'uncommon' : 'common';
        const qualColor = { common: '#88ff88', uncommon: '#44bbff', rare: '#ff88ff' }[quality];
        const statBonus = quality === 'rare' ? 3 : quality === 'uncommon' ? 2 : 1;

        // Apply equipment
        if (!G.equipment) G.equipment = { armor: null, talisman: null, mount: null };
        G.equipment[eqType] = {
            type: eqType, quality, statBonus,
            name: (e.generalName || 'General') + "'s " + eqType.charAt(0).toUpperCase() + eqType.slice(1),
            el: e.el
        };

        // Apply stat bonuses
        if (eqType === 'armor') {
            P.maxHp += statBonus * 10;
            P.hp = Math.min(P.hp + statBonus * 10, P.maxHp);
        } else if (eqType === 'talisman') {
            P.dmgMult = (P.dmgMult || 1) + statBonus * 0.05;
        } else if (eqType === 'mount') {
            P.speed += statBonus * 5;
        }

        // Equipment pickup notification
        spawnDmgNum(e.x, e.y - 20, eqType.toUpperCase() + '!', qualColor, false);

        // Bonus gold
        G.score += 50 + G.floor * 10;
        spawnDmgNum(e.x + 15, e.y - 10, (50 + G.floor * 10) + 'G', '#ffd700', false);
    }

    // Phase E: Total kill counter
    G.totalKills = (G.totalKills || 0) + 1;

    // Phase E: Chain kill tracking
    G.chainTimer = 0.8; // 0.8s window for chain
    G.chainCount = (G.chainCount || 0) + 1;
    if (G.chainCount > (G.chainBest || 0)) G.chainBest = G.chainCount;

    // Phase E: Kill milestones
    const milestones = [100, 500, 1000, 2000, 5000];
    for (const m of milestones) {
        if (G.totalKills >= m && (G.killMilestone || 0) < m) {
            G.killMilestone = m;
            G._milestoneTime = G.time;
            shake(6, 0.4);
            spawnParticles(P.x, P.y, '#ffd700', 30, 80);
            if (typeof triggerFlash === 'function') triggerFlash('#ffd700', 0.3);
            break;
        }
    }

    // Yang boost on kill
    G.yinYang.yang = clamp(G.yinYang.yang + 1, 0, 100);

    const elDef = ELEMENTS[e.el] || ELEMENTS.METAL;
    // Death explosion with element particles
    spawnDeathExplosion(e.x, e.y, elDef.color, elDef.light, e.r);
    spawnElementParticles(e.x, e.y, e.el, 10, 60);
    SFX.kill();

    // Drop XP (Strategist bonus)
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
    const xpMult = (hero && hero.passive.stat === 'xpBonus') ? 1.3 : 1;
    const xpVal = Math.floor((3 + G.floor) * xpMult);
    G.pickups.push({ x: e.x + rng(-5, 5), y: e.y + rng(-5, 5), type: 'xp', val: xpVal, color: '#55ffff', r: 3, life: 15 });

    // Chance to drop gold
    if (Math.random() < 0.3) {
        G.pickups.push({ x: e.x + rng(-8, 8), y: e.y + rng(-8, 8), type: 'gold', val: 5 + G.floor * 2, color: '#ffdd44', r: 3, life: 15 });
    }

    // Chance to drop HP orb
    if (Math.random() < 0.06) {
        G.pickups.push({ x: e.x, y: e.y, type: 'hp', val: 15, color: '#ff4444', r: 4, life: 15 });
    }

    // Phase E: Mystic passive — 10% chance dead enemy rises as ally
    if (hero && hero.passive.stat === 'necro' && Math.random() < 0.10) {
        G.allies.push({
            name: 'Undead', behavior: 'melee',
            x: e.x, y: e.y,
            hp: 20, maxHp: 20, dmg: 8,
            atkRate: 1.0, atkCd: 0, range: 20,
            speed: 50, color: '#8844aa',
            target: null, respawnTimer: 0,
            _tempTimer: 8 // Disappears after 8s — tracked in updateAllies
        });
    }

    // Shake on multi-kills
    if (G.combo % 50 === 0) { shake(5, 0.2); hitStop(0.04); triggerFlash('#ffdd00', 0.3); triggerSpeedLines(0.8); SFX.combo50(); }
    else if (G.combo % 10 === 0) { shake(3, 0.1); triggerChromatic(1.5); SFX.combo10(); }

    // Check floor clear
    if (G.enemiesKilled >= G.enemiesNeeded && !G.portalActive) {
        G.portalActive = true;
        G.portal = { x: G.arenaW / 2, y: G.arenaH / 2, r: 20, pulse: 0 };
    }
}
