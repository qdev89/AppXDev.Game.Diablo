# [PBI] N001: Floating Damage Numbers

**Priority:** CRITICAL (RICE: 350)
**Estimate:** 1.5 hours
**Phase:** N — The Visceral (v1.2)

## Description
Every hit on enemies shows a floating damage number that rises, fades, and disappears. This is THE #1 missing visual feedback in the game.

## Acceptance Criteria
- [ ] Normal hits show white damage numbers floating upward
- [ ] Critical hits show yellow/gold numbers with bounce animation and larger font
- [ ] Elemental damage uses color coding (red=fire, blue=ice, green=poison, purple=shadow)
- [ ] Number size scales with damage magnitude (small for 1-10, medium for 10-50, large for 50+)
- [ ] Numbers fade out over ~1 second while drifting upward
- [ ] Slight random X offset so stacked hits don't overlap perfectly
- [ ] Performance: use object pool, max 50 active numbers at once
- [ ] Player damage taken shows RED numbers near player

## Technical Notes
- Create `DamageNumber` array in game state
- Each entry: { x, y, text, color, size, alpha, vy, lifetime }
- Render in HUD layer above entities
- Pool and recycle objects to prevent GC pressure
- Font: bold monospace, shadow for readability

## Why This Matters
Every premium action game has damage numbers. Without them, combat feels muted and players can't tell if their build is actually getting stronger. This single feature will make the game feel 3x more polished.
