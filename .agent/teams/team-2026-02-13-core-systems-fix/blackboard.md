# Blackboard — Core Systems Fix Team

## Shared Context
- Game: Dynasty Bruhhh Dungeon (canvas-based action roguelike)
- All rendering via `ctx` (2D canvas context)
- Game state managed through global `G` object
- Player state through global `P` object
- Sprites are pixel art defined as ASCII strings with color maps

## Key Findings from Audit
1. EQUIPMENT_DEFS in heroes.js has 15 items but weapons.js ignores them
2. ENEMY_SPRITES missing: miniboss, finalboss, archer, shaman, bomber, shieldwall
3. physics.js spawnHazard() never called
4. Bonding only accessible after GAME_OVER
5. Floor tiles exist but no decorative objects

## Discoveries During Implementation
<!-- Updated by Lead during synthesis -->
