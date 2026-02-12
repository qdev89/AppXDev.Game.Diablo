# Brainstorm Report: Mewgenics Integration

## Executive Summary
This report analyzes the core strengths of *Mewgenics* (Team Meat) and proposes a strategy to integrate its "Genetic Chaos" and "Physics-Driven Tactics" into *AppXDev.Game.Diablo*. The goal is to evolve the current Survivor-like loop into a deeper, stickier experience with **generational consequences** and **emergent battlefield interactions**, moving beyond simple stat-checking to tactical sandbox gameplay.

## 1. Problem Definition
### Problem Statement
Current gameplay relies on standard "Survivor" tropes: linear upgrades, predictable combat, and static hero definitions. It lacks the "chaos," "emergent humor," and "long-term emotional investment" (via lineage) that defines modern deep roguelites like Mewgenics.

### Context
*   **Target Game:** AppXDev.Game.Diablo (Action/Survivor RPG with Wu Xing elements).
*   **Inspiration:** Mewgenics (Turn-based tactical breeding sim with physics chaos).
*   **Gap:** We have Elements (Wu Xing) but they are just math multipliers. We have Heroes but they are static.

### Constraints
*   **Genre Gap:** Blending Turn-Based mechanics into Real-Time Action.
*   **Asset Limitations:** Cannot generate infinite visual cat variations (need to use existing sprites/tints).
*   **Performance:** Physics/Fluid simulation must run in browser/JS at 60fps with hundreds of entities.

## 2. Discovery Summary (Mewgenics Strong Points)
1.  **Genetic Lineage:** Breeding passing on stats, abilities, and *flaws*. High emotional stakes.
2.  **Emergent Physics:** Elements aren't just damage types; they change the terrain (Fire spreads, Water conducts, Ice slides).
3.  **Permanent Consequence:** Injuries/Scars that persist across runs, altering playstyle (e.g., "Broken Leg" = slower move speed but maybe pity bonus).
4.  **Tangible Homestead:** Base building that directly impacts breeding odds and unit recovery.

## 3. Ideas Generated (The "Mew-ification" Plan)

### Category A: The "Elemental Chaos" (Physics & Environment)
**Impact: CRITICAL (Transforms Combat)**
1.  **Dynamic Surface Layers:**
    *   *Idea:* Instead of just hitting enemies, attacks paint the floor.
    *   *Mew-Twist:* **Fire** creates "Scorched Earth" (DoT). **Water** creates "Puddles". **Lightning** striking a Puddle creates an "Electrified Zone" (Stun). **Ice** creates "Slippery Terrain" (Loss of control/Knockback amplification).
    *   *Implementation:* A localized low-res grid or list of "Hazard Zones".

2.  **Object Physics & Knockback Lethality:**
    *   *Idea:* Knockback is currently defensive.
    *   *Mew-Twist:* "Wall Splat" damage. If an enemy is knocked into a wall or obstacle, they take massive bonus damage + Stun.
    *   *Combo:* Knocking an enemy *into* another enemy causes collision damage to both.

### Category B: The "Ancestral Souls" (Lineage System)
**Impact: HIGH (Transforms Progression)**
1.  **Hero Retirement & Breeding:**
    *   *Idea:* "Prestige" with personality.
    *   *Mew-Twist:* When a run ends (Victory or Death), the hero's "Soul" is preserved. It has **Traits** based on how they played (e.g., "Coward" if they dodged a lot, "Berserker" if they took damage).
    *   *Fusion:* You don't breed cats; you **Fuse Souls** into the next generation Hero.
    *   *Result:* Gen 2 Hero starts with base stats and "Mutations" from the Gen 1 parents.

2.  **Permanent Scars (Roguelite Flaws):**
    *   *Idea:* Negative traits that grant meta-currency or unique playstyles.
    *   *Mew-Twist:* "Cursed Bloodline". A hero might start with "Short Sighted" (Fog of War is closer) but +20% Gold Gain.

### Category C: The "Living Base" (Homestead)
**Impact: MEDIUM (Retention)**
1.  **Feng Shui Totems:**
    *   *Idea:* Base upgrades that are physical objects.
    *   *Mew-Twist:* Placing a "Fire Totem" near a "Wood Totem" in the menus boosts Fire Damage by 10% (Burning logic) but risks "burning" (degrading) the Wood Totem over time.

## 4. Evaluation & Selection

### Winner 1: "Dynamic Hazard System" (Physics)
*   **Why:** Directly enhances the existing Wu Xing system. Makes the "Five Elements" feel real, not just colors.
*   **Effort:** High (requires spatial grid logic), but high payoff for "Game Feel".

### Winner 2: "Soul Mutation System" (Lineage)
*   **Why:** Solves the "static hero" problem. Adds the "One more run" urge to create the perfect "Offspring".
*   **Effort:** Medium (mostly UI and data structure changes).

## 5. Recommended Solution: Phase 1 "Chaos & Lineage"
We will implement two core systems to capture the spirit of Mewgenics:

1.  **The Environmental Reaction System:**
    *   Modify `weapons.js` / `engine.js` to spawn `HazardZones`.
    *   Implement interaction logic (Fire+Water=Steam, etc.).
    *   Implement "Wall Splat" physics.

2.  **The Soul Mutation Engine:**
    *   On Game Over: Generate a `SoulGene` object capturing the run's DNA.
    *   New Menu: "Ancestral Altar" to select a previous Soul to "inherit" traits from for the new run.
    *   Traits include distinct "Mew-like" flaws (e.g., "Zoomies": Random speed bursts, "Scaredy Cat": Less defense when enemies are close).

## 6. Implementation Plan (Next Steps)
1.  **Create `physics.js`:** Handle Hazard Zones and Collision logic.
2.  **Update `engine.js`:** Render Hazard Zones (under entities).
3.  **Update `game.js`:** Save/Load "Soul Genes".
4.  **Update `weapons.js`:** Attacks trigger Hazard creation.

---
**Status:** Approved for Design
**Decision Maker:** Conductor (Antigravity)
