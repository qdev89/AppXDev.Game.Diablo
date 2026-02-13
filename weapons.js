// ============================================================
// DYNASTY BRUHHH DUNGEON - Weapons & Combat
// ============================================================

// --- Weapon Definitions ---
window.WEAPON_DEFS = [
    // ===== HERO SIGNATURE WEAPONS (unique starting weapons) =====
    // BALANCE: Damage reduced ~40% from original. heroClass restricts which classes can pick.
    {
        id: 'fire_halberd', name: '🔴 Sky Piercer', el: 'FIRE', type: 'melee',
        desc: 'Lu Bu\'s legendary halberd — wide devastating sweep',
        dmg: 9, cd: 1.0, range: 48, arc: 120, tier: 1, heroOnly: 'berserker', heroClass: 'berserker',
        evolvesTo: 'fire_halberd_evo', evolutionReq: { passive: 'atk_speed', level: 5 }
    },
    {
        id: 'wood_fan', name: '🟢 Feather Fan', el: 'WOOD', type: 'projectile',
        desc: 'Zhuge Liang\'s fan — fires 3 wind blades in spread',
        dmg: 6, cd: 1.1, range: 140, speed: 180, spread: 3, spreadAngle: 25, tier: 1, heroOnly: 'strategist', heroClass: 'strategist',
        evolvesTo: 'wood_fan_evo', evolutionReq: { passive: 'xp_gain', level: 5 }
    },
    {
        id: 'metal_twin', name: '🪙 Twin Blades', el: 'METAL', type: 'orbital',
        desc: 'Zhou Yu\'s dual swords — fast spinning orbit',
        dmg: 4, cd: 0.35, range: 40, count: 2, tier: 1, heroOnly: 'assassin', heroClass: 'assassin',
        evolvesTo: 'metal_twin_evo', evolutionReq: { passive: 'move_spd', level: 5 }
    },
    {
        id: 'earth_spear', name: '🟤 Dragon Spear', el: 'EARTH', type: 'melee',
        desc: 'Zhao Yun\'s spear — long reach forward thrust',
        dmg: 10, cd: 0.8, range: 55, arc: 45, tier: 1, heroOnly: 'vanguard', heroClass: 'vanguard',
        evolvesTo: 'earth_spear_evo', evolutionReq: { passive: 'max_hp', level: 5 }
    },
    {
        id: 'water_scepter', name: '🔵 Dark Scepter', el: 'WATER', type: 'projectile',
        desc: 'Sima Yi\'s scepter — homing frost bolts',
        dmg: 9, cd: 1.1, range: 160, speed: 150, homing: true, tier: 1, heroOnly: 'mystic', heroClass: 'mystic',
        evolvesTo: 'water_scepter_evo', evolutionReq: { passive: 'pickup_range', level: 5 }
    },
    {
        id: 'wood_shuriken', name: '🌟 Wind Shuriken', el: 'WOOD', type: 'thrown',
        desc: 'Huang Zhong\'s shuriken — 3-fan spread + pierce',
        dmg: 6, cd: 0.8, range: 170, speed: 220, spread: 3, spreadAngle: 30,
        pierce: 1, tier: 1, heroOnly: 'ranger', heroClass: 'ranger',
        evolvesTo: 'wood_shuriken_evo', evolutionReq: { passive: 'atk_speed', level: 5 }
    },

    // ===== GENERIC WEAPONS (loot/level-up pool) =====
    // heroClass restricts which hero classes can pick them from level-up.
    // No heroClass = any class can pick.
    {
        id: 'fire_sword', name: '🔴 Fire Sword', el: 'FIRE', type: 'melee', desc: 'Forward fire slash',
        dmg: 7, cd: 0.9, range: 40, arc: 90, tier: 1, heroClass: 'berserker|vanguard'
    },
    {
        id: 'metal_blade', name: '🪙 Blade Storm', el: 'METAL', type: 'orbital', desc: 'Spinning blades orbit you',
        dmg: 5, cd: 0.35, range: 50, count: 3, tier: 1, heroClass: 'assassin|ranger'
    },
    {
        id: 'water_bolt', name: '🔵 Chain Frost', el: 'WATER', type: 'projectile', desc: 'Bounces between 3 enemies + slows',
        dmg: 8, cd: 1.1, range: 160, speed: 240, chain: 3, slowPct: 0.3, slowDur: 1.5, tier: 1, heroClass: 'mystic|strategist'
    },
    {
        id: 'wood_vine', name: '🟢 Root Zone', el: 'WOOD', type: 'aoe', desc: 'Healing vines damage nearby foes',
        dmg: 3, cd: 2.2, range: 60, duration: 3, tier: 1
    },
    {
        id: 'earth_wall', name: '🟤 Earth Shield', el: 'EARTH', type: 'shield', desc: 'Damage aura + defense up',
        dmg: 2, cd: 0.5, range: 35, tier: 1, heroClass: 'vanguard|berserker'
    },
    {
        id: 'fire_pillar', name: '🔴 Fire Pillar', el: 'FIRE', type: 'projectile', desc: 'Erupting flame pillars',
        dmg: 12, cd: 2.0, range: 120, speed: 0, tier: 2, minLevel: 5, heroClass: 'berserker|strategist'
    },
    {
        id: 'metal_rain', name: '🪙 Arrow Rain', el: 'METAL', type: 'aoe', desc: 'Raining metal shards',
        dmg: 6, cd: 2.8, range: 100, tier: 2, minLevel: 5, heroClass: 'ranger|assassin'
    },
    {
        id: 'water_wave', name: '🔵 Tidal Wave', el: 'WATER', type: 'melee', desc: 'Wide water sweep',
        dmg: 11, cd: 1.6, range: 60, arc: 180, tier: 2, minLevel: 5, heroClass: 'mystic|vanguard'
    },
    {
        id: 'wood_heal', name: '🟢 Life Surge', el: 'WOOD', type: 'heal', desc: 'Heal 15% HP over time',
        dmg: 0, cd: 10, healPct: 0.15, tier: 1
    },
    {
        id: 'earth_quake', name: '🟤 Earthquake', el: 'EARTH', type: 'aoe', desc: 'Ground slam, stuns nearby',
        dmg: 15, cd: 3.5, range: 80, tier: 2, minLevel: 5, heroClass: 'vanguard|berserker'
    },
    // Thrown weapons (Ranger pool)
    {
        id: 'fire_kunai', name: '🔴 Flame Kunai', el: 'FIRE', type: 'thrown', desc: 'Piercing flame kunai + burn DOT',
        dmg: 5, cd: 0.6, range: 130, speed: 260, spread: 2, spreadAngle: 15,
        pierce: 2, burnDot: 2, tier: 1, heroClass: 'ranger|assassin'
    },
    {
        id: 'metal_crossbow', name: '🪙 Repeating Crossbow', el: 'METAL', type: 'thrown', desc: 'Rapid-fire piercing crossbow bolts',
        dmg: 5, cd: 0.35, range: 140, speed: 300, spread: 2, spreadAngle: 12,
        pierce: 1, tier: 2, minLevel: 5, heroClass: 'ranger|assassin'
    },

    // ===== EVOLVED WEAPONS (Tier 3) — restricted to original hero class =====
    {
        id: 'fire_halberd_evo', name: '🔥 Inferno Dragon', el: 'FIRE', type: 'melee',
        desc: 'Lu Bu\'s ultimate halberd — leaves a trail of fire',
        dmg: 32, cd: 0.85, range: 70, arc: 160, tier: 3, heroClass: 'berserker'
    },
    {
        id: 'wood_fan_evo', name: '🌪️ Storm Lord\'s Call', el: 'WOOD', type: 'projectile',
        desc: 'Summons giant tornadoes',
        dmg: 24, cd: 1.0, range: 180, speed: 100, count: 5, spreadAngle: 60, tier: 3, heroClass: 'strategist'
    },
    {
        id: 'metal_twin_evo', name: '⚔️ Blade Master\'s Flow', el: 'METAL', type: 'orbital',
        desc: 'Massive web of blades',
        dmg: 18, cd: 0.25, range: 80, count: 8, tier: 3, heroClass: 'assassin'
    },
    {
        id: 'earth_spear_evo', name: '🏔️ Mountain Crusher', el: 'EARTH', type: 'melee',
        desc: 'Shockwaves on every hit',
        dmg: 35, cd: 0.65, range: 90, arc: 80, tier: 3, heroClass: 'vanguard'
    },
    {
        id: 'water_scepter_evo', name: '❄️ Frost Archon\'s Gaze', el: 'WATER', type: 'projectile',
        desc: 'Blizzard storm',
        dmg: 28, cd: 1.3, range: 200, speed: 120, homing: true, tier: 3, heroClass: 'mystic'
    },
    {
        id: 'wood_shuriken_evo', name: '🍃 Wind Shadow', el: 'WOOD', type: 'thrown',
        desc: '8-way shuriken burst',
        dmg: 20, cd: 0.55, range: 250, spread: 8, spreadAngle: 360, pierce: 5, tier: 3, heroClass: 'ranger'
    },

    // Passives (no class restriction — any hero can pick)
    { id: 'atk_speed', name: '⚡ Swift Strikes', type: 'passive', desc: '+15% attack speed', stat: 'atkSpd', val: 0.15 },
    { id: 'max_hp', name: '❤️ Vitality', type: 'passive', desc: '+20 max HP', stat: 'maxHp', val: 20 },
    { id: 'move_spd', name: '🏃 Fleet Foot', type: 'passive', desc: '+10% move speed', stat: 'moveSpd', val: 0.10 },
    { id: 'pickup_range', name: '🧲 Magnet', type: 'passive', desc: '+40% pickup range', stat: 'pickupRange', val: 0.4 },
    { id: 'xp_gain', name: '📚 Scholar', type: 'passive', desc: '+20% XP gain', stat: 'xpGain', val: 0.20 },
];

// --- Weapon Class Check Helper ---
// Returns true if the hero can use this weapon
window.canHeroUseWeapon = function (weaponDef, heroId) {
    if (!weaponDef.heroClass) return true; // No restriction = universal
    if (weaponDef.heroOnly) return weaponDef.heroOnly === heroId; // Signature check
    return weaponDef.heroClass.split('|').includes(heroId);
};

// --- Level-scaled Damage Recalculation ---
window.recalcWeaponDmg = function (w) {
    if (w.baseDmg !== undefined) {
        w.dmg = Math.round(w.baseDmg * (1 + 0.15 * (w.level - 1)) * 10) / 10;
    }
};

// Active weapon instances on player
window.createWeapon = function (def) {
    const w = {
        ...def, timer: 0, level: 1, angle: 0,
        orbitAngle: Math.random() * Math.PI * 2,
        comboStep: 0, comboReset: 0
    };
    w.baseDmg = def.dmg; // Store original base damage for scaling
    w.dmg = w.baseDmg;   // Level 1 = 100% base damage
    return w;
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
    let spdMult = 1 + (window.passives ? window.passives.atkSpd : 0) + auraAtkSpd;
    // S001: Aspect attack speed multiplier (Shadow 3x, Eternity 0.6x, Siege 0.5x)
    if (P.aspectAtkSpdMult && P.aspectAtkSpdMult !== 1.0) spdMult *= P.aspectAtkSpdMult;
    // S003: Relic attack speed modifier (Sky Piercer: -30%)
    if (typeof getRelicStats === 'function') {
        const relicS = getRelicStats();
        if (relicS.atkSpeed !== 0) spdMult *= (1 + relicS.atkSpeed);
    }
    // Berserker: Rage mode = 1.5x attack speed
    if (P.rageModeTimer > 0) {
        const hero = getHeroDef(P.heroId);
        spdMult *= (hero.ultimate.atkSpdMultiplier || 1.5);
    }
    for (const w of G.weapons) {
        // Recalculate damage based on current weapon level
        window.recalcWeaponDmg(w);
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
        // Subtle thrust impact (use crack instead of speed_line — fires too often)
        G.skillEffects.push({
            type: 'crack', x: P.x + Math.cos(aimAngle || 0) * 20, y: P.y + Math.sin(aimAngle || 0) * 20,
            angle: aimAngle || 0, length: 15, width: 1,
            color: '#ddaa44', alpha: 0.4, timer: 0.1
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

    // AIMING: Mouse > Movement > Facing (Matches fireMelee)
    let baseA = 0;
    if (G.mouse && G.mouse.moved) {
        baseA = Math.atan2(G.mouse.y + G.camY - P.y, G.mouse.x + G.camX - P.x);
    } else if (Math.abs(P.vx) > 10 || Math.abs(P.vy) > 10) {
        baseA = Math.atan2(P.vy, P.vx);
    } else if (nearest) {
        // Fallback to auto-aim if idle and enemy exists? 
        // User said "must be by direction of player move", strictly.
        // But if idle, facing or auto-aim? fireMelee uses Facing.
        // Let's use Facing to be consistent, but maybe auto-aim is helpful if idle?
        // Let's stick to P.facing for consistency with user request "direction of move".
        baseA = P.facing > 0 ? 0 : Math.PI;
    } else {
        baseA = P.facing > 0 ? 0 : Math.PI;
    }
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
            const hx = nearest ? nearest.x : P.x + Math.cos(baseA) * 150;
            const hy = nearest ? nearest.y : P.y + Math.sin(baseA) * 150;
            window.Physics.spawnHazard(hx, hy, 'PUDDLE', 60);
        } else if (w.id === 'fire_pillar' || w.el === 'FIRE') {
            // 10% chance to leave scorched earth at target or aiming point
            if (Math.random() < 0.15) {
                const hx = nearest ? nearest.x : P.x + Math.cos(baseA) * 100;
                const hy = nearest ? nearest.y : P.y + Math.sin(baseA) * 100;
                window.Physics.spawnHazard(hx, hy, 'SCORCHED', 20);
            }
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

    // AIMING: Mouse > Movement > Facing
    let baseA = 0;
    if (G.mouse && G.mouse.moved) {
        baseA = Math.atan2(G.mouse.y + G.camY - P.y, G.mouse.x + G.camX - P.x);
    } else if (Math.abs(P.vx) > 10 || Math.abs(P.vy) > 10) {
        baseA = Math.atan2(P.vy, P.vx);
    } else {
        baseA = P.facing > 0 ? 0 : Math.PI;
    }
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
        const hx = nearest ? nearest.x : P.x + Math.cos(baseA) * 150;
        const hy = nearest ? nearest.y : P.y + Math.sin(baseA) * 150;
        window.Physics.spawnHazard(hx, hy, 'SCORCHED', 25);
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

    // Berserker: Rage mode = data-driven damage multiplier
    if (P.rageModeTimer > 0) {
        mult *= (hero && hero.ultimate ? hero.ultimate.dmgMultiplier : 2) || 2;
    }

    // Berserker: Combo rage passive (+2% per combo, max 50%)
    if (hero && hero.passive.stat === 'comboRage') {
        mult *= 1 + Math.min(G.combo * 0.02, 0.5);
    }

    // S001: Aspect Damage Multiplier (e.g., Demon 2x, Shadow 0.4x, Siege 2x)
    if (P.aspectDmgMult && P.aspectDmgMult !== 1.0) mult *= P.aspectDmgMult;

    // S001: Red Cliffs — combo damage scaling (+0.5% per combo hit)
    if (P.comboDmgScaling > 0 && G.combo > 0) {
        mult *= 1 + (G.combo * P.comboDmgScaling);
    }

    // S001: Stars — marked targets take bonus damage
    if (P.markDmgBonus > 0 && e._marked) {
        mult *= (1 + P.markDmgBonus);
    }

    // S001: Prophecy — cursed targets take bonus damage
    if (P.curseDmgTaken > 0 && e._cursed > 0) {
        mult *= (1 + P.curseDmgTaken);
    }

    // S001: Siege — siege shot bonus (standing still charges x5 dmg)
    if (P.siegeMode && P.siegeChargeTimer >= 1.0) {
        mult *= P.siegeDmgMult;
        P.siegeChargeTimer = 0; // Reset after firing
        spawnDmgNum(P.x, P.y - 30, 'SIEGE!', '#ff6600', true);
        shake(4, 0.2);
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

    // T001: Mandate — enemy damage reduction (Unbreakable modifier)
    const mandateEffects = typeof getMandateEffects === 'function' ? getMandateEffects() : {};
    let mandateDR = mandateEffects.enemyDmgReduction || 0;

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

    // BALANCE: Shieldwall enemy — 70% DR from frontal attacks
    if (e.type === 'shieldwall' && e._shieldFacing !== undefined) {
        const attackAngle = Math.atan2(e.y - P.y, e.x - P.x);
        const angleDiff = Math.abs(attackAngle - e._shieldFacing);
        const normalizedDiff = angleDiff > Math.PI ? (2 * Math.PI - angleDiff) : angleDiff;
        if (normalizedDiff < Math.PI / 4) { // Within 45° of facing = frontal
            reducedDmg *= 0.3; // 70% reduction
            spawnDmgNum(e.x, e.y - 15, 'BLOCKED', '#8899cc', false);
        }
    }

    // T001: Apply Mandate damage reduction
    if (mandateDR > 0) {
        reducedDmg *= (1 - mandateDR);
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

    // S001: Demon Aspect — drain MP per attack
    if (P.aspectMpDrain > 0) {
        P.mp = Math.max(0, P.mp - P.aspectMpDrain);
    }

    // S001: Shadow Aspect — teleport behind enemy every Nth hit
    if (P.teleportEvery > 0) {
        P.teleportHitCounter = (P.teleportHitCounter || 0) + 1;
        if (P.teleportHitCounter >= P.teleportEvery) {
            P.teleportHitCounter = 0;
            // Teleport behind the enemy
            const angle = Math.atan2(e.y - P.y, e.x - P.x);
            P.x = e.x + Math.cos(angle) * (e.r + 15);
            P.y = e.y + Math.sin(angle) * (e.r + 15);
            spawnParticles(P.x, P.y, '#222244', 8, 30);
            spawnDmgNum(P.x, P.y - 20, 'BLINK!', '#aaaaff', false);
        }
    }

    // S001: Stars Aspect — mark target for bonus damage
    if (P.markDmgBonus > 0 && !e._marked) {
        e._marked = true;
        spawnDmgNum(e.x, e.y - 25, '⭐ MARK', '#ffd700', false);
    }

    // S001: Prophecy Aspect — curse target on hit
    if (P.curseOnHit && !e._cursed) {
        e._cursed = (P.aspectMods && P.aspectMods.curseDuration) || 5;
        spawnDmgNum(e.x, e.y - 25, '🔮 CURSE', '#cc44ff', false);
    }

    // T-02: TALISMAN ON-HIT PROC EFFECTS
    if (P.talismanProc && P.talismanProc.chance > 0 && Math.random() < P.talismanProc.chance) {
        switch (P.talismanProc.type) {
            case 'burn': // Flame Charm — burn 3s
                e.burn = (e.burn || 0) + 3;
                e.burnDps = Math.max(e.burnDps || 0, 5);
                spawnDmgNum(e.x, e.y - 25, '🔥 BURN', '#ff4400', false);
                spawnParticles(e.x, e.y, '#ff4400', 4, 20);
                break;
            case 'slow': // Frost Jade — slow 30% for 2s
                e.slow = (e.slow || 0) + 2;
                spawnDmgNum(e.x, e.y - 25, '❄ CHILL', '#44aaff', false);
                spawnParticles(e.x, e.y, '#88ccff', 4, 20);
                break;
        }
    }

    // S003: RELIC DAMAGE MODIFIER
    if (typeof getRelicStats === 'function') {
        const relicS = getRelicStats();
        if (relicS.dmgMult > 0) {
            const bonus = reducedDmg * relicS.dmgMult;
            e.hp -= bonus; // Extra damage from relic
        }
        // Combo damage bonus (Blood Jade)
        if (relicS.comboDmgBonus > 0 && G.combo > 0) {
            const comboBonus = reducedDmg * (relicS.comboDmgBonus * G.combo);
            e.hp -= comboBonus;
        }
    }

    const elDef = ELEMENTS[el] || ELEMENTS.METAL;
    const dmgColor = isCrit ? '#ff4400' : mult > 1.2 ? '#ffff00' : elDef.light;
    spawnDmgNum(e.x + rng(-5, 5), e.y - 8, Math.ceil(reducedDmg), dmgColor, isCrit || mult > 1.2);
    spawnElementParticles(e.x, e.y, el, 3, 35);
    SFX.hit();

    if (e.hp <= 0 && !e.dead) {
        killEnemy(e);
    }

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
    let killGold = Math.floor(10 * _rewardMult);
    // S003: Relic gold multiplier (Merchant's Compass: +100%)
    if (typeof getRelicStats === 'function') {
        const relicS = getRelicStats();
        if (relicS.goldMult > 0) killGold = Math.floor(killGold * (1 + relicS.goldMult));
    }
    G.score += killGold;
    G.combo++;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.enemiesKilled++;
    // P004: Hero Mastery XP on kill
    if (typeof grantMasteryXP === 'function') grantMasteryXP('kill');

    // S001: Demon Aspect — restore MP on kill
    if (P.aspectMpOnKill > 0) {
        P.mp = Math.min(P.mpMax, P.mp + P.aspectMpOnKill);
        spawnDmgNum(P.x, P.y - 15, '+' + P.aspectMpOnKill + ' MP', '#8844ff', false);
    }

    // S001: Prophecy Aspect — cursed enemies drop 2x resources
    if (P.curseOnHit && e._cursed > 0) {
        // Double XP drop
        const bonusXp = e.xp || 3;
        spawnPickup(e.x + rng(-10, 10), e.y + rng(-10, 10), 'xp', bonusXp);
    }

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

    // S003: RELIC ON-KILL EFFECTS
    if (typeof getRelicStats === 'function') {
        const relicS = getRelicStats();
        // Blood Jade: heal 1% MaxHP on kill
        if (relicS.healOnKillPct > 0) {
            const heal = Math.ceil(P.maxHp * relicS.healOnKillPct);
            P.hp = Math.min(P.hp + heal, P.maxHp);
            if (Math.random() < 0.15) { // Show heal number occasionally (avoid spam)
                spawnDmgNum(P.x, P.y - 15, '+' + heal, '#44ff44', false);
            }
        }
    }

    // T-02: TALISMAN ON-KILL PROC EFFECTS
    if (P.talismanProc) {
        const proc = P.talismanProc;
        switch (proc.type) {
            case 'chain': // Thunder Seal — 12% on kill: chain lightning ×3
                if (proc.chance && Math.random() < proc.chance) {
                    let chainTargets = 0;
                    for (const ce of G.enemies) {
                        if (ce.dead || chainTargets >= 3) break;
                        const cd = Math.hypot(ce.x - e.x, ce.y - e.y);
                        if (cd < 120) {
                            if (typeof damageEnemy === 'function') damageEnemy(ce, 15 + G.floor * 2, 'METAL');
                            // Lightning arc VFX
                            G.skillEffects.push({
                                type: 'lightning', x1: e.x, y1: e.y, x2: ce.x, y2: ce.y,
                                color: '#ffff00', timer: 0.3
                            });
                            chainTargets++;
                        }
                    }
                    if (chainTargets > 0) {
                        spawnDmgNum(e.x, e.y - 25, '⚡ CHAIN ×' + chainTargets, '#ffff00', true);
                        shake(2, 0.1);
                    }
                }
                break;
            case 'explode': // Void Stone — 5% on kill: enemy explodes AoE
                if (proc.chance && Math.random() < proc.chance) {
                    const aoeRadius = 60;
                    for (const ae of G.enemies) {
                        if (ae.dead) continue;
                        const ad = Math.hypot(ae.x - e.x, ae.y - e.y);
                        if (ad < aoeRadius) {
                            if (typeof damageEnemy === 'function') damageEnemy(ae, 20 + G.floor * 3, e.el || 'FIRE');
                        }
                    }
                    G.skillEffects.push({
                        type: 'shockwave', x: e.x, y: e.y,
                        radius: 5, maxRadius: aoeRadius, speed: 300,
                        color: '#aa00ff', alpha: 0.7, lineWidth: 3, timer: 0.3
                    });
                    spawnDmgNum(e.x, e.y - 25, '💥 VOID BURST', '#aa00ff', true);
                    spawnParticles(e.x, e.y, '#aa00ff', 15, 60);
                    shake(4, 0.15);
                }
                break;
        }
    }

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
        // Molten: Leave fire AoE on death — use Physics hazard system
        if (e.modifiers.includes('molten')) {
            if (window.Physics && typeof Physics.spawnHazard === 'function') {
                Physics.spawnHazard(e.x, e.y, 'LAVA_POOL', 30);
            } else {
                // Legacy fallback
                G.bullets.push({
                    x: e.x, y: e.y, type: 'aoe_ring', r: 30,
                    color: '#ff6600', el: 'FIRE',
                    life: 3, maxLife: 3, dmg: e.dmg * 0.3,
                    _moltenPool: true
                });
            }
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

    // T-03: HAZARD SPAWNING ON ENEMY DEATH
    // Activate the Physics hazard system — element-based ground effects
    if (window.Physics && typeof Physics.spawnHazard === 'function') {
        // Map enemy element to hazard type
        const EL_TO_HAZARD = {
            'FIRE': 'SCORCHED', 'WATER': 'PUDDLE', 'EARTH': 'MUD',
            'METAL': 'ELECTRIFIED', 'WOOD': 'OVERGROWN'
        };
        const hazardType = EL_TO_HAZARD[e.el];

        // Elite+ enemies always leave ground hazards
        if (hazardType && (e.type === 'elite' || e.type === 'miniboss' || e.type === 'boss' || e.type === 'finalboss')) {
            const hazardRadius = e.type === 'finalboss' ? 45 : e.type === 'boss' ? 35 :
                e.type === 'miniboss' ? 28 : 20;
            Physics.spawnHazard(e.x, e.y, hazardType, hazardRadius);
        }
        // Regular enemies: 15% chance to leave small hazard
        else if (hazardType && Math.random() < 0.15) {
            Physics.spawnHazard(e.x, e.y, hazardType, 12);
        }
    }

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

        // Guaranteed equipment drop — uses rich EQUIPMENT_DEFS system
        const maxRarity = G.floor >= 10 ? 4 : G.floor >= 7 ? 3 : G.floor >= 4 ? 2 : G.floor >= 2 ? 1 : 0;
        const equip = (typeof getEquipmentByRarity === 'function') ? getEquipmentByRarity(maxRarity) : null;

        if (equip) {
            if (!G.equipment) G.equipment = { armor: null, talisman: null, mount: null };
            const eqSlot = equip.slot;
            const rarColor = (typeof RARITY_COLORS !== 'undefined') ? RARITY_COLORS[equip.rarity] : '#ffd700';
            const rarName = (typeof RARITY_NAMES !== 'undefined') ? RARITY_NAMES[equip.rarity] : '';

            // Store the full equipment definition with element from defeated general
            G.equipment[eqSlot] = { ...equip, el: e.el, fromGeneral: e.generalName || 'General' };

            // Apply equipment-specific stat bonuses
            if (eqSlot === 'armor') {
                if (equip.hp) { P.maxHp += equip.hp; P.hp = Math.min(P.hp + equip.hp, P.maxHp); }
                if (equip.def) P.dmgReduction = (P.dmgReduction || 0) + equip.def;
                if (equip.hpRegen) P.hpRegen = (P.hpRegen || 0) + equip.hpRegen;
                if (equip.reflect) P.reflectDmg = (P.reflectDmg || 0) + equip.reflect;
            } else if (eqSlot === 'talisman') {
                if (equip.procChance) P.talismanProc = { chance: equip.procChance, type: equip.procType };
                if (equip.procType === 'reflect_proj') P.reflectProjectiles = true;
            } else if (eqSlot === 'mount') {
                if (equip.speed) P.speed *= (1 + equip.speed);
                if (equip.dodgeCdBonus) P.dodgeCdBonus = (P.dodgeCdBonus || 0) + equip.dodgeCdBonus;
                if (equip.mpRegen) P.mpRegen = (P.mpRegen || 0) + equip.mpRegen;
                if (equip.xpBonus) P.xpMult = (P.xpMult || 1) + equip.xpBonus;
                if (equip.fireTrail) P.fireTrailOnDodge = true;
            }

            // Rich equipment pickup notification
            spawnDmgNum(e.x, e.y - 30, rarName, rarColor, true);
            spawnDmgNum(e.x, e.y - 18, equip.name, rarColor, false);
            spawnDmgNum(e.x, e.y - 8, equip.desc, '#ccc', false);

            // Element burst VFX for rare+ drops
            if (equip.rarity >= 2) {
                spawnElementParticles(e.x, e.y, e.el, 12, 60);
                triggerFlash(rarColor, 0.2);
            }
        }

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

// ═══════════════════════════════════════════════════════════════
// P008: Omega Attacks — Hold F to charge, release devastating AoE
// ═══════════════════════════════════════════════════════════════

const OMEGA_CONFIG = {
    chargeTime: 0.8,     // Seconds to fully charge
    mpCost: 25,          // MP consumed on release
    dmgMultiplier: 3.0,  // Damage = base weapon dmg × this
    radius: 120,         // AoE radius
    cooldown: 5.0        // Cooldown between Omega attacks
};

// State
window.OmegaState = {
    charging: false,
    chargeTimer: 0,
    cooldown: 0,
    ready: false  // True when fully charged
};

function startOmegaCharge() {
    if (G.state !== 'PLAYING') return;
    if (window.OmegaState.cooldown > 0) return;
    if (P.mp < OMEGA_CONFIG.mpCost) return;

    window.OmegaState.charging = true;
    window.OmegaState.chargeTimer = 0;
    window.OmegaState.ready = false;
}

function updateOmegaCharge(dt) {
    const os = window.OmegaState;
    if (os.cooldown > 0) os.cooldown -= dt;

    if (!os.charging) return;

    os.chargeTimer += dt;

    // Charge particles (escalating intensity)
    const intensity = Math.min(os.chargeTimer / OMEGA_CONFIG.chargeTime, 1);
    if (Math.random() < intensity * 0.5) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        spawnParticles(
            P.x + Math.cos(angle) * dist,
            P.y + Math.sin(angle) * dist,
            intensity > 0.8 ? '#ffd700' : '#ffaa00',
            1, 15
        );
    }

    // Slow movement while charging
    P.spdOverride = P.spd * (0.3 + 0.7 * (1 - intensity));

    if (os.chargeTimer >= OMEGA_CONFIG.chargeTime && !os.ready) {
        os.ready = true;
        // Ready flash
        triggerFlash('#ffd700', 0.1);
        spawnParticles(P.x, P.y, '#ffd700', 10, 40);
    }
}

function releaseOmegaAttack() {
    const os = window.OmegaState;
    if (!os.charging) return;

    // Restore speed
    P.spdOverride = undefined;

    os.charging = false;

    if (!os.ready) {
        // Cancelled early — no attack, no cost
        os.chargeTimer = 0;
        return;
    }

    // Consume MP
    if (P.mp < OMEGA_CONFIG.mpCost) {
        os.chargeTimer = 0;
        os.ready = false;
        return;
    }
    P.mp -= OMEGA_CONFIG.mpCost;
    P.mpRegenDelay = 2.0;
    os.cooldown = OMEGA_CONFIG.cooldown;
    os.chargeTimer = 0;
    os.ready = false;

    // Determine element from primary weapon
    const primaryWeapon = G.weapons[0];
    const el = primaryWeapon ? primaryWeapon.el : 'METAL';
    const elDef = ELEMENTS[el] || ELEMENTS.METAL;
    const baseDmg = primaryWeapon ? primaryWeapon.dmg : 10;
    const omegaDmg = Math.ceil(baseDmg * OMEGA_CONFIG.dmgMultiplier);

    // Hit all enemies in radius
    const radius = OMEGA_CONFIG.radius;
    let hitCount = 0;
    for (const e of G.enemies) {
        const d = Math.hypot(e.x - P.x, e.y - P.y);
        if (d < radius) {
            damageEnemy(e, omegaDmg, el);
            // Knockback
            const angle = Math.atan2(e.y - P.y, e.x - P.x);
            e.vx += Math.cos(angle) * 200;
            e.vy += Math.sin(angle) * 200;
            hitCount++;
        }
    }

    // Epic VFX
    spawnParticles(P.x, P.y, elDef.light, 40, 120);
    spawnParticles(P.x, P.y, elDef.dark || elDef.light, 25, 90);
    spawnParticles(P.x, P.y, '#ffd700', 20, 100);

    // Shockwave bullet (visual only)
    G.bullets.push({
        x: P.x, y: P.y, type: 'omega_wave',
        angle: 0, range: radius, color: elDef.light,
        el: el, life: 0.4, maxLife: 0.4, weaponId: 'omega'
    });

    // Screen effects
    shake(8, 0.4);
    hitStop(0.08);
    triggerFlash(elDef.light, 0.3);
    triggerChromatic(4);
    triggerSpeedLines(1.0);

    // Sound
    if (typeof SFX !== 'undefined') {
        if (SFX.ultimateActivate) SFX.ultimateActivate();
        if (SFX.hit) SFX.hit();
    }

    // Announcement
    const omegaName = G.lang === 'en' ? '⚡ OMEGA ATTACK!' : '⚡ ĐÒN TUYỆT CHIÊU!';
    if (hitCount > 0) {
        spawnDmgNum(P.x, P.y - 30, omegaName, '#ffd700', true);
    }
}

function drawOmegaChargeBar() {
    const os = window.OmegaState;
    if (!os.charging) return;

    const sx = P.x - G.camX + G.shakeX;
    const sy = P.y - G.camY + G.shakeY - 25;
    const barW = 30, barH = 4;
    const progress = Math.min(os.chargeTimer / OMEGA_CONFIG.chargeTime, 1);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(sx - barW / 2, sy, barW, barH);

    // Fill (gold when ready, orange while charging)
    ctx.fillStyle = progress >= 1 ? '#ffd700' : '#ff8800';
    ctx.fillRect(sx - barW / 2, sy, barW * progress, barH);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(sx - barW / 2, sy, barW, barH);

    // Label
    if (progress >= 1) {
        drawText('OMEGA!', sx, sy - 4, { font: 'bold 6px monospace', fill: '#ffd700', align: 'center' });
    }
}

