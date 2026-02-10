# PBI-E006: Sacred Beast — Phụng (Phoenix)

## Priority: HIGH
## Points: 5

## Description
First of the Tứ Linh (Four Sacred Beasts). Fire element phoenix that orbits the player,
shoots fire bolts, and revives on death.

## Mechanics
- Orbits player at 40px radius, shoots fire bolt every 2s at nearest enemy
- Affinity: grows by killing FIRE element enemies (0-100)
- At affinity 50: fire bolts become homing
- At affinity 100: on death, revive with 100% HP + massive fire AoE (phoenix rebirth)
- Visual: Red-gold fire bird sprite, flame trail particles

## Future Sacred Beasts (Phase F)
- Long (Dragon/WOOD) — poison trail, AoE breath
- Lân (Qilin/EARTH) — stun charge, double gold drops
- Quy (Turtle/WATER) — damage shield, HP regen aura

## Acceptance Criteria
- [ ] G.sacredBeast object with position, angle, affinity
- [ ] Phoenix orbits player, auto-targets nearest enemy
- [ ] Fire bolt projectiles with particle trails
- [ ] Affinity growth from FIRE kills
- [ ] Death revive mechanic at affinity 100
- [ ] Pixel art phoenix sprite in renderer
