// ============================================================
// P007: Historical Synergies — Codex System
// ============================================================

const SYNERGIES = [
    {
        id: 'red_cliffs',
        icon: '🔥',
        name: { vi: 'Trận Xích Bích', en: 'Battle of Red Cliffs' },
        lore: { vi: '赤壁之戰 — Lửa cháy trên sông', en: '赤壁之戰 — Fire on the river' },
        desc: { vi: 'Mỗi đòn phát ra sóng xung kích hơi', en: 'Each hit releases a steam shockwave' },
        color: '#ff6622',
        check(heroId, weapons, blessings) {
            const hasFireWeapon = weapons.some(w => w.el === 'FIRE');
            const hasWaterBlessing = blessings.some(b => b.deity === 'water' || b.element === 'WATER');
            return hasFireWeapon && hasWaterBlessing;
        },
        effect: { steamAoE: true, steamRadius: 40, steamDmg: 5 }
    },
    {
        id: 'burning_luoyang',
        icon: '🔥',
        name: { vi: 'Hỏa Thiêu Lạc Dương', en: 'Burning of Luoyang' },
        lore: { vi: '火燒洛陽 — Đổng Trác thiêu kinh thành', en: '火燒洛陽 — Dong Zhuo burns the capital' },
        desc: { vi: 'Sát thương Hỏa +100%', en: 'All Fire damage +100%' },
        color: '#ff2200',
        check(heroId, weapons, blessings) {
            const fireCount = blessings.filter(b => b.deity === 'fire' || b.element === 'FIRE').length;
            return heroId === 'berserker' && fireCount >= 3;
        },
        effect: { fireDmgMult: 1.0 }
    },
    {
        id: 'changban_bridge',
        icon: '🛡️',
        name: { vi: 'Cầu Trường Bản', en: 'Changban Bridge' },
        lore: { vi: '長坂橋 — Triệu Vân một mình đương vạn quân', en: '長坂橋 — Zhao Yun stands alone against thousands' },
        desc: { vi: '+50% sát thương, +50% tốc độ', en: '+50% damage, +50% speed' },
        color: '#44aaff',
        check(heroId, weapons, blessings) {
            // Zhao Yun + no AI allies active
            const noAllies = !window.G || !G.allies || G.allies.length === 0;
            return heroId === 'vanguard' && noAllies;
        },
        effect: { dmgMult: 0.50, spdMult: 0.50 }
    },
    {
        id: 'eight_trigrams',
        icon: '🔮',
        name: { vi: 'Bát Trận Đồ', en: 'Eight Trigrams' },
        lore: { vi: '八陣圖 — Khổng Minh bày trận', en: '八陣圖 — Zhuge Liang\'s legendary formation' },
        desc: { vi: 'Kẻ địch trong tầm bị hoang mang', en: 'Nearby enemies become confused' },
        color: '#aa44ff',
        check(heroId, weapons, blessings) {
            return heroId === 'strategist' && blessings.length >= 4;
        },
        effect: { confuseAura: true, confuseRadius: 100, confuseChance: 0.15 }
    },
    {
        id: 'peach_garden',
        icon: '🤝',
        name: { vi: 'Đào Viên Kết Nghĩa', en: 'Peach Garden Oath' },
        lore: { vi: '桃園結義 — Ba anh em kết nghĩa', en: '桃園結義 — The oath of three brothers' },
        desc: { vi: 'Bắt đầu +50 HP', en: 'Start with +50 HP' },
        color: '#ff88aa',
        check(heroId, weapons, blessings) {
            // 3+ Brotherhood bonds active
            if (typeof BondState === 'undefined') return false;
            const activeBonds = BondState.active ? BondState.active.length : 0;
            return activeBonds >= 3;
        },
        effect: { bonusHP: 50 }
    }
];

const SYNERGY_STORAGE_KEY = 'dbd_discoveredSynergies';

window.SynergyState = {
    active: [],        // Currently active synergy IDs
    discovered: [],    // All-time discovered synergy IDs (persisted)
    _checked: false,

    load() {
        try {
            const saved = localStorage.getItem(SYNERGY_STORAGE_KEY);
            this.discovered = saved ? JSON.parse(saved) : [];
        } catch (e) { this.discovered = []; }
    },

    save() {
        try {
            localStorage.setItem(SYNERGY_STORAGE_KEY, JSON.stringify(this.discovered));
        } catch (e) { /* silently fail */ }
    },

    reset() {
        this.active = [];
        this._checked = false;
    },

    discover(synergyId) {
        if (!this.discovered.includes(synergyId)) {
            this.discovered.push(synergyId);
            this.save();
            return true;  // New discovery
        }
        return false;
    }
};

// Load on init
window.SynergyState.load();

function checkSynergies() {
    if (!window.P || !window.G) return;

    const heroId = P.heroId || '';
    const weapons = G.weapons || [];
    const blessings = (typeof BlessingState !== 'undefined') ? BlessingState.active : [];

    const newActive = [];

    for (const syn of SYNERGIES) {
        try {
            if (syn.check(heroId, weapons, blessings)) {
                newActive.push(syn.id);

                // If not already active, announce (but only after first check)
                if (window.SynergyState._checked && !window.SynergyState.active.includes(syn.id)) {
                    const isNew = window.SynergyState.discover(syn.id);
                    const synName = syn.name[G.lang || 'vi'];
                    const desc = syn.desc[G.lang || 'vi'];

                    if (isNew) {
                        G.floorAnnounce = {
                            text: '🔓 ' + (G.lang === 'en' ? 'SYNERGY DISCOVERED!' : 'PHÁT HIỆN HIỆP LỰC!'),
                            subtitle: syn.icon + ' ' + synName + ' — ' + desc,
                            timer: 3.5
                        };
                        spawnParticles(P.x, P.y, syn.color, 30, 80);
                        spawnParticles(P.x, P.y, '#ffd700', 15, 60);
                        if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();
                        triggerFlash(syn.color, 0.3);
                        shake(4, 0.2);
                    } else {
                        G.floorAnnounce = {
                            text: syn.icon + ' ' + synName,
                            subtitle: desc,
                            timer: 2.0
                        };
                        spawnParticles(P.x, P.y, syn.color, 15, 50);
                    }
                }
            }
        } catch (e) {
            // Ignore check errors
        }
    }

    window.SynergyState.active = newActive;
    window.SynergyState._checked = true;
}

function getSynergyStats() {
    const stats = {
        dmgMult: 0, spdMult: 0, fireDmgMult: 0,
        bonusHP: 0, steamAoE: false, confuseAura: false
    };

    for (const synId of window.SynergyState.active) {
        const syn = SYNERGIES.find(s => s.id === synId);
        if (!syn) continue;
        for (const [key, val] of Object.entries(syn.effect)) {
            if (typeof val === 'boolean') {
                stats[key] = val;
            } else if (typeof val === 'number' && stats[key] !== undefined) {
                stats[key] += val;
            }
        }
    }
    return stats;
}

function getCodexData() {
    return SYNERGIES.map(syn => ({
        id: syn.id,
        icon: syn.icon,
        name: syn.name,
        lore: syn.lore,
        desc: syn.desc,
        color: syn.color,
        discovered: window.SynergyState.discovered.includes(syn.id),
        active: window.SynergyState.active.includes(syn.id)
    }));
}

function getSynergyCount() {
    return {
        total: SYNERGIES.length,
        discovered: window.SynergyState.discovered.length,
        active: window.SynergyState.active.length
    };
}
