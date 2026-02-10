# [PBI] G001 - Entourage System (Mount Visual + Ally Buffs + Morale + War Cry)

## Priority: HIGH
## Estimate: Medium (2hr)
## Status: ✅ DONE (v0.8.0)

## Problem Statement
The game has 3 fragmented helper systems: Allies fight but don't buff, Mounts are invisible stat sticks, and there's no momentum/morale system. Dynasty Warriors is defined by its morale meter and army feel.

## Acceptance Criteria
- [x] Equipped mount is visually drawn beneath the player with unique colors per mount type
- [x] Allies provide passive aura buffs based on behavior type (tank/melee/ranged)
- [x] Morale meter (0-100) with 4 thresholds providing escalating team buffs
- [x] Musou activation triggers War Cry: morale→100, all allies buffed for 6s
- [x] HUD displays morale bar with flame theme and threshold labels
- [x] Ally aura effects shown as subtle colored rings

## Implementation Summary

### Files Modified
| File | Changes |
|------|---------|
| `engine.js` | Added `G.morale`, `G.moraleDecayTimer`, `G.allyAura` state |
| `renderer.js` | Mount visualization: 5 element colors, leg animation, Red Hare fire trail |
| `hud.js` | Ally aura calc, morale decay, War Cry buff, morale HUD bar, aura indicators, ally rings |
| `systems.js` | Ally aura DR on player damage, morale loss on hit (both melee + projectile) |
| `weapons.js` | Morale gain on kill, morale damage bonus, aura crit/atkSpd bonus |
| `game.js` | Morale speed bonus to player movement |

### Morale Thresholds
| Range | Label | Damage Bonus | Speed Bonus |
|-------|-------|-------------|-------------|
| 0-29 | Wavering | – | – |
| 30-59 | Steady | +5% | – |
| 60-79 | High Spirits | +10% | +5% |
| 80-100 | OVERWHELMING! | +20% | +10% |

### Ally Aura Buffs
| Behavior | Buff | Value (1st/2nd ally) |
|----------|------|---------------------|
| Tank | Damage Reduction | 10% / 15% |
| Melee | Attack Speed | 15% / 22.5% |
| Ranged | Crit Chance | 10% / 15% |

### War Cry (Musou Synergy)
- Triggers on any ultimate activation
- Sets morale to 100 instantly
- All living allies receive 6s golden buff (+30% dmg, +20% speed)
- Golden particle VFX on buffed allies
