// ============================================================
// DYNASTY BRUHHH DUNGEON - Bonding & Skill Tree (Hades-style)
// ============================================================

// --- Brotherhood Bonds (Keepsakes) ---
// Like Hades: each bond = a passive trinket you equip before/during a run.
// Bonds level up by playing runs, granting stronger effects.
const BONDS = [
    // --- Shu Brotherhood ---
    {
        id: 'peach_oath', name: 'Peach Garden Oath', heroes: ['Liu Bei', 'Guan Yu', 'Zhang Fei'],
        color: '#ff6644', desc: 'Sworn brothers protect', faction: 'Shu',
        levels: [
            { name: 'Lv.1 Bond', effect: 'Revive once with 20% HP on death', stat: 'revive', val: 0.2 },
            { name: 'Lv.2 Bond', effect: 'Revive once with 35% HP on death', stat: 'revive', val: 0.35 },
            { name: 'Lv.3 Bond', effect: 'Revive once with 50% HP + 3s invincible', stat: 'revive', val: 0.5 },
        ]
    },
    {
        id: 'five_tigers', name: 'Five Tiger Generals', heroes: ['Guan Yu', 'Zhang Fei', 'Zhao Yun', 'Huang Zhong', 'Ma Chao'],
        color: '#ff8800', desc: '+DMG per weapon equipped', faction: 'Shu',
        levels: [
            { name: 'Lv.1', effect: '+5% DMG per weapon slot filled', stat: 'dmgPerWeapon', val: 0.05 },
            { name: 'Lv.2', effect: '+8% DMG per weapon slot filled', stat: 'dmgPerWeapon', val: 0.08 },
            { name: 'Lv.3', effect: '+12% DMG per weapon + AoE on kill', stat: 'dmgPerWeapon', val: 0.12 },
        ]
    },
    {
        id: 'dragon_phoenix', name: 'Dragon & Phoenix', heroes: ['Zhuge Liang', 'Pang Tong'],
        color: '#aaffaa', desc: 'Elemental mastery boost', faction: 'Shu',
        levels: [
            { name: 'Lv.1', effect: '+15% elemental combo damage', stat: 'elCombo', val: 0.15 },
            { name: 'Lv.2', effect: '+25% elemental combo damage', stat: 'elCombo', val: 0.25 },
            { name: 'Lv.3', effect: '+40% elemental combo + Wu Xing auto-chain', stat: 'elCombo', val: 0.40 },
        ]
    },

    // --- Wei Brotherhood ---
    {
        id: 'cao_elites', name: "Cao's Five Elites", heroes: ['Zhang Liao', 'Xu Huang', 'Zhang He', 'Yue Jin', 'Yu Jin'],
        color: '#8888ff', desc: 'Defense wall aura', faction: 'Wei',
        levels: [
            { name: 'Lv.1', effect: 'Take 10% less damage', stat: 'dmgReduction', val: 0.10 },
            { name: 'Lv.2', effect: 'Take 15% less damage', stat: 'dmgReduction', val: 0.15 },
            { name: 'Lv.3', effect: 'Take 20% less + reflect 10% dmg', stat: 'dmgReduction', val: 0.20 },
        ]
    },
    {
        id: 'wei_ambition', name: "Ambition of Wei", heroes: ['Cao Cao', 'Sima Yi', 'Guo Jia'],
        color: '#7777cc', desc: '+XP and gold gain', faction: 'Wei',
        levels: [
            { name: 'Lv.1', effect: '+15% XP and gold from enemies', stat: 'xpGold', val: 0.15 },
            { name: 'Lv.2', effect: '+25% XP and gold from enemies', stat: 'xpGold', val: 0.25 },
            { name: 'Lv.3', effect: '+35% XP/gold + rare drop chance', stat: 'xpGold', val: 0.35 },
        ]
    },

    // --- Wu Brotherhood ---
    {
        id: 'sun_legacy', name: 'Sun Family Legacy', heroes: ['Sun Jian', 'Sun Ce', 'Sun Shangxiang'],
        color: '#ff4444', desc: 'Attack speed boost', faction: 'Wu',
        levels: [
            { name: 'Lv.1', effect: '+15% attack speed', stat: 'atkSpd', val: 0.15 },
            { name: 'Lv.2', effect: '+25% attack speed', stat: 'atkSpd', val: 0.25 },
            { name: 'Lv.3', effect: '+35% attack speed + chain lightning', stat: 'atkSpd', val: 0.35 },
        ]
    },
    {
        id: 'red_cliffs', name: 'Red Cliffs Alliance', heroes: ['Zhou Yu', 'Zhuge Liang', 'Huang Gai'],
        color: '#ff6600', desc: 'Fire damage & burn', faction: 'Wu×Shu',
        levels: [
            { name: 'Lv.1', effect: 'All attacks +10% fire damage', stat: 'fireDmg', val: 0.10 },
            { name: 'Lv.2', effect: 'All attacks +20% fire + burn DOT', stat: 'fireDmg', val: 0.20 },
            { name: 'Lv.3', effect: '+30% fire + burn + explosion on kill', stat: 'fireDmg', val: 0.30 },
        ]
    },

    // --- Cross-Faction (Duo Boons) ---
    {
        id: 'tragic_romance', name: 'Tragic Romance', heroes: ['Lu Bu', 'Diao Chan'],
        color: '#ff44aa', desc: 'Max power, max risk', faction: 'Other',
        levels: [
            { name: 'Lv.1', effect: '+30% DMG but +15% dmg taken', stat: 'glass', val: 0.30 },
            { name: 'Lv.2', effect: '+45% DMG but +15% dmg taken', stat: 'glass', val: 0.45 },
            { name: 'Lv.3', effect: '+60% DMG but +15% dmg taken + lifesteal 5%', stat: 'glass', val: 0.60 },
        ]
    },
    {
        id: 'brilliant_rivals', name: 'Brilliant Rivals', heroes: ['Zhou Yu', 'Zhuge Liang'],
        color: '#ddddff', desc: 'Weapon evolution speed', faction: 'Wu×Shu',
        levels: [
            { name: 'Lv.1', effect: 'Weapons gain +1 level at floor 5', stat: 'weaponBoost', val: 1 },
            { name: 'Lv.2', effect: 'Weapons gain +1 level at floor 3', stat: 'weaponBoost', val: 1 },
            { name: 'Lv.3', effect: 'Weapons gain +1 level at floor 3 + evolve', stat: 'weaponBoost', val: 2 },
        ]
    },
];

// --- Skill Tree (Arcana-style progressive cards) ---
// Like Hades 2 Arcana: unlock cards with currency, equip with limited Grasp
const SKILL_TREE = [
    // Row 1: Basics (0-1 Grasp)
    {
        id: 'strength', name: 'Strength', icon: '💪', grasp: 1, cost: 0, unlocked: true,
        desc: '+10% base weapon damage', stat: 'baseDmg', val: 0.10, row: 0
    },
    {
        id: 'vitality', name: 'Vitality', icon: '❤️', grasp: 1, cost: 0, unlocked: true,
        desc: '+15 max HP', stat: 'maxHp', val: 15, row: 0
    },
    {
        id: 'swiftness', name: 'Swiftness', icon: '⚡', grasp: 1, cost: 0, unlocked: true,
        desc: '+10% move speed', stat: 'moveSpd', val: 0.10, row: 0
    },

    // Row 2: Element (1 Grasp each, unlock at floor 3)
    {
        id: 'wood_affinity', name: 'Wood Affinity', icon: '🌿', grasp: 1, cost: 50, unlocked: false,
        desc: 'Wood attacks heal 2% HP', stat: 'woodHeal', val: 0.02, row: 1, requires: 'strength'
    },
    {
        id: 'fire_affinity', name: 'Fire Affinity', icon: '🔥', grasp: 1, cost: 50, unlocked: false,
        desc: 'Fire attacks burn for 3s DOT', stat: 'fireBurn', val: 3, row: 1, requires: 'strength'
    },
    {
        id: 'water_affinity', name: 'Water Affinity', icon: '💧', grasp: 1, cost: 50, unlocked: false,
        desc: 'Water attacks slow enemies 20%', stat: 'waterSlow', val: 0.2, row: 1, requires: 'vitality'
    },
    {
        id: 'metal_affinity', name: 'Metal Affinity', icon: '⚔️', grasp: 1, cost: 50, unlocked: false,
        desc: '+10% crit chance on Metal attacks', stat: 'metalCrit', val: 0.1, row: 1, requires: 'swiftness'
    },
    {
        id: 'earth_affinity', name: 'Earth Affinity', icon: '🪨', grasp: 1, cost: 50, unlocked: false,
        desc: 'Earth attacks stun for 0.5s', stat: 'earthStun', val: 0.5, row: 1, requires: 'vitality'
    },

    // Row 3: Advanced (2 Grasp each, unlock at floor 5)
    {
        id: 'wu_xing_master', name: 'Wu Xing Master', icon: '☯️', grasp: 2, cost: 200, unlocked: false,
        desc: '+25% all elemental combo damage', stat: 'elCombo', val: 0.25, row: 2, requires: 'fire_affinity'
    },
    {
        id: 'death_defiance', name: 'Death Defiance', icon: '💀', grasp: 2, cost: 200, unlocked: false,
        desc: 'Revive once with 25% HP per run', stat: 'revive', val: 0.25, row: 2, requires: 'vitality'
    },
    {
        id: 'weapon_master', name: 'Weapon Master', icon: '🗡️', grasp: 2, cost: 200, unlocked: false,
        desc: '+1 weapon slot capacity', stat: 'weaponSlots', val: 1, row: 2, requires: 'metal_affinity'
    },

    // Row 4: Ultimate (3 Grasp, unlock at floor 10)
    {
        id: 'harmony_seeker', name: 'Harmony Seeker', icon: '🌟', grasp: 3, cost: 500, unlocked: false,
        desc: 'Yin-Yang fills 2x faster', stat: 'yinYangSpeed', val: 2.0, row: 3, requires: 'wu_xing_master'
    },
    {
        id: 'dynasty_lord', name: 'Dynasty Lord', icon: '👑', grasp: 3, cost: 500, unlocked: false,
        desc: 'All brotherhood bond effects +50%', stat: 'bondBoost', val: 0.5, row: 3, requires: 'death_defiance'
    },
];

// --- Bonding State ---
// Persists between runs (meta-progression)
const BondingState = {
    maxGrasp: 5,
    darkness: 0, // Currency earned from runs
    bondLevels: {}, // bondId -> level (0-2)
    unlockedCards: ['strength', 'vitality', 'swiftness'], // Skill tree cards unlocked
    equippedCards: [], // Active cards (limited by grasp)
    equippedBond: null, // Active brotherhood bond (1 per run)
    totalRuns: 0,
};

// --- Initialize Bonding for a Run ---
function initBondingForRun() {
    G.bonding = {
        equipped: null,
        xpEarned: 0,
        activeEffects: {},
    };

    // Apply equipped bond
    if (BondingState.equippedBond) {
        const bond = BONDS.find(b => b.id === BondingState.equippedBond);
        if (bond) {
            const lvl = BondingState.bondLevels[bond.id] || 0;
            const effect = bond.levels[Math.min(lvl, bond.levels.length - 1)];
            G.bonding.equipped = { name: bond.name, color: bond.color, desc: effect.effect, stat: effect.stat, val: effect.val };
            G.bonding.activeEffects[effect.stat] = effect.val;
        }
    }

    // Apply equipped skill cards
    for (const cardId of BondingState.equippedCards) {
        const card = SKILL_TREE.find(c => c.id === cardId);
        if (card) {
            G.bonding.activeEffects[card.stat] = (G.bonding.activeEffects[card.stat] || 0) + card.val;
            // Apply immediate effects
            if (card.stat === 'maxHp') {
                P.maxHp += card.val; P.hp += card.val;
            } else if (card.stat === 'moveSpd') {
                if (window.passives) window.passives.moveSpd += card.val;
            } else if (card.stat === 'baseDmg') {
                // Applied in damage calculation
            }
        }
    }
}

// --- End Run: Award Darkness ---
function endRunBonding() {
    if (!G.bonding) return;
    const darknessEarned = G.floor * 10 + P.level * 5 + Math.floor(G.score / 50);
    BondingState.darkness += darknessEarned;
    BondingState.totalRuns++;
    G.bonding.darknessEarned = darknessEarned;
}

// --- Get Bond Damage Multiplier ---
function getBondDmgMult() {
    if (!G.bonding || !G.bonding.activeEffects) return 1;
    let mult = 1;
    const fx = G.bonding.activeEffects;
    if (fx.baseDmg) mult += fx.baseDmg;
    if (fx.dmgPerWeapon) mult += fx.dmgPerWeapon * G.weapons.filter(w => w.type !== 'passive').length;
    if (fx.glass) mult += fx.glass;
    if (fx.fireDmg && P.element === 'FIRE') mult += fx.fireDmg;
    return mult;
}

// --- Check Revive (from bond or skill) ---
function checkBondRevive() {
    if (!G.bonding || !G.bonding.activeEffects) return false;
    const fx = G.bonding.activeEffects;
    if (fx.revive && fx.revive > 0) {
        P.hp = P.maxHp * fx.revive;
        P.invincible = 3; // 3s invincible after revive
        fx.revive = 0; // Used up for this run
        spawnParticles(P.x, P.y, '#ffd700', 30, 100);
        shake(5, 0.3);
        spawnDmgNum(P.x, P.y - 20, 0, '#ffd700', true);
        return true;
    }
    return false;
}

// --- Check Bond Damage Reduction ---
function getBondDmgReduction() {
    if (!G.bonding || !G.bonding.activeEffects) return 0;
    return G.bonding.activeEffects.dmgReduction || 0;
}

// ============================================================
// Phase H: BROTHERHOOD COMBOS — Active Combo Attacks
// ============================================================
const BROTHERHOOD_COMBOS = [
    {
        id: 'peach_rush', bondId: 'peach_oath',
        name: 'Peach Garden Rush',
        heroes: ['Liu Bei', 'Guan Yu', 'Zhang Fei'],
        minAllies: 2, // Need at least 2 of these allies alive
        dmg: 50, range: 100,
        type: 'rush', // All allies dash forward
        color: '#ff6644', vfx: 'triple_charge',
        cooldown: 30, chargeRate: 2 // Charges per kill with bond allies nearby
    },
    {
        id: 'tiger_roar', bondId: 'five_tigers',
        name: 'Tiger Generals Roar',
        heroes: ['Guan Yu', 'Zhang Fei', 'Zhao Yun', 'Huang Zhong', 'Ma Chao'],
        minAllies: 2,
        dmg: 35, range: 120,
        type: 'aoe_stun', // AoE stun + damage buff
        color: '#ff8800', vfx: 'tiger_blast',
        cooldown: 35, chargeRate: 1.5
    },
    {
        id: 'dragon_phoenix', bondId: 'dragon_phoenix',
        name: 'Dragon Phoenix Storm',
        heroes: ['Zhuge Liang', 'Pang Tong'],
        minAllies: 1,
        dmg: 60, range: 150,
        type: 'element_cross', // Cross-element AoE
        color: '#aaffaa', vfx: 'elemental_burst',
        cooldown: 40, chargeRate: 3
    },
    {
        id: 'red_cliffs', bondId: 'red_cliffs',
        name: 'Red Cliffs Inferno',
        heroes: ['Zhou Yu', 'Zhuge Liang', 'Huang Gai'],
        minAllies: 2,
        dmg: 70, range: 130,
        type: 'fire_wave', // Massive fire wave
        color: '#ff6600', vfx: 'inferno',
        cooldown: 45, chargeRate: 2
    }
];

// --- Check if combo is available ---
function getAvailableBrotherhoodCombo() {
    if (!G.allies || G.allies.length === 0) return null;
    const aliveAllyNames = G.allies.filter(a => a.hp > 0).map(a => a.name);

    for (const combo of BROTHERHOOD_COMBOS) {
        const matchCount = combo.heroes.filter(h => aliveAllyNames.includes(h)).length;
        if (matchCount >= combo.minAllies) {
            return combo;
        }
    }
    return null;
}

// --- Charge brotherhood gauge (called from killEnemy) ---
function chargeBrotherhoodGauge(amount) {
    if (!G.brotherhoodGauge && G.brotherhoodGauge !== 0) G.brotherhoodGauge = 0;
    const combo = getAvailableBrotherhoodCombo();
    if (!combo) return;
    G.brotherhoodGauge = clamp((G.brotherhoodGauge || 0) + amount * (combo.chargeRate || 1), 0, 100);
}

// --- Execute Brotherhood Combo ---
function executeBrotherhoodCombo() {
    const combo = getAvailableBrotherhoodCombo();
    if (!combo) return false;
    if ((G.brotherhoodGauge || 0) < 100) return false;
    if (G.brotherhoodCooldown > 0) return false;

    G.brotherhoodGauge = 0;
    G.brotherhoodCooldown = combo.cooldown;

    // Flash announcement
    G.floorAnnounce = { text: '⚔ ' + (typeof t === 'function' ? t('combo_' + combo.id) : combo.name) + ' ⚔', timer: 2.5 };
    triggerFlash(combo.color, 0.5);
    shake(12, 0.6);
    triggerChromatic(4);
    if (typeof triggerSpeedLines === 'function') triggerSpeedLines(2.0);

    // === Phase I: Cinematic Brotherhood VFX ===
    // Time-slow effect (brief freeze frame)
    G._comboTimeSlow = 0.6; // 0.6s of 20% speed
    // Screen darken overlay
    G._comboDarken = 0.5;  // 0.5s of screen darkening
    // Subtle radial burst lines
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 / 4) * i;
        G.skillEffects.push({
            type: 'speed_line', x: P.x, y: P.y,
            angle: angle, length: 0, maxLength: 18,
            speed: 500, color: combo.color, alpha: 0.3,
            timer: 0.1, lineWidth: 1
        });
    }
    // Ground impact ring
    G.skillEffects.push({
        type: 'shockwave', x: P.x, y: P.y,
        radius: 3, maxRadius: 60, speed: 250,
        color: '#ffffff', alpha: 0.8, lineWidth: 3, timer: 0.3
    });

    // Damage all enemies in range
    const dmg = combo.dmg * (1 + G.floor * 0.1);
    for (const e of G.enemies) {
        if (dist(P, e) < combo.range) {
            damageEnemy(e, dmg, P.element);
        }
    }

    // === TYPE-SPECIFIC EFFECTS ===
    if (combo.type === 'rush') {
        // All matching allies dash to nearest enemy
        for (const ally of G.allies) {
            if (ally.hp > 0 && combo.heroes.includes(ally.name)) {
                // Temporary speed + damage boost
                ally._comboRush = 3; // 3s rush
                ally._comboDmgMult = 2;
                spawnParticles(ally.x, ally.y, combo.color, 10, 50);
            }
        }
        // Triple shockwave
        for (let i = 0; i < 3; i++) {
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 10 + i * 15, maxRadius: combo.range * (0.6 + i * 0.2), speed: 200 + i * 50,
                color: combo.color, alpha: 0.5 - i * 0.1, lineWidth: 3 - i * 0.5,
                timer: 0.4 + i * 0.1
            });
        }
    } else if (combo.type === 'aoe_stun') {
        // Stun all enemies in range
        for (const e of G.enemies) {
            if (dist(P, e) < combo.range) {
                e.stunTimer = (e.stunTimer || 0) + 2;
                e.speed *= 0.3;
            }
        }
        // Tiger roar shockwave
        G.skillEffects.push({
            type: 'shockwave', x: P.x, y: P.y,
            radius: 5, maxRadius: combo.range, speed: 350,
            color: '#ff8800', alpha: 0.7, lineWidth: 4, timer: 0.5
        });
        // Buff allies
        for (const ally of G.allies) {
            if (ally.hp > 0) {
                ally._comboDmgMult = 1.5;
                ally._comboRush = 5;
            }
        }
    } else if (combo.type === 'element_cross') {
        // Cross pattern elemental bolts
        const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4, Math.PI, Math.PI * 5 / 4, Math.PI * 3 / 2, Math.PI * 7 / 4];
        const els = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER', 'WOOD', 'FIRE', 'EARTH'];
        for (let i = 0; i < 8; i++) {
            const elDef = ELEMENTS[els[i]];
            G.bullets.push({
                x: P.x, y: P.y,
                vx: Math.cos(angles[i]) * 180, vy: Math.sin(angles[i]) * 180,
                dmg: combo.dmg * 0.5, el: els[i], color: elDef.light,
                life: 2, type: 'bullet', r: 5, pierce: 5,
                weaponId: 'brotherhood'
            });
        }
    } else if (combo.type === 'fire_wave') {
        // Expanding fire ring
        G.skillEffects.push({
            type: 'shockwave', x: P.x, y: P.y,
            radius: 10, maxRadius: combo.range * 1.5, speed: 150,
            color: '#ff4400', alpha: 0.8, lineWidth: 6, timer: 0.8
        });
        G.skillEffects.push({
            type: 'fire_aura', x: P.x, y: P.y,
            radius: combo.range, color: '#ff4400', alpha: 0.5, timer: 1.5
        });
        // Burn all enemies
        for (const e of G.enemies) {
            if (dist(P, e) < combo.range * 1.2) {
                e._burnTimer = (e._burnTimer || 0) + 4;
                e._burnDmg = combo.dmg * 0.15;
            }
        }
    }

    // Epic particle burst at player
    spawnParticles(P.x, P.y, combo.color, 30, 120);
    spawnParticles(P.x, P.y, '#ffd700', 20, 80);
    spawnParticles(P.x, P.y, '#ffffff', 15, 60);

    SFX.combo50();
    if (typeof SFX.bossSpawn === 'function') SFX.bossSpawn();

    return true;
}

