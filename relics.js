// ============================================================
// DYNASTY BRUHHH DUNGEON - Heirloom Relics (S003)
// ============================================================
// Powerful, run-defining passive items. One relic per run.
// Found in boss drops or treasure rooms.
// ============================================================

const HEIRLOOM_RELICS = [
    // ═══ OFFENSIVE RELICS ═══
    {
        id: 'relic_sky_piercer', rarity: 'legendary',
        name: { vi: 'Thương Trời', en: 'Sky Piercer' },
        desc: { vi: '+50% sát thương, -30% tốc đánh', en: '+50% damage, -30% attack speed' },
        icon: '🗡️', color: '#ff4444',
        effect: { dmgMult: 0.50, atkSpeed: -0.30 }
    },
    {
        id: 'relic_blood_jade', rarity: 'legendary',
        name: { vi: 'Huyết Ngọc', en: 'Blood Jade' },
        desc: { vi: 'Mỗi hạ gục hồi 1% MaxHP, tăng sát thương theo combo', en: 'Each kill heals 1% MaxHP, +dmg per combo' },
        icon: '💎', color: '#cc0033',
        effect: { healOnKillPct: 0.01, comboDmgBonus: 0.001 }
    },
    {
        id: 'relic_dragon_pearl', rarity: 'legendary',
        name: { vi: 'Long Châu', en: 'Dragon Pearl' },
        desc: { vi: 'Mỗi 30 giây, triệu hồi rồng lửa quét AoE', en: 'Every 30s, summon fire dragon AoE sweep' },
        icon: '🐉', color: '#ff8800',
        effect: { dragonSummon: true, interval: 30, dragonDmg: 50, dragonRadius: 150 }
    },
    {
        id: 'relic_void_mirror', rarity: 'legendary',
        name: { vi: 'Gương Hư Vô', en: 'Void Mirror' },
        desc: { vi: '20% cơ hội phản chiếu đạn kẻ thù', en: '20% chance to reflect enemy projectiles' },
        icon: '🪞', color: '#8844cc',
        effect: { reflectChance: 0.20 }
    },

    // ═══ DEFENSIVE RELICS ═══
    {
        id: 'relic_tortoise_shell', rarity: 'legendary',
        name: { vi: 'Mai Rùa Thần', en: 'Sacred Tortoise Shell' },
        desc: { vi: '-40% sát thương nhận, +100 MaxHP', en: '-40% damage taken, +100 MaxHP' },
        icon: '🐢', color: '#44aaaa',
        effect: { dmgReduction: 0.40, maxHpBoost: 100 }
    },
    {
        id: 'relic_phoenix_feather', rarity: 'legendary',
        name: { vi: 'Lông Phượng', en: 'Phoenix Feather' },
        desc: { vi: '+2 Death Defiance, hồi 50% HP khi hồi sinh', en: '+2 Death Defiance, revive at 50% HP' },
        icon: '🪶', color: '#ff6600',
        effect: { extraLives: 2, reviveHpPct: 0.50 }
    },
    {
        id: 'relic_jade_emperor_seal', rarity: 'legendary',
        name: { vi: 'Ấn Ngọc Hoàng', en: "Jade Emperor's Seal" },
        desc: { vi: 'Mỗi blessing +5% tất cả stats', en: 'Each blessing gives +5% all stats' },
        icon: '📜', color: '#44ffaa',
        effect: { blessingStatBonus: 0.05 }
    },

    // ═══ UTILITY RELICS ═══
    {
        id: 'relic_merchant_compass', rarity: 'legendary',
        name: { vi: 'La Bàn Thương Nhân', en: "Merchant's Compass" },
        desc: { vi: '+100% vàng, shop rẻ 50%', en: '+100% gold, shop 50% cheaper' },
        icon: '🧭', color: '#ffd700',
        effect: { goldMult: 1.0, shopDiscount: 0.50 }
    },
    {
        id: 'relic_book_of_changes', rarity: 'legendary',
        name: { vi: 'Kinh Dịch', en: 'Book of Changes' },
        desc: { vi: '+1 reroll miễn phí mỗi blessing, luôn có 4 lựa chọn', en: '+1 free reroll per blessing, always 4 choices' },
        icon: '📕', color: '#cc8833',
        effect: { freeRerolls: 1, blessingChoices: 4 }
    },
    {
        id: 'relic_heavenly_eye', rarity: 'legendary',
        name: { vi: 'Thiên Nhãn', en: 'Heavenly Eye' },
        desc: { vi: 'Hiện toàn bộ minimap. Kho báu phát sáng.', en: 'Full minimap revealed. Treasures glow.' },
        icon: '👁️', color: '#44ddff',
        effect: { fullMap: true, treasureGlow: true }
    },

    // ═══ CHAOS RELICS (high risk / high reward) ═══
    {
        id: 'relic_pandoras_urn', rarity: 'legendary',
        name: { vi: 'Hũ Thần', en: "Pandora's Urn" },
        desc: { vi: '+100% tất cả stats, nhưng bắt đầu với 1 HP', en: '+100% all stats, but start with 1 HP' },
        icon: '🏺', color: '#aa0066',
        effect: { allStatsMult: 1.0, startHp: 1 }
    },
    {
        id: 'relic_chaos_dice', rarity: 'legendary',
        name: { vi: 'Xúc Xắc Hỗn Mang', en: 'Chaos Dice' },
        desc: { vi: 'Mỗi tầng, random buff hoặc debuff cực mạnh', en: 'Each floor, random extreme buff OR debuff' },
        icon: '🎲', color: '#ff44ff',
        effect: { chaosPerFloor: true }
    }
];

// --- Relic State ---
window.RelicState = {
    active: null,               // Currently equipped relic (one per run)
    discovered: [],             // All discovered relic IDs (persistent)
    dragonTimer: 0,             // Timer for dragon pearl relic
};

function initRelicState() {
    const saved = localStorage.getItem('dynastyBruhh_relics');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            window.RelicState.discovered = parsed.discovered || [];
        } catch (e) { /* ignore */ }
    }
}

function saveRelicState() {
    localStorage.setItem('dynastyBruhh_relics', JSON.stringify({
        discovered: window.RelicState.discovered
    }));
}

function resetRunRelic() {
    window.RelicState.active = null;
    window.RelicState.dragonTimer = 0;
}

function equipRelic(relicId) {
    const relic = HEIRLOOM_RELICS.find(r => r.id === relicId);
    if (!relic) return false;

    window.RelicState.active = relic;

    // Apply immediate effects
    if (relic.effect.maxHpBoost) {
        P.maxHp += relic.effect.maxHpBoost;
        P.hp = Math.min(P.hp + relic.effect.maxHpBoost, P.maxHp);
    }
    if (relic.effect.extraLives) {
        G.deathDefiance = (G.deathDefiance || 0) + relic.effect.extraLives;
    }
    if (relic.effect.startHp) {
        P.hp = relic.effect.startHp;
    }

    // Track discovery
    if (!window.RelicState.discovered.includes(relicId)) {
        window.RelicState.discovered.push(relicId);
        saveRelicState();
    }

    // VFX
    if (typeof triggerFlash === 'function') triggerFlash('#ffd700', 0.5);
    if (typeof shake === 'function') shake(4, 0.3);
    if (typeof spawnParticles === 'function') {
        spawnParticles(P.x, P.y, '#ffd700', 25, 80);
        spawnParticles(P.x, P.y, relic.color, 15, 60);
    }
    if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();

    return true;
}

// --- Get Relic Stats ---
function getRelicStats() {
    const stats = {
        dmgMult: 0, atkSpeed: 0, dmgReduction: 0,
        healOnKillPct: 0, comboDmgBonus: 0,
        goldMult: 0, shopDiscount: 0,
        reflectChance: 0, blessingStatBonus: 0,
        freeRerolls: 0, blessingChoices: 3,
        fullMap: false, treasureGlow: false,
        chaosPerFloor: false, allStatsMult: 0,
        hasDragonSummon: false, dragonInterval: 30, dragonDmg: 0,
    };

    const relic = window.RelicState.active;
    if (!relic) return stats;

    const e = relic.effect;
    if (e.dmgMult) stats.dmgMult += e.dmgMult;
    if (e.atkSpeed) stats.atkSpeed += e.atkSpeed;
    if (e.dmgReduction) stats.dmgReduction += e.dmgReduction;
    if (e.healOnKillPct) stats.healOnKillPct += e.healOnKillPct;
    if (e.comboDmgBonus) stats.comboDmgBonus += e.comboDmgBonus;
    if (e.goldMult) stats.goldMult += e.goldMult;
    if (e.shopDiscount) stats.shopDiscount += e.shopDiscount;
    if (e.reflectChance) stats.reflectChance += e.reflectChance;
    if (e.blessingStatBonus) stats.blessingStatBonus += e.blessingStatBonus;
    if (e.freeRerolls) stats.freeRerolls += e.freeRerolls;
    if (e.blessingChoices) stats.blessingChoices = e.blessingChoices;
    if (e.fullMap) stats.fullMap = true;
    if (e.treasureGlow) stats.treasureGlow = true;
    if (e.chaosPerFloor) stats.chaosPerFloor = true;
    if (e.allStatsMult) stats.allStatsMult += e.allStatsMult;
    if (e.dragonSummon) {
        stats.hasDragonSummon = true;
        stats.dragonInterval = e.interval;
        stats.dragonDmg = e.dragonDmg;
    }

    return stats;
}

// --- Update Relics (per-frame) ---
function updateRelics(dt) {
    const stats = getRelicStats();

    // Dragon Pearl summon
    if (stats.hasDragonSummon) {
        window.RelicState.dragonTimer += dt;
        if (window.RelicState.dragonTimer >= stats.dragonInterval) {
            window.RelicState.dragonTimer -= stats.dragonInterval;
            summonDragon(stats.dragonDmg);
        }
    }
}

function summonDragon(dmg) {
    // Dragon sweeps across screen
    for (const e of G.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - P.x, e.y - P.y);
        if (dist <= 150) {
            e.hp -= dmg;
            if (e.hp <= 0 && !e.dead) { killEnemy(e); continue; }
            e.burnTimer = Math.max(e.burnTimer || 0, 3);
            e.burnDps = Math.max(e.burnDps || 0, 10);
            e.flash = 0.2;
        }
    }

    // Epic VFX
    if (typeof spawnParticles === 'function') {
        spawnParticles(P.x, P.y, '#ff6600', 30, 120);
        spawnParticles(P.x, P.y, '#ffd700', 20, 80);
        spawnParticles(P.x, P.y, '#ff2200', 15, 60);
    }
    if (typeof shake === 'function') shake(6, 0.4);
    if (typeof triggerFlash === 'function') triggerFlash('#ff4400', 0.3);

    G.skillEffects.push({
        type: 'shockwave', x: P.x, y: P.y,
        radius: 20, maxRadius: 160, speed: 200,
        color: '#ff6600', alpha: 0.5, lineWidth: 4, timer: 0.5
    });

    if (typeof spawnDmgNum === 'function') {
        spawnDmgNum(P.x, P.y - 40, '🐉 DRAGON!', '#ffd700', true);
    }
    if (typeof SFX !== 'undefined' && SFX.combo50) SFX.combo50();
}

// --- Generate random relic choices (for boss drops) ---
function generateRelicChoices(count) {
    count = count || 3;
    // If player already has a relic, don't offer more
    if (window.RelicState.active) return [];

    const available = HEIRLOOM_RELICS.filter(r => true); // All available
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Initialize on load
if (typeof window !== 'undefined') {
    initRelicState();
}
