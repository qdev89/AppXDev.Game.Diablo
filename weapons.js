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
        el: w.el, life: 0.2, maxLife: 0.2
    });
    shake(2, 0.06);
    triggerChromatic(0.8);
    // Fire slash element particles
    spawnElementParticles(P.x + P.facing * 20, P.y, w.el, 4, 40);
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
    // Element bonus
    let mult = 1;
    if (GENERATING[el] === e.el) mult = 0.8;
    if (OVERCOMING[el] === e.el) mult = 1.5;
    if (GENERATING[e.el] === el) mult = 1.3;

    // Phase E: Hero passive multipliers
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;

    // Berserker: Rage mode = 2x damage
    if (P.rageModeTimer > 0) mult *= 2;

    // Berserker: Combo rage passive (+2% per combo, max 50%)
    if (hero && hero.passive.stat === 'comboRage') {
        mult *= 1 + Math.min(G.combo * 0.02, 0.5);
    }

    // Assassin: Crit chance (20% for 3x)
    let isCrit = false;
    if (hero && hero.passive.stat === 'critChance' && Math.random() < 0.20) {
        mult *= 3;
        isCrit = true;
    }

    const finalDmg = dmg * mult;
    e.hp -= finalDmg;
    e.flash = 0.1;
    e.knockX = (e.x - P.x) * 0.3;
    e.knockY = (e.y - P.y) * 0.3;

    const elDef = ELEMENTS[el] || ELEMENTS.METAL;
    const dmgColor = isCrit ? '#ff4400' : mult > 1.2 ? '#ffff00' : elDef.light;
    spawnDmgNum(e.x + rng(-5, 5), e.y - 8, finalDmg, dmgColor, isCrit || mult > 1.2);
    spawnElementParticles(e.x, e.y, el, 3, 35);
    SFX.hit();

    if (isCrit) {
        spawnDmgNum(e.x, e.y - 20, 0, '#ff4400', true); // "CRIT!"
        shake(3, 0.08);
        triggerChromatic(1.5);
    } else if (mult > 1.2) {
        spawnDmgNum(e.x, e.y - 20, 0, '#ffff00', true);
        shake(3, 0.08);
        triggerChromatic(1.0);
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

    // Phase E: Musou gauge fill
    const musouGain = e.type === 'fodder' ? 1 : e.type === 'elite' ? 8 : e.type === 'boss' ? 25 : 3;
    P.musou = clamp((P.musou || 0) + musouGain, 0, P.musouMax || 100);

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
    if (Math.random() < 0.08) {
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
