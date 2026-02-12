# PBI-R002: Blessing Stacking + Jade Shard

**Epic:** Phase R: The Mutation (v1.4)
**Priority:** HIGH (RICE 310)
**Status:** IN-PROGRESS

## Description
Allow getting the same blessing multiple times to stack effect (max Lv.3). Add Jade Shard pickup that upgrades a random blessing.

## Mechanics
- Same blessing ×2 = Lv.2 (doubled effect), ×3 = Lv.3 (tripled)
- Jade Shard: 15% drop from elites, upgrades random active blessing +1 level
- VFX: Green gem aura burst + "BLESSING ENHANCED!" text

## Technical Details
- Modify addBlessing() to handle stacking instead of rejecting duplicates
- Add `level` property to active blessings
- Update getBlessingStats() to multiply by level
- Add Jade Shard pickup type in systems.js
