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
| `lang.js` | Bilingual localization (VI/EN), `t()` helper, `setLang()`, `tGen()`, `tGenTitle()`, `tComp()` |
| `engine.js` | Core engine: constants, state, input, camera, utilities |
| `game.js` | Game loop, state machine, screen transitions (fade), localStorage persistence, chain kills, room state machine |
| `weapons.js` | Weapon definitions, combat, damage calculations, kill tracking, musou gauge, thrown weapons, blessing damage integration |
| `systems.js` | Enemies, spawning, level-up, pickups, portal, treasure rooms, debuffs, room generation, shop logic, door choices, DoT processing |
| `renderer.js` | All drawing/rendering (player, enemies, effects, chain frost bounces) |
| `hud.js` | HUD, menus, level-up cards, bonding screen, hero select, room indicators, door choices, shop UI, blessing choice UI, active blessings |
| `heroes.js` | Hero class definitions (6 classes), equipment items, companion AI data, sacred beast data |
| `bonding.js` | Brotherhood bonds, Arcana skill tree, meta-progression, Brotherhood Combo execution |
| `sound.js` | Procedural SFX + BGM via Web Audio API (3 moods: menu/combat/boss) |
| `sprites.js` | Pixel art sprite definitions and rendering |
| `postfx.js` | Post-processing effects, biome floor tiles, ambient particles |
| `evolution.js` | Weapon evolution system |
| `blessings.js` | Wu Xing Blessing System: 5 deities, 25 blessings, 3 duo blessings, set bonuses, on-hit/on-kill effects |

## Script Load Order
```
lang.js → heroes.js → bonding.js → sound.js → sprites.js → engine.js →
blessings.js → weapons.js → systems.js → game.js → renderer.js → postfx.js → hud.js → evolution.js
```

## Game States
`MENU → HERO_SELECT → BONDING → PLAYING → LEVEL_UP → SHOP → BLESSING_CHOICE → GAME_OVER → BONDING`

### Room States (within PLAYING)
`FIGHTING → CLEARED → DOOR_CHOICE → TRANSITIONING → (next room)`

## Hero Classes (6 Heroes)
| Class | Hero | Element | HP | SPD | MP | Passive | Tactical [E] | Ultimate [Q] |
|-------|------|---------|----|----|-----|---------|-------------|--------------|
| ⚔️ Berserker | Lu Bu | FIRE | 120 | 90 | 80 | Blood Rage (+2%/combo) | Ground Slam (AoE stun) | Dynasty Fury (2x dmg 6s) |
| 🧙 Strategist | Zhuge Liang | WOOD | 80 | 95 | 150 | Brilliant Mind (+30% XP) | Wind Burst (knockback) | Eight Trigrams (8 bolts) |
| 🗡️ Assassin | Zhou Yu | METAL | 75 | 130 | 100 | Lethal Edge (20% crit) | Shadow Strike (teleport) | Blade Storm (multi-dash) |
| 🛡️ Vanguard | Zhao Yun | EARTH | 150 | 85 | 100 | Unbreakable (-20% dmg) | Shield Wall (block all) | Changban Charge (charge) |
| 🌊 Mystic | Sima Yi | WATER | 90 | 100 | 130 | Dark Wisdom (10% necro) | Life Drain (steal HP) | Sacred Phoenix (summon) |
| 🏹 Ranger | Huang Zhong | WOOD | 85 | 105 | 100 | Eagle Eye (+30% range) | Arrow Rain (AoE shuriken) | Shuriken Storm (homing) |

## Key Bindings
| Key | Action | State |
|-----|--------|-------|
| WASD / Arrows | Move | PLAYING |
| Space | Dodge Roll | PLAYING |
| E | Tactical Skill (costs MP) | PLAYING |
| Q | Ultimate / Musou (requires full gauge) | PLAYING |
| R | Brotherhood Combo (requires full gauge) | PLAYING |
| L | Language Toggle (VI ↔ EN) | ALL |
| 1-5 | Quick hero select | HERO_SELECT |
| 1-3 | Quick level-up choice | LEVEL_UP |
| Click | Menu navigation | ALL |

## Resource System
| Resource | Bar Color | Regen | Used For |
|----------|-----------|-------|----------|
| HP (Red) | Green/Yellow/Red | Pickups, drain skill | Survival |
| MP (Blue) | Blue | +3/sec passive (hero varies) | Tactical skill [E] |
| Musou (Gold) | Gold, rainbow when full | +1-25 per kill (type varies) | Ultimate skill [Q] |
| Morale | Red→Yellow→Green | +1-25 per kill, decays over time | Passive buffs |
| Brotherhood | Purple/Gold | +5-25 per kill (type varies) | Brotherhood Combo [R] |

## Weapon Types
| Type | Behavior | Examples |
|------|----------|---------|
| `melee` | Arc slash around player | Fire Sword, Fire Halberd |
| `projectile` | Auto-fires at nearest enemy | Frost Bolt (chains between enemies) |
| `thrown` | Fan-spread projectiles | Wind Shuriken, Flame Kunai, Repeating Crossbow |
| `orbital` | Spins around player | Metal Blade Storm |
| `aura` | Passive AoE around player | Root Zone, Earth Shield |
| `active` | Manual cast | Life Surge heal, Earthquake |

## Mini-Boss Generals (12 Three Kingdoms Characters)
| General | Vietnamese | Title | Element | Unique Ability |
|---------|-----------|-------|---------|---------------|
| Dong Zhuo | Đổng Trác | Bạo Chúa | FIRE | Fire Charge |
| Yuan Shao | Viên Thiệu | Quý Tộc | EARTH | Arrow Volley |
| Cao Cao | Tào Tháo | Gian Hùng | METAL | Ambush Summon |
| Sun Jian | Tôn Kiên | Mãnh Hổ | WOOD | Tiger Pounce |
| Diao Chan | Điêu Thuyền | Mỹ Nhân Kế | WATER | Charm (confusion) |
| Guan Yu | Quan Vũ | Võ Thánh | WOOD | Crescent Sweep |
| Zhang Fei | Trương Phi | Vạn Nhân Địch | FIRE | Thunderous Roar |
| Lu Bu | Lữ Bố | Chiến Thần | FIRE | Sky Piercer |
| Sun Ce | Tôn Sách | Tiểu Bá Vương | WOOD | Little Conqueror |
| Zhang Liao | Trương Liêu | Oai Trấn Tiêu Dao | METAL | Terror Charge |
| Zhao Yun | Triệu Vân | Thường Sơn Long | EARTH | Dragon Thrust |
| Sima Yi | Tư Mã Ý | Ẩn Long | WATER | Dark Ritual |

## Localization System
- `lang.js` loaded FIRST — defines `LANG` object with `vi` and `en` translations
- `t(key)` — returns translated string for current language
- `tGen(englishName)` — returns localized general name
- `tGenTitle(englishName)` — returns localized general title
- `tComp(englishName)` — returns localized companion name
- `setLang(langCode)` — switches language (`'vi'` or `'en'`)
- Default language: Vietnamese (`'vi'`)

## Brotherhood System
- **Bonds**: Peach Garden Oath, Five Tiger Generals, Dragon & Phoenix, Cao's Five Elites, etc.
- **Brotherhood Combo**: Gauge charges on kills → activate with R key → dramatic combo attack
- **Charge rates**: fodder=5, elite=8, miniboss=15, boss=25
- **Cooldown**: 15s after activation

## Enemy Debuff System
- **Slow**: Reduces speed by 30% for 1.5s (applied by Chain Frost Bolt, Water blessings)
- **Burn DOT**: Fire damage over time from Flame Kunai, fire abilities, Fire blessings
- **Poison DOT**: Damage over time from Wood blessings (`poisonTimer`, `poisonDps`)
- **Bleed DOT**: Damage over time from Metal blessings (`bleedTimer`, `bleedDps`)
- **Freeze**: Enemy completely stopped from Water blessings (`frozenTimer`)
- **Stun**: Enemy stopped from Earth blessings (`stunTimer`)
- All DoTs tracked per-enemy, ticking every 0.5s with VFX

## Wu Xing Blessing System (Phase K)
| Element | Deity | Icon | Blessing Types |
|---------|-------|------|---------|
| WOOD | Thần Nông (Shennong) | 🌿 | Healing, thorns, poison, regen, max HP |
| FIRE | Chúc Dung (Zhurong) | 🔥 | Damage, burn, explosion on kill, crit, fire aura |
| EARTH | Hậu Thổ (Houtu) | ⛰️ | Armor, stun, shield, knockback, fortress |
| METAL | Bạch Hổ (Bai Hu) | ⚔️ | Speed, pierce, bleed, attack speed, execute |
| WATER | Cung Công (Gonggong) | 🌊 | Slow, life steal, freeze, tidal wave, ice armor |

### Blessing Rarities
- **Common**: 60% weight — basic effects
- **Rare**: 30% weight — stronger effects
- **Epic**: 10% weight — build-defining effects

### Set Bonuses (3+ of same element)
- WOOD: +30% healing effectiveness
- FIRE: +25% DoT damage
- EARTH: +20 Max HP, -10% damage
- METAL: +10% attack speed, +10% crit
- WATER: +15% lifesteal, +15% slow

### Duo Blessings (2 different elements)
- Fire+Wood: Wildfire (burning spreads to nearby)
- Water+Metal: Frost Blade (+30% dmg to frozen)
- Earth+Fire: Magma (lava trail on dodge)

### Key Functions
- `addBlessing(def)` — Add blessing, apply immediate effects, check set/duo bonuses
- `getBlessingStats()` — Aggregate all active blessing stats
- `applyBlessingOnHit(enemy, dmg)` — Apply on-hit effects (slow, stun, freeze, DoTs, lifesteal, execute)
- `applyBlessingOnKill(enemy)` — Apply on-kill effects (heal, explosion, spreading burn)
- `updateBlessings(dt)` — Tick regen, shield, fire aura, tidal wave
- `generateBlessingChoices(count)` — Generate weighted blessing options
- `getBlessingDamageMult()` — Get damage multiplier (including crit)
- `getBlessingDamageReduction()` — Get damage reduction (capped at 75%)

## Room-Based Dungeon System (Phase K)
| Room Type | Color | Reward | Description |
|-----------|-------|--------|-------------|
| COMBAT | Red | XP/Gold | Standard enemy waves |
| ELITE | Orange | Weapon | Mini-boss general encounter |
| SHOP | Yellow | Items | Buy items with gold |
| REST | Green | HP | Heal 30% HP |
| TREASURE | Gold | Weapon/Blessing | Free reward |
| BLESSING | Purple | Blessing | Choose from 3 blessings |
| BOSS | Dark Red | Floor Clear | Floor boss fight |

### Room Progression
- 6 rooms per floor, door choices after each cleared room
- 2-3 door options with room type preview and reward icons
- Boss room appears as final room of each floor
- "BOSS INCOMING" warning on penultimate room
- Room indicator HUD (pips at top of screen)

### Key State: `G.roomState`
- `FIGHTING` — Combat in progress
- `CLEARED` — Room completed, waiting for doors
- `DOOR_CHOICE` — Player choosing next room
- `TRANSITIONING` — Fade between rooms

### Key Variables
- `G.room` — Current room number (1-indexed)
- `G.roomsPerFloor` — Total rooms per floor (default: 6)
- `G.roomType` — Current room type
- `G.doorChoices` — Array of door options [{type, reward}]
- `G.roomCleared` — Whether current room is cleared
- `G.enemiesKilled` / `G.enemiesNeeded` — Kill counter for room clear

## Key Patterns
- **drawText()** helper: outlined text for readability (3px black outline)
- **drawBar()** / **drawAnimatedBar()** helper: progress bars with bg/fg/border + damage trail
- **SFX** object: namespace for all sound effects (e.g., `SFX.hit()`, `SFX.coin()`)
- **Wu Xing elements**: WOOD→FIRE→EARTH→METAL→WATER generating cycle
- **Death check** must run AFTER `updateEnemies()` in main `update()` loop
- **Tabbed bonding screen**: `G.bondingTab` (0=Bonds, 1=Arcana) — click tabs to switch
- **Hero select screen**: 6 hero cards, click to select, transitions to BONDING
- **Skill execution**: `fireTacticalSkill()` (E key), `fireUltimateSkill()` (Q key), `executeBrotherhoodCombo()` (R key)
- **AI companions**: `updateAllies(dt)` / `drawAllies()` — melee/ranged/tank behaviors
- **Sacred beast**: `updateSacredBeast(dt)` / `drawSacredBeast()` — orbiting fire phoenix
- **Kill tracking**: `G.totalKills`, `G.chainCount`, `G.chainTimer`, `G.killMilestone`
- **Stun mechanic**: `e.stunTimer` on enemies, `e._origSpeed` for recovery
- **BlessingState**: Global blessing state manager (active blessings, affinity, set/duo bonuses)
- `catch` blocks must include `(e)` parameter for compatibility (no bare `catch {}`)

## Enemy Types
| Type | HP | Speed | Behavior | Floor |
|------|-----|-------|----------|-------|
| fodder | 5 | 25 | Chase (1-hit KO) | 1+ |
| grunt | 20 | 35 | Chase | 1+ |
| fast | 12 | 65 | Chase | 1+ |
| tank | 60 | 20 | Chase | 1+ |
| archer | 15 | 25 | Ranged, retreats if close | 2+ |
| elite | 120 | 30 | Chase | 3+ |
| miniboss | 300+ | 28 | Unique ability AI, named general | 3+ |
| boss | 500 | 18 | Multi-phase AI, charge, shockwave | 5/10/15... |

## Spawning (Dynasty Warriors Style)
- Each wave: ~60% fodder (dies in 1 hit) + ~40% officers (grunt/fast/tank/archer/elite)
- Fodder count: 10 + floor*2 per wave
- Officers count: 3 + floor*0.8 per wave

## Equipment System
- 3 slots: Armor, Talisman, Mount
- Dropped by bosses (future: treasure rooms)
- Rarity tiers: Common (0) → Uncommon (1) → Rare (2) → Legendary (3) → Sacred (4)

## Known Constraints
- Canvas CSS: `width: 100vw; height: 100vh` — no flex centering (blocks clicks)
- Audio requires user interaction to initialize (Web Audio API policy)
- `lang.js` must load FIRST (defines LANG, t, tGen, tGenTitle, tComp, setLang)
- `bonding.js` must load before `engine.js` (defines BONDS, SKILL_TREE, BondingState)
- `heroes.js` must load before `engine.js` (defines HEROES, EQUIPMENT, getHeroDef, etc.)
- `sound.js` must load before `engine.js` (defines SFX, initAudioOnInteraction)
- Bonding screen uses 480×320 canvas — text must be 9px+ for readability

## Version History
- **v0.9.5** — Phase K: The Roguelike Soul — Room-Based Dungeon Progression (6 room types, door choices, room state machine), Wu Xing Blessing System (5 deities, 25 blessings, 3 duo blessings, set bonuses, on-hit/on-kill/DoT effects), Death Defiance (revive once per run), Difficulty Tiers (Normal/Hard/Dynasty), Reroll/Banish QoL for level-up choices
- **v0.9.2** — Phase J: The Atmosphere — Screen Transitions (fade), Procedural BGM (3 moods), localStorage Persistence (settings/stats/Arcana), Enhanced Main Menu (embers, glow, orbiting elements)
- **v0.9.0** — Phase H: Dynasty Warriors Expansion — 6th Hero (Ranger), Chain Frost Bolt, Brotherhood Combos, 12 Mini-Boss Generals, Bilingual (VI/EN), Thrown Weapons, Morale System
- **v0.8.0** — Phase G: The Entourage — AI Companions, Morale System, Brotherhood Bonds with Combos
- **v0.7.1** — Phase F: The Spectacle — Complete Skill VFX Overhaul (10 skills), Weapon-Specific VFX
- **v0.7.0** — Phase E: The Dynasty Awakens — Hero Classes, MP/Musou, Active Skills, DW Musou Feel
