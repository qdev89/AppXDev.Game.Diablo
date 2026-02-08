// ============================================================
// DYNASTY BRUHHH DUNGEON - Weapons & Combat
// ============================================================

// --- Weapon Definitions ---
const WEAPON_DEFS = [
    {
        id: 'fire_sword', name: '🔴 Fire Sword', el: 'FIRE', type: 'melee', desc: 'Forward fire slash',
        dmg: 12, cd: 0.8, range: 40, arc: 90, tier: 1
    },
    {
        id: 'metal_blade', name: '🪙 Blade Storm', el: 'METAL', type: 'orbital', desc: 'Spinning blades orbit you',
        dmg: 8, cd: 0.3, range: 50, count: 3, tier: 1
    },
    {
        id: 'water_bolt', name: '🔵 Frost Bolt', el: 'WATER', type: 'projectile', desc: 'Auto-fires at nearest enemy',
        dmg: 15, cd: 1.2, range: 150, speed: 200, tier: 1
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
    // Passives
    { id: 'atk_speed', name: '⚡ Swift Strikes', type: 'passive', desc: '+20% attack speed', stat: 'atkSpd', val: 0.2 },
    { id: 'max_hp', name: '❤️ Vitality', type: 'passive', desc: '+25 max HP', stat: 'maxHp', val: 25 },
    { id: 'move_spd', name: '🏃 Fleet Foot', type: 'passive', desc: '+15% move speed', stat: 'moveSpd', val: 0.15 },
    { id: 'pickup_range', name: '🧲 Magnet', type: 'passive', desc: '+50% pickup range', stat: 'pickupRange', val: 0.5 },
    { id: 'xp_gain', name: '📚 Scholar', type: 'passive', desc: '+25% XP gain', stat: 'xpGain', val: 0.25 },
];

// Active weapon instances on player
function createWeapon(def) {
    return {
        ...def, timer: 0, level: 1, angle: 0,
        orbitAngle: Math.random() * Math.PI * 2
    };
}

// --- Passive Stats ---
const passives = { atkSpd: 0, maxHp: 0, moveSpd: 0, pickupRange: 0, xpGain: 0 };

function applyPassive(def) {
    passives[def.stat] = (passives[def.stat] || 0) + def.val;
    if (def.stat === 'maxHp') { P.maxHp += def.val; P.hp = Math.min(P.hp + def.val, P.maxHp); }
}

// --- Weapon Update ---
function updateWeapons(dt) {
    const spdMult = 1 + passives.atkSpd;
    for (const w of G.weapons) {
        w.timer -= dt * spdMult;
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
        case 'orbital': fireOrbital(w, el); break;
        case 'aoe': fireAoE(w, el); break;
        case 'shield': fireShield(w, el); break;
        case 'heal': fireHeal(w); break;
    }
}

function fireMelee(w, el) {
    const arcRad = (w.arc || 90) * Math.PI / 180;
    const baseAngle = P.facing > 0 ? 0 : Math.PI;
    const range = w.range + w.level * 5;
    const dmg = w.dmg * (1 + w.level * 0.3);
    for (const e of G.enemies) {
        const dx = e.x - P.x, dy = e.y - P.y;
        const d = Math.hypot(dx, dy);
        if (d > range) continue;
        const angle = Math.atan2(dy, dx);
        let diff = angle - baseAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) < arcRad / 2) {
            damageEnemy(e, dmg, w.el);
        }
    }
    // Visual slash
    G.bullets.push({
        x: P.x + P.facing * 15, y: P.y, type: 'slash',
        angle: baseAngle, arc: arcRad, range, color: el.light,
        life: 0.15, maxLife: 0.15
    });
    shake(1.5, 0.05);
}

function fireProjectile(w, el) {
    let nearest = null, nearDist = w.range + w.level * 20;
    for (const e of G.enemies) {
        const d = dist(P, e);
        if (d < nearDist) { nearDist = d; nearest = e; }
    }
    if (!nearest) return;
    const a = Math.atan2(nearest.y - P.y, nearest.x - P.x);
    const spd = w.speed || 200;
    G.bullets.push({
        x: P.x, y: P.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        dmg: w.dmg * (1 + w.level * 0.3), el: w.el, color: el.light,
        life: 2, type: 'bullet', r: 3 + w.level, pierce: w.level >= 3 ? 2 : 0
    });
}

function fireOrbital(w, el) {
    const orbCount = (w.count || 3) + Math.floor(w.level / 2);
    const range = w.range + w.level * 8;
    const dmg = w.dmg * (1 + w.level * 0.25);
    for (let i = 0; i < orbCount; i++) {
        const a = w.orbitAngle + (Math.PI * 2 / orbCount) * i;
        const ox = P.x + Math.cos(a) * range;
        const oy = P.y + Math.sin(a) * range;
        for (const e of G.enemies) {
            if (dist({ x: ox, y: oy }, e) < 15) {
                damageEnemy(e, dmg, w.el);
            }
        }
    }
}

function fireAoE(w, el) {
    const range = w.range + w.level * 10;
    const dmg = w.dmg * (1 + w.level * 0.3);
    for (const e of G.enemies) {
        if (dist(P, e) < range) {
            damageEnemy(e, dmg, w.el);
        }
    }
    G.bullets.push({
        x: P.x, y: P.y, type: 'aoe_ring', r: range, color: el.light,
        life: 0.3, maxLife: 0.3
    });
    shake(2, 0.08);
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
    // Element bonus
    let mult = 1;
    if (GENERATING[el] === e.el) mult = 0.8; // generating = slightly less (feeds their element)
    if (OVERCOMING[el] === e.el) mult = 1.5; // overcoming = super effective!
    if (GENERATING[e.el] === el) mult = 1.3; // we overcome them

    const finalDmg = dmg * mult;
    e.hp -= finalDmg;
    e.flash = 0.1;
    e.knockX = (e.x - P.x) * 0.3;
    e.knockY = (e.y - P.y) * 0.3;

    const elDef = ELEMENTS[el] || ELEMENTS.METAL;
    spawnDmgNum(e.x + rng(-5, 5), e.y - 8, finalDmg, mult > 1.2 ? '#ffff00' : elDef.light, mult > 1.2);
    spawnParticles(e.x, e.y, elDef.color, 3, 40);
    SFX.hit();

    if (mult > 1.2) {
        spawnDmgNum(e.x, e.y - 20, 0, '#ffff00', true); // shows "EFFECTIVE!"
        shake(2, 0.06);
    }

    // Yin-Yang: attacks = +Yang
    G.yinYang.yang = clamp(G.yinYang.yang + 0.5, 0, 100);

    if (e.hp <= 0) killEnemy(e);
}

function killEnemy(e) {
    e.dead = true;
    G.score += 10;
    G.combo++;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.enemiesKilled++;

    // Yang boost on kill
    G.yinYang.yang = clamp(G.yinYang.yang + 1, 0, 100);

    const elDef = ELEMENTS[e.el] || ELEMENTS.METAL;
    spawnParticles(e.x, e.y, elDef.color, 8, 60);
    SFX.kill();

    // Drop XP
    const xpVal = 3 + G.floor;
    G.pickups.push({ x: e.x + rng(-5, 5), y: e.y + rng(-5, 5), type: 'xp', val: xpVal, color: '#55ffff', r: 3, life: 15 });

    // Chance to drop gold
    if (Math.random() < 0.3) {
        G.pickups.push({ x: e.x + rng(-8, 8), y: e.y + rng(-8, 8), type: 'gold', val: 5 + G.floor * 2, color: '#ffdd44', r: 3, life: 15 });
    }

    // Chance to drop HP orb
    if (Math.random() < 0.08) {
        G.pickups.push({ x: e.x, y: e.y, type: 'hp', val: 15, color: '#ff4444', r: 4, life: 15 });
    }

    // Shake on multi-kills
    if (G.combo % 50 === 0) { shake(4, 0.15); hitStop(0.03); SFX.combo50(); }
    else if (G.combo % 10 === 0) { shake(2, 0.08); SFX.combo10(); }

    // Check floor clear
    if (G.enemiesKilled >= G.enemiesNeeded && !G.portalActive) {
        G.portalActive = true;
        G.portal = { x: G.arenaW / 2, y: G.arenaH / 2, r: 20, pulse: 0 };
    }
}
