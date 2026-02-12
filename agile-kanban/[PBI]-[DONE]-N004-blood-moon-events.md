# [PBI] N004: Blood Moon Events

**Priority:** HIGH (RICE: 149)
**Estimate:** 1 hour
**Phase:** N — The Visceral (v1.2)

## Description
Random "Blood Moon" events during combat that temporarily buff enemy spawns but double rewards. Creates exciting risk/reward moments mid-run.

## Acceptance Criteria
- [ ] 15% chance to trigger per room clear, guaranteed every 5 rooms without one
- [ ] 3-second warning: "⚠️ BLOOD MOON RISING..." in red text, screen tint starts shifting
- [ ] During event (30 seconds):
  - Canvas overlay tint shifts to deep crimson red
  - Red ambient particles drift across screen
  - Enemy spawn rate 2x
  - XP gain 2x
  - Gold drops 2x
  - Elite spawn chance 2x
- [ ] End with "The Blood Moon fades..." announcement
- [ ] Rewards summary flash after event ends ("+234 bonus XP earned!")
- [ ] Blood Moon icon shown on HUD during event with countdown timer
- [ ] Works in all room types (COMBAT and ELITE)

## Technical Notes
- `G.bloodMoon = { active: false, timer: 0, warned: false }`
- Modify spawn rate temporarily during blood moon
- Canvas tint: draw semi-transparent red overlay before entities
- Simple to implement — mostly visual + spawn rate multiplier

## Why This Matters
Blood Moon creates "stories" — "I had a Blood Moon on the boss floor and barely survived!" These random events break monotony and give players adrenaline spikes. The risk/reward tradeoff (harder but more rewarding) creates memorable moments.
