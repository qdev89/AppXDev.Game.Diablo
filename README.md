# 🎮 Dynasty Bruhhh Dungeon

**Vampire Survivors × Dynasty Warriors — A roguelike action game with Three Kingdoms mythology**

> Pure HTML5 Canvas · No frameworks · Asset-free · Procedural everything · Bilingual (VI/EN) · PWA Installable

## 🌐 Play Now

**[▶ Play Online](https://qdev89.github.io/AppXDev.Game.Diablo/)** — No install needed, runs in any browser!

📱 **Install as PWA** — Open the link above on mobile/desktop and click "Install" for offline play.

## 🚀 Quick Start (Local Development)

```bash
# Option 1: Direct open
# Just open index.html in your browser

# Option 2: Local server (recommended)
npx -y http-server -p 8080 -c-1 --cors
# Open http://localhost:8080
```

## 🎯 Game Overview

Dynasty Bruhhh Dungeon is a **Diablo × Dynasty Warriors** hybrid roguelike dungeon crawler built entirely with HTML5 Canvas 2D primitives and procedural Web Audio API sounds. No external assets needed.

### Key Features

- **6 Hero Classes** — Berserker, Strategist, Assassin, Vanguard, Mystic, Ranger
- **Room-Based Dungeon** — Hades-style room progression with door choices between rooms
- **7 Room Types** — Combat, Elite, Shop, Rest, Treasure, Blessing, Boss
- **Wu Xing Blessings** — 5 elemental deities, 25 blessings, set bonuses, duo blessings
- **Wu Xing (Five Elements)** — Wood 木 → Fire 火 → Earth 土 → Metal 金 → Water 水
- **Musou Ultimates** — Fill the gauge by slaying enemies, unleash devastating skills
- **Mana Skills** — Tactical abilities on cooldown that cost MP
- **Brotherhood Combos** — Fill the Brotherhood gauge, activate with [R] for devastating team attacks
- **Dynasty Warriors Feel** — Hordes of fodder enemies, chain kills, kill counters, morale system
- **AI Companions** — Brotherhood Bond heroes fight alongside you
- **Sacred Beasts** — Summon the Phoenix (Phụng) to orbit and attack
- **12 Mini-Boss Generals** — Named Three Kingdoms characters with unique abilities
- **Death Defiance** — Revive once per run when HP reaches 0
- **Difficulty Tiers** — Normal, Hard, Dynasty difficulty modes
- **Minimap Radar** — Toggle with [M] key, shows enemies, pickups, portal
- **Endgame Boss** — Đổng Trác spawns at 25:00, 3-phase fight with unique mechanics
- **Victory Screen** — Gold-themed run stats with Endless Mode continuation
- **🏆 Achievement System** — 18 achievements across Combat, Exploration, Mastery, and Secret categories
- **📅 Daily Challenge** — Seeded daily runs with unique modifiers (same challenge for all players)
- **📱 PWA Support** — Installable as app, offline play via Service Worker
- **Status Effect Combos** — Element + Element interactions for enhanced damage
- **Reroll & Banish** — QoL for level-up choices
- **Chain Frost Bolt** — Ice projectile that chains between enemies with slow debuff
- **Thrown Weapons** — Shurikens, Kunai, and Crossbow with fan-spread mechanics
- **Brotherhood Bonds** — Meta-progression bonding with Three Kingdoms heroes
- **Arcana Skill Tree** — Permanent upgrades across runs
- **Equipment Drops** — Armor, Talismans, Mounts with rarity tiers
- **Auto-attack Weapons** — Level-up choices, elemental affinities, evolution system
- **Boss Fights** — Multi-phase AI with charge attacks and shockwaves
- **Bilingual** — Full Vietnamese (VI) and English (EN), toggle with [L] key
- **Screen Transitions** — Smooth fade transitions between all game states
- **Procedural BGM** — 3-mood background music (menu ambient, combat drums, boss tension) via Web Audio API
- **Persistent Progress** — Settings, stats, achievements, and Arcana progress saved via localStorage
- **Animated Main Menu** — Ember particles, orbiting element symbols, glowing title

## ⚔️ Controls

| Key | Action |
|-----|--------|
| WASD / Arrows | Move |
| Space | Dodge Roll |
| E | Tactical Skill (costs MP) |
| Q | Ultimate / Musou (requires full gauge) |
| R | Brotherhood Combo (requires full Brotherhood gauge) |
| M | Toggle Minimap |
| L | Toggle Language (Vietnamese ↔ English) |
| TAB | Toggle Achievement List |
| ESC | Pause / Return to Menu |
| Click | Menu navigation |

## 🏆 Achievement System

18 achievements across 4 categories with tier-colored toast notifications:

| Category | Examples |
|----------|----------|
| ⚔️ Combat | First Blood, Slayer, Massacre, Combo King |
| 🏔️ Exploration | Deep Enough, Into The Abyss, Depth Dweller |
| 🌀 Mastery | Tyrant Slayer, Speed Demon, Elemental Master |
| 🔮 Secret | Untouchable, Rich Beyond Measure, Veteran |

## 📅 Daily Challenge

- **Seeded RNG** — Same hero + modifiers for all players each day
- **10 Unique Modifiers** — Speed Rush, Glass Cannon, Horde Mode, Treasure Hunter, Elemental Chaos, Boss Rush, Frugal, Blessing Rain, One HP Warrior, Titan Foes
- **Personal Best** — Track your best floor, kills, and time each day

## 🦸 Hero Classes

| Class | Hero | Element | Style |
|-------|------|---------|-------|
| ⚔️ Berserker | Lu Bu (Lữ Bố) | 🔥 Fire | AoE ground slams, rage mode |
| 🧙 Strategist | Zhuge Liang (Gia Cát Lượng) | 🌿 Wood | Wind bursts, 8 elemental bolts |
| 🗡️ Assassin | Zhou Yu (Chu Du) | ⚔️ Metal | Shadow strike teleport, blade storm |
| 🛡️ Vanguard | Zhao Yun (Triệu Vân) | 🏔️ Earth | Shield wall, invincible charge |
| 🌊 Mystic | Sima Yi (Tư Mã Ý) | 💧 Water | Life drain, phoenix summoning |
| 🏹 Ranger | Huang Zhong (Hoàng Trung) | 🌿 Wood | Arrow rain, shuriken storm, range bonus |

## ⚔️ Mini-Boss Generals

| General | Vietnamese | Unique Ability |
|---------|-----------|---------------|
| Guan Yu | Quan Vũ — Võ Thánh | Crescent Sweep |
| Zhang Fei | Trương Phi — Vạn Nhân Địch | Thunderous Roar |
| Lu Bu | Lữ Bố — Chiến Thần | Sky Piercer |
| Sun Ce | Tôn Sách — Tiểu Bá Vương | Little Conqueror |
| Zhang Liao | Trương Liêu — Oai Trấn Tiêu Dao | Terror Charge |
| Sima Yi | Tư Mã Ý — Ẩn Long | Dark Ritual |
| + 6 more... | | |

## 🌋 Physics Hazard System (New!)

**Inspired by Mewgenics (binding of isaac developer)** — A robust environmental hazard engine that adds "chemistry" to the combat:

- **Interactive Zones** — Weapons now spawn persistent hazard zones:
    - 🔥 **Scorched Earth** — Burns enemies over time (Fire attacks)
    - 💧 **Puddles** — Slows movement and wets entities (Water attacks)
    - 🌿 **Overgrowth** — Heals player, slows enemies (Wood attacks)
    - 🧱 **Mud** — Heavy slow, sticky movement (Earth attacks)
    - ⚡ **Electrified** — Stuns enemies in range (Metal/Lightning attacks)

- **Elemental Chemistry** — Hazards interact dynamically:
    - **Fire + Water = Steam** ☁️ (Blinds enemies, deals AoE steam damage)
    - **Water + Lightning = Electrified Puddle** ⚡ (Massive stun area)
    - **Mud + Fire = Baked Earth** 🌋 (Traps enemies in hardened clay)

## 📁 File Structure

```
├── index.html          # Entry point + PWA meta tags
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (cache-first offline)
├── icons/              # PWA icons (192x192, 512x512)
├── lang.js             # Bilingual localization (VI/EN)
├── engine.js           # Core engine, constants, state, input
├── game.js             # Game loop, player update, state machine
├── physics.js          # Environmental Hazards & Elemental Chemistry (New!)
├── heroes.js           # 6 hero classes, equipment, companions
├── weapons.js          # Weapon system, damage, musou
├── systems.js          # Enemy AI, spawning, level-up, rooms, shops
├── renderer.js         # All drawing/rendering, VFX
├── hud.js              # HUD, menus, hero select, daily challenge button
├── bonding.js          # Brotherhood bonds, Arcana skill tree
├── blessings.js        # Wu Xing Blessing System
├── achievements.js     # Achievement System (18 achievements, 4 categories)
├── daily.js            # Daily Challenge System (seeded runs, 10 modifiers)
├── sound.js            # Procedural SFX (Web Audio API)
├── sprites.js          # Pixel art sprite definitions
├── postfx.js           # Post-processing, biome tiles
├── evolution.js        # Weapon evolution system
└── agile-kanban/       # Development backlog
```

## 🏗️ Tech Stack

- **Canvas 2D** — All rendering via `ctx.fillRect()`, `ctx.arc()`, `ctx.fillText()`
- **Web Audio API** — All sounds generated procedurally (oscillators + noise)
- **localStorage** — High scores, achievements, and meta-progression persistence
- **Service Worker** — Cache-first offline strategy for PWA
- **Zero dependencies** — No npm, no build step, no external assets

## 📦 Version History

| Version | Phase | Highlights |
|---------|-------|------------|
| **v1.2.0** | Phase P: "Mewgenics Physics" | 🌋 Environmental Hazards, Elemental Chemistry, Weapon interactions |
| **v1.1.0** | Phase M: "The Infinite" | 🏆 Achievements, 📅 Daily Challenges, 📱 PWA + GitHub Pages |
| v1.0.0 | Phase L: "The Living World" | Minimap, Wu Xing combos, Đổng Trác final boss, Victory screen |
| v0.9.0 | Phases A-K | Core gameplay, 6 heroes, blessings, rooms, bonding, weapons |

---

*Built with ❤️ and pure JavaScript*
