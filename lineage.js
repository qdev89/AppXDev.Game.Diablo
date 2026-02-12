// ============================================================
// DYNASTY BRUHHH DUNGEON - Dynasty Lineage System (U001)
// ============================================================
// Heroes leave "ghost traits" when they die that future heroes
// can inherit. Creates a persistent lineage of power.
// Inspired by Mewgenics' genetic system.
// ============================================================

// --- Lineage State (Persistent) ---
window.LineageState = {
    ghosts: [],          // Array of GhostTrait objects
    maxGhosts: 12,       // Max saved ghosts
    selectedGhost: null, // Selected ghost for current run
};

// --- Ghost Trait Structure ---
// {
//   heroId, heroName, aspectId,
//   blessingId, blessingName, blessingIcon, blessingEffect,
//   floorReached, timestamp,
//   strength: 0.3-0.7 (30%-70% of original effect)
// }

function initLineageState() {
    const saved = localStorage.getItem('dynastyBruhh_lineage');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            window.LineageState.ghosts = parsed.ghosts || [];
        } catch (e) { /* ignore */ }
    }
}

function saveLineageState() {
    localStorage.setItem('dynastyBruhh_lineage', JSON.stringify({
        ghosts: window.LineageState.ghosts
    }));
}

// --- Create Ghost on Death ---
function createGhostTrait() {
    if (!window.BlessingState || window.BlessingState.active.length === 0) return;

    // Find the strongest blessing (highest rarity, or most impactful)
    const sorted = [...window.BlessingState.active].sort((a, b) => {
        const rarityOrder = { common: 1, rare: 2, epic: 3, cursed: 3 };
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    });

    const strongest = sorted[0];
    if (!strongest) return;

    // Calculate strength (based on floor reached)
    const floor = G.floor || 1;
    const strength = Math.min(0.7, 0.3 + (floor - 1) * 0.05); // 30% base, +5% per floor, cap 70%

    const heroDef = typeof getHeroDef === 'function' ? getHeroDef(G.heroId) : null;

    const ghost = {
        heroId: G.heroId || 'unknown',
        heroName: heroDef ? heroDef.name : 'Unknown',
        aspectId: window.AspectState ? window.AspectState.selectedAspect[G.heroId] : null,
        blessingId: strongest.id,
        blessingName: strongest.name,
        blessingIcon: strongest.icon || '👻',
        blessingDeity: strongest.deity,
        blessingEffect: strongest.effect,
        blessingRarity: strongest.rarity,
        floorReached: floor,
        timestamp: Date.now(),
        strength: strength
    };

    // Add to lineage
    window.LineageState.ghosts.push(ghost);

    // Limit size (remove oldest if over max)
    while (window.LineageState.ghosts.length > window.LineageState.maxGhosts) {
        window.LineageState.ghosts.shift();
    }

    saveLineageState();
    return ghost;
}

// --- Select Ghost for Run ---
function selectGhostTrait(index) {
    if (index < 0 || index >= window.LineageState.ghosts.length) return false;
    window.LineageState.selectedGhost = window.LineageState.ghosts[index];
    return true;
}

function clearGhostSelection() {
    window.LineageState.selectedGhost = null;
}

// --- Apply Ghost Trait at Run Start ---
function applyGhostTrait() {
    const ghost = window.LineageState.selectedGhost;
    if (!ghost) return;

    // Create a weakened version of the blessing
    const weakenedEffect = {};
    for (const [key, val] of Object.entries(ghost.blessingEffect)) {
        if (typeof val === 'number') {
            weakenedEffect[key] = val * ghost.strength;
        } else if (typeof val === 'boolean') {
            weakenedEffect[key] = val; // Boolean abilities remain
        } else {
            weakenedEffect[key] = val;
        }
    }

    // Add as a ghost blessing
    const ghostBlessing = {
        id: 'ghost_' + ghost.blessingId,
        deity: ghost.blessingDeity || 'EARTH',
        rarity: 'ghost',
        name: {
            vi: '👻 ' + (ghost.blessingName.vi || ghost.blessingName),
            en: '👻 ' + (ghost.blessingName.en || ghost.blessingName)
        },
        desc: {
            vi: `Di sản từ ${ghost.heroName} (${Math.round(ghost.strength * 100)}% sức mạnh)`,
            en: `Legacy of ${ghost.heroName} (${Math.round(ghost.strength * 100)}% power)`
        },
        icon: '👻',
        effect: weakenedEffect,
        isGhost: true
    };

    // Add directly to blessing state
    if (typeof addBlessing === 'function') {
        addBlessing(ghostBlessing);
    }

    // VFX
    if (typeof spawnParticles === 'function') {
        spawnParticles(P.x, P.y, '#aaaacc', 20, 60);
        spawnParticles(P.x, P.y, '#ffffff', 10, 40);
    }
    if (typeof spawnDmgNum === 'function') {
        spawnDmgNum(P.x, P.y - 35, '👻 LINEAGE AWAKENED', '#ccccff', true);
    }
    if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();
}

// --- Get Lineage Display Data ---
function getLineageDisplay() {
    return window.LineageState.ghosts.map((ghost, idx) => ({
        index: idx,
        heroName: ghost.heroName,
        blessingName: ghost.blessingName,
        blessingIcon: ghost.blessingIcon,
        floor: ghost.floorReached,
        strength: Math.round(ghost.strength * 100),
        age: formatTimeAgo(ghost.timestamp)
    }));
}

function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return hours + 'h ago';
    return Math.floor(hours / 24) + 'd ago';
}

// Initialize on load
if (typeof window !== 'undefined') {
    initLineageState();
}
