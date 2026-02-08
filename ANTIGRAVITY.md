# Dynasty Bruhhh Dungeon — Project Rules

## Architecture
- **Pure HTML5 Canvas + Vanilla JS** — No frameworks, no bundlers
- **Asset-Free** — All visuals drawn with Canvas 2D primitives, all sounds procedural via Web Audio API
- **Game resolution**: 480×320 (3:2 aspect ratio)
- **Target**: 60+ FPS with 200 enemies on screen

## Code Organization
| File | Purpose |
|------|---------|
| `index.html` | Entry point, canvas, CSS, script loading |
| `engine.js` | Core engine: constants, state, input, camera, utilities |
| `game.js` | Game loop, state machine, player update |
| `weapons.js` | Weapon definitions, combat, damage calculations |
| `systems.js` | Enemies, spawning, level-up, pickups, portal |
| `renderer.js` | All drawing/rendering (player, enemies, effects) |
| `hud.js` | HUD, menus, level-up cards, bonding screen |
| `bonding.js` | Brotherhood bonds, Arcana skill tree, meta-progression |
| `sound.js` | Procedural SFX via Web Audio API |

## Game States
`MENU → BONDING → PLAYING → LEVEL_UP → GAME_OVER → BONDING`

## Key Patterns
- **drawText()** helper: outlined text for readability (3px black outline)
- **drawBar()** helper: progress bars with bg/fg/border
- **SFX** object: namespace for all sound effects (e.g., `SFX.hit()`)
- **Wu Xing elements**: WOOD→FIRE→EARTH→METAL→WATER generating cycle
- **Death check** must run AFTER `updateEnemies()` in main `update()` loop

## Known Constraints
- Canvas CSS: `width: 100vw; height: 100vh` — no flex centering (blocks clicks)
- Audio requires user interaction to initialize (Web Audio API policy)
- `bonding.js` must load before `engine.js` (defines BONDS, SKILL_TREE, BondingState)
- `sound.js` must load before `engine.js` (defines SFX, initAudioOnInteraction)
