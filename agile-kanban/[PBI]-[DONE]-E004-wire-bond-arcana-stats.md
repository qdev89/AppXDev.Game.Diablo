# PBI-E004: Wire Up Bond & Arcana Stats to Combat

## Priority: CRITICAL
## Points: 3

## Description
Bond and Arcana stats are DEFINED in bonding.js but NEVER APPLIED in combat code.
Wire all stat effects into their respective systems.

## Stats to Wire
### Arcana Stats
- baseDmg → apply in damageEnemy() as multiplier
- maxHpBonus → apply in startGame() to P.maxHp
- moveSpd → already partially applied via passives
- waterSlow → apply in damageEnemy() when el=WATER
- metalCrit → apply in damageEnemy() when el=METAL (chance for 2x)
- yinYangSpeed → apply in updateYinYang()

### Bond Stats  
- dmgPerWeapon → apply in damageEnemy() per weapon count
- dmgReduction → apply in updateEnemies() contact damage (already has getBondDmgReduction but verify)
- glass (dmg boost + take more) → apply in both damage dealt and received
- weaponBoost → apply in startGame() to give weapons +level

## Acceptance Criteria
- [ ] Every stat in SKILL_TREE actually affects gameplay when equipped
- [ ] Every bond level effect actually modifies combat
- [ ] Visual feedback when bonus triggers (damage numbers show crit color, etc.)
