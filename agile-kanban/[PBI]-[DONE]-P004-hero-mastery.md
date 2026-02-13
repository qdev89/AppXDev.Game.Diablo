# PBI-P004: Hero Mastery Tracks

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** MEDIUM-HIGH (RICE 190)
**Status:** TODO

## Description
Each hero gains mastery XP based on runs completed. Higher mastery unlocks permanent stat bonuses and cosmetic rewards for that specific hero. Creates a "main" incentive — play your favorite hero more, get rewarded.

## Mechanics
- **XP Sources:** Completing a run (any outcome) = 1 mastery point for that hero
- **Persistence:** Stored in localStorage per hero

## Mastery Levels

| Level | Runs Required | Reward |
|-------|---------------|--------|
| 1 | 3 | Unlock hero lore text |
| 2 | 5 | +5% base stats for this hero |
| 3 | 10 | Unlock alternate weapon variant |
| 5 | 20 | Unlock passive ability upgrade |
| 7 | 35 | +10% base stats for this hero |
| 10 | 50 | Unlock color-swap skin |

## Technical Details
- Track `heroMastery_${heroId}` in localStorage
- Apply mastery bonuses at run start in hero stat initialization
- Display mastery level on hero select screen (star icons or progress bar)
- Mastery Level 3+ requirements gate Aspect unlocks (ties into existing S001 system)
