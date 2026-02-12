# [PBI] N003: Elite Enemy Modifiers

**Priority:** HIGH (RICE: 216)
**Estimate:** 2 hours
**Phase:** N — The Visceral (v1.2)

## Description
Elite enemies spawn with 1-2 random modifiers that change their behavior and appearance. Creates combat variety and tactical challenge.

## Acceptance Criteria
- [ ] 6 modifier types implemented:
  - 🛡️ **Shielded:** 50% damage reduction for first 3 hits, then shield breaks (blue glow)
  - ⚡ **Berserker:** At <30% HP, gains +100% speed and +50% damage (red pulse)
  - 🧬 **Splitting:** On death, spawns 2 copies at 50% size and 40% HP (green particles)
  - 🧛 **Vampiric:** Heals 10% of damage dealt to player (purple aura)
  - 💫 **Teleporter:** Blinks to random nearby position every 3 seconds (flicker effect)
  - 🔥 **Molten:** On death, creates fire AoE that deals damage for 3 seconds (fire trail)
- [ ] Floor-based modifier count: Floor 1-2: 1 modifier, Floor 3-4: 1-2, Floor 5+: 2
- [ ] Modifier icons shown above elite's head (small colored circles/symbols)
- [ ] Modifier name briefly shown when elite spawns ("ELITE: Vampiric Berserker!")
- [ ] Modified elites drop better rewards (1.5x XP, higher item chance)
- [ ] Modifiers are randomly assigned from pool, no duplicate modifiers on same elite

## Technical Notes
- Add `modifiers: []` array to elite enemy objects
- Each modifier is a behavior module that hooks into the enemy update loop
- Use particle effects for visual distinction
- Splitting modifier needs careful handling to avoid infinite recursion (splits don't split)

## Why This Matters
Currently all elites feel the same — they're just tankier. Modifiers create "puzzle enemies" where players must adapt their strategy. A Vampiric Berserker requires burst damage, while a Shielded Teleporter forces area attacks. This single feature doubles combat variety.
