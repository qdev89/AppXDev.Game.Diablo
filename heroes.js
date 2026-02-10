// ============================================================
// DYNASTY BRUHHH DUNGEON - Heroes, Skills & Equipment
// Must load BEFORE engine.js
// ============================================================

// --- Hero Definitions ---
const HEROES = [
    {
        id: 'berserker', name: 'Lu Bu', title: 'God of War', element: 'FIRE',
        colors: { body: '#cc2222', accent: '#ff6644', glow: '#ff4400', hair: '#440000' },
        startWeapon: 'fire_halberd', weaponIcon: '🔱', weaponName: 'Sky Piercer',
        hp: 120, speed: 90, mp: 80, mpRegen: 2.5,
        passive: { name: 'Blood Rage', desc: '+2% DMG per combo (max 50%)', stat: 'comboRage' },
        tactical: {
            id: 'ground_slam', name: 'Ground Slam', icon: '💥',
            desc: 'AoE stun around player', mpCost: 25, cd: 5, range: 80, dmg: 35, stunDur: 1.5
        },
        ultimate: {
            id: 'rage_mode', name: 'Dynasty Fury', icon: '🔥',
            desc: '2x damage + 1.5x speed for 6s', duration: 6
        },
        dodgeTrail: '#ff4400'
    },
    {
        id: 'strategist', name: 'Zhuge Liang', title: 'Sleeping Dragon', element: 'WOOD',
        colors: { body: '#226622', accent: '#55cc55', glow: '#44ff44', hair: '#113311' },
        startWeapon: 'wood_fan', weaponIcon: '🪭', weaponName: 'Feather Fan',
        hp: 80, speed: 95, mp: 150, mpRegen: 5,
        passive: { name: 'Brilliant Mind', desc: '+30% XP, 4 level-up choices', stat: 'xpBonus' },
        tactical: {
            id: 'wind_burst', name: 'Wind Burst', icon: '🌀',
            desc: 'Cone knockback + slow', mpCost: 35, cd: 7, range: 100, dmg: 20, knockback: 120
        },
        ultimate: {
            id: 'eight_trigrams', name: 'Eight Trigrams', icon: '☯',
            desc: '8 elemental bolts spiral out', dmg: 40, count: 8
        },
        dodgeTrail: '#44ff44'
    },
    {
        id: 'assassin', name: 'Zhou Yu', title: 'Young Conqueror', element: 'METAL',
        colors: { body: '#7777aa', accent: '#ccccff', glow: '#aaaaff', hair: '#333355' },
        startWeapon: 'metal_twin', weaponIcon: '⚔️', weaponName: 'Twin Blades',
        hp: 75, speed: 130, mp: 100, mpRegen: 3,
        passive: { name: 'Lethal Edge', desc: '20% crit chance, crits deal 3x', stat: 'critChance' },
        tactical: {
            id: 'shadow_strike', name: 'Shadow Strike', icon: '⚡',
            desc: 'Teleport to nearest + backstab', mpCost: 20, cd: 4, dmg: 40, teleRange: 150
        },
        ultimate: {
            id: 'blade_storm', name: 'Blade Storm', icon: '🗡️',
            desc: 'Dash through all nearby enemies', dmg: 35, hits: 10, range: 120
        },
        dodgeTrail: '#ccccff'
    },
    {
        id: 'vanguard', name: 'Zhao Yun', title: 'Dragon of Changshan', element: 'EARTH',
        colors: { body: '#886622', accent: '#ddaa44', glow: '#ffcc00', hair: '#553311' },
        startWeapon: 'earth_spear', weaponIcon: '🗡️', weaponName: 'Dragon Spear',
        hp: 150, speed: 85, mp: 100, mpRegen: 3,
        passive: { name: 'Unbreakable', desc: '-20% damage taken, +10% ally HP', stat: 'tankAura' },
        tactical: {
            id: 'shield_wall', name: 'Shield Wall', icon: '🛡️',
            desc: 'Block all damage for 2.5s', mpCost: 30, cd: 8, blockDur: 2.5
        },
        ultimate: {
            id: 'changban_charge', name: 'Changban Charge', icon: '🐴',
            desc: 'Invincible charge + AoE explosion', dmg: 60, chargeSpeed: 400, range: 100
        },
        dodgeTrail: '#ddaa44'
    },
    {
        id: 'mystic', name: 'Sima Yi', title: 'Hidden Dragon', element: 'WATER',
        colors: { body: '#223388', accent: '#5588ff', glow: '#4466ff', hair: '#111133' },
        startWeapon: 'water_scepter', weaponIcon: '🔮', weaponName: 'Dark Scepter',
        hp: 90, speed: 100, mp: 130, mpRegen: 4,
        passive: { name: 'Dark Wisdom', desc: '10% killed enemies rise as allies 8s', stat: 'necro' },
        tactical: {
            id: 'life_drain', name: 'Life Drain', icon: '💀',
            desc: 'Steal 30 HP from nearby enemies', mpCost: 30, cd: 6, range: 80, healAmt: 30
        },
        ultimate: {
            id: 'phoenix_summon', name: 'Sacred Phoenix', icon: '🔥',
            desc: 'Summon Phụng — fire AoE + heal', duration: 10, dmg: 25
        },
        dodgeTrail: '#5588ff'
    },
    {
        id: 'ranger', name: 'Huang Zhong', title: 'The Veteran Archer', element: 'WOOD',
        colors: { body: '#556633', accent: '#aacc44', glow: '#88ff22', hair: '#333311' },
        startWeapon: 'wood_shuriken', weaponIcon: '🌟', weaponName: 'Wind Shuriken',
        hp: 85, speed: 105, mp: 100, mpRegen: 3,
        passive: { name: 'Eagle Eye', desc: 'Range +30%, DMG scales with distance', stat: 'eagleEye' },
        tactical: {
            id: 'arrow_rain', name: 'Arrow Rain', icon: '🎯',
            desc: 'Shuriken barrage rains down AoE', mpCost: 30, cd: 6, range: 120, dmg: 8, count: 12
        },
        ultimate: {
            id: 'shuriken_storm', name: 'Shuriken Storm', icon: '🌀',
            desc: 'Whirlwind of 20 homing shuriken', dmg: 20, count: 20, duration: 4
        },
        dodgeTrail: '#88ff22'
    }
];

// --- Equipment Definitions ---
const EQUIPMENT_DEFS = [
    // ARMOR (slot: 'armor')
    { id: 'cloth_armor', name: 'Cloth Armor', rarity: 0, slot: 'armor', hp: 10, def: 0.05, desc: '+10 HP, -5% dmg taken' },
    { id: 'chain_mail', name: 'Chain Mail', rarity: 1, slot: 'armor', hp: 20, def: 0.10, desc: '+20 HP, -10% dmg taken' },
    { id: 'tiger_plate', name: 'Tiger General Plate', rarity: 2, slot: 'armor', hp: 30, def: 0.15, desc: '+30 HP, -15% dmg taken' },
    { id: 'mandate_heaven', name: 'Mandate of Heaven', rarity: 3, slot: 'armor', hp: 50, def: 0.25, reflect: 0.05, desc: '+50 HP, -25% dmg, reflect 5%' },
    { id: 'dragon_scale', name: 'Dragon Scale Mail', rarity: 4, slot: 'armor', hp: 40, def: 0.20, hpRegen: 3, desc: '+40 HP, -20% dmg, +3 HP/s' },

    // TALISMAN (slot: 'talisman')
    { id: 'flame_charm', name: 'Flame Charm', rarity: 0, slot: 'talisman', procChance: 0.10, procType: 'burn', desc: '10% on hit: burn 3s' },
    { id: 'frost_jade', name: 'Frost Jade', rarity: 1, slot: 'talisman', procChance: 0.15, procType: 'slow', desc: '15% on hit: slow 30% 2s' },
    { id: 'thunder_seal', name: 'Thunder Seal', rarity: 2, slot: 'talisman', procChance: 0.12, procType: 'chain', desc: '12% on kill: chain lightning ×3' },
    { id: 'borrowed_arrows', name: 'Borrowed Arrows', rarity: 3, slot: 'talisman', procType: 'reflect_proj', desc: 'Archer arrows return to sender' },
    { id: 'void_stone', name: 'Void Stone', rarity: 4, slot: 'talisman', procChance: 0.05, procType: 'explode', desc: '5% on kill: enemy explodes AoE' },

    // MOUNT (slot: 'mount')
    { id: 'war_horse', name: 'War Horse', rarity: 0, slot: 'mount', speed: 0.15, desc: '+15% move speed' },
    { id: 'shadow_steed', name: 'Shadow Steed', rarity: 1, slot: 'mount', speed: 0.25, dodgeCdBonus: -0.2, desc: '+25% speed, -0.2s dodge CD' },
    { id: 'hex_mark', name: 'Hex Mark', rarity: 2, slot: 'mount', speed: 0.20, mpRegen: 2, desc: '+20% speed, +2 MP/s' },
    { id: 'red_hare', name: 'Red Hare', rarity: 3, slot: 'mount', speed: 0.40, fireTrail: true, desc: '+40% speed, fire trail on dodge' },
    { id: 'jade_qilin', name: 'Jade Qilin', rarity: 4, slot: 'mount', speed: 0.30, xpBonus: 0.50, desc: '+30% speed, +50% XP' },
];

const RARITY_COLORS = ['#888888', '#44ff44', '#4488ff', '#ffd700', '#ff4444'];
const RARITY_NAMES = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Sacred'];

// --- Companion Definitions (linked to bonds) ---
const COMPANION_DEFS = {
    'Liu Bei': { behavior: 'tank', hp: 60, dmg: 8, atkRate: 1.5, range: 20, speed: 75, color: '#ff4444' },
    'Guan Yu': { behavior: 'melee', hp: 80, dmg: 15, atkRate: 1.2, range: 20, speed: 80, color: '#ff6644' },
    'Zhang Fei': { behavior: 'melee', hp: 70, dmg: 12, atkRate: 1.0, range: 20, speed: 90, color: '#ff8844' },
    'Zhuge Liang': { behavior: 'ranged', hp: 40, dmg: 20, atkRate: 2.0, range: 120, speed: 60, color: '#44ff44' },
    'Pang Tong': { behavior: 'ranged', hp: 35, dmg: 15, atkRate: 1.8, range: 100, speed: 65, color: '#88ff44' },
    'Ma Chao': { behavior: 'melee', hp: 50, dmg: 18, atkRate: 0.8, range: 20, speed: 110, color: '#ffaa44' },
    'Cao Cao': { behavior: 'ranged', hp: 50, dmg: 14, atkRate: 1.5, range: 100, speed: 70, color: '#4488ff' },
    'Sima Yi': { behavior: 'ranged', hp: 45, dmg: 22, atkRate: 2.2, range: 130, speed: 55, color: '#5588ff' },
    'Guo Jia': { behavior: 'ranged', hp: 35, dmg: 18, atkRate: 1.8, range: 110, speed: 60, color: '#6688ff' },
    'Xu Chu': { behavior: 'tank', hp: 100, dmg: 10, atkRate: 2.0, range: 20, speed: 50, color: '#4466cc' },
    'Zhang Liao': { behavior: 'melee', hp: 60, dmg: 14, atkRate: 1.0, range: 20, speed: 95, color: '#5577dd' },
    'Zhou Yu': { behavior: 'ranged', hp: 45, dmg: 16, atkRate: 1.5, range: 100, speed: 70, color: '#ff6600' },
    'Huang Gai': { behavior: 'tank', hp: 90, dmg: 8, atkRate: 2.0, range: 20, speed: 55, color: '#ff4400' },
    'Sun Ce': { behavior: 'melee', hp: 55, dmg: 16, atkRate: 0.9, range: 20, speed: 100, color: '#44dd44' },
    'Zhou Tai': { behavior: 'tank', hp: 90, dmg: 8, atkRate: 1.8, range: 20, speed: 60, color: '#22aa22' },
    'Huang Zhong': { behavior: 'ranged', hp: 55, dmg: 20, atkRate: 1.5, range: 140, speed: 55, color: '#aacc44' },
    'Zhao Yun': { behavior: 'melee', hp: 70, dmg: 14, atkRate: 1.0, range: 20, speed: 100, color: '#ddaa44' },
    'Huang Zhong': { behavior: 'ranged', hp: 55, dmg: 20, atkRate: 1.5, range: 140, speed: 55, color: '#aacc44' },
};

// --- Sacred Beast: Phụng (Phoenix) ---
const SACRED_BEASTS = {
    phoenix: {
        id: 'phoenix', name: 'Phụng', title: 'Sacred Phoenix', element: 'FIRE',
        colors: { body: '#ff4400', accent: '#ffd700', glow: '#ff8800' },
        orbitRadius: 35, orbitSpeed: 2.5,
        attackRate: 1.8, attackRange: 120, boltSpeed: 130, boltDmg: 12,
        affinityThresholds: {
            50: { homing: true, desc: 'Fire bolts become homing' },
            75: { attackRate: 1.2, desc: 'Attack speed increased' },
            100: { revive: true, reviveHeal: 1.0, explodeDmg: 80, explodeRange: 100, desc: 'Revive on death + fire explosion' }
        }
    }
};

// --- Skill Execution Helpers (used by game.js) ---
function getHeroDef(heroId) {
    return HEROES.find(h => h.id === heroId) || HEROES[0];
}

function getEquipmentByRarity(maxRarity) {
    const pool = EQUIPMENT_DEFS.filter(e => e.rarity <= maxRarity);
    // Weight toward lower rarities
    const weighted = [];
    pool.forEach(e => {
        const weight = Math.max(1, 5 - e.rarity); // Common=5, Sacred=1
        for (let i = 0; i < weight; i++) weighted.push(e);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
}

function getCompanionsForBond(bondId) {
    const bond = BONDS.find(b => b.id === bondId);
    if (!bond) return [];
    return bond.heroes.slice(0, 2).map(name => {
        const def = COMPANION_DEFS[name];
        if (!def) return null;
        return { ...def, name, bondId };
    }).filter(Boolean);
}
