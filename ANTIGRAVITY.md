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
| `game.js` | Game loop, state machine, player update, dodge roll, treasure room, skill timers, chain kills |
| `weapons.js` | Weapon definitions, combat, damage calculations, kill tracking, musou gauge |
| `systems.js` | Enemies (fodder/grunt/fast/tank/archer/elite/boss), spawning, level-up, pickups, portal, treasure rooms, archer projectiles, stun mechanic |
| `renderer.js` | All drawing/rendering (player, enemies, effects) |
| `hud.js` | HUD (HP/MP/XP/combo/dodge cooldown), menus, level-up cards, bonding screen, hero select screen, musou bar, skill icons, kill counter, chain display, ally/beast rendering |
| `heroes.js` | Hero class definitions (5 classes), equipment items, companion AI data, sacred beast data |
| `bonding.js` | Brotherhood bonds, Arcana skill tree, meta-progression |
| `sound.js` | Procedural SFX via Web Audio API (hit, kill, coin, etc.) |
| `sprites.js` | Pixel art sprite definitions and rendering |
| `postfx.js` | Post-processing effects, biome floor tiles, ambient particles |
| `evolution.js` | Weapon evolution system |

## Game States
`MENU → HERO_SELECT → BONDING → PLAYING → LEVEL_UP → GAME_OVER → BONDING`

## Hero Classes (Phase E)
| Class | Hero | Element | HP | SPD | MP | Passive | Tactical [E] | Ultimate [Q] |
|-------|------|---------|----|----|-----|---------|-------------|--------------|
| ⚔️ Berserker | Lu Bu | FIRE | 120 | 90 | 80 | Blood Rage (+2%/combo) | Ground Slam (AoE stun) | Dynasty Fury (2x dmg 6s) |
| 🧙 Strategist | Zhuge Liang | WOOD | 80 | 95 | 150 | Brilliant Mind (+30% XP) | Wind Burst (knockback) | Eight Trigrams (8 bolts) |
| 🗡️ Assassin | Zhou Yu | METAL | 75 | 130 | 100 | Lethal Edge (20% crit) | Shadow Strike (teleport) | Blade Storm (multi-dash) |
| 🛡️ Vanguard | Zhao Yun | EARTH | 150 | 85 | 100 | Unbreakable (-20% dmg) | Shield Wall (block all) | Changban Charge (charge) |
| 🌊 Mystic | Sima Yi | WATER | 90 | 100 | 130 | Dark Wisdom (10% necro) | Life Drain (steal HP) | Sacred Phoenix (summon) |

## Resource System
| Resource | Bar Color | Regen | Used For |
|----------|-----------|-------|----------|
| HP (Red) | Green/Yellow/Red | Pickups, drain skill | Survival |
| MP (Blue) | Blue | +3/sec passive (hero varies) | Tactical skill [E] |
| Musou (Gold) | Gold, rainbow when full | +1-25 per kill (type varies) | Ultimate skill [Q] |

## Key Patterns
- **drawText()** helper: outlined text for readability (3px black outline)
- **drawBar()** / **drawAnimatedBar()** helper: progress bars with bg/fg/border + damage trail
- **SFX** object: namespace for all sound effects (e.g., `SFX.hit()`, `SFX.coin()`)
- **Wu Xing elements**: WOOD→FIRE→EARTH→METAL→WATER generating cycle
- **Death check** must run AFTER `updateEnemies()` in main `update()` loop
- **Tabbed bonding screen**: `G.bondingTab` (0=Bonds, 1=Arcana) — click tabs to switch
- **Hero select screen**: 5 hero cards, click to select, transitions to BONDING
- **Skill execution**: `fireTacticalSkill()` (E key), `fireUltimateSkill()` (Q key) — per-hero switch
- **AI companions**: `updateAllies(dt)` / `drawAllies()` — melee/ranged/tank behaviors
- **Sacred beast**: `updateSacredBeast(dt)` / `drawSacredBeast()` — orbiting fire phoenix
- **Kill tracking**: `G.totalKills`, `G.chainCount`, `G.chainTimer`, `G.killMilestone`
- **Stun mechanic**: `e.stunTimer` on enemies, `e._origSpeed` for recovery

## Enemy Types
| Type | HP | Speed | Behavior | Floor |
|------|-----|-------|----------|-------|
| fodder | 5 | 25 | Chase (1-hit KO) | 1+ |
| grunt | 20 | 35 | Chase | 1+ |
| fast | 12 | 65 | Chase | 1+ |
| tank | 60 | 20 | Chase | 1+ |
| archer | 15 | 25 | Ranged, retreats if close | 2+ |
| elite | 120 | 30 | Chase | 3+ |
| boss | 500 | 18 | Multi-phase AI, charge, shockwave | 5/10/15... |

## Spawning (Dynasty Warriors Style)
- Each wave: ~60% fodder (dies in 1 hit) + ~40% officers (grunt/fast/tank/archer/elite)
- Fodder count: 10 + floor*2 per wave
- Officers count: 3 + floor*0.8 per wave

## Equipment System
- 3 slots: Armor, Talisman, Mount
- Dropped by bosses (future: treasure rooms)
- Rarity tiers: Common (0) → Uncommon (1) → Rare (2) → Legendary (3) → Mythical (4)

## Known Constraints
- Canvas CSS: `width: 100vw; height: 100vh` — no flex centering (blocks clicks)
- Audio requires user interaction to initialize (Web Audio API policy)
- `bonding.js` must load before `engine.js` (defines BONDS, SKILL_TREE, BondingState)
- `heroes.js` must load before `engine.js` (defines HEROES, EQUIPMENT, getHeroDef, etc.)
- `sound.js` must load before `engine.js` (defines SFX, initAudioOnInteraction)
- Bonding screen uses 480×320 canvas — text must be 9px+ for readability
- `catch` blocks must include `(e)` parameter for compatibility (no bare `catch {}`)

## Version
- **v0.7.1** — Phase F: The Spectacle — Complete Skill VFX Overhaul (10 skills), Weapon-Specific VFX, Keybinds (1-5 hero select, 1-3 level-up)
- **v0.7.0** — Phase E: The Dynasty Awakens — Hero Classes, MP/Musou, Active Skills, DW Musou Feel, AI Companions, Sacred Beast
