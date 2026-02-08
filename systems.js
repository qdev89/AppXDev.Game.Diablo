// ============================================================
// DYNASTY BRUHHH DUNGEON - Enemies & Spawning
// ============================================================

function spawnEnemy(x, y, type) {
    const el = rngEl();
    const elDef = ELEMENTS[el];
    const floorMult = 1 + (G.floor - 1) * 0.15;
    const types = {
        grunt: { hp: 20, speed: 35, dmg: 5, r: 6, xp: 3 },
        fast: { hp: 12, speed: 65, dmg: 3, r: 5, xp: 4 },
        tank: { hp: 60, speed: 20, dmg: 10, r: 9, xp: 8 },
        elite: { hp: 120, speed: 30, dmg: 15, r: 11, xp: 20 },
        boss: { hp: 500, speed: 18, dmg: 25, r: 16, xp: 100 }
    };
    const t = types[type] || types.grunt;
    const enemy = {
        x, y, vx: 0, vy: 0,
        hp: t.hp * floorMult, maxHp: t.hp * floorMult,
        speed: t.speed, dmg: t.dmg * floorMult,
        r: t.r, el, color: elDef.color, lightColor: elDef.light,
        type, flash: 0, knockX: 0, knockY: 0, dead: false,
        attackCd: 0, spawnAnim: 0.4
    };
    // Boss-specific phase tracking
    if (type === 'boss') {
        enemy.phase = 1;
        enemy.chargeTimer = 0;
        enemy.chargeCd = 5;
        enemy.shockwaveCd = 8;
        enemy.entranceTimer = 1.5; // entrance freeze
        enemy.enraged = false;
        // Boss entrance announcement
        G.floorAnnounce = { text: '\u26a0 BOSS INCOMING \u26a0', timer: 2.5 };
        triggerFlash('#ff0000', 0.3);
        shake(4, 0.3);
    }
    G.enemies.push(enemy);
}

function spawnWave() {
    const count = G.enemiesPerWave + G.floor * 2;
    const cx = P.x, cy = P.y;
    for (let i = 0; i < count; i++) {
        const angle = rng(0, Math.PI * 2);
        const dist = rng(180, 300);
        const x = clamp(cx + Math.cos(angle) * dist, 30, G.arenaW - 30);
        const y = clamp(cy + Math.sin(angle) * dist, 30, G.arenaH - 30);
        const roll = Math.random();
        let type = 'grunt';
        if (roll < 0.05 && G.floor >= 3) type = 'elite';
        else if (roll < 0.15) type = 'tank';
        else if (roll < 0.35) type = 'fast';
        spawnEnemy(x, y, type);
    }
}

function updateEnemies(dt) {
    for (let i = G.enemies.length - 1; i >= 0; i--) {
        const e = G.enemies[i];
        if (e.dead) { G.enemies.splice(i, 1); continue; }

        // Spawn animation timer
        if (e.spawnAnim > 0) e.spawnAnim -= dt;

        // Flash timer
        if (e.flash > 0) e.flash -= dt;

        // Knockback
        if (Math.abs(e.knockX) > 0.1 || Math.abs(e.knockY) > 0.1) {
            e.x += e.knockX * dt * 10;
            e.y += e.knockY * dt * 10;
            e.knockX *= 0.9; e.knockY *= 0.9;
        }

        // Chase player (with boss-specific AI)
        const dx = P.x - e.x, dy = P.y - e.y;
        const d = Math.hypot(dx, dy);

        if (e.type === 'boss') {
            // Boss entrance freeze
            if (e.entranceTimer > 0) {
                e.entranceTimer -= dt;
                continue; // boss doesn't move during entrance
            }

            // Phase transitions
            const hpPct = e.hp / e.maxHp;
            if (hpPct < 0.3 && e.phase < 3) {
                e.phase = 3;
                e.enraged = true;
                e.speed *= 2;
                e.dmg *= 1.5;
                G.floorAnnounce = { text: '\ud83d\udd25 BOSS ENRAGED! \ud83d\udd25', timer: 2 };
                triggerFlash('#ff4400', 0.3);
                triggerChromatic(3);
                shake(5, 0.3);
                spawnElementParticles(e.x, e.y, e.el, 20, 80);
            } else if (hpPct < 0.6 && e.phase < 2) {
                e.phase = 2;
                e.speed *= 1.3;
                G.floorAnnounce = { text: '\u26a1 BOSS PHASE 2 \u26a1', timer: 1.5 };
                triggerFlash('#ffaa00', 0.2);
            }

            // Boss charge attack (Phase 2+)
            if (e.phase >= 2) {
                e.chargeCd -= dt;
                if (e.chargeCd <= 0 && d < 200) {
                    e.chargeCd = e.enraged ? 3 : 5;
                    // Lunge toward player
                    const chargeSpeed = e.enraged ? 400 : 250;
                    e.knockX = (dx / d) * chargeSpeed * 0.02;
                    e.knockY = (dy / d) * chargeSpeed * 0.02;
                    shake(3, 0.1);
                    spawnElementParticles(e.x, e.y, e.el, 6, 40);
                }
            }

            // Boss shockwave (Phase 3 — enrage)
            if (e.enraged) {
                e.shockwaveCd -= dt;
                if (e.shockwaveCd <= 0) {
                    e.shockwaveCd = 4;
                    // AoE shockwave damage to player if nearby
                    if (d < 80 && P.invincible <= 0) {
                        const dr = getBondDmgReduction();
                        P.hp -= e.dmg * 0.5 * (1 - dr);
                        P.damageFlash = 0.2;
                        P.invincible = 0.5;
                        shake(4, 0.15);
                    }
                    // Visual shockwave ring
                    G.bullets.push({
                        x: e.x, y: e.y, type: 'aoe_ring', r: 80,
                        color: ELEMENTS[e.el].light, el: e.el,
                        life: 0.5, maxLife: 0.5
                    });
                    spawnElementParticles(e.x, e.y, e.el, 12, 60);
                    triggerChromatic(1.5);
                }
                // Enrage visual: ambient particle pulsing
                if (Math.random() < 0.3) {
                    spawnParticles(e.x + rng(-15, 15), e.y + rng(-15, 15), '#ff4400', 1, 20);
                }
            }
        }

        if (d > 5) {
            e.x += (dx / d) * e.speed * dt;
            e.y += (dy / d) * e.speed * dt;
        }

        // Collision with player
        if (d < e.r + 6 && P.invincible <= 0) {
            e.attackCd -= dt;
            if (e.attackCd <= 0) {
                // Apply bonding damage reduction
                const dr = getBondDmgReduction();
                const dmg = e.dmg * (1 - dr);
                P.hp -= dmg;
                P.damageFlash = 0.15;
                P.invincible = 0.3;
                G.combo = 0; // combo reset on hit!
                G.yinYang.yin = clamp(G.yinYang.yin + 3, 0, 100); // Yin from damage
                shake(3, 0.1);
                spawnDmgNum(P.x, P.y - 12, Math.ceil(dmg), '#ff3333', true);
                spawnParticles(P.x, P.y, '#ff3333', 5, 50);
                SFX.playerHit();
                e.attackCd = 0.5;
            }
        }

        // Stay in arena
        e.x = clamp(e.x, 5, G.arenaW - 5);
        e.y = clamp(e.y, 5, G.arenaH - 5);

        // Separation from other enemies (simple)
        for (let j = i + 1; j < G.enemies.length; j++) {
            const o = G.enemies[j];
            const sep = dist(e, o);
            if (sep < e.r + o.r && sep > 0) {
                const push = (e.r + o.r - sep) * 0.3;
                const sx = (e.x - o.x) / sep, sy = (e.y - o.y) / sep;
                e.x += sx * push; e.y += sy * push;
                o.x -= sx * push; o.y -= sy * push;
            }
        }
    }
}

// --- Level Up System ---
function checkLevelUp() {
    if (P.xp >= P.xpNeeded) {
        P.xp -= P.xpNeeded;
        P.level++;
        P.xpNeeded = Math.floor(20 * Math.pow(1.3, P.level - 1));
        // Small heal on level up (10% HP) - NOT full recovery
        P.hp = Math.min(P.hp + P.maxHp * 0.1, P.maxHp);
        G.state = 'LEVEL_UP';
        generateLevelUpChoices();
        spawnParticles(P.x, P.y, '#ffff00', 20, 80);
        spawnElementParticles(P.x, P.y, P.element, 15, 60);
        shake(3, 0.15);
        triggerFlash('#ffffff', 0.2);
        SFX.levelUp();
        // Track bonding XP
        if (G.bonding) G.bonding.xpEarned = (G.bonding.xpEarned || 0) + 5;
    }
}

function generateLevelUpChoices() {
    const choices = [];

    // Check for evolution opportunity first
    if (typeof getEvolutionChoice === 'function') {
        const evoChoice = getEvolutionChoice();
        if (evoChoice) {
            choices.push(evoChoice);
        }
    }

    const available = WEAPON_DEFS.filter(w => {
        // Can upgrade existing weapons
        const existing = G.weapons.find(ew => ew.id === w.id);
        if (existing && existing.level < 5) return true;
        // Can add new weapons if slots available (max 6 active)
        if (!existing && w.type !== 'passive' && G.weapons.filter(ww => ww.type !== 'passive').length < 6) return true;
        // Passives always available
        if (w.type === 'passive') return true;
        return false;
    });
    // Pick remaining slots (3 total, minus evolution if present)
    const remaining = 3 - choices.length;
    const shuffled = available.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(remaining, shuffled.length); i++) {
        const def = shuffled[i];
        const existing = G.weapons.find(w => w.id === def.id);
        choices.push({
            def, isUpgrade: !!existing,
            level: existing ? existing.level + 1 : 1
        });
    }
    G.levelUpChoices = choices;
}

function handleLevelUpClick(mx, my) {
    if (G.state !== 'LEVEL_UP') return;
    const choices = G.levelUpChoices;
    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 5;
    for (let i = 0; i < choices.length; i++) {
        const bx = startX + i * (boxW + gap);
        if (mx >= bx && mx <= bx + boxW && my >= startY && my <= startY + boxH) {
            selectLevelUpChoice(choices[i]);
            return;
        }
    }
}

function selectLevelUpChoice(choice) {
    const def = choice.def;

    // Handle evolution
    if (choice.isEvolution && def.isEvolution) {
        applyEvolution(def);
        G.state = 'PLAYING';
        G.levelUpChoices = [];
        return;
    }

    if (def.type === 'passive') {
        applyPassive(def);
    } else {
        const existing = G.weapons.find(w => w.id === def.id);
        if (existing) {
            existing.level++;
            existing.dmg = def.dmg * (1 + existing.level * 0.3);
            existing.range = (def.range || 40) + existing.level * 8;
        } else {
            G.weapons.push(createWeapon(def));
        }
    }
    G.state = 'PLAYING';
    G.levelUpChoices = [];
    SFX.menuClick();
}

// --- Yin-Yang Update ---
function updateYinYang(dt) {
    const yy = G.yinYang;
    // Natural decay
    yy.yin = Math.max(0, yy.yin - dt * 2);
    yy.yang = Math.max(0, yy.yang - dt * 1.5);

    // State detection
    if (yy.yin >= 80 && yy.yang >= 80) {
        yy.state = 'HARMONY'; yy.timer = 10;
    } else if (yy.yang >= 95 && yy.yin < 30) {
        yy.state = 'CHAOS'; yy.timer = 8;
    } else if (yy.yin >= 95 && yy.yang < 30) {
        yy.state = 'SERENITY'; yy.timer = 5;
    } else if (yy.timer > 0) {
        yy.timer -= dt;
        if (yy.timer <= 0) yy.state = 'NEUTRAL';
    } else {
        yy.state = 'NEUTRAL';
    }
}

// --- Pickups ---
function updatePickups(dt) {
    const pickupR = 40 * (1 + passives.pickupRange);
    for (let i = G.pickups.length - 1; i >= 0; i--) {
        const p = G.pickups[i];
        p.life -= dt;
        if (p.life <= 0) { G.pickups.splice(i, 1); continue; }
        const d = dist(P, p);
        if (d < pickupR) {
            // Vacuum toward player
            const speed = 200;
            const dx = P.x - p.x, dy = P.y - p.y;
            const nd = Math.hypot(dx, dy);
            p.x += (dx / nd) * speed * dt;
            p.y += (dy / nd) * speed * dt;
        }
        if (d < 8) {
            // Collect
            if (p.type === 'xp') {
                P.xp += p.val * (1 + passives.xpGain);
                SFX.xpPickup();
            } else if (p.type === 'gold') {
                G.score += p.val;
                SFX.goldPickup();
            } else if (p.type === 'hp') {
                P.hp = Math.min(P.hp + p.val, P.maxHp);
                spawnDmgNum(P.x, P.y - 10, p.val, '#ff4444', false);
                SFX.hpPickup();
            }
            G.pickups.splice(i, 1);
        }
    }
}

// --- Portal ---
function updatePortal(dt) {
    if (!G.portalActive || !G.portal) return;
    G.portal.pulse += dt * 3;
    if (dist(P, G.portal) < G.portal.r + 10) {
        nextFloor();
    }
}

function nextFloor() {
    G.floor++;
    G.enemies = [];
    G.bullets = [];
    G.pickups = [];
    G.portalActive = false;
    G.portal = null;
    SFX.portalOpen();
    G.enemiesKilled = 0;
    G.enemiesNeeded = 30 + G.floor * 10;
    G.spawnRate = Math.max(0.5, 1.5 - G.floor * 0.05);
    G.enemiesPerWave = 8 + G.floor * 2;
    P.x = G.arenaW / 2; P.y = G.arenaH / 2;
    P.hp = Math.min(P.hp + P.maxHp * 0.3, P.maxHp); // heal 30% between floors
    spawnParticles(P.x, P.y, '#ffff00', 30, 100);
    spawnElementParticles(P.x, P.y, P.element, 20, 80);
    shake(4, 0.2);
    triggerFlash('#ffffff', 0.3);
    triggerSpeedLines(0.5);

    // Show biome name
    if (typeof getBiome === 'function') {
        const biome = getBiome();
        G.floorAnnounce = { text: `Floor ${G.floor} — ${biome.name}`, timer: 2.5 };
    }

    // Re-init ambient particles for new biome
    if (typeof initAmbientParticles === 'function') initAmbientParticles();
}
