# Team Tasks: Wire Equipment Stats Into Combat

| ID | Task | Assigned To | Backend | Depends On | Status | Priority |
|----|------|-------------|---------|------------|--------|----------|
| T-01 | Wire `P.dmgReduction` into ALL scattered `P.hp -=` paths (boss slam, shockwave, bomber, archer bullets, etc.) | armor-engineer | direct | none | TODO | 🔴 CRITICAL |
| T-02 | Wire talisman proc effects into `damageEnemy()` (burn, slow, chain, reflect proj, explode) | talisman-engineer | direct | none | TODO | 🔴 CRITICAL |
| T-03 | Wire `P.fireTrailOnDodge` into dodge system + apply `P.dodgeCdBonus` to dodge cooldown | mount-engineer | direct | none | TODO | 🟡 HIGH |
| T-04 | Add `RARITY_COLORS` + `RARITY_NAMES` constants to `heroes.js` | rarity-engineer | direct | none | TODO | 🟡 HIGH |

## Wave 1: ALL PARALLEL
All 4 tasks modify different code regions — zero conflict risk.

## Discovery Findings
- `eqArmor.def` and `eqArmor.reflect` are ALREADY applied in the centralized contact damage block (systems.js:1074-1080)
- BUT scattered damage paths (boss slam, shockwave, bomber, archer bullets) skip equipment DR entirely
- `P.fireTrailOnDash` already exists for Red Cliffs aspect (game.js:617) — can reuse pattern for `P.fireTrailOnDodge`
- `P.dodgeCd = 1.0` is hardcoded in engine.js:324 — need to apply `P.dodgeCdBonus` there
