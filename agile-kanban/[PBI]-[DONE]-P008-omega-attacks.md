# PBI-P008: Omega / Charged Attacks

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** MEDIUM (RICE 180)
**Status:** TODO

## Description
Hold the attack key for 1.5s to unleash a charged "Omega" version of the hero's base weapon that costs MP. Inspired by Hades 2. Distinct from E-skill (which is utility) — Omega is a DAMAGE upgrade of the base attack.

## Omega Attacks Per Hero

| Hero | Normal Attack | Omega Attack | MP Cost |
|------|-------------|-------------|---------|
| ⚔️ Lu Bu | Halberd swing | 360° fire shockwave (full room) | 30 MP |
| 🧙 Zhuge Liang | Fan bolt | Triple seeking wisps | 25 MP |
| 🗡️ Zhou Yu | Dual slash | Teleport-slash through enemies | 35 MP |
| 🛡️ Zhao Yun | Spear thrust | Spear tornado (sustained AoE) | 30 MP |
| 🌊 Sima Yi | Dark bolt | Void explosion (pull + damage) | 40 MP |
| 🏹 Huang Zhong | Arrow | Piercing siege arrow (5× dmg) | 20 MP |

## Mechanics
- **Input:** Hold attack key/button for 1.5s → charge indicator appears → release for Omega
- **Visual:** Glowing charge-up aura around hero, then dramatic release VFX
- **Balance:** High damage, high MP cost. Encourages MP management
- **Indicator:** Radial progress circle around hero while charging

## Technical Details
- Add `chargeTimer` to player state
- Modify weapon firing logic in `weapons.js` to detect held input
- Create Omega weapon definitions per hero in `heroes.js`
- Touch support: long-press detection
