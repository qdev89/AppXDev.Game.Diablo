// ============================================================
// DYNASTY BRUHHH DUNGEON - Hero Aspect System (S001)
// ============================================================
// 3 aspects per hero = 18 distinct playstyles
// Each aspect changes weapon behavior, passive, and visuals
// ============================================================

const HERO_ASPECTS = {
    // ═══ LU BU (Berserker) ═══
    berserker: [
        {
            id: 'wrath', name: { vi: 'Phẫn Nộ', en: 'Wrath' },
            desc: { vi: 'Mặc định. Sát thương tăng theo combo.', en: 'Default. Damage scales with combo.' },
            icon: '🔥', color: '#ff4400', isDefault: true,
            mods: {} // No modifications — base stats
        },
        {
            id: 'demon', name: { vi: 'Ác Quỷ', en: 'The Demon' },
            desc: { vi: 'Đánh hút MP nhưng gây x2 sát thương. Hạ gục hồi MP.', en: 'Attacks drain MP but deal 2x damage. Kills restore MP.' },
            icon: '👹', color: '#880044',
            mods: {
                dmgMult: 2.0,      // 2x damage
                mpDrain: 3,         // Drain 3 MP per attack
                mpOnKill: 5,        // Restore 5 MP per kill
                passiveOverride: { vi: 'Hút MP mỗi đánh, hồi MP khi hạ gục', en: 'Drain MP on hit, restore on kill' }
            },
            unlockCost: 100 // Jade cost to unlock
        },
        {
            id: 'eternity', name: { vi: 'Vĩnh Hằng', en: 'Eternity' },
            desc: { vi: 'Chậm hơn, quét 360°. Giảm sát thương khi đứng yên.', en: 'Slower, full 360° sweep. DMG reduction when stationary.' },
            icon: '♾️', color: '#6644aa',
            mods: {
                attackSpeedMult: 0.6,  // 40% slower
                arcOverride: 360,      // Full circle swing
                stationaryDR: 0.30,    // -30% dmg when not moving for 1s
                passiveOverride: { vi: 'Giảm 30% sát thương khi đứng yên', en: '-30% dmg taken when stationary' }
            },
            unlockCost: 150
        }
    ],

    // ═══ ZHUGE LIANG (Strategist) ═══
    strategist: [
        {
            id: 'wisdom', name: { vi: 'Trí Tuệ', en: 'Wisdom' },
            desc: { vi: 'Mặc định. +30% EXP.', en: 'Default. +30% EXP.' },
            icon: '📖', color: '#44dd44', isDefault: true,
            mods: {}
        },
        {
            id: 'stars', name: { vi: 'Tinh Tú', en: 'The Stars' },
            desc: { vi: 'Đạn tự tìm mục tiêu. Mục tiêu bị đánh dấu +20% sát thương.', en: 'Homing projectiles. Marked targets take +20% damage.' },
            icon: '⭐', color: '#ffd700',
            mods: {
                homing: true,           // Projectiles home toward enemies
                markDmgBonus: 0.20,     // Marked targets take +20%
                passiveOverride: { vi: 'Đạn truy tìm, đánh dấu +20% dmg', en: 'Homing shots, mark +20% dmg' }
            },
            unlockCost: 100
        },
        {
            id: 'deception', name: { vi: 'Ảo Thuật', en: 'Deception' },
            desc: { vi: 'Tạo phân thân chiến đấu. Tàng hình 2s sau phân thân.', en: 'Create fighting illusions. Stealth 2s after clone.' },
            icon: '👤', color: '#8844cc',
            mods: {
                cloneOnSkill: true,     // E skill creates a fighting clone
                cloneDuration: 5,       // Clone lasts 5s
                stealthAfterClone: 2,   // 2s stealth after creating clone
                passiveOverride: { vi: 'Phân thân chiến đấu, tàng hình 2s', en: 'Fighting clones, stealth 2s' }
            },
            unlockCost: 150
        }
    ],

    // ═══ ZHOU YU (Assassin) ═══
    assassin: [
        {
            id: 'flame', name: { vi: 'Ngọn Lửa', en: 'Flame' },
            desc: { vi: 'Mặc định. 20% chí mạng.', en: 'Default. 20% crit chance.' },
            icon: '🗡️', color: '#ccccff', isDefault: true,
            mods: {}
        },
        {
            id: 'shadow', name: { vi: 'Bóng Tối', en: 'The Shadow' },
            desc: { vi: 'Đánh nhanh x3, tầm ngắn. Mỗi 5 đánh teleport sau lưng.', en: '3x faster, shorter range. Every 5th hit teleports behind.' },
            icon: '🌑', color: '#222244',
            mods: {
                attackSpeedMult: 3.0,
                dmgMult: 0.4,           // 40% damage per hit (but 3x speed = 120% DPS)
                rangeOverride: 15,      // Very short range
                teleportEvery: 5,       // Teleport behind enemy every 5th hit
                passiveOverride: { vi: 'Cực nhanh, teleport sau 5 đòn', en: 'Ultra fast, teleport every 5 hits' }
            },
            unlockCost: 100
        },
        {
            id: 'red_cliffs', name: { vi: 'Xích Bích', en: 'Red Cliffs' },
            desc: { vi: 'Lưỡi kiếm để lại vệt lửa khi lướt. Sát thương lửa tăng theo combo.', en: 'Blades leave fire trail on dash. Fire damage scales with combo.' },
            icon: '🔥', color: '#ff6622',
            mods: {
                fireTrailOnDash: true,
                fireTrailDps: 8,
                fireTrailDuration: 3,
                comboDmgScaling: 0.005, // +0.5% fire dmg per combo hit
                passiveOverride: { vi: 'Vệt lửa khi lướt, sát thương theo combo', en: 'Fire trail on dash, fire scales combo' }
            },
            unlockCost: 150
        }
    ],

    // ═══ ZHAO YUN (Vanguard) ═══
    vanguard: [
        {
            id: 'dragon', name: { vi: 'Rồng', en: 'Dragon' },
            desc: { vi: 'Mặc định. -20% sát thương nhận.', en: 'Default. -20% damage taken.' },
            icon: '🐉', color: '#ddaa44', isDefault: true,
            mods: {}
        },
        {
            id: 'changban', name: { vi: 'Trường Bản', en: 'Changban' },
            desc: { vi: 'Khiên chính, thương phụ. Lướt thành xung phong.', en: 'Shield primary, spear secondary. Dash becomes charge.' },
            icon: '🛡️', color: '#886622',
            mods: {
                shieldPrimary: true,    // Shield bash as main attack
                shieldDmg: 12,
                shieldKnockback: 5,
                chargeOnDash: true,     // Dash becomes a charge attack
                chargeDmg: 25,
                passiveOverride: { vi: 'Khiên chính, xung phong khi lướt', en: 'Shield primary, charge on dash' }
            },
            unlockCost: 100
        },
        {
            id: 'loyalty', name: { vi: 'Trung Nghĩa', en: 'Loyalty' },
            desc: { vi: 'Phóng thương bay trở lại. Đồng minh gần +15% dmg + speed.', en: 'Thrown spear returns. Nearby allies +15% dmg + speed.' },
            icon: '💛', color: '#ffdd44',
            mods: {
                throwAndReturn: true,   // Spear throw returns like boomerang
                allyAuraRange: 100,
                allyDmgBonus: 0.15,
                allySpeedBonus: 0.15,
                passiveOverride: { vi: 'Thương boomerang, aura đồng minh +15%', en: 'Boomerang spear, ally aura +15%' }
            },
            unlockCost: 150
        }
    ],

    // ═══ SIMA YI (Mystic) ═══
    mystic: [
        {
            id: 'darkness', name: { vi: 'Bóng Đêm', en: 'Darkness' },
            desc: { vi: 'Mặc định. 10% hút máu kẻ chết.', en: 'Default. 10% necromancy.' },
            icon: '🌙', color: '#5588ff', isDefault: true,
            mods: {}
        },
        {
            id: 'void', name: { vi: 'Hư Không', en: 'The Void' },
            desc: { vi: 'Đạn tạo hố đen nhỏ hút kẻ thù. Kẻ chết gần hố đen nổ.', en: 'Bolts create mini black holes. Enemies killed near void explode.' },
            icon: '🕳️', color: '#220044',
            mods: {
                voidOnHit: true,        // Create small void area on hit
                voidRadius: 30,
                voidDuration: 2,
                voidPullStrength: 50,
                voidExplodeOnKill: true, // Kills near void cause explosion
                passiveOverride: { vi: 'Hố đen hút kẻ thù, nổ khi giết', en: 'Black holes pull enemies, explode on kill' }
            },
            unlockCost: 100
        },
        {
            id: 'prophecy', name: { vi: 'Tiên Tri', en: 'Prophecy' },
            desc: { vi: 'Tấn công nguyền rủa kẻ thù. Kẻ bị rủa rơi x2 tài nguyên.', en: 'Attacks curse enemies. Cursed enemies drop 2x resources.' },
            icon: '🔮', color: '#cc44ff',
            mods: {
                curseOnHit: true,       // Apply curse debuff
                curseDuration: 5,
                curseDmgTaken: 0.15,    // Cursed take +15% damage
                curseDoubleDrops: true, // Cursed drop 2x resources
                passiveOverride: { vi: 'Nguyền rủa kẻ thù, x2 tài nguyên', en: 'Curse enemies, 2x resource drops' }
            },
            unlockCost: 150
        }
    ],

    // ═══ HUANG ZHONG (Ranger) ═══
    ranger: [
        {
            id: 'eagle', name: { vi: 'Đại Bàng', en: 'Eagle' },
            desc: { vi: 'Mặc định. +30% tầm bắn.', en: 'Default. +30% range.' },
            icon: '🦅', color: '#88ff22', isDefault: true,
            mods: {}
        },
        {
            id: 'storm', name: { vi: 'Bão Tố', en: 'The Storm' },
            desc: { vi: 'Mũi tên tách 3 khi trúng. Mỗi 50 kills +1 tách thêm.', en: 'Arrows split 3 on hit. Every 50 kills +1 extra split.' },
            icon: '⚡', color: '#ffff44',
            mods: {
                splitOnHit: 3,          // Arrow splits into 3
                splitDmgMult: 0.4,      // Each split does 40% damage
                splitScalingPerKills: 50, // Every 50 kills, +1 split
                passiveOverride: { vi: 'Mũi tên tách, +1 tách mỗi 50 kills', en: 'Splitting arrows, +1 per 50 kills' }
            },
            unlockCost: 100
        },
        {
            id: 'siege', name: { vi: 'Công Thành', en: 'Siege' },
            desc: { vi: 'Chậm, mũi tên khổng lồ xuyên TẤT CẢ. Đứng yên 1s = siege shot x5.', en: 'Slow, massive arrows pierce ALL. Stand 1s = siege shot x5 dmg.' },
            icon: '🏰', color: '#aa4422',
            mods: {
                attackSpeedMult: 0.5,   // Half speed
                dmgMult: 2.0,           // But 2x damage
                pierceAll: true,        // Arrows pierce all enemies
                siegeMode: true,        // Standing still 1s charges siege shot
                siegeChargTime: 1.0,
                siegeDmgMult: 5.0,      // 5x damage on siege shot
                passiveOverride: { vi: 'Xuyên tất cả, siege shot x5 dmg', en: 'Pierce all, siege shot x5 dmg' }
            },
            unlockCost: 150
        }
    ]
};

// --- Aspect State ---
window.AspectState = {
    unlockedAspects: {},  // { heroId: [aspectId, ...] }
    selectedAspect: {},   // { heroId: aspectId }
};

function initAspectState() {
    const saved = localStorage.getItem('dynastyBruhh_aspects');
    if (saved) {
        try {
            Object.assign(window.AspectState, JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }
    // Ensure defaults are unlocked
    for (const [heroId, aspects] of Object.entries(HERO_ASPECTS)) {
        if (!window.AspectState.unlockedAspects[heroId]) {
            window.AspectState.unlockedAspects[heroId] = [];
        }
        const defaultAspect = aspects.find(a => a.isDefault);
        if (defaultAspect && !window.AspectState.unlockedAspects[heroId].includes(defaultAspect.id)) {
            window.AspectState.unlockedAspects[heroId].push(defaultAspect.id);
        }
        if (!window.AspectState.selectedAspect[heroId] && defaultAspect) {
            window.AspectState.selectedAspect[heroId] = defaultAspect.id;
        }
    }
}

function saveAspectState() {
    localStorage.setItem('dynastyBruhh_aspects', JSON.stringify(window.AspectState));
}

function unlockAspect(heroId, aspectId) {
    if (!window.AspectState.unlockedAspects[heroId]) {
        window.AspectState.unlockedAspects[heroId] = [];
    }
    if (!window.AspectState.unlockedAspects[heroId].includes(aspectId)) {
        window.AspectState.unlockedAspects[heroId].push(aspectId);
        saveAspectState();
        return true;
    }
    return false;
}

function selectAspect(heroId, aspectId) {
    if (window.AspectState.unlockedAspects[heroId] &&
        window.AspectState.unlockedAspects[heroId].includes(aspectId)) {
        window.AspectState.selectedAspect[heroId] = aspectId;
        saveAspectState();
        return true;
    }
    return false;
}

function getActiveAspect(heroId) {
    const aspectId = window.AspectState.selectedAspect[heroId];
    const heroAspects = HERO_ASPECTS[heroId];
    if (!heroAspects) return null;
    return heroAspects.find(a => a.id === aspectId) || heroAspects.find(a => a.isDefault);
}

function getAspectMods(heroId) {
    const aspect = getActiveAspect(heroId);
    return aspect ? aspect.mods : {};
}

// Initialize on load
if (typeof window !== 'undefined') {
    initAspectState();
}
