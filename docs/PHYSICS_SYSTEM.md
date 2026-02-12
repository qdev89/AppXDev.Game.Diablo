# 🌋 Physics Hazard System Documentation

## Overview
The Physics Hazard System introduces interactive environmental zones to combat, inspired by games like *The Binding of Isaac* (Mewgenics). These zones apply continuous or periodic effects to entities (Player and Enemies) within their radius.

## Architecture

### 1. `physics.js` (New Module)
The core logic resides in `physics.js`, which exposes a global `window.Physics` object.

- **`HAZARD_TYPES`**: Defines properties for each hazard (color, particles, damage, duration, effect).
- **`spawnHazard(x, y, typeId, radius)`**: Creates a new hazard zone. Handles interactions (chemistry) with existing zones.
- **`checkInteraction(newZone, existingZone)`**: Determines if two zones react (e.g., Fire + Water).
- **`update(dt)`**: Main update loop. Decrements timers, applies effects.
    - **Continuous Effects**: Applied every frame (Slow, Slide). Speed modifiers are multiplicative.
    - **Periodic Effects**: Applied every 0.5s (Damage, Heal).
- **`render(ctx, camX, camY)`**: Draws hazard zones with borders and fill colors.

### 2. Hazard Types & Effects

| Hazard Type | Element | Color | Effect | Source |
| :--- | :--- | :--- | :--- | :--- |
| **SCORCHED** | 🔥 Fire | #552200 | **Burn** (DoT) | Fire Melee, Fire Pillar, Fire Thrown |
| **PUDDLE** | 💧 Water | #224488 | **Wet + Slow** (50%) | Water Scepter, Rain |
| **MUD** | 🧱 Earth | #443311 | **Sticky Slow** (30%) | Earth AoE (Earthquake), Earth Spear |
| **OVERGROWN** | 🌿 Wood | #226622 | **Heal** (Player) / **Root** (Enemy) | Wood AoE (Vines), Mystic |
| **ELECTRIFIED** | ⚡ Metal | #ffff00 | **Stun** (High Dmg) | Metal Storm (Twin Blades Evo) |
| **STEAM** | ☁️ Gas | #ffffff | **Blind** (Accuracy Loss) | Fire + Water Interaction |

### 3. Elemental Chemistry (Interactions)

When a new hazard spawns on top of an existing one, `checkInteraction()` is called.

- **Steam Reaction**:
    - **Input**: `SCORCHED` + `PUDDLE`
    - **Result**: Both are consumed. Spawns `STEAM` cloud (larger radius).
    - **Effect**: Deals AoE damage and blinds enemies.

- **Electrolysis**:
    - **Input**: `PUDDLE` + `ELECTRIFIED`
    - **Result**: `PUDDLE` becomes `ELECTRIFIED` permanently.
    - **Effect**: Massive stun area.

- **Baked Earth**:
    - **Input**: `MUD` + `SCORCHED`
    - **Result**: `MUD` becomes `SCORCHED` (hardened clay).
    - **Effect**: Removing the slow, adding burn.

## Integration Points

### Game Loop (`game.js`)
- **Update**: `window.Physics.update(G.dt)` is called in the main `update()` loop.
- **Player**: `P._inHazardSlow` affects player movement speed in `updatePlayer()`.

### Renderer (`renderer.js`)
- **Draw**: `window.Physics.render(ctx, G.camX, G.camY)` is called in `drawGame()` after floor tiles but before entities.

### Weapons (`weapons.js`)
- **Triggers**: Modified `fireMelee`, `fireProjectile`, `fireAoE`, `fireThrown`, `fireOrbital` to spawn hazards based on weapon element and ID.

### Systems (`systems.js`)
- **Enemy AI**: `updateEnemies()` checks `e._inHazardSlow` to reduce movement speed. Stacks multiplicatively with status effect slows.

## Future Expansions
- **Ice Hazards**: Sliding mechanics (momentum-based movement).
- **Gas Hazards**: Spreading poison clouds.
- **Environmental Destruction**: Hazards destroying destructible props.
