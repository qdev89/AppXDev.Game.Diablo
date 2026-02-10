// ═══════════════════════════════════════════════════════════════
// K002: Wu Xing Blessing System — Hades-style Boon System
// Five elemental deities offer themed blessings that define builds
// ═══════════════════════════════════════════════════════════════

// --- Wu Xing Deities ---
const WU_XING_DEITIES = {
    WOOD: {
        name: { vi: 'Thần Nông', en: 'Shennong' },
        title: { vi: 'Thần Cây Cỏ', en: 'God of Harvest' },
        icon: '🌿', color: '#44dd44', light: '#88ff88',
        element: 'WOOD',
        greeting: { vi: 'Sức mạnh cây cỏ sẽ che chở ngươi!', en: 'The forest shall protect you!' }
    },
    FIRE: {
        name: { vi: 'Chúc Dung', en: 'Zhurong' },
        title: { vi: 'Thần Lửa', en: 'God of Fire' },
        icon: '🔥', color: '#ff4400', light: '#ff8844',
        element: 'FIRE',
        greeting: { vi: 'Ngọn lửa thiêng sẽ đốt cháy kẻ thù!', en: 'Sacred flame shall burn your foes!' }
    },
    EARTH: {
        name: { vi: 'Hậu Thổ', en: 'Houtu' },
        title: { vi: 'Thần Đất', en: 'Goddess of Earth' },
        icon: '⛰️', color: '#cc8833', light: '#ddaa55',
        element: 'EARTH',
        greeting: { vi: 'Đất mẹ sẽ ban cho ngươi sức mạnh!', en: 'The earth shall grant you strength!' }
    },
    METAL: {
        name: { vi: 'Bạch Hổ', en: 'Bai Hu' },
        title: { vi: 'Thần Kim', en: 'White Tiger' },
        icon: '⚔️', color: '#cccccc', light: '#eeeeff',
        element: 'METAL',
        greeting: { vi: 'Lưỡi kiếm sắc bén sẽ chém tan mọi thứ!', en: 'The blade shall cut through all!' }
    },
    WATER: {
        name: { vi: 'Cung Công', en: 'Gonggong' },
        title: { vi: 'Thần Nước', en: 'God of Water' },
        icon: '🌊', color: '#4488ff', light: '#88bbff',
        element: 'WATER',
        greeting: { vi: 'Dòng nước sẽ cuốn trôi kẻ thù!', en: 'The tide shall sweep away your enemies!' }
    }
};

// --- Blessing Definitions ---
const BLESSINGS = [
    // ═══ WOOD (Healing / Thorns / Poison) ═══
    {
        id: 'wood_heal_on_kill', deity: 'WOOD', rarity: 'common',
        name: { vi: 'Hồi Sinh Rừng', en: 'Forest Recovery' },
        desc: { vi: 'Hồi 3 HP mỗi lần hạ gục', en: 'Heal 3 HP per kill' },
        icon: '🌱', effect: { type: 'heal_on_kill', value: 3 }
    },
    {
        id: 'wood_thorns', deity: 'WOOD', rarity: 'common',
        name: { vi: 'Gai Rừng', en: 'Forest Thorns' },
        desc: { vi: 'Phản 15% sát thương nhận', en: 'Reflect 15% damage taken' },
        icon: '🌵', effect: { type: 'thorns', value: 0.15 }
    },
    {
        id: 'wood_regen', deity: 'WOOD', rarity: 'rare',
        name: { vi: 'Hơi Thở Rừng', en: 'Forest Breath' },
        desc: { vi: 'Hồi 1 HP mỗi 3 giây', en: 'Regenerate 1 HP every 3s' },
        icon: '🍃', effect: { type: 'regen', value: 1, interval: 3 }
    },
    {
        id: 'wood_poison', deity: 'WOOD', rarity: 'rare',
        name: { vi: 'Độc Tố Rừng', en: 'Forest Toxin' },
        desc: { vi: 'Tấn công gây độc (3 sát thương/giây, 3 giây)', en: 'Attacks poison enemies (3 DPS for 3s)' },
        icon: '☠️', effect: { type: 'poison', dps: 3, duration: 3 }
    },
    {
        id: 'wood_max_hp', deity: 'WOOD', rarity: 'epic',
        name: { vi: 'Cây Đời', en: 'Tree of Life' },
        desc: { vi: '+50 HP tối đa, hồi đầy máu', en: '+50 Max HP, full heal' },
        icon: '🌳', effect: { type: 'max_hp_boost', value: 50, fullHeal: true }
    },

    // ═══ FIRE (Damage / Burn / Explosions) ═══
    {
        id: 'fire_bonus_dmg', deity: 'FIRE', rarity: 'common',
        name: { vi: 'Lửa Thiêng', en: 'Sacred Flame' },
        desc: { vi: '+20% sát thương', en: '+20% damage' },
        icon: '🔥', effect: { type: 'dmg_mult', value: 0.20 }
    },
    {
        id: 'fire_burn', deity: 'FIRE', rarity: 'common',
        name: { vi: 'Thiêu Đốt', en: 'Ignite' },
        desc: { vi: 'Tấn công gây cháy (5 sát thương/giây, 2 giây)', en: 'Attacks burn (5 DPS for 2s)' },
        icon: '🔻', effect: { type: 'burn', dps: 5, duration: 2 }
    },
    {
        id: 'fire_explosion', deity: 'FIRE', rarity: 'rare',
        name: { vi: 'Nổ Tung', en: 'Explosion' },
        desc: { vi: '15% cơ hội gây nổ AoE khi hạ gục', en: '15% chance AoE explosion on kill' },
        icon: '💥', effect: { type: 'explosion_on_kill', chance: 0.15, radius: 60, dmg: 20 }
    },
    {
        id: 'fire_crit', deity: 'FIRE', rarity: 'rare',
        name: { vi: 'Ngọn Lửa Cuồng', en: 'Fury Flame' },
        desc: { vi: '+15% cơ hội chí mạng', en: '+15% crit chance' },
        icon: '⚡', effect: { type: 'crit_chance', value: 0.15 }
    },
    {
        id: 'fire_inferno', deity: 'FIRE', rarity: 'epic',
        name: { vi: 'Hỏa Ngục', en: 'Inferno' },
        desc: { vi: 'Aura lửa gây 8 sát thương/giây cho kẻ thù gần', en: 'Fire aura deals 8 DPS to nearby enemies' },
        icon: '🌋', effect: { type: 'fire_aura', dps: 8, radius: 50 }
    },

    // ═══ EARTH (Armor / Stun / Shields) ═══
    {
        id: 'earth_armor', deity: 'EARTH', rarity: 'common',
        name: { vi: 'Da Đá', en: 'Stone Skin' },
        desc: { vi: 'Giảm 15% sát thương nhận', en: '-15% damage taken' },
        icon: '🛡️', effect: { type: 'dmg_reduction', value: 0.15 }
    },
    {
        id: 'earth_stun', deity: 'EARTH', rarity: 'common',
        name: { vi: 'Chấn Động', en: 'Tremor' },
        desc: { vi: '10% cơ hội choáng kẻ thù 1 giây', en: '10% chance to stun enemy 1s' },
        icon: '💫', effect: { type: 'stun_chance', chance: 0.10, duration: 1 }
    },
    {
        id: 'earth_shield', deity: 'EARTH', rarity: 'rare',
        name: { vi: 'Khiên Đất', en: 'Earth Shield' },
        desc: { vi: 'Mỗi 20 giây, hấp thụ 1 đòn đánh', en: 'Every 20s, absorb 1 hit' },
        icon: '🔶', effect: { type: 'shield', interval: 20 }
    },
    {
        id: 'earth_knockback', deity: 'EARTH', rarity: 'rare',
        name: { vi: 'Lực Đẩy', en: 'Repulse' },
        desc: { vi: '+50% lực đẩy kẻ thù', en: '+50% knockback force' },
        icon: '💨', effect: { type: 'knockback_mult', value: 0.50 }
    },
    {
        id: 'earth_fortress', deity: 'EARTH', rarity: 'epic',
        name: { vi: 'Thành Trì', en: 'Fortress' },
        desc: { vi: '+30 HP tối đa, -25% sát thương nhận', en: '+30 Max HP, -25% damage taken' },
        icon: '🏯', effect: { type: 'fortress', hpBoost: 30, dmgReduction: 0.25 }
    },

    // ═══ METAL (Speed / Pierce / Bleed) ═══
    {
        id: 'metal_speed', deity: 'METAL', rarity: 'common',
        name: { vi: 'Tốc Kiếm', en: 'Swift Blade' },
        desc: { vi: '+15% tốc độ di chuyển', en: '+15% move speed' },
        icon: '💨', effect: { type: 'speed_mult', value: 0.15 }
    },
    {
        id: 'metal_pierce', deity: 'METAL', rarity: 'common',
        name: { vi: 'Xuyên Giáp', en: 'Armor Pierce' },
        desc: { vi: 'Đạn xuyên qua thêm 1 kẻ thù', en: 'Projectiles pierce +1 enemy' },
        icon: '🔪', effect: { type: 'pierce', value: 1 }
    },
    {
        id: 'metal_bleed', deity: 'METAL', rarity: 'rare',
        name: { vi: 'Chảy Máu', en: 'Hemorrhage' },
        desc: { vi: 'Tấn công gây chảy máu (4 sát thương/giây, 3 giây)', en: 'Attacks cause bleed (4 DPS for 3s)' },
        icon: '🩸', effect: { type: 'bleed', dps: 4, duration: 3 }
    },
    {
        id: 'metal_attack_speed', deity: 'METAL', rarity: 'rare',
        name: { vi: 'Loạn Kiếm', en: 'Flurry' },
        desc: { vi: '+20% tốc độ tấn công', en: '+20% attack speed' },
        icon: '⚡', effect: { type: 'attack_speed', value: 0.20 }
    },
    {
        id: 'metal_execute', deity: 'METAL', rarity: 'epic',
        name: { vi: 'Xử Tử', en: 'Execute' },
        desc: { vi: 'Hạ gục ngay kẻ thù dưới 15% HP', en: 'Instantly kill enemies below 15% HP' },
        icon: '💀', effect: { type: 'execute_threshold', value: 0.15 }
    },

    // ═══ WATER (Freeze / Life Steal / Wave Clear) ═══
    {
        id: 'water_slow', deity: 'WATER', rarity: 'common',
        name: { vi: 'Băng Giá', en: 'Frost' },
        desc: { vi: 'Tấn công làm chậm kẻ thù 30%', en: 'Attacks slow enemies by 30%' },
        icon: '❄️', effect: { type: 'slow', value: 0.30 }
    },
    {
        id: 'water_lifesteal', deity: 'WATER', rarity: 'common',
        name: { vi: 'Hút Máu', en: 'Life Steal' },
        desc: { vi: 'Hồi 5% sát thương gây ra thành HP', en: 'Heal 5% of damage dealt' },
        icon: '💧', effect: { type: 'lifesteal', value: 0.05 }
    },
    {
        id: 'water_freeze', deity: 'WATER', rarity: 'rare',
        name: { vi: 'Đóng Băng', en: 'Deep Freeze' },
        desc: { vi: '8% cơ hội đóng băng kẻ thù 2 giây', en: '8% chance to freeze enemy 2s' },
        icon: '🧊', effect: { type: 'freeze_chance', chance: 0.08, duration: 2 }
    },
    {
        id: 'water_wave', deity: 'WATER', rarity: 'rare',
        name: { vi: 'Sóng Thần', en: 'Tsunami' },
        desc: { vi: 'Mỗi 15 giây, sóng quét 80 sát thương', en: 'Every 15s, wave deals 80 AoE damage' },
        icon: '🌊', effect: { type: 'tidal_wave', interval: 15, dmg: 80, radius: 120 }
    },
    {
        id: 'water_ice_armor', deity: 'WATER', rarity: 'epic',
        name: { vi: 'Giáp Băng', en: 'Ice Armor' },
        desc: { vi: 'Đóng băng kẻ thù tấn công bạn 1 giây, -20% sát thương nhận', en: 'Freeze attackers 1s, -20% damage taken' },
        icon: '🏔️', effect: { type: 'ice_armor', freezeDuration: 1, dmgReduction: 0.20 }
    }
];

// --- Duo Blessings (combining 2 elements) ---
const DUO_BLESSINGS = [
    {
        id: 'duo_fire_wood', elements: ['FIRE', 'WOOD'], rarity: 'epic',
        name: { vi: 'Cháy Rừng', en: 'Wildfire' },
        desc: { vi: 'Kẻ thù bị đốt lan sang kẻ thù gần', en: 'Burning enemies spread fire to nearby foes' },
        icon: '🔥🌿', effect: { type: 'spreading_burn', radius: 40, dmg: 3 },
        requires: ['FIRE', 'WOOD']
    },
    {
        id: 'duo_water_metal', elements: ['WATER', 'METAL'], rarity: 'epic',
        name: { vi: 'Kiếm Băng', en: 'Frost Blade' },
        desc: { vi: '+30% sát thương lên kẻ thù bị chậm/đóng băng', en: '+30% damage to slowed/frozen enemies' },
        icon: '❄️⚔️', effect: { type: 'frozen_bonus_dmg', value: 0.30 },
        requires: ['WATER', 'METAL']
    },
    {
        id: 'duo_earth_fire', elements: ['EARTH', 'FIRE'], rarity: 'epic',
        name: { vi: 'Dung Nham', en: 'Magma' },
        desc: { vi: 'Tạo vùng dung nham khi né, gây 10 sát thương/giây', en: 'Leave magma trail on dodge, 10 DPS' },
        icon: '⛰️🔥', effect: { type: 'magma_trail', dps: 10, duration: 3 },
        requires: ['EARTH', 'FIRE']
    }
];

// --- Set Bonuses (3+ blessings of same element) ---
const ELEMENT_SET_BONUSES = {
    WOOD: { name: { vi: 'Rừng Thiêng', en: 'Sacred Grove' }, desc: { vi: '+30% hiệu quả hồi máu', en: '+30% healing effectiveness' }, effect: { healMult: 0.30 } },
    FIRE: { name: { vi: 'Luyện Ngục', en: 'Purgatory' }, desc: { vi: '+25% sát thương DoT', en: '+25% DoT damage' }, effect: { dotMult: 0.25 } },
    EARTH: { name: { vi: 'Bất Khả Xâm Phạm', en: 'Unbreakable' }, desc: { vi: '+20 HP tối đa, giảm thêm 10% sát thương', en: '+20 Max HP, -10% extra damage reduction' }, effect: { hpBoost: 20, dmgReduction: 0.10 } },
    METAL: { name: { vi: 'Bách Kiếm', en: 'Hundred Blades' }, desc: { vi: '+10% tốc độ tấn công, +10% chí mạng', en: '+10% attack speed, +10% crit' }, effect: { atkSpd: 0.10, crit: 0.10 } },
    WATER: { name: { vi: 'Thuỷ Triều', en: 'Tidal Force' }, desc: { vi: '+15% hút máu, chậm thêm 15%', en: '+15% lifesteal, +15% slow' }, effect: { lifesteal: 0.15, slow: 0.15 } }
};

// --- Blessing State Manager ---
const BlessingState = {
    active: [],          // Active blessings for this run [{id, deity, rarity, effect, ...}]
    affinity: { WOOD: 0, FIRE: 0, EARTH: 0, METAL: 0, WATER: 0 }, // Count per element
    setBonuses: [],      // Active set bonus element names
    duoBlessings: [],    // Active duo blessing ids
    regenTimer: 0,       // For regen blessing
    shieldTimer: 0,      // For shield blessing
    shieldActive: false,
    waveTimer: 0,        // For tidal wave blessing
    auraTimer: 0,        // For fire aura tick
};

function resetBlessings() {
    BlessingState.active = [];
    BlessingState.affinity = { WOOD: 0, FIRE: 0, EARTH: 0, METAL: 0, WATER: 0 };
    BlessingState.setBonuses = [];
    BlessingState.duoBlessings = [];
    BlessingState.regenTimer = 0;
    BlessingState.shieldTimer = 0;
    BlessingState.shieldActive = false;
    BlessingState.waveTimer = 0;
    BlessingState.auraTimer = 0;
}

// --- Add Blessing ---
function addBlessing(blessingDef) {
    // Don't add duplicates
    if (BlessingState.active.find(b => b.id === blessingDef.id)) return false;

    BlessingState.active.push(blessingDef);
    BlessingState.affinity[blessingDef.deity]++;

    // Apply immediate effects
    const eff = blessingDef.effect;
    switch (eff.type) {
        case 'max_hp_boost':
            P.maxHp += eff.value;
            if (eff.fullHeal) P.hp = P.maxHp;
            else P.hp = Math.min(P.hp + eff.value, P.maxHp);
            break;
        case 'speed_mult':
            P.speed *= (1 + eff.value);
            break;
        case 'fortress':
            P.maxHp += eff.hpBoost;
            P.hp = Math.min(P.hp + eff.hpBoost, P.maxHp);
            break;
    }

    // Check set bonuses
    checkSetBonuses();
    // Check duo blessings
    checkDuoBlessings();

    return true;
}

// --- Check Set Bonuses ---
function checkSetBonuses() {
    BlessingState.setBonuses = [];
    for (const el of ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER']) {
        if (BlessingState.affinity[el] >= 3 && !BlessingState.setBonuses.includes(el)) {
            BlessingState.setBonuses.push(el);
            // Apply set bonus immediate effects
            const bonus = ELEMENT_SET_BONUSES[el];
            if (bonus.effect.hpBoost) {
                P.maxHp += bonus.effect.hpBoost;
                P.hp = Math.min(P.hp + bonus.effect.hpBoost, P.maxHp);
            }
        }
    }
}

// --- Check Duo Blessings ---
function checkDuoBlessings() {
    for (const duo of DUO_BLESSINGS) {
        if (BlessingState.duoBlessings.includes(duo.id)) continue;
        const hasAll = duo.requires.every(el => BlessingState.affinity[el] >= 1);
        if (hasAll) {
            BlessingState.duoBlessings.push(duo.id);
            // Could announce duo blessing unlock
            if (typeof G !== 'undefined') {
                G.floorAnnounce = {
                    text: '✨ DUO BLESSING ✨',
                    subtitle: duo.name[G.lang || 'vi'],
                    timer: 2.5,
                    color: '#ffd700'
                };
            }
        }
    }
}

// --- Get Aggregate Blessing Stats ---
function getBlessingStats() {
    const stats = {
        dmgMult: 0, dmgReduction: 0, critChance: 0, attackSpeed: 0,
        lifesteal: 0, healOnKill: 0, slowAmount: 0, pierce: 0,
        knockbackMult: 0, executeThreshold: 0,
        hasThorns: false, thornsValue: 0,
        hasRegen: false, regenValue: 0, regenInterval: 3,
        hasPoison: false, poisonDps: 0, poisonDuration: 0,
        hasBurn: false, burnDps: 0, burnDuration: 0,
        hasBleed: false, bleedDps: 0, bleedDuration: 0,
        hasExplosion: false, explosionChance: 0, explosionRadius: 0, explosionDmg: 0,
        hasStun: false, stunChance: 0, stunDuration: 0,
        hasFreeze: false, freezeChance: 0, freezeDuration: 0,
        hasShield: false, shieldInterval: 20,
        hasFireAura: false, fireAuraDps: 0, fireAuraRadius: 0,
        hasTidalWave: false, waveInterval: 15, waveDmg: 0, waveRadius: 0,
        hasIceArmor: false, iceArmorFreeze: 0,
    };

    for (const b of BlessingState.active) {
        const e = b.effect;
        switch (e.type) {
            case 'dmg_mult': stats.dmgMult += e.value; break;
            case 'dmg_reduction': stats.dmgReduction += e.value; break;
            case 'crit_chance': stats.critChance += e.value; break;
            case 'attack_speed': stats.attackSpeed += e.value; break;
            case 'lifesteal': stats.lifesteal += e.value; break;
            case 'heal_on_kill': stats.healOnKill += e.value; break;
            case 'slow': stats.slowAmount = Math.max(stats.slowAmount, e.value); break;
            case 'pierce': stats.pierce += e.value; break;
            case 'knockback_mult': stats.knockbackMult += e.value; break;
            case 'execute_threshold': stats.executeThreshold = Math.max(stats.executeThreshold, e.value); break;
            case 'thorns': stats.hasThorns = true; stats.thornsValue += e.value; break;
            case 'regen': stats.hasRegen = true; stats.regenValue += e.value; stats.regenInterval = e.interval; break;
            case 'poison': stats.hasPoison = true; stats.poisonDps += e.dps; stats.poisonDuration = Math.max(stats.poisonDuration, e.duration); break;
            case 'burn': stats.hasBurn = true; stats.burnDps += e.dps; stats.burnDuration = Math.max(stats.burnDuration, e.duration); break;
            case 'bleed': stats.hasBleed = true; stats.bleedDps += e.dps; stats.bleedDuration = Math.max(stats.bleedDuration, e.duration); break;
            case 'explosion_on_kill': stats.hasExplosion = true; stats.explosionChance = Math.max(stats.explosionChance, e.chance); stats.explosionRadius = Math.max(stats.explosionRadius, e.radius); stats.explosionDmg += e.dmg; break;
            case 'stun_chance': stats.hasStun = true; stats.stunChance = Math.max(stats.stunChance, e.chance); stats.stunDuration = Math.max(stats.stunDuration, e.duration); break;
            case 'freeze_chance': stats.hasFreeze = true; stats.freezeChance = Math.max(stats.freezeChance, e.chance); stats.freezeDuration = Math.max(stats.freezeDuration, e.duration); break;
            case 'shield': stats.hasShield = true; stats.shieldInterval = Math.min(stats.shieldInterval, e.interval); break;
            case 'fire_aura': stats.hasFireAura = true; stats.fireAuraDps += e.dps; stats.fireAuraRadius = Math.max(stats.fireAuraRadius, e.radius); break;
            case 'tidal_wave': stats.hasTidalWave = true; stats.waveInterval = Math.min(stats.waveInterval, e.interval); stats.waveDmg += e.dmg; stats.waveRadius = Math.max(stats.waveRadius, e.radius); break;
            case 'ice_armor': stats.hasIceArmor = true; stats.iceArmorFreeze = Math.max(stats.iceArmorFreeze, e.freezeDuration); stats.dmgReduction += e.dmgReduction; break;
            case 'fortress': stats.dmgReduction += e.dmgReduction; break;
        }
    }

    // Apply set bonuses
    for (const el of BlessingState.setBonuses) {
        const bonus = ELEMENT_SET_BONUSES[el].effect;
        if (bonus.healMult) stats.healOnKill *= (1 + bonus.healMult);
        if (bonus.dotMult) { stats.poisonDps *= (1 + bonus.dotMult); stats.burnDps *= (1 + bonus.dotMult); stats.bleedDps *= (1 + bonus.dotMult); }
        if (bonus.dmgReduction) stats.dmgReduction += bonus.dmgReduction;
        if (bonus.atkSpd) stats.attackSpeed += bonus.atkSpd;
        if (bonus.crit) stats.critChance += bonus.crit;
        if (bonus.lifesteal) stats.lifesteal += bonus.lifesteal;
        if (bonus.slow) stats.slowAmount += bonus.slow;
    }

    return stats;
}

// --- Update Blessings (called every frame) ---
function updateBlessings(dt) {
    const stats = getBlessingStats();

    // Regen
    if (stats.hasRegen) {
        BlessingState.regenTimer += dt;
        if (BlessingState.regenTimer >= stats.regenInterval) {
            BlessingState.regenTimer -= stats.regenInterval;
            P.hp = Math.min(P.hp + stats.regenValue, P.maxHp);
            spawnParticles(P.x, P.y, '#44dd44', 3, 20);
        }
    }

    // Shield refresh
    if (stats.hasShield) {
        BlessingState.shieldTimer += dt;
        if (BlessingState.shieldTimer >= stats.shieldInterval) {
            BlessingState.shieldTimer -= stats.shieldInterval;
            BlessingState.shieldActive = true;
            spawnParticles(P.x, P.y, '#cc8833', 8, 30);
        }
    }

    // Fire aura
    if (stats.hasFireAura) {
        BlessingState.auraTimer += dt;
        if (BlessingState.auraTimer >= 0.5) { // tick every 0.5s
            BlessingState.auraTimer -= 0.5;
            for (const e of G.enemies) {
                if (e.dead) continue;
                const dist = Math.hypot(e.x - P.x, e.y - P.y);
                if (dist <= stats.fireAuraRadius) {
                    e.hp -= stats.fireAuraDps * 0.5;
                    e.flash = 0.1;
                }
            }
        }
    }

    // Tidal Wave
    if (stats.hasTidalWave) {
        BlessingState.waveTimer += dt;
        if (BlessingState.waveTimer >= stats.waveInterval) {
            BlessingState.waveTimer -= stats.waveInterval;
            // Damage all enemies in radius
            for (const e of G.enemies) {
                if (e.dead) continue;
                const dist = Math.hypot(e.x - P.x, e.y - P.y);
                if (dist <= stats.waveRadius) {
                    e.hp -= stats.waveDmg;
                    e.flash = 0.2;
                    e.knockX += (e.x - P.x) / dist * 5;
                    e.knockY += (e.y - P.y) / dist * 5;
                }
            }
            // VFX
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: stats.waveRadius, speed: 300,
                color: '#4488ff', alpha: 0.5, lineWidth: 3, timer: 0.4
            });
            spawnParticles(P.x, P.y, '#4488ff', 15, 60);
            if (typeof SFX !== 'undefined' && SFX.splash) SFX.splash();
        }
    }
}

// --- Generate Blessing Choices (for level-up or room rewards) ---
function generateBlessingChoices(count, guaranteedElement) {
    count = count || 3;
    const available = BLESSINGS.filter(b => {
        // Don't offer already-active blessings
        if (BlessingState.active.find(a => a.id === b.id)) return false;
        return true;
    });

    const choices = [];

    // If guaranteedElement, try to add one of that element
    if (guaranteedElement) {
        const elBlessings = available.filter(b => b.deity === guaranteedElement);
        if (elBlessings.length > 0) {
            const pick = elBlessings[Math.floor(Math.random() * elBlessings.length)];
            choices.push(pick);
        }
    }

    // Fill remaining with random (weighted by rarity)
    const remaining = available.filter(b => !choices.find(c => c.id === b.id));
    while (choices.length < count && remaining.length > 0) {
        // Weight: common 60%, rare 30%, epic 10%
        const weights = remaining.map(b => b.rarity === 'common' ? 6 : b.rarity === 'rare' ? 3 : 1);
        const totalW = weights.reduce((s, w) => s + w, 0);
        let r = Math.random() * totalW;
        for (let i = 0; i < remaining.length; i++) {
            r -= weights[i];
            if (r <= 0) {
                choices.push(remaining[i]);
                remaining.splice(i, 1);
                break;
            }
        }
    }

    // Check if any duo blessings should appear
    for (const duo of DUO_BLESSINGS) {
        if (BlessingState.duoBlessings.includes(duo.id)) continue;
        if (choices.length >= count) break;
        const hasAll = duo.requires.every(el => BlessingState.affinity[el] >= 1);
        if (hasAll && Math.random() < 0.3) {
            choices.push({ ...duo, deity: duo.elements[0], isDuo: true });
        }
    }

    return choices.slice(0, count);
}

// --- Apply Blessing On-Hit Effects ---
function applyBlessingOnHit(enemy, damageDealt) {
    const stats = getBlessingStats();

    // Slow
    if (stats.slowAmount > 0 && !enemy.blessed_slow) {
        enemy.blessed_slow = stats.slowAmount;
        enemy.speed *= (1 - stats.slowAmount);
    }

    // Stun
    if (stats.hasStun && Math.random() < stats.stunChance) {
        enemy.stunTimer = (enemy.stunTimer || 0) + stats.stunDuration;
    }

    // Freeze
    if (stats.hasFreeze && Math.random() < stats.freezeChance) {
        enemy.frozenTimer = (enemy.frozenTimer || 0) + stats.freezeDuration;
        spawnParticles(enemy.x, enemy.y, '#88ccff', 5, 20);
    }

    // Poison
    if (stats.hasPoison) {
        enemy.poisonTimer = stats.poisonDuration;
        enemy.poisonDps = stats.poisonDps;
    }

    // Burn
    if (stats.hasBurn) {
        enemy.burnTimer = stats.burnDuration;
        enemy.burnDps = stats.burnDps;
    }

    // Bleed
    if (stats.hasBleed) {
        enemy.bleedTimer = stats.bleedDuration;
        enemy.bleedDps = stats.bleedDps;
    }

    // Life steal
    if (stats.lifesteal > 0) {
        const heal = Math.ceil(damageDealt * stats.lifesteal);
        P.hp = Math.min(P.hp + heal, P.maxHp);
    }

    // Execute
    if (stats.executeThreshold > 0 && enemy.hp > 0 && enemy.hp / enemy.maxHp <= stats.executeThreshold) {
        enemy.hp = 0;
        spawnDmgNum(enemy.x, enemy.y - 15, 'EXECUTE!', '#cc44ff', true);
    }
}

// --- Apply Blessing On-Kill Effects ---
function applyBlessingOnKill(enemy) {
    const stats = getBlessingStats();

    // Heal on kill
    if (stats.healOnKill > 0) {
        P.hp = Math.min(P.hp + stats.healOnKill, P.maxHp);
        spawnParticles(P.x, P.y, '#44dd44', 2, 15);
    }

    // Explosion on kill
    if (stats.hasExplosion && Math.random() < stats.explosionChance) {
        for (const e2 of G.enemies) {
            if (e2.dead || e2 === enemy) continue;
            const dist = Math.hypot(e2.x - enemy.x, e2.y - enemy.y);
            if (dist <= stats.explosionRadius) {
                e2.hp -= stats.explosionDmg;
                e2.flash = 0.15;
                const pushDist = 3;
                e2.knockX += (e2.x - enemy.x) / dist * pushDist;
                e2.knockY += (e2.y - enemy.y) / dist * pushDist;
            }
        }
        // Explosion VFX
        spawnParticles(enemy.x, enemy.y, '#ff4400', 12, 40);
        spawnParticles(enemy.x, enemy.y, '#ffaa00', 8, 30);
        G.skillEffects.push({
            type: 'shockwave', x: enemy.x, y: enemy.y,
            radius: 5, maxRadius: stats.explosionRadius, speed: 250,
            color: '#ff4400', alpha: 0.4, lineWidth: 2, timer: 0.3
        });
        shake(2, 0.1);
    }

    // Spreading burn (Duo: Fire+Wood)
    if (BlessingState.duoBlessings.includes('duo_fire_wood') && (enemy.burnTimer > 0 || enemy.burnDps > 0)) {
        for (const e2 of G.enemies) {
            if (e2.dead || e2 === enemy) continue;
            const dist = Math.hypot(e2.x - enemy.x, e2.y - enemy.y);
            if (dist <= 40) {
                e2.burnTimer = 2;
                e2.burnDps = 3;
            }
        }
    }
}

// --- Apply Blessing Damage Modifiers ---
function getBlessingDamageMult() {
    const stats = getBlessingStats();
    let mult = 1 + stats.dmgMult;

    // Crit check
    if (stats.critChance > 0 && Math.random() < stats.critChance) {
        mult *= 2; // 2x crit damage
    }

    // Frozen bonus (Duo: Water+Metal)
    // Applied in combat logic

    return mult;
}

// --- Apply Blessing Damage Reduction ---
function getBlessingDamageReduction() {
    const stats = getBlessingStats();
    return Math.min(stats.dmgReduction, 0.75); // Cap at 75% reduction
}
