# PBI-E002: Mana + Musou + Active Skills

## Priority: CRITICAL
## Points: 8

## Description
Add MP (mana) and Musou gauge resource systems.
Each hero gets 1 Tactical Skill (E key, costs MP) + 1 Ultimate (Q key, requires full Musou).

## Resource System
- MP: max 100, regen +3/s, used by tactical skill (E)
- Musou: 0-100, +2 per kill, +10 per elite, must be full to use (Q)

## Hero Skills
| Hero | Tactical (E) | MP Cost | Ultimate (Q) |
|------|-------------|---------|--------------|
| Berserker | Ground Slam — AoE stun | 25 | Rage Mode — 2x dmg, 2x speed for 5s |
| Strategist | Wind Burst — knockback cone | 35 | Eight Trigrams — 8 elemental bolts spiral |
| Assassin | Shadow Strike — teleport to enemy | 20 | Blade Storm — dash through all nearby enemies |
| Vanguard | Shield Wall — block all damage 2s | 30 | Changban Charge — invincible charge + AoE |
| Mystic | Life Drain — steal HP from enemies | 30 | Phoenix Summon — Phụng AoE fire + heal |

## Acceptance Criteria
- [ ] MP bar (blue) under HP bar in HUD
- [ ] Musou bar (gold) at bottom center, pulses when full
- [ ] E key fires tactical skill, drains MP, shows cooldown
- [ ] Q key fires ultimate when musou=100, resets to 0
- [ ] Each skill has distinct visual effects (particles, screen shake)
- [ ] MP regen pauses for 2s after using a skill
