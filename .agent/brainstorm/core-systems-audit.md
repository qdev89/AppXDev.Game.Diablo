# 🔍 Dynasty Dungeon — Core Systems Audit Report

**Date:** 2026-02-13
**Scope:** Full codebase audit of all core game systems
**Status:** CRITICAL — Multiple systems defined but non-functional

---

## Executive Summary

The game has an impressive **code architecture** with 15+ files and rich data definitions, but a significant gap exists between **defined systems** and **functional gameplay**. Several systems are "vapor" — code exists but is never invoked, or renders as colored rectangles instead of proper visuals. Equipment drops from minibosses but ignores the rich EQUIPMENT_DEFS. Bosses/minibosses have no unique sprites. The hazard system is completely dormant. Environment biomes DO exist but are basic tile patterns — no traps, castles, or environmental variety.

---

## System-by-System Audit

### ✅ WORKING Systems

| System | File(s) | Status | Notes |
|--------|---------|--------|-------|
| Player Sprites | `sprites.js` | ✅ WORKING | 6 unique hero-specific pixel art sprites with idle/walk animations |
| Enemy Sprites | `sprites.js` | ⚠️ PARTIAL | grunt, fast, tank, elite, boss types have sprites. **miniboss & finalboss fall back to colored rectangles** |
| Wu Xing Elements | `engine.js` | ✅ WORKING | 5 elements with generation/destruction cycles |
| Weapon System | `weapons.js` | ✅ WORKING | 15+ weapon types with leveling, elemental damage |
| Blessings | `blessings.js` | ✅ WORKING | 50+ blessings with effects and mutations |
| Mutations | `mutations.js` | ✅ WORKING | Wu Xing mutation recipes when elements combine |
| Hero Selection | `hud.js` | ✅ WORKING | 6 heroes with distinct abilities and tacticals |
| Floor Tiles & Biomes | `postfx.js` | ✅ WORKING | 4 biomes (Stone Dungeon, Crimson Cavern, Jade Temple, Shadow Realm) with checkerboard tiles, wall torches |
| Post-FX | `postfx.js` | ✅ WORKING | CRT scanlines, vignette, chromatic aberration, speed lines, bloom |
| Sound System | `sound.js` | ✅ WORKING | Web Audio API with procedural SFX |
| Level Up System | `hud.js` | ✅ WORKING | Random blessing cards on level up |
| Combo System | `hud.js` | ✅ WORKING | Escalating combo counter with visual feedback |
| Achievements | `achievements.js` | ✅ WORKING | Unlockable achievements tracking |
| Daily Challenge | `daily.js` | ✅ WORKING | Daily seeded runs with modifiers |
| Aspects | `aspects.js` | ✅ WORKING | 3 aspects per hero (18 total playstyles) |
| Workshop/Crafting | `workshop.js` | ✅ WORKING | Resource collection and recipe crafting |
| Relics | `relics.js` | ✅ WORKING | Relic system with passive effects |
| Lineage | `lineage.js` | ✅ WORKING | Meta-progression between runs |
| Mandate of Heaven | `mandate.js` | ✅ WORKING | Pact of Punishment system (difficulty modifiers) |
| Save/Load | `game.js` | ✅ WORKING | Run persistence with localStorage |

### ❌ BROKEN / Non-Functional Systems

#### 1. 🔴 CRITICAL: Equipment System — DEFINED BUT UNUSED

**Impact:** CRITICAL
**Files:** `heroes.js` (definitions), `weapons.js` (drop code)

**The Problem:**
- `heroes.js` defines **15 rich equipment items** across 3 slots (armor, talisman, mount) with detailed stats like `def`, `procChance`, `hpRegen`, `speed`, `xpBonus`, `fireTrail`, etc.
- `getEquipmentByRarity()` function exists to weighted-random select from EQUIPMENT_DEFS
- **BUT**: The actual equipment drop code in `weapons.js:1097-1127` (miniboss death) **completely ignores EQUIPMENT_DEFS** and creates basic `{ type, quality, statBonus, name }` objects instead
- Players never see "Dragon Scale Mail" or "Red Hare" or "Void Stone" — they get generic "General's Armor" with flat bonuses
- The mount rendering in `renderer.js:62-125` DOES work if a mount is equipped — it draws element-colored horses with animated legs

**✗ Current (Incorrect):**
```javascript
// weapons.js:1097 — Creates generic equipment, ignores EQUIPMENT_DEFS
G.equipment[eqType] = {
    type: eqType, quality, statBonus,
    name: (e.generalName || 'General') + "'s " + eqType.charAt(0).toUpperCase() + eqType.slice(1),
    el: e.el
};
```

**✓ Should be:**
```javascript
// Use the rich EQUIPMENT_DEFS system
const maxRarity = G.floor >= 10 ? 4 : G.floor >= 7 ? 3 : G.floor >= 4 ? 2 : G.floor >= 2 ? 1 : 0;
const equipPool = EQUIPMENT_DEFS.filter(e => e.slot === eqType && e.rarity <= maxRarity);
const equip = getEquipmentByRarity(maxRarity);
G.equipment[equip.slot] = { ...equip, el: e.el };
```

---

#### 2. 🔴 CRITICAL: Mini-Boss & Final Boss — No Unique Sprites

**Impact:** CRITICAL
**File:** `sprites.js`

**The Problem:**
- `ENEMY_SPRITES` defines sprites for: `grunt`, `fast`, `tank`, `elite`, `boss`
- **NO sprite for `miniboss` type** — falls through to colored rectangle fallback
- **NO sprite for `finalboss` type** — falls through to colored rectangle fallback
- The named generals (Đổng Trác, Tào Tháo, Lữ Bố, etc.) appear as colored blobs despite having rich names, titles, and abilities

**✗ Current (Incorrect):**
```javascript
// sprites.js:940 — Fallback draws colored rectangle for unknown types
function drawEnemySprite(ex, ey, enemy, tint) {
    const def = ENEMY_SPRITES[enemy.type];
    if (!def) {
        ctx.fillStyle = tint || enemy.color;
        ctx.fillRect(ex - enemy.r, ey - enemy.r, enemy.r * 2, enemy.r * 2);
        return;
    }
```

**✓ Need:** Add `miniboss` and `finalboss` sprite definitions to ENEMY_SPRITES. Minibosses should be larger (14x16 like elite) with general-specific color palettes. Final boss should be even larger (24x28) with dramatic horns/crown.

---

#### 3. 🟡 HIGH: Hazard/Physics System — Completely Dormant

**Impact:** HIGH
**File:** `physics.js`

**The Problem:**
- `physics.js` defines a full hazard system with 8 hazard types: SCORCHED, FROZEN, OVERGROWN, SHOCK, STEAM, PETRIFIED, VOID_RIFT, LAVA_POOL
- Includes elemental chemistry interactions (fire + water = steam, etc.)
- Has `spawnHazard()`, `update()`, `applyZoneEffects()`, `render()` functions
- **BUT**: `spawnHazard()` is **NEVER CALLED** from any game code
- The render pipeline checks `window.Physics` and calls it in `renderer.js:24` but no hazards exist to render
- No traps, no environmental dangers, no elemental terrain

**✓ Fix:** Spawn hazards on:
- Enemy death (element-based ground effect)
- Boss abilities (lava pools, void rifts)
- Room transitions (pre-placed hazards)
- Elemental weapon impacts

---

#### 4. 🟡 HIGH: Bonding System — Only Accessible After Death

**Impact:** HIGH
**File:** `bonding.js`, `hud.js`

**The Problem:**
- Rich bonding system with 7 brotherhood bonds, skill tree (15+ arcana cards), and combo attacks
- **BUT**: Players can ONLY access bonding screen when `G.state === 'GAME_OVER'` (they must die first)
- No pre-run bonding selection from menu
- No way to preview/equip bonds before starting a run
- The Hades-style design (equip keepsake before a run) requires bonding access at the MENU/HERO_SELECT stage

**✓ Fix:** Add bonding access:
- From hero select screen (equip bond before run starts)
- From pause menu ("View Bonds" option)
- Show equipped bond on HUD during gameplay

---

#### 5. 🟡 HIGH: Environment Design — Minimal Visual Variety

**Impact:** HIGH
**File:** `postfx.js`

**The Problem:**
- Floor tiles exist with 4 biome color themes (Stone Dungeon, Crimson Cavern, Jade Temple, Shadow Realm)
- **BUT**: All biomes are just **recolored checkerboard tiles** with cracks and wall torches
- No environmental objects (pillars, barrels, crates, statues)
- No terrain features (bridges, pits, water pools)
- No decorative elements (banners, blood stains, moss, rubble)
- No visual storytelling (castle ruins, war camps, temples)
- The arena is just a rectangular box with colored tiles

**✓ Need:**
- Procedural decorative objects per biome
- Environmental hazards tied to biome (lava pools in Crimson Cavern, vines in Jade Temple)
- Arena shape variation (not always rectangular)
- Destructible objects (barrels drop pickups)

---

#### 6. 🟢 MEDIUM: Enemy Type Variety in Spawning

**Impact:** MEDIUM
**File:** `systems.js`

**The Problem:**
- `spawnEnemy()` supports 11 enemy types: `fodder`, `grunt`, `fast`, `tank`, `archer`, `shaman`, `bomber`, `shieldwall`, `elite`, `miniboss`, `boss`
- **BUT**: Only `grunt`, `fast`, `tank`, `elite`, and `boss`/`miniboss` have sprites
- `archer`, `shaman`, `bomber`, `shieldwall` types will render as colored rectangles
- Need sprites for these specialized enemy types

---

## Priority Matrix

| # | Issue | Severity | Effort | Impact on Player |
|---|-------|----------|--------|------------------|
| 1 | **Equipment: Wire EQUIPMENT_DEFS to drop system** | 🔴 CRITICAL | S (1-2h) | Players see named items with real stats |
| 2 | **Add miniboss/finalboss sprites** | 🔴 CRITICAL | M (3-4h) | Bosses look like bosses, not colored rectangles |
| 3 | **Activate hazard system** | 🟡 HIGH | M (2-3h) | Dynamic battlefield, elemental interactions |
| 4 | **Pre-run bonding access** | 🟡 HIGH | S (1-2h) | Players can equip bonds before runs |
| 5 | **Environment decorations** | 🟡 HIGH | L (4-6h) | Rooms feel alive and varied |
| 6 | **Add missing enemy sprites** | 🟢 MEDIUM | M (3-4h) | All enemies have visual identity |

---

## Recommended Fix Order

### Sprint 1: Quick Wins (1-3 hours)
1. Wire `EQUIPMENT_DEFS` to miniboss drop system
2. Add bonding access from Hero Select screen
3. Add `miniboss` sprite (recolor/upscale `elite` sprite as starting point)

### Sprint 2: Visual Identity (3-5 hours)
4. Add `finalboss` sprite (larger, more dramatic than `boss`)
5. Add `archer`, `shaman`, `bomber`, `shieldwall` enemy sprites
6. Add biome-specific decorative objects

### Sprint 3: Gameplay Depth (4-6 hours)
7. Activate hazard system with spawning triggers
8. Add destructible environment objects
9. Procedural room decoration system

---

## Files Changed in This Audit
- None (read-only audit)

## Files That Need Changes
1. `weapons.js` — Equipment drop integration
2. `sprites.js` — New enemy sprites
3. `systems.js` — Hazard spawning triggers
4. `hud.js` — Bonding access from Hero Select
5. `postfx.js` — Environment decoration system
6. `engine.js` — State transitions for bonding

---

**Document Status:** Final
**Auditor:** AI Assistant
**Decision Required:** Which sprint to execute first?
