// ============================================================
// DYNASTY BRUHHH DUNGEON - Mandate of Heaven (T001)
// ============================================================
// Post-first-victory difficulty modifier system inspired by
// Hades' Pact of Punishment. Adds endgame replayability.
// ============================================================

// --- Mandate Modifiers ---
const MANDATE_MODIFIERS = [
    {
        id: 'heavens_decree', icon: '🗡️', maxLevel: 5,
        name: { vi: 'Trời Cao', en: "Heaven's Decree" },
        desc: { vi: 'Kẻ thù +20% HP mỗi cấp', en: 'Enemies +20% HP per level' },
        perLevel: { enemyHpMult: 0.20 },
        jadeBonus: 0.10 // +10% jade per level
    },
    {
        id: 'fates_call', icon: '💀', maxLevel: 3,
        name: { vi: 'Vận Mệnh', en: "Fate's Call" },
        desc: { vi: '+15% tỷ lệ Elite mỗi cấp', en: '+15% elite spawn rate per level' },
        perLevel: { eliteRate: 0.15 },
        jadeBonus: 0.15
    },
    {
        id: 'times_edge', icon: '⏰', maxLevel: 3,
        name: { vi: 'Thiên Thời', en: "Time's Edge" },
        desc: { vi: 'Boss xuất hiện sớm 3 phút mỗi cấp', en: 'Boss arrives 3 min earlier per level' },
        perLevel: { bossTimerReduction: 180 }, // 180 seconds = 3 min
        jadeBonus: 0.20
    },
    {
        id: 'elemental_chaos', icon: '🔥', maxLevel: 3,
        name: { vi: 'Ngũ Hành Loạn', en: 'Elemental Chaos' },
        desc: { vi: 'Vùng nguy hiểm +30% sát thương mỗi cấp', en: 'Hazard damage +30% per level' },
        perLevel: { hazardDmgMult: 0.30 },
        jadeBonus: 0.10
    },
    {
        id: 'fierce_generals', icon: '👹', maxLevel: 2,
        name: { vi: 'Tướng Hung', en: 'Fierce Generals' },
        desc: { vi: '+1 mini-boss mỗi tầng mỗi cấp', en: '+1 mini-boss per floor per level' },
        perLevel: { extraMiniBoss: 1 },
        jadeBonus: 0.25
    },
    {
        id: 'god_slayer', icon: '💎', maxLevel: 2,
        name: { vi: 'Sát Thần', en: 'God Slayer' },
        desc: { vi: 'Boss thêm 1 phase mỗi cấp', en: 'Boss gains extra phase per level' },
        perLevel: { bossExtraPhases: 1 },
        jadeBonus: 0.30
    },
    {
        id: 'shadow_army', icon: '🌑', maxLevel: 3,
        name: { vi: 'Bóng Tối', en: 'Shadow Army' },
        desc: { vi: 'Kẻ thù có 1 modifier ngẫu nhiên mỗi cấp', en: 'Enemies get 1 random modifier per level' },
        perLevel: { enemyModifiers: 1 },
        jadeBonus: 0.15
    },
    {
        id: 'speed_of_war', icon: '⚡', maxLevel: 5,
        name: { vi: 'Tốc Chiến', en: 'Speed of War' },
        desc: { vi: 'Kẻ thù nhanh +10% mỗi cấp', en: 'Enemies +10% faster per level' },
        perLevel: { enemySpeedMult: 0.10 },
        jadeBonus: 0.05
    },
    {
        id: 'unbreakable', icon: '🛡️', maxLevel: 3,
        name: { vi: 'Bất Khả Xâm', en: 'Unbreakable' },
        desc: { vi: 'Kẻ thù giảm 15% sát thương nhận mỗi cấp', en: 'Enemies take -15% damage per level' },
        perLevel: { enemyDmgReduction: 0.15 },
        jadeBonus: 0.10
    },
    {
        id: 'middle_ground', icon: '🎯', maxLevel: 1,
        name: { vi: 'Trung Dung', en: 'Middle Ground' },
        desc: { vi: 'Không có Hồi Sinh (Death Defiance)', en: 'No Death Defiance' },
        perLevel: { noDeathDefiance: true },
        jadeBonus: 0.50
    }
];

// --- Mandate Titles ---
const MANDATE_TITLES = [
    { threshold: 5, title: { vi: 'Đồng Tướng', en: 'Bronze General' }, color: '#cc8844' },
    { threshold: 10, title: { vi: 'Bạc Tướng', en: 'Silver General' }, color: '#cccccc' },
    { threshold: 20, title: { vi: 'Kim Tướng', en: 'Gold General' }, color: '#ffd700' },
    { threshold: 30, title: { vi: 'Ngọc Hoàng', en: 'Jade Emperor' }, color: '#44ffaa' }
];

// --- Mandate State (persisted) ---
window.MandateState = {
    unlocked: false,          // Unlocked after first victory
    levels: {},               // { modifierId: currentLevel }
    totalMandate: 0,          // Sum of all levels
    highestMandate: 0,        // Highest total ever cleared
    jadeMultiplier: 1.0,      // Current jade bonus
    currentTitle: null        // Current earned title
};

function initMandateState() {
    const saved = localStorage.getItem('dynastyBruhh_mandate');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(window.MandateState, parsed);
        } catch (e) { /* ignore parse errors */ }
    }
    // Initialize levels
    for (const mod of MANDATE_MODIFIERS) {
        if (window.MandateState.levels[mod.id] === undefined) {
            window.MandateState.levels[mod.id] = 0;
        }
    }
    recalcMandate();
}

function saveMandateState() {
    localStorage.setItem('dynastyBruhh_mandate', JSON.stringify(window.MandateState));
}

function unlockMandate() {
    window.MandateState.unlocked = true;
    saveMandateState();
}

function setMandateLevel(modId, level) {
    const mod = MANDATE_MODIFIERS.find(m => m.id === modId);
    if (!mod) return;
    window.MandateState.levels[modId] = Math.max(0, Math.min(level, mod.maxLevel));
    recalcMandate();
    saveMandateState();
}

function recalcMandate() {
    let total = 0;
    let jadeBonus = 0;
    for (const mod of MANDATE_MODIFIERS) {
        const lv = window.MandateState.levels[mod.id] || 0;
        total += lv;
        jadeBonus += mod.jadeBonus * lv;
    }
    window.MandateState.totalMandate = total;
    window.MandateState.jadeMultiplier = 1 + jadeBonus;

    // Update title
    window.MandateState.currentTitle = null;
    for (const t of MANDATE_TITLES) {
        if (total >= t.threshold) {
            window.MandateState.currentTitle = t;
        }
    }
}

// --- Get Active Mandate Effects (for game systems to query) ---
function getMandateEffects() {
    const effects = {
        enemyHpMult: 1.0,
        enemySpeedMult: 1.0,
        enemyDmgReduction: 0,
        eliteRate: 0,
        bossTimerReduction: 0,
        hazardDmgMult: 1.0,
        extraMiniBoss: 0,
        bossExtraPhases: 0,
        enemyModifiers: 0,
        noDeathDefiance: false,
        jadeMultiplier: window.MandateState.jadeMultiplier
    };

    for (const mod of MANDATE_MODIFIERS) {
        const lv = window.MandateState.levels[mod.id] || 0;
        if (lv <= 0) continue;

        for (const [key, val] of Object.entries(mod.perLevel)) {
            if (typeof val === 'boolean') {
                effects[key] = val;
            } else if (key.endsWith('Mult')) {
                effects[key] += val * lv;
            } else {
                effects[key] += val * lv;
            }
        }
    }

    return effects;
}

// --- Record a Victory ---
function recordMandateVictory() {
    if (window.MandateState.totalMandate > window.MandateState.highestMandate) {
        window.MandateState.highestMandate = window.MandateState.totalMandate;
    }
    saveMandateState();
}

// Initialize on load
if (typeof window !== 'undefined') {
    initMandateState();
}
