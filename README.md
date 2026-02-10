# 🎮 Dynasty Bruhhh Dungeon

**Vampire Survivors × Dynasty Warriors — A roguelike action game with Chinese mythology**

> Pure HTML5 Canvas · No frameworks · Asset-free · Procedural everything

## 🚀 Quick Start

```bash
# Start local server
npx -y http-server -p 8080 -c-1 --cors

# Open in browser
http://localhost:8080
```

## 🎯 Game Overview

Dynasty Bruhhh Dungeon is a **Diablo × Dynasty Warriors** hybrid roguelike dungeon crawler built entirely with HTML5 Canvas 2D primitives and procedural Web Audio API sounds. No external assets needed.

### Key Features

- **5 Hero Classes** — Berserker, Strategist, Assassin, Vanguard, Mystic
- **Wu Xing (Five Elements)** — Wood 木 → Fire 火 → Earth 土 → Metal 金 → Water 水
- **Musou Ultimates** — Fill the gauge by slaying enemies, unleash devastating skills
- **Mana Skills** — Tactical abilities on cooldown that cost MP
- **Dynasty Warriors Feel** — Hordes of fodder enemies, chain kills, kill counters
- **AI Companions** — Brotherhood Bond heroes fight alongside you
- **Sacred Beasts** — Summon the Phoenix (Phụng) to orbit and attack
- **Brotherhood Bonds** — Meta-progression bonding with Three Kingdoms heroes
- **Arcana Skill Tree** — Permanent upgrades across runs
- **Equipment Drops** — Armor, Talismans, Mounts with rarity tiers
- **Auto-attack Weapons** — Level-up choices, elemental affinities, evolution system
- **Boss Fights** — Multi-phase AI with charge attacks and shockwaves
- **Treasure Rooms** — Special reward floors every 3 levels

## ⚔️ Controls

| Key | Action |
|-----|--------|
| WASD / Arrows | Move |
| Space | Dodge Roll |
| E | Tactical Skill (costs MP) |
| Q | Ultimate / Musou (requires full gauge) |
| Click | Menu navigation |

## 🦸 Hero Classes

| Class | Hero | Element | Style |
|-------|------|---------|-------|
| ⚔️ Berserker | Lu Bu | 🔥 Fire | AoE ground slams, rage mode |
| 🧙 Strategist | Zhuge Liang | 🌿 Wood | Wind bursts, 8 elemental bolts |
| 🗡️ Assassin | Zhou Yu | ⚔️ Metal | Shadow strike teleport, blade storm |
| 🛡️ Vanguard | Zhao Yun | 🏔️ Earth | Shield wall, invincible charge |
| 🌊 Mystic | Sima Yi | 💧 Water | Life drain, phoenix summoning |

## 📁 File Structure

```
├── index.html      # Entry point
├── engine.js       # Core engine, constants, state, input
├── game.js         # Game loop, player update, state machine
├── heroes.js       # 5 hero classes, equipment, companions, sacred beasts
├── weapons.js      # Weapon system, damage, musou tracking
├── systems.js      # Enemy AI, spawning, level-up, pickups
├── renderer.js     # All drawing/rendering
├── hud.js          # HUD, menus, hero select, skill icons
├── bonding.js      # Brotherhood bonds, Arcana skill tree
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

**v0.7.0** — Phase E: "The Dynasty Awakens"

---

*Built with ❤️ and pure JavaScript*
