# [PBI] F003 - AI Companion VFX Upgrade ("The Brotherhood")

## Priority: HIGH  
## Estimate: Medium (1-2hr)

## Problem Statement
AI companions (unlocked via Brotherhood bonds) currently fight with invisible attacks. They lack:
- Attack animations / VFX when hitting enemies
- Class-specific visual identity (tank=shield glow, ranged=projectile trails, melee=slash arcs)
- Damage numbers from ally attacks
- Visual feedback when allies take damage or die

## Acceptance Criteria
- [ ] Melee allies show slash arc VFX when attacking
- [ ] Ranged allies show visible projectile trails  
- [ ] Tank allies show shield glow / block animation
- [ ] Allies spawn hit particles on enemies they damage
- [ ] Damage numbers appear from ally attacks (different color from player)
- [ ] Ally take-damage flash effect
- [ ] Ally death effect (fade out + particles)
- [ ] Sacred Beast (Phoenix) attack VFX enhanced

## Technical Plan
1. Add attack VFX to `updateAllies()` in `hud.js`
2. Add visual feedback to ally damage in `drawAllies()`
3. Spawn damage numbers from ally kills
4. Add ally death particles and fade-out
5. Enhance Sacred Beast fire trail + attack VFX
