# PBI-R001: Wu Xing Mutation System

**Epic:** Phase R: The Mutation (v1.4)
**Priority:** CRITICAL (RICE 450) — GAME-DEFINING KILLER FEATURE
**Status:** IN-PROGRESS

## Description
When acquiring a blessing of the NEXT element in the Wu Xing generating cycle (Wood→Fire→Earth→Metal→Water), existing blessings of the PREVIOUS element MUTATE into evolved, more powerful versions. This is the game's unique identity mechanic.

## Mechanics
- **Generating Cycle:** Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal collects Water, Water nourishes Wood
- **Trigger:** Gaining a Fire blessing when you already have a Wood blessing → Wood blessing MUTATES
- **Overcoming Cycle:** Triggers CORRUPTION (weaker mutation with debuff)
- **VFX:** Purple lightning + "⚡ WU XING MUTATION! ⚡" gold/purple text
- **Cap:** Each blessing can only mutate once

## Mutation Recipes (25 total: 5 blessings × 5 generating triggers)
See BRAINSTORM-HADES-ROGUELIKE-MEWGENICS-2026-02-12.md for full details.

## Technical Details
- Add WU_XING_MUTATIONS constant in blessings.js
- Modify addBlessing() to call checkMutations() 
- Mutations replace original blessing in BlessingState.active
- getBlessingStats() already handles varied effect types
