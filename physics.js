// ============================================================
// MEWGENICS INTEGRATION: PHYSICS & HAZARD SYSTEM (P001)
// ============================================================
// Core "Chaos" system inspired by Mewgenics (Team Meat).
// Elements are not just stats; they are physical layers on the battlefield.

const HAZARD_TYPES = {
    SCORCHED: { id: 'SCORCHED', color: '#552200', particles: '#ff4400', damage: 5, duration: 4.0, effect: 'burn' }, // Fire
    PUDDLE: { id: 'PUDDLE', color: '#224488', particles: '#4488ff', slow: 0.5, duration: 6.0, effect: 'wet' },       // Water
    MUD: { id: 'MUD', color: '#443311', particles: '#665522', slow: 0.3, duration: 8.0, effect: 'slow' },             // Earth
    ELECTRIFIED: { id: 'ELECTRIFIED', color: '#ffff0033', particles: '#ffff00', damage: 8, duration: 2.0, effect: 'stun' }, // Metal/Lightning
    OVERGROWN: { id: 'OVERGROWN', color: '#226622', particles: '#44aa44', heal: 2, duration: 5.0, effect: 'heal' },   // Wood
    STEAM: { id: 'STEAM', color: '#ffffff55', particles: '#ffffff', blind: true, duration: 3.0, effect: 'blind' },    // Fire + Water
    ICE: { id: 'ICE', color: '#aaddff', particles: '#ffffff', slide: true, duration: 5.0, effect: 'slide' }           // Water + Ice (alt)
};

// Global State for Hazards (managed in G.hazards in engine.js)
window.Physics = {

    // Spawn a hazard via global function
    spawnHazard: function (x, y, typeId, radius) {
        if (!G.hazards) G.hazards = [];

        const def = HAZARD_TYPES[typeId];
        if (!def) return;

        // Check for interactions with existing hazards
        for (let i = G.hazards.length - 1; i >= 0; i--) {
            const h = G.hazards[i];
            const d = Math.hypot(h.x - x, h.y - y);
            if (d < h.radius + radius) {
                // Interaction Logic (Mewgenics Chaos)
                if (this.checkInteraction(h, typeId, x, y)) {
                    // Interaction consumed the old hazard
                    G.hazards.splice(i, 1);
                    return;
                }
            }
        }

        G.hazards.push({
            x, y, type: typeId, radius,
            life: def.duration,
            def: def,
            tickTimer: 0
        });

        // Spawn visual pop
        spawnParticles(x, y, def.particles, 5, 20);
    },

    // Handle "Chemistry" between elements
    checkInteraction: function (existingZone, newType, x, y) {
        const t1 = existingZone.type;
        const t2 = newType;

        // Fire + Water = Steam
        if ((t1 === 'SCORCHED' && t2 === 'PUDDLE') || (t1 === 'PUDDLE' && t2 === 'SCORCHED')) {
            this.spawnHazard(x, y, 'STEAM', existingZone.radius * 1.5);
            spawnDmgNum(x, y, "STEAM!", '#ffffff', true);
            return true; // Consumed
        }

        // Water + Metal(Lightning) = Electrified Puddle
        // Assuming 'METAL' attacks might trigger 'ELECTRIFIED' directly, or we map Metal to Electrified
        if (t1 === 'PUDDLE' && t2 === 'ELECTRIFIED') {
            this.spawnHazard(x, y, 'ELECTRIFIED', existingZone.radius);
            spawnDmgNum(x, y, "ZAP!", '#ffff00', true);
            return true;
        }

        // Mud + Fire = Hardened Clay (Blocker)? Or just Scorched?
        if (t1 === 'MUD' && t2 === 'SCORCHED') {
            // Simply refresh scorched
            return false; // Don't consume, just overlay
        }

        return false;
    },

    update: function (dt) {
        if (!G.hazards) return;

        // Reset continuous flags for Player (Enemies handled in their loop or here?)
        // Better to reset here if we can iterate entities, or rely on entities resetting themselves.
        // Let's reset Player here for safety as it's a singleton.
        if (typeof P !== 'undefined') P._inHazardSlow = 0;
        // Enemies resetting is expensive if we iterate all G.enemies just to reset.
        // Instead, we can reset them in their own update loop? 
        // Or just iterate them here since we iterate hazards? 
        // Optimization: Iterating all enemies * hazards is O(N*M). 
        // If we have 50 enemies and 5 hazards, that's 250 checks. Fine.

        // Reset Enemy Flags - We need to do this efficiently.
        // We'll trust the Apply cycle to overwrite. But what if they leave the zone?
        // We need to clear flags every frame.
        if (G.enemies) {
            for (const e of G.enemies) e._inHazardSlow = 0;
        }

        for (let i = G.hazards.length - 1; i >= 0; i--) {
            const h = G.hazards[i];
            h.life -= dt;
            h.tickTimer += dt;

            // Continuous Effects (Every Frame): Slow, Slide
            this.applyZoneEffects(h, false);

            // Periodic Effects (Every 0.5s): Damage, Heal
            if (h.tickTimer >= 0.5) {
                h.tickTimer = 0;
                this.applyZoneEffects(h, true);
            }

            if (h.life <= 0) {
                G.hazards.splice(i, 1);
            }
        }
    },

    applyZoneEffects: function (zone, isPeriodic) {
        // Player
        const dP = Math.hypot(zone.x - P.x, zone.y - P.y);
        if (dP < zone.radius) {
            this.applyEffectToEntity(P, zone, isPeriodic);
        }

        // Enemies
        if (G.enemies) {
            for (const e of G.enemies) {
                const dE = Math.hypot(zone.x - e.x, zone.y - e.y);
                if (dE < zone.radius) {
                    this.applyEffectToEntity(e, zone, isPeriodic);
                }
            }
        }
    },

    applyEffectToEntity: function (ent, zone, isPeriodic) {
        const def = zone.def;

        if (isPeriodic) {
            // Periodic: Damage, Heal
            if (def.damage) {
                if (ent === P) {
                    if (!ent.invincible) ent.hp -= def.damage;
                } else {
                    if (typeof damageEnemy === 'function') {
                        damageEnemy(ent, def.damage, zone.type === 'SCORCHED' ? 'FIRE' : 'METAL');
                    } else {
                        ent.hp -= def.damage;
                    }
                }
            }
            if (def.heal && ent === P) {
                P.hp = Math.min(P.hp + def.heal, P.maxHp);
                spawnDmgNum(P.x, P.y - 10, "+" + def.heal, '#44ff44');
            }
            // Steam Blindness / Stun? Periodic to avoid permanent lock
            if (def.blind && ent === P) {
                // Add blindness logic later
            }
        } else {
            // Continuous: Slow, Slide
            if (def.slow) {
                // Stackable? Max? For now just take the strongest slow if multiple zones
                // Since we reset to 0, we can just assign or max.
                ent._inHazardSlow = Math.max(ent._inHazardSlow || 0, def.slow);
            }
            if (def.slide) {
                ent._inHazardSlide = true;
            }
        }
    },

    // Rendering called from Renderer
    render: function (ctx, camX, camY) {
        if (!G.hazards) return;

        for (const h of G.hazards) {
            const rx = h.x - camX;
            const ry = h.y - camY;

            // Simple Circle Render
            ctx.beginPath();
            ctx.arc(rx, ry, h.radius, 0, Math.PI * 2);
            ctx.fillStyle = h.def.color;
            ctx.fill();

            // Border interaction
            ctx.strokeStyle = h.def.particles;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};
