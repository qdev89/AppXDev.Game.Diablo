// ============================================================
// DYNASTY BRUHHH DUNGEON - Imperial Workshop (T002)
// ============================================================
// Meta-progression crafting system (Hades 2 Cauldron-inspired)
// Players spend resources gathered during runs to permanently
// unlock new content.
// ============================================================

// --- Workshop Resources ---
const WORKSHOP_RESOURCES = {
    spirit_jade: { id: 'spirit_jade', name: { vi: 'Linh Ngọc', en: 'Spirit Jade' }, icon: '💎', color: '#44ffaa' },
    war_iron: { id: 'war_iron', name: { vi: 'Chiến Thiết', en: 'War Iron' }, icon: '⚔️', color: '#cccccc' },
    dragon_bone: { id: 'dragon_bone', name: { vi: 'Long Cốt', en: 'Dragon Bone' }, icon: '🦴', color: '#ddaa44' },
    phoenix_ash: { id: 'phoenix_ash', name: { vi: 'Tro Phượng', en: 'Phoenix Ash' }, icon: '🔥', color: '#ff6600' },
    void_ink: { id: 'void_ink', name: { vi: 'Mực Hư Vô', en: 'Void Ink' }, icon: '🖤', color: '#6644aa' }
};

// --- Workshop Recipes ---
const WORKSHOP_RECIPES = [
    // ═══ WEAPON UNLOCKS ═══
    {
        id: 'unlock_fire_pillar', category: 'weapons',
        name: { vi: 'Mở Khoá: Trụ Lửa', en: 'Unlock: Fire Pillar' },
        desc: { vi: 'Thêm vũ khí Trụ Lửa vào pool', en: 'Add Fire Pillar weapon to pool' },
        cost: { spirit_jade: 30, phoenix_ash: 10 },
        icon: '🔥', unlockType: 'weapon', unlockId: 'fire_pillar'
    },
    {
        id: 'unlock_earth_wall', category: 'weapons',
        name: { vi: 'Mở Khoá: Tường Đất', en: 'Unlock: Earth Wall' },
        desc: { vi: 'Thêm vũ khí Tường Đất vào pool', en: 'Add Earth Wall weapon to pool' },
        cost: { spirit_jade: 30, war_iron: 15 },
        icon: '⛰️', unlockType: 'weapon', unlockId: 'earth_wall'
    },

    // ═══ SACRED BEAST UNLOCKS ═══
    {
        id: 'unlock_azure_dragon', category: 'beasts',
        name: { vi: 'Triệu Hồi: Thanh Long', en: 'Summon: Azure Dragon' },
        desc: { vi: 'Mở khoá Thần Thú Thanh Long (Gỗ)', en: 'Unlock Sacred Beast: Azure Dragon (Wood)' },
        cost: { dragon_bone: 30, spirit_jade: 50 },
        icon: '🐲', unlockType: 'beast', unlockId: 'azure_dragon'
    },
    {
        id: 'unlock_white_tiger', category: 'beasts',
        name: { vi: 'Triệu Hồi: Bạch Hổ', en: 'Summon: White Tiger' },
        desc: { vi: 'Mở khoá Thần Thú Bạch Hổ (Kim)', en: 'Unlock Sacred Beast: White Tiger (Metal)' },
        cost: { dragon_bone: 25, war_iron: 30 },
        icon: '🐅', unlockType: 'beast', unlockId: 'white_tiger'
    },
    {
        id: 'unlock_black_tortoise', category: 'beasts',
        name: { vi: 'Triệu Hồi: Huyền Vũ', en: 'Summon: Black Tortoise' },
        desc: { vi: 'Mở khoá Thần Thú Huyền Vũ (Thuỷ)', en: 'Unlock Sacred Beast: Black Tortoise (Water)' },
        cost: { dragon_bone: 20, void_ink: 25 },
        icon: '🐢', unlockType: 'beast', unlockId: 'black_tortoise'
    },

    // ═══ ASPECT UNLOCKS ═══
    {
        id: 'unlock_aspect_demon', category: 'aspects',
        name: { vi: 'Giải Phóng: Ác Quỷ Lữ Bố', en: "Unleash: Lu Bu's Demon" },
        desc: { vi: 'Mở khoá Aspect Ác Quỷ cho Lữ Bố', en: "Unlock Demon Aspect for Lu Bu" },
        cost: { spirit_jade: 80, phoenix_ash: 20 },
        icon: '👹', unlockType: 'aspect', heroId: 'berserker', aspectId: 'demon'
    },
    {
        id: 'unlock_aspect_stars', category: 'aspects',
        name: { vi: 'Giải Phóng: Tinh Tú Khổng Minh', en: "Unleash: Zhuge Liang's Stars" },
        desc: { vi: 'Mở khoá Aspect Tinh Tú cho Gia Cát Lượng', en: "Unlock Stars Aspect for Zhuge Liang" },
        cost: { spirit_jade: 80, void_ink: 20 },
        icon: '⭐', unlockType: 'aspect', heroId: 'strategist', aspectId: 'stars'
    },

    // ═══ ROOM UNLOCKS ═══
    {
        id: 'unlock_purge_shrine', category: 'rooms',
        name: { vi: 'Xây: Đền Tẩy Trần', en: 'Build: Purge Shrine' },
        desc: { vi: 'Thêm phòng Đền Tẩy Trần (bỏ 1 blessing)', en: 'Add Purge Shrine room (remove 1 blessing)' },
        cost: { spirit_jade: 40, void_ink: 15 },
        icon: '⛩️', unlockType: 'room', unlockId: 'purge_shrine'
    },
    {
        id: 'unlock_jade_forge', category: 'rooms',
        name: { vi: 'Xây: Lò Ngọc', en: 'Build: Jade Forge' },
        desc: { vi: 'Thêm phòng Lò Ngọc (nâng cấp vũ khí)', en: 'Add Jade Forge room (upgrade weapons)' },
        cost: { war_iron: 30, spirit_jade: 20 },
        icon: '🔨', unlockType: 'room', unlockId: 'jade_forge'
    },

    // ═══ META UPGRADES ═══
    {
        id: 'upgrade_death_defiance_2', category: 'meta',
        name: { vi: 'Hồi Sinh Cấp II', en: 'Death Defiance II' },
        desc: { vi: '+1 Hồi Sinh (tổng 2)', en: '+1 Death Defiance (total 2)' },
        cost: { spirit_jade: 60, dragon_bone: 15 },
        icon: '💛', unlockType: 'meta', unlockId: 'death_defiance_2'
    },
    {
        id: 'upgrade_blessing_slots', category: 'meta',
        name: { vi: 'Khoang Phước Lành', en: 'Blessing Expansion' },
        desc: { vi: 'Tăng tối đa blessing lên 16', en: 'Increase max blessings to 16' },
        cost: { spirit_jade: 100, void_ink: 30 },
        icon: '🌟', unlockType: 'meta', unlockId: 'blessing_expansion'
    },
    {
        id: 'upgrade_starting_gold', category: 'meta',
        name: { vi: 'Kho Bạc Hoàng Gia', en: 'Royal Treasury' },
        desc: { vi: 'Bắt đầu mỗi run với 100 vàng', en: 'Start each run with 100 gold' },
        cost: { spirit_jade: 40, war_iron: 10 },
        icon: '💰', unlockType: 'meta', unlockId: 'starting_gold'
    }
];

// --- Workshop State (Persistent) ---
window.WorkshopState = {
    resources: { spirit_jade: 0, war_iron: 0, dragon_bone: 0, phoenix_ash: 0, void_ink: 0 },
    crafted: [],     // Array of crafted recipe IDs
    totalCrafted: 0  // Total items crafted
};

function initWorkshopState() {
    const saved = localStorage.getItem('dynastyBruhh_workshop');
    if (saved) {
        try {
            Object.assign(window.WorkshopState, JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }
}

function saveWorkshopState() {
    localStorage.setItem('dynastyBruhh_workshop', JSON.stringify(window.WorkshopState));
}

// --- Add Resources ---
function addResource(resourceId, amount) {
    if (window.WorkshopState.resources[resourceId] !== undefined) {
        window.WorkshopState.resources[resourceId] += amount;
        saveWorkshopState();
    }
}

// --- Check if Recipe is Craftable ---
function canCraft(recipeId) {
    const recipe = WORKSHOP_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;
    if (window.WorkshopState.crafted.includes(recipeId)) return false; // Already crafted

    for (const [res, cost] of Object.entries(recipe.cost)) {
        if ((window.WorkshopState.resources[res] || 0) < cost) return false;
    }
    return true;
}

// --- Craft Recipe ---
function craftRecipe(recipeId) {
    if (!canCraft(recipeId)) return false;

    const recipe = WORKSHOP_RECIPES.find(r => r.id === recipeId);

    // Spend resources
    for (const [res, cost] of Object.entries(recipe.cost)) {
        window.WorkshopState.resources[res] -= cost;
    }

    // Mark as crafted
    window.WorkshopState.crafted.push(recipeId);
    window.WorkshopState.totalCrafted++;

    // Apply unlock
    applyWorkshopUnlock(recipe);

    saveWorkshopState();
    return true;
}

// --- Apply Workshop Unlock ---
function applyWorkshopUnlock(recipe) {
    switch (recipe.unlockType) {
        case 'aspect':
            if (typeof unlockAspect === 'function') {
                unlockAspect(recipe.heroId, recipe.aspectId);
            }
            break;
        case 'beast':
            // Sacred beast unlock (stored in workshop state, checked elsewhere)
            break;
        case 'weapon':
            // Weapon unlock (stored in workshop state, checked by weapon pool)
            break;
        case 'room':
            // Room unlock (stored in workshop state, checked by room generation)
            break;
        case 'meta':
            // Meta upgrade (applied at run start)
            break;
    }
}

// --- Check if Something is Unlocked ---
function isWorkshopUnlocked(unlockId) {
    return window.WorkshopState.crafted.some(id => {
        const recipe = WORKSHOP_RECIPES.find(r => r.id === id);
        return recipe && recipe.unlockId === unlockId;
    });
}

// --- Get Workshop Meta Effects (Applied at Run Start) ---
function getWorkshopMetaEffects() {
    const effects = {
        extraLives: 0,
        maxBlessings: 12,
        startingGold: 0
    };

    if (isWorkshopUnlocked('death_defiance_2')) effects.extraLives += 1;
    if (isWorkshopUnlocked('blessing_expansion')) effects.maxBlessings = 16;
    if (isWorkshopUnlocked('starting_gold')) effects.startingGold += 100;

    return effects;
}

// --- Grant Run Resources (On Floor Clear / Boss Kill / Enemy Kill) ---
function grantRunResources(source) {
    const jadeMultiplier = typeof getMandateEffects === 'function' ?
        getMandateEffects().jadeMultiplier : 1.0;

    switch (source) {
        case 'floor_clear':
            addResource('spirit_jade', Math.ceil(5 * jadeMultiplier));
            addResource('war_iron', Math.ceil(2 * jadeMultiplier));
            break;
        case 'boss_kill':
            addResource('spirit_jade', Math.ceil(20 * jadeMultiplier));
            addResource('dragon_bone', Math.ceil(5 * jadeMultiplier));
            addResource('phoenix_ash', Math.ceil(3 * jadeMultiplier));
            break;
        case 'mini_boss_kill':
            addResource('spirit_jade', Math.ceil(8 * jadeMultiplier));
            addResource('war_iron', Math.ceil(3 * jadeMultiplier));
            break;
        case 'elite_kill':
            addResource('spirit_jade', Math.ceil(2 * jadeMultiplier));
            break;
        case 'treasure_room':
            addResource('void_ink', Math.ceil(5 * jadeMultiplier));
            break;
    }
}

// --- Get all available recipes grouped by category ---
function getWorkshopRecipesByCategory() {
    const grouped = {};
    for (const recipe of WORKSHOP_RECIPES) {
        if (!grouped[recipe.category]) grouped[recipe.category] = [];
        grouped[recipe.category].push({
            ...recipe,
            canCraft: canCraft(recipe.id),
            isCrafted: window.WorkshopState.crafted.includes(recipe.id)
        });
    }
    return grouped;
}

// Initialize on load
if (typeof window !== 'undefined') {
    initWorkshopState();
}
