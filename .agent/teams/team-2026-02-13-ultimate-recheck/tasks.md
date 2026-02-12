# Team Tasks: Ultimate Recheck & Implementation

## Heroes & Ultimates Inventory
| Hero | Class | Ultimate ID | Ultimate Name | Description |
|------|-------|-------------|---------------|-------------|
| Lu Bu | Berserker | rage_mode | Dynasty Fury | 2x damage + 1.5x speed for 6s |
| Zhuge Liang | Strategist | eight_trigrams | Eight Trigrams | 8 elemental bolts spiral out |
| Zhou Yu | Assassin | blade_storm | Blade Storm | Dash through all nearby enemies |
| Zhao Yun | Vanguard | changban_charge | Changban Charge | Invincible charge + AoE explosion |
| Sima Yi | Mystic | phoenix_summon | Sacred Phoenix | Summon Phụng — fire AoE + heal |
| Huang Zhong | Ranger | shuriken_storm | Shuriken Storm | Whirlwind of 20 homing shuriken |

## Task Breakdown

| ID | Task | Agent | Depends On | Status | Priority |
|----|------|-------|------------|--------|----------|
| T-01 | Static Code Audit: Verify all hero.ultimate properties match implementation | analyst | none | TODO | HIGH |
| T-02 | Runtime Mechanics Test: Test damage/buff/heal effects actually apply | tester-mechanics | none | TODO | HIGH |
| T-03 | Runtime VFX Test: Visual quality check all 6 ultimates | tester-vfx | none | TODO | MEDIUM |
| T-04 | Fix all issues found by T-01/T-02/T-03 | fixer | T-01,T-02,T-03 | BLOCKED | HIGH |
| T-05 | Integration test: Full gameplay verification | verifier | T-04 | BLOCKED | HIGH |

## Parallel Groups
- **Group 1** (parallel): T-01, T-02, T-03
- **Group 2** (sequential): T-04 (depends on Group 1)
- **Group 3** (sequential): T-05 (depends on T-04)
