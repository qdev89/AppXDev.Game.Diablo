# 🎮 Dynasty Bruhhh Dungeon

**Vampire Survivors × Dynasty Warriors — A roguelike action game with Three Kingdoms mythology**

> Pure HTML5 Canvas · No frameworks · Asset-free · Procedural everything · Bilingual (VI/EN)

## 🚀 Quick Start

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
- **Wu Xing (Five Elements)** — Wood 木 → Fire 火 → Earth 土 → Metal 金 → Water 水
- **Musou Ultimates** — Fill the gauge by slaying enemies, unleash devastating skills
- **Mana Skills** — Tactical abilities on cooldown that cost MP
- **Brotherhood Combos** — Fill the Brotherhood gauge, activate with [R] for devastating team attacks
- **Dynasty Warriors Feel** — Hordes of fodder enemies, chain kills, kill counters, morale system
- **AI Companions** — Brotherhood Bond heroes fight alongside you
- **Sacred Beasts** — Summon the Phoenix (Phụng) to orbit and attack
- **12 Mini-Boss Generals** — Named Three Kingdoms characters with unique abilities
- **Chain Frost Bolt** — Ice projectile that chains between enemies with slow debuff
- **Thrown Weapons** — Shurikens, Kunai, and Crossbow with fan-spread mechanics
- **Brotherhood Bonds** — Meta-progression bonding with Three Kingdoms heroes
- **Arcana Skill Tree** — Permanent upgrades across runs
- **Equipment Drops** — Armor, Talismans, Mounts with rarity tiers
- **Auto-attack Weapons** — Level-up choices, elemental affinities, evolution system
- **Boss Fights** — Multi-phase AI with charge attacks and shockwaves
- **Treasure Rooms** — Special reward floors every 3 levels
- **Bilingual** — Full Vietnamese (VI) and English (EN), toggle with [L] key

## ⚔️ Controls

| Key | Action |
|-----|--------|
| WASD / Arrows | Move |
| Space | Dodge Roll |
| E | Tactical Skill (costs MP) |
| Q | Ultimate / Musou (requires full gauge) |
| R | Brotherhood Combo (requires full Brotherhood gauge) |
| L | Toggle Language (Vietnamese ↔ English) |
| Click | Menu navigation |

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

## 📁 File Structure

```
├── index.html      # Entry point
├── lang.js         # Bilingual localization (VI/EN)
├── engine.js       # Core engine, constants, state, input
├── game.js         # Game loop, player update, state machine
├── heroes.js       # 6 hero classes, equipment, companions, sacred beasts
├── weapons.js      # Weapon system, damage, musou, thrown weapons
├── systems.js      # Enemy AI, spawning, level-up, pickups, debuffs
├── renderer.js     # All drawing/rendering, chain frost VFX
├── hud.js          # HUD, menus, hero select, brotherhood gauge
├── bonding.js      # Brotherhood bonds, Arcana skill tree, combos
├── sound.js        # Procedural SFX (Web Audio API)
├── sprites.js      # Pixel art sprite definitions
├── postfx.js       # Post-processing, biome tiles
├── evolution.js    # Weapon evolution system
└── agile-kanban/   # Development backlog
```

## 🏗️ Tech Stack

- **Canvas 2D** — All rendering via `ctx.fillRect()`, `ctx.arc()`, `ctx.fillText()`
- **Web Audio API** — All sounds generated procedurally (oscillators + noise)
- **localStorage** — High scores and meta-progression persistence
- **Zero dependencies** — No npm, no build step, no external assets

## 📦 Version

**v0.9.0** — Phase H: "Dynasty Warriors Expansion"

---

*Built with ❤️ and pure JavaScript*
