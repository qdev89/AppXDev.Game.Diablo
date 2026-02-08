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
                passives.moveSpd += card.val;
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
