# PBI-S001: Hero Aspect System

**Epic:** Phase S: The Aspects (v1.5)
**Priority:** CRITICAL (RICE 400)
**Status:** IN-PROGRESS

## Description
3 aspects per hero = 18 distinct playstyles. Each aspect changes base weapon behavior, passive ability, and visual appearance.

## Aspect List (18 total)
See BRAINSTORM-HADES-ROGUELIKE-MEWGENICS-2026-02-12.md for full details.

## Technical Details
- Add `aspects` array to each hero in HEROES (heroes.js)
- Add aspect selection UI to hero select screen
- Aspects modify baseWeapon, passive, and skill behavior
- Store selected aspect in game state
