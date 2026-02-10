# K003: Death Defiance

## Priority: HIGH
## Effort: Small
## Phase: K — The Roguelike Soul

## Description
Add Hades-style Death Defiance mechanic — free revives that prevent instant permadeath and give players a second chance.

## Acceptance Criteria
- [ ] 1 Death Defiance charge per run (default)
- [ ] On lethal damage: slow-mo effect, screen flash, revive at 30% HP
- [ ] Visual indicator on HUD showing remaining charges (skull icon)
- [ ] Dramatic revival VFX (phoenix burst, screen pulse)
- [ ] Charge consumed on use, no natural regen during run
- [ ] Upgradeable via Arcana skill tree (up to 3 charges)
- [ ] Brief invincibility window (2s) after revival
- [ ] SFX: dramatic revival sound

## Technical Notes
- Modify death check in `game.js` to intercept lethal hits
- Add `G.deathDefiance` counter
- Add Arcana skill nodes in `bonding.js` for extra charges
- Revival VFX in `renderer.js`
