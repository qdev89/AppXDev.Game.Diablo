# Decision Log — Dynasty Bruhhh Dungeon

## 2026-02-08: Sound System Approach
- **Decision**: Procedural SFX via Web Audio API oscillators (no external audio files)
- **Why**: Asset-free MVP philosophy, instant load, no CORS issues
- **Trade-off**: Sounds are "chiptune-like" — suitable for pixel art style

## 2026-02-08: Death Check Placement
- **Decision**: Move death/revive check from `updatePlayer()` to after `updateEnemies()` in `update()`
- **Why**: Enemy damage is dealt in `updateEnemies()` which ran AFTER the death check, allowing negative HP
- **Impact**: Critical bug fix — player could survive at HP < 0

## 2026-02-08: Canvas CSS Strategy
- **Decision**: Use `width: 100vw; height: 100vh` instead of flexbox centering
- **Why**: `<body>` flex centering creates padding that intercepts pointer events on canvas
- **Trade-off**: Canvas stretches non-uniformly on non-3:2 viewports, but coordinate mapping handles it correctly via `getBoundingClientRect()`

## 2026-02-08: Bonding Screen as Game State
- **Decision**: BONDING is a distinct game state between MENU and PLAYING
- **Why**: Hades pattern — players equip bonds/cards before each run, not during
- **Impact**: Game flow is now MENU → BONDING → PLAYING → GAME_OVER → BONDING

## 2026-02-08: Script Load Order
- **Decision**: bonding.js → sound.js → engine.js → weapons.js → systems.js → renderer.js → hud.js → game.js
- **Why**: engine.js references BONDS, SKILL_TREE, BondingState (from bonding.js) and SFX (from sound.js)
