// ============================================================
// DYNASTY BRUHHH DUNGEON - Enemies & Spawning
// ============================================================

function spawnEnemy(x, y, type) {
    const el = rngEl();
    const elDef = ELEMENTS[el];
    const floorMult = 1 + (G.floor - 1) * 0.20;
    // K004: Difficulty tier multiplier
    const diffTier = (typeof DIFFICULTY_TIERS !== 'undefined' && DIFFICULTY_TIERS[G.difficulty]) ? DIFFICULTY_TIERS[G.difficulty] : { hpMult: 1, spdMult: 1 };
    // T001: Mandate of Heaven effects (Pact of Punishment)
    const mandate = typeof getMandateEffects === 'function' ? getMandateEffects() : {};
    const mandateHpMult = mandate.enemyHpMult || 1.0;
    const mandateSpdMult = mandate.enemySpeedMult || 1.0;
    const types = {
        fodder: { hp: 12, speed: 28, dmg: 3, r: 4, xp: 1 },
        grunt: { hp: 40, speed: 35, dmg: 6, r: 6, xp: 3 },
        fast: { hp: 22, speed: 60, dmg: 4, r: 5, xp: 4 },
        tank: { hp: 120, speed: 22, dmg: 12, r: 9, xp: 8 },
        archer: { hp: 28, speed: 28, dmg: 8, r: 6, xp: 5 },
        shaman: { hp: 35, speed: 20, dmg: 4, r: 6, xp: 7, healer: true },
        bomber: { hp: 18, speed: 55, dmg: 20, r: 5, xp: 6, explodeOnDeath: true },
        shieldwall: { hp: 80, speed: 18, dmg: 5, r: 8, xp: 6, frontShield: true },
        elite: { hp: 250, speed: 32, dmg: 18, r: 11, xp: 20 },
        miniboss: { hp: 600, speed: 28, dmg: 22, r: 14, xp: 50 },
        boss: { hp: 1500, speed: 20, dmg: 30, r: 18, xp: 100 }
    };
    const t = types[type] || types.grunt;
    const enemy = {
        x, y, vx: 0, vy: 0,
        hp: t.hp * floorMult * diffTier.hpMult * mandateHpMult, maxHp: t.hp * floorMult * diffTier.hpMult * mandateHpMult,
        speed: t.speed * diffTier.spdMult * mandateSpdMult, dmg: t.dmg * floorMult * diffTier.hpMult,
        r: t.r, el, color: elDef.color, lightColor: elDef.light,
        type, flash: 0, knockX: 0, knockY: 0, dead: false,
        attackCd: 0, spawnAnim: 0.4,
        modifiers: [], // N003: Elite modifier slots
        // New behavior flags
        _healCd: type === 'shaman' ? 3.0 : 0,
        _bombTimer: type === 'bomber' ? -1 : 0, // -1 = not triggered
        _shieldFacing: type === 'shieldwall' ? 0 : 0
    };
    // N003: Assign random modifiers to elite/miniboss enemies
    if ((type === 'elite' || type === 'miniboss') && typeof ELITE_MODIFIERS !== 'undefined') {
        let numMods = G.floor >= 5 ? (Math.random() < 0.4 ? 2 : 1) : (G.floor >= 3 ? 1 : 0);
        // T001: Mandate — Shadow Army adds extra modifiers to ALL enemies
        numMods += (mandate.enemyModifiers || 0);
        const pool = [...ELITE_MODIFIERS];
        for (let mi = 0; mi < numMods && pool.length > 0; mi++) {
            const idx = Math.floor(Math.random() * pool.length);
            const mod = pool.splice(idx, 1)[0];
            enemy.modifiers.push(mod.id);
            // Modifier-specific init state
            if (mod.id === 'shielded') enemy._shieldHits = 3;
            if (mod.id === 'teleporter') enemy._teleportCd = 3;
            if (mod.id === 'berserker') enemy._enraged = false;
        }
        // Announce modifiers
        if (enemy.modifiers.length > 0) {
            const modNames = enemy.modifiers.map(id => {
                const m = ELITE_MODIFIERS.find(m2 => m2.id === id);
                return m ? m.label : id;
            }).join(' ');
            spawnDmgNum(x, y - 20, modNames, '#ffaa00', true);
        }
    }
    // Boss-specific phase tracking
    if (type === 'boss') {
        enemy.phase = 1;         // 3-phase boss: 1 (100-60%), 2 (60-30%), 3 (<30%)
        enemy.chargeTimer = 0;
        enemy.chargeCd = 4;
        enemy.shockwaveCd = 6;
        enemy.summonCd = 12;     // Phase 2+: summon fodder adds
        enemy.enrageCd = 0;      // Phase 3: berserk mode
        enemy.entranceTimer = 2.0; // entrance freeze
        enemy.enraged = false;
        enemy.bossName = '';
        enemy.bossPhaseAnnounced = [false, false, false];
        // Boss entrance announcement
        G.floorAnnounce = { text: '⚠ BOSS INCOMING ⚠', timer: 3.0 };
        triggerFlash('#ff0000', 0.4);
        shake(6, 0.5);
        if (typeof SFX !== 'undefined' && SFX.bossSpawn) SFX.bossSpawn();
    }
    // Mini-boss (The Generals) setup
    if (type === 'miniboss') {
        enemy.entranceTimer = 1.2;
        enemy.specialCd = 4;
        enemy.phase = 1;
        // Pick a general based on floor — expanded Dynasty Warriors roster
        const generals = [
            { name: 'Đổng Trác', title: 'Bạo Chúa', el: 'FIRE', ability: 'fire_slam', color: '#ff4400' },
            { name: 'Viên Thiệu', title: 'Quý Tộc', el: 'WOOD', ability: 'arrow_volley', color: '#44cc44' },
            { name: 'Tào Tháo', title: 'Gian Hùng', el: 'METAL', ability: 'triple_slash', color: '#cccccc' },
            { name: 'Tôn Kiên', title: 'Mãnh Hổ', el: 'EARTH', ability: 'tiger_charge', color: '#cc8833' },
            { name: 'Điêu Thuyền', title: 'Tuyệt Sắc', el: 'WATER', ability: 'confusion', color: '#6688ff' },
            // Phase H: Expanded generals
            { name: 'Quan Vũ', title: 'Võ Thánh', el: 'WOOD', ability: 'crescent_sweep', color: '#22ff22' },
            { name: 'Trương Phi', title: 'Dũng Mãnh', el: 'FIRE', ability: 'thunderous_roar', color: '#ff6600' },
            { name: 'Lữ Bố', title: 'Chiến Thần', el: 'METAL', ability: 'sky_piercer', color: '#aaaaff' },
            { name: 'Tôn Sách', title: 'Tiểu Bá Vương', el: 'EARTH', ability: 'little_conqueror', color: '#ddaa33' },
            { name: 'Trương Liêu', title: 'Uy Chấn', el: 'FIRE', ability: 'terror_charge', color: '#ff3300' },
            { name: 'Triệu Vân', title: 'Long Đảm', el: 'METAL', ability: 'dragon_thrust', color: '#4488ff' },
            { name: 'Tư Mã Ý', title: 'Ẩn Long', el: 'WATER', ability: 'dark_ritual', color: '#4466ff' }
        ];
        const genIdx = (G.floor + Math.floor(Math.random() * generals.length)) % generals.length;
        const gen = generals[genIdx];
        enemy.generalName = gen.name;
        enemy.generalTitle = gen.title;
        enemy.el = gen.el;
        enemy.color = ELEMENTS[gen.el].color;
        enemy.lightColor = ELEMENTS[gen.el].light;
        enemy.ability = gen.ability;
        enemy.generalColor = gen.color;
        // Announcement with Vietnamese names + element-colored banner
        G.floorAnnounce = {
            text: '⚔ ' + gen.name + ' ⚔',
            subtitle: '— ' + gen.title + ' —',
            timer: 3.0,
            color: gen.color
        };
        triggerFlash(gen.color, 0.35);
        shake(6, 0.4);
        if (typeof triggerChromatic === 'function') triggerChromatic(2);
        if (typeof SFX !== 'undefined' && SFX.bossSpawn) SFX.bossSpawn();
        // Phase I: Dramatic entrance VFX
        G._comboDarken = 0.3; // brief screen darken
        // Spawn shockwave at general position
        G.skillEffects.push({
            type: 'shockwave', x, y,
            radius: 5, maxRadius: 80, speed: 200,
            color: gen.color, alpha: 0.6, lineWidth: 3, timer: 0.5
        });
        // Element particle burst
        spawnParticles(x, y, gen.color, 20, 60);
        spawnParticles(x, y, ELEMENTS[gen.el].light, 12, 40);
    }
    G.enemies.push(enemy);
    return enemy; // N003: Return for modifier use (e.g. Splitting)
}

// L003: Final Boss — Dong Zhuo, The Tyrant
function spawnFinalBoss() {
    const cx = G.arenaW / 2;
    const cy = G.arenaH / 2;
    const floorMult = 1 + (G.floor - 1) * 0.12;

    const boss = {
        x: cx, y: cy, vx: 0, vy: 0,
        hp: 3000 * floorMult, maxHp: 3000 * floorMult,
        speed: 22, dmg: 40 * floorMult,
        r: 22, el: 'FIRE', color: '#ff2200', lightColor: '#ff8844',
        type: 'finalboss', flash: 0, knockX: 0, knockY: 0, dead: false,
        attackCd: 0, spawnAnim: 1.0,
        // Final boss specific
        phase: 1,
        phaseTransition: 0,
        generalName: 'Đổng Trác',
        generalTitle: 'Bạo Chúa Cuối Cùng',
        isFinalBoss: true,
        // Ability timers
        slamCd: 0,
        summonCd: 3,
        fireCd: 0,
        enraged: false,
        desperation: false,
        cloneSpawned: false,
        entranceTimer: 2.0
    };

    G.enemies.push(boss);
    G.finalBoss = boss;

    // Dramatic entrance
    G.floorAnnounce = {
        text: '⚔ ĐỔNG TRÁC — BẠO CHÚA ⚔',
        sub: 'The Tyrant descends!',
        timer: 3,
        color: '#ff2200'
    };
    triggerFlash('#ff0000', 0.5);
    triggerChromatic(5);
    shake(10, 1.0);

    // Clear all other enemies to make room for the epic battle
    for (const e of G.enemies) {
        if (e !== boss && !e.dead) {
            e.dead = true;
            spawnParticles(e.x, e.y, e.color || '#666', 8, 30);
        }
    }

    // Massive entrance VFX
    G.skillEffects.push({
        type: 'shockwave', x: cx, y: cy,
        radius: 5, maxRadius: 250, speed: 150,
        color: '#ff2200', alpha: 0.6, lineWidth: 4, timer: 0.8
    });
    spawnParticles(cx, cy, '#ff4400', 40, 120);
    spawnParticles(cx, cy, '#ffd700', 30, 100);
}

// L003: Update Final Boss AI (called from updateEnemies)
function updateFinalBossAI(boss, dt) {
    if (!boss || boss.dead || !boss.isFinalBoss) return;

    // Cooldown management
    if (boss.slamCd > 0) boss.slamCd -= dt;
    if (boss.summonCd > 0) boss.summonCd -= dt;
    if (boss.fireCd > 0) boss.fireCd -= dt;
    if (boss.jumpTimer > 0) boss.jumpTimer -= dt;
    if (boss.rainCd > 0) boss.rainCd -= dt;

    const hpRatio = boss.hp / boss.maxHp;
    const dist = Math.hypot(P.x - boss.x, P.y - boss.y);

    // --- Phase Transitions ---
    if (hpRatio <= 0.6 && boss.phase === 1) {
        boss.phase = 2;
        boss.enraged = true;
        boss.speed = 40; // Faster
        boss.phaseTransition = 2.0;

        G.floorAnnounce = {
            text: '🔥 CHẤN ĐỘNG CÀN KHÔN 🔥',
            sub: 'EARTHQUAKE MODE',
            timer: 2,
            color: '#ff4400'
        };
        shake(10, 0.8);
        triggerFlash('#ff4400', 0.5);
        // Push player away
        const ang = Math.atan2(P.y - boss.y, P.x - boss.x);
        P.vx += Math.cos(ang) * 800;
        P.vy += Math.sin(ang) * 800;
    }

    if (hpRatio <= 0.3 && boss.phase === 2) {
        boss.phase = 3;
        boss.desperation = true;
        boss.speed = 55; // Very fast
        boss.phaseTransition = 2.0;

        G.floorAnnounce = {
            text: '☠ THIÊN HẠ ĐẠI LOẠN ☠',
            sub: 'TOTAL CHAOS',
            timer: 2,
            color: '#ff0000'
        };
        triggerChromatic(10); // Heavy distortion
        shake(15, 1.0);

        // Spawn "Lu Bu" Shadow Clone
        if (!boss.cloneSpawned) {
            boss.cloneSpawned = true;
            spawnEnemy(boss.x + 50, boss.y, 'boss'); // Reuse generic boss as Lu Bu holder
            const clone = G.enemies[G.enemies.length - 1];
            clone.generalName = "Lữ Bố (Bóng)";
            clone.color = "#8800ff";
            clone.hp = 1500; clone.maxHp = 1500;
            spawnParticles(clone.x, clone.y, '#8800ff', 50, 60);
        }
    }

    // Phase Transition Freeze
    if (boss.phaseTransition > 0) {
        boss.phaseTransition -= dt;
        spawnParticles(boss.x, boss.y, boss.color, 2, 10);
        return;
    }

    // --- State Machine ---

    // 1. Tyrant's Jump (Jump Slam) - Phases 2 & 3
    // Boss disappears, shadow follows player, then lands.
    if (boss.phase >= 2 && boss.jumpTimer <= 0 && Math.random() < 0.05) {
        boss.isJumping = true;
        boss.jumpTimer = boss.phase === 3 ? 4 : 7; // Cooldown
        boss.airTime = 1.5; // Time in air
        boss.landX = P.x;
        boss.landY = P.y;
        boss.hidden = true; // Hide sprite logic in renderer (need to handle)
        // Instead of 'hidden' prop which renderer might not check, we can move him offscreen or sets visible flag
        // Let's use specific property 'isAirborne'
        boss.isAirborne = true;
        spawnParticles(boss.x, boss.y, '#555', 20, 50); // Smoke bomb effect
    }

    if (boss.isAirborne) {
        boss.airTime -= dt;
        // Tracking player (Tracking Shadow)
        const lerp = 5 * dt;
        boss.landX += (P.x - boss.landX) * lerp;
        boss.landY += (P.y - boss.landY) * lerp;

        // Draw Shadow Indicator (handled in renderer or here via effect)
        // Since we can't easily modify renderer in this Step without another tool call, 
        // we'll spawn a "shadow" particle/effect every frame that stays for 1 frame
        G.skillEffects.push({
            type: 'impact_radius_warn', // New type or reuse 'shockwave' with 0 expansion
            x: boss.landX, y: boss.landY,
            radius: 60, color: 'rgba(0,0,0,0.5)', timer: 0.1
        });

        if (boss.airTime <= 0) {
            // LAND!
            boss.isAirborne = false;
            boss.x = boss.landX;
            boss.y = boss.landY;

            // Damage
            const landDist = Math.hypot(P.x - boss.x, P.y - boss.y);
            if (landDist < 80) {
                let slamDmg = boss.dmg * 2;
                // Equipment armor DR
                if (P.dmgReduction > 0) slamDmg *= (1 - P.dmgReduction);
                P.hp -= slamDmg;
                P.invincible = 0.5;
                spawnDmgNum(P.x, P.y, Math.floor(slamDmg), '#ff0000', true);
                shake(10, 0.4);
                // Equipment reflect
                if (P.reflectDmg > 0 && boss.hp > 0) {
                    damageEnemy(boss, slamDmg * P.reflectDmg, P.element);
                }
            }

            // Visuals
            spawnParticles(boss.x, boss.y, '#ff4400', 50, 100); // Explosion
            G.skillEffects.push({
                type: 'shockwave', x: boss.x, y: boss.y,
                radius: 10, maxRadius: 150, speed: 400,
                color: '#ff4400', alpha: 0.8, lineWidth: 5, timer: 0.5
            });

            // T-03: Boss slam creates scorched ground hazard
            if (window.Physics && typeof Physics.spawnHazard === 'function') {
                Physics.spawnHazard(boss.x, boss.y, 'SCORCHED', boss.phase === 3 ? 50 : 35);
            }
        }
        return; // Don't do other updates while in air
    }

    // 2. Chain Flail (Orbiting Fireballs) - Phase 1 & 2
    if (!boss.orbitals && boss.phase <= 2) {
        boss.orbitals = [];
        for (let i = 0; i < 3; i++) {
            boss.orbitals.push({ angle: (Math.PI * 2 / 3) * i, r: 80 });
        }
    }
    if (boss.orbitals) {
        // Update orbitals
        const rotSpeed = boss.enraged ? 3 : 1.5;
        for (let orb of boss.orbitals) {
            orb.angle += rotSpeed * dt;
            const ox = boss.x + Math.cos(orb.angle) * orb.r;
            const oy = boss.y + Math.sin(orb.angle) * orb.r;

            // Damage player if touched
            if (Math.hypot(P.x - ox, P.y - oy) < 20) {
                if (P.invincible <= 0) {
                    P.hp -= boss.dmg * 0.5;
                    P.invincible = 0.2;
                    spawnDmgNum(P.x, P.y, Math.floor(boss.dmg * 0.5), '#ff8800');
                }
            }

            // Visuals (Particle ball)
            spawnParticles(ox, oy, '#ff8800', 2, 10);
        }
    }

    // 3. Rain of Fire (Desperation) - Phase 3
    if (boss.phase === 3) {
        if (boss.rainCd <= 0) {
            boss.rainCd = 0.2; // Very frequent
            const rx = rng(30, G.arenaW - 30);
            const ry = rng(30, G.arenaH - 30);

            // Warning first? Setup warning effect
            G.skillEffects.push({
                type: 'hazard_warn', x: rx, y: ry,
                r: 40, timer: 1.0, color: '#ff0000',
                onExpire: () => {
                    // Explosion logic
                    spawnParticles(rx, ry, '#ff0000', 10, 30);
                    if (Math.hypot(P.x - rx, P.y - ry) < 40) {
                        P.hp -= boss.dmg;
                        P.invincible = 0.2;
                    }
                }
            });
        }
    }

    // Basic Movement (Chase)
    if (dist > 60) {
        const angle = Math.atan2(P.y - boss.y, P.x - boss.x);
        boss.x += Math.cos(angle) * boss.speed * dt;
        boss.y += Math.sin(angle) * boss.speed * dt;
    }

    // Basic Attack (Melee)
    if (dist < 70 && boss.attackCd <= 0) {
        boss.attackCd = 1.0;
        // Swing logic
        spawnParticles(boss.x + (P.x - boss.x) * 0.5, boss.y + (P.y - boss.y) * 0.5, '#fff', 5, 20);
        if (dist < 50) {
            P.hp -= boss.dmg;
            P.invincible = 0.5;
            shake(2, 0.1);
        }
    }
}

function spawnWave() {
    const cx = P.x, cy = P.y;
    // BALANCE: More enemies, better composition
    const fodderCount = 12 + G.floor * 3; // 15, 18, 21...
    const officerCount = 4 + Math.floor(G.floor * 1.2); // 5, 6, 7...
    const totalCount = fodderCount + officerCount;

    // Spawn fodder in formation clusters (3-5 per cluster)
    const clusterSize = 4;
    const numClusters = Math.ceil(fodderCount / clusterSize);
    for (let c = 0; c < numClusters; c++) {
        const clusterAngle = rng(0, Math.PI * 2);
        const clusterDist = rng(150, 280);
        const clusterCx = cx + Math.cos(clusterAngle) * clusterDist;
        const clusterCy = cy + Math.sin(clusterAngle) * clusterDist;
        for (let i = 0; i < clusterSize && (c * clusterSize + i) < fodderCount; i++) {
            const ox = rng(-20, 20);
            const oy = rng(-20, 20);
            const x = clamp(clusterCx + ox, 30, G.arenaW - 30);
            const y = clamp(clusterCy + oy, 30, G.arenaH - 30);
            spawnEnemy(x, y, 'fodder');
        }
    }

    // Spawn officers with diverse types
    for (let i = 0; i < officerCount; i++) {
        const angle = rng(0, Math.PI * 2);
        const d = rng(180, 320);
        const x = clamp(cx + Math.cos(angle) * d, 30, G.arenaW - 30);
        const y = clamp(cy + Math.sin(angle) * d, 30, G.arenaH - 30);
        const roll = Math.random();
        let type = 'grunt';
        if (roll < 0.04 && G.floor >= 3) type = 'elite';
        else if (roll < 0.08 && G.floor >= 2) type = 'shaman';
        else if (roll < 0.13 && G.floor >= 3) type = 'bomber';
        else if (roll < 0.18 && G.floor >= 2) type = 'shieldwall';
        else if (roll < 0.28 && G.floor >= 2) type = 'archer';
        else if (roll < 0.45) type = 'tank';
        else if (roll < 0.65) type = 'fast';
        spawnEnemy(x, y, type);
    }
}

function updateEnemies(dt) {
    // L001: Update elemental combo cooldowns and timers
    if (typeof updateComboCooldowns === 'function') updateComboCooldowns(dt);

    for (let i = G.enemies.length - 1; i >= 0; i--) {
        const e = G.enemies[i];
        if (e.dead) { G.enemies.splice(i, 1); continue; }

        // SAFETY NET: catch zombie enemies from ANY damage source
        if (e.hp <= 0) { killEnemy(e); G.enemies.splice(i, 1); continue; }

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

        // Stun timer (from Ground Slam etc.)
        if (e.stunTimer > 0) {
            e.stunTimer -= dt;
            if (e.stunTimer <= 0 && e._origSpeed) {
                e.speed = e._origSpeed; // Restore speed
            }
            continue; // Skip all AI while stunned
        }
        // Save original speed for stun recovery
        if (!e._origSpeed) e._origSpeed = e.speed;

        // Unified Speed Calculation (Status + Hazard)
        let speedMult = 1.0;

        // Hazard Slow (P001)
        if (e._inHazardSlow > 0) {
            speedMult *= (1 - e._inHazardSlow);
        }

        // Phase H: Slow debuff tick-down
        if (e.slowTimer > 0 || e._slowTimer > 0) { // Support both legacy and new prop names if any
            if (e.slowTimer) e.slowTimer -= dt;
            if (e._slowTimer) e._slowTimer -= dt;
            speedMult *= (1 - (e._slowPct || 0.3));
        }

        e.speed = e._origSpeed * speedMult;

        // Phase H: Burn DOT
        if (e._burnTimer > 0) {
            e._burnTimer -= dt;
            e._burnTick = (e._burnTick || 0) + dt;
            if (e._burnTick >= 0.5) {
                e._burnTick -= 0.5;
                const burnDmg = e._burnDmg || 3;
                e.hp -= burnDmg;
                spawnDmgNum(e.x, e.y - 8, burnDmg, '#ff4400', false);
                if (Math.random() < 0.5) {
                    spawnParticles(e.x, e.y, '#ff4400', 1, 10);
                }
                if (e.hp <= 0) {
                    killEnemy(e);
                    continue;
                }
            }
        }

        // K002: Wu Xing Blessing DOTs
        // Poison DOT (WOOD)
        if (e.poisonTimer > 0) {
            e.poisonTimer -= dt;
            e._poisonTick = (e._poisonTick || 0) + dt;
            if (e._poisonTick >= 0.5) {
                e._poisonTick -= 0.5;
                const pDmg = (e.poisonDps || 3) * 0.5;
                e.hp -= pDmg;
                spawnDmgNum(e.x + rng(-5, 5), e.y - 8, pDmg, '#44dd44', false);
                if (Math.random() < 0.3) spawnParticles(e.x, e.y, '#44dd44', 1, 8);
                if (e.hp <= 0) { killEnemy(e); continue; }
            }
        }
        // Blessing Burn DOT (FIRE)
        if (e.burnTimer > 0) {
            e.burnTimer -= dt;
            e._bBurnTick = (e._bBurnTick || 0) + dt;
            if (e._bBurnTick >= 0.5) {
                e._bBurnTick -= 0.5;
                const bDmg = (e.burnDps || 5) * 0.5;
                e.hp -= bDmg;
                spawnDmgNum(e.x + rng(-5, 5), e.y - 12, bDmg, '#ff6600', false);
                if (Math.random() < 0.4) spawnParticles(e.x, e.y, '#ff6600', 1, 10);
                if (e.hp <= 0) { killEnemy(e); continue; }
            }
        }
        // Bleed DOT (METAL)
        if (e.bleedTimer > 0) {
            e.bleedTimer -= dt;
            e._bleedTick = (e._bleedTick || 0) + dt;
            if (e._bleedTick >= 0.5) {
                e._bleedTick -= 0.5;
                const blDmg = (e.bleedDps || 4) * 0.5;
                e.hp -= blDmg;
                spawnDmgNum(e.x + rng(-5, 5), e.y - 6, blDmg, '#cc2222', false);
                if (Math.random() < 0.3) spawnParticles(e.x, e.y, '#cc2222', 1, 8);
                if (e.hp <= 0) { killEnemy(e); continue; }
            }
        }
        // Freeze (WATER) — completely stops enemy
        if (e.frozenTimer > 0) {
            e.frozenTimer -= dt;
            if (Math.random() < 0.1) spawnParticles(e.x, e.y, '#88ccff', 1, 6);
            continue; // Skip all AI while frozen
        }

        // N003: Elite Modifier Behaviors (per-frame)
        if (e.modifiers && e.modifiers.length > 0) {
            // Berserker: Enrage at <30% HP
            if (e.modifiers.includes('berserker') && !e._enraged && e.hp / e.maxHp < 0.3) {
                e._enraged = true;
                e.speed = (e._origSpeed || e.speed) * 2;
                e.dmg *= 1.5;
                spawnDmgNum(e.x, e.y - 15, 'ENRAGED!', '#ff2222', true);
                shake(3, 0.15);
                spawnParticles(e.x, e.y, '#ff2222', 10, 40);
            }
            // Berserker visual: red pulse
            if (e._enraged && Math.random() < 0.15) {
                spawnParticles(e.x + rng(-5, 5), e.y + rng(-5, 5), '#ff2222', 1, 15);
            }
            // Teleporter: Blink every 3s
            if (e.modifiers.includes('teleporter')) {
                e._teleportCd = (e._teleportCd || 3) - dt;
                if (e._teleportCd <= 0) {
                    e._teleportCd = 3;
                    // Blink to random position near player
                    const angle = Math.random() * Math.PI * 2;
                    const blinkDist = 40 + Math.random() * 60;
                    e.x = clamp(P.x + Math.cos(angle) * blinkDist, 20, G.arenaW - 20);
                    e.y = clamp(P.y + Math.sin(angle) * blinkDist, 20, G.arenaH - 20);
                    spawnParticles(e.x, e.y, '#44dddd', 8, 30);
                }
                // Flicker visual near teleport
                if (e._teleportCd < 0.5 && Math.random() < 0.3) {
                    spawnParticles(e.x + rng(-8, 8), e.y + rng(-8, 8), '#44dddd', 1, 10);
                }
            }
            // Vampiric visual: purple aura
            if (e.modifiers.includes('vampiric') && Math.random() < 0.08) {
                spawnParticles(e.x + rng(-6, 6), e.y + rng(-6, 6), '#aa44cc', 1, 8);
            }
        }

        // ===== NEW ENEMY TYPE BEHAVIORS =====
        // Shaman: heals nearby wounded allies every 3s
        if (e.type === 'shaman') {
            e._healCd -= dt;
            if (e._healCd <= 0) {
                e._healCd = 3.0;
                // Find nearby wounded ally (not self)
                for (const ally of G.enemies) {
                    if (ally === e || ally.dead) continue;
                    const ad = Math.hypot(ally.x - e.x, ally.y - e.y);
                    if (ad < 80 && ally.hp < ally.maxHp) {
                        const healAmt = Math.floor(ally.maxHp * 0.15);
                        ally.hp = Math.min(ally.hp + healAmt, ally.maxHp);
                        spawnDmgNum(ally.x, ally.y - 10, '+' + healAmt, '#44ff44');
                        // Green heal beam particles
                        spawnParticles(e.x, e.y, '#44ff44', 3, 15);
                        spawnParticles(ally.x, ally.y, '#44ff44', 3, 15);
                        break; // Heal one ally per tick
                    }
                }
            }
            // Visual: green aura
            if (Math.random() < 0.08) spawnParticles(e.x + rng(-6, 6), e.y + rng(-6, 6), '#44ff44', 1, 8);
        }

        // Bomber: charges at player and explodes on death (or proximity)
        if (e.type === 'bomber') {
            if (d < 25) {
                // Self-destruct on contact
                // AoE damage to player
                if (!P.invincible) {
                    let bomberDmg = e.dmg;
                    if (P.dmgReduction > 0) bomberDmg *= (1 - P.dmgReduction);
                    P.hp -= bomberDmg;
                    shake(4, 0.2);
                }
                // Explosion VFX
                G.skillEffects.push({
                    type: 'shockwave', x: e.x, y: e.y,
                    radius: 5, maxRadius: 50, speed: 200,
                    color: '#ff6600', alpha: 0.7, lineWidth: 2, timer: 0.3
                });
                spawnParticles(e.x, e.y, '#ff4400', 15, 50);
                spawnParticles(e.x, e.y, '#ffaa00', 10, 30);
                e.hp = 0;
                killEnemy(e);
                G.enemies.splice(i, 1);
                continue;
            }
            // Visual: glowing red pulsing
            if (Math.random() < 0.15) spawnParticles(e.x + rng(-4, 4), e.y + rng(-4, 4), '#ff4400', 1, 10);
        }

        // Shieldwall: takes 70% less damage from frontal attacks
        if (e.type === 'shieldwall') {
            e._shieldFacing = Math.atan2(P.y - e.y, P.x - e.x); // Always face player
            // Visual: shield shimmer
            if (Math.random() < 0.05) {
                const sx = e.x + Math.cos(e._shieldFacing) * 8;
                const sy = e.y + Math.sin(e._shieldFacing) * 8;
                spawnParticles(sx, sy, '#ccddff', 1, 6);
            }
        }

        // Chase player (with boss-specific AI)
        const dx = P.x - e.x, dy = P.y - e.y;
        const d = Math.hypot(dx, dy);

        // L003: Final boss AI
        if (e.type === 'finalboss') {
            if (e.entranceTimer > 0) {
                e.entranceTimer -= dt;
                if (Math.random() < 0.5) {
                    spawnParticles(e.x + rng(-15, 15), e.y + rng(-15, 15), '#ff4400', 2, 30);
                }
                continue;
            }
            if (typeof updateFinalBossAI === 'function') updateFinalBossAI(e, dt);
        }

        if (e.type === 'boss') {
            // Boss entrance freeze
            if (e.entranceTimer > 0) {
                e.entranceTimer -= dt;
                // Boss entrance VFX: dramatic particle ring
                if (Math.random() < 0.4) {
                    const angle = Math.random() * Math.PI * 2;
                    spawnParticles(
                        e.x + Math.cos(angle) * 20,
                        e.y + Math.sin(angle) * 20,
                        '#ff4444', 2, 25
                    );
                }
                continue; // boss doesn't move during entrance
            }

            // Phase transitions with dramatic effects
            const hpPct = e.hp / e.maxHp;
            if (hpPct < 0.3 && e.phase < 3) {
                e.phase = 3;
                e.enraged = true;
                e.speed = (e._origSpeed || e.speed) * 2.5;
                e.dmg *= 1.8;
                if (!e.bossPhaseAnnounced[2]) {
                    e.bossPhaseAnnounced[2] = true;
                    G.floorAnnounce = { text: '🔥 FINAL FURY! 🔥', subtitle: '— Boss Enraged —', timer: 2.5, color: '#ff2200' };
                    triggerFlash('#ff2200', 0.5);
                    if (typeof triggerChromatic === 'function') triggerChromatic(4);
                    shake(8, 0.5);
                    spawnElementParticles(e.x, e.y, e.el, 30, 100);
                    // Spawn rage adds
                    for (let a = 0; a < 6; a++) {
                        const aa = (a / 6) * Math.PI * 2;
                        spawnEnemy(
                            clamp(e.x + Math.cos(aa) * 60, 30, G.arenaW - 30),
                            clamp(e.y + Math.sin(aa) * 60, 30, G.arenaH - 30),
                            'fast'
                        );
                    }
                }
            } else if (hpPct < 0.6 && e.phase < 2) {
                e.phase = 2;
                e.speed = (e._origSpeed || e.speed) * 1.5;
                if (!e.bossPhaseAnnounced[1]) {
                    e.bossPhaseAnnounced[1] = true;
                    G.floorAnnounce = { text: '⚡ PHASE 2 ⚡', subtitle: '— Boss grows stronger —', timer: 2.0, color: '#ffaa00' };
                    triggerFlash('#ffaa00', 0.3);
                    shake(4, 0.3);
                    // Phase 2: spawn some adds
                    for (let a = 0; a < 4; a++) {
                        const aa = (a / 4) * Math.PI * 2;
                        spawnEnemy(
                            clamp(e.x + Math.cos(aa) * 80, 30, G.arenaW - 30),
                            clamp(e.y + Math.sin(aa) * 80, 30, G.arenaH - 30),
                            'grunt'
                        );
                    }
                }
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
                        let shockDmg = e.dmg * 0.5 * (1 - dr);
                        if (P.dmgReduction > 0) shockDmg *= (1 - P.dmgReduction);
                        P.hp -= shockDmg;
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

        // --- Mini-Boss AI (The Generals) ---
        if (e.type === 'miniboss') {
            // Entrance freeze
            if (e.entranceTimer > 0) {
                e.entranceTimer -= dt;
                // Entrance particles
                if (Math.random() < 0.5) {
                    spawnParticles(e.x + rng(-10, 10), e.y + rng(-10, 10), e.lightColor, 2, 30);
                }
                continue;
            }

            // Enrage at 30% HP
            const mbPct = e.hp / e.maxHp;
            if (mbPct < 0.3 && e.phase < 2) {
                e.phase = 2;
                e.speed *= 1.5;
                e.dmg *= 1.3;
                G.floorAnnounce = { text: '\ud83d\udd25 ' + (e.generalName || 'GENERAL') + ' ENRAGED! \ud83d\udd25', timer: 2 };
                triggerFlash(e.generalColor || '#ff4400', 0.3);
                shake(3, 0.2);
                spawnElementParticles(e.x, e.y, e.el, 12, 50);
            }

            // Special ability cooldown
            e.specialCd -= dt;
            if (e.specialCd <= 0 && d < 180) {
                e.specialCd = e.phase >= 2 ? 3.5 : 6;
                const ability = e.ability || 'fire_slam';

                if (ability === 'fire_slam') {
                    // Dong Zhuo: AoE fire ring
                    G.bullets.push({
                        x: e.x, y: e.y, type: 'aoe_ring', r: 60,
                        color: '#ff4400', el: 'FIRE',
                        life: 0.4, maxLife: 0.4
                    });
                    if (d < 60 && P.invincible <= 0) {
                        const dr = getBondDmgReduction();
                        P.hp -= e.dmg * 0.8 * (1 - dr);
                        P.damageFlash = 0.2;
                        P.invincible = 0.3;
                    }
                    shake(3, 0.15);
                    spawnElementParticles(e.x, e.y, 'FIRE', 10, 50);
                } else if (ability === 'arrow_volley') {
                    // Yuan Shao: spawn 3 temporary archers
                    for (let a = 0; a < 3; a++) {
                        const ax = e.x + rng(-40, 40);
                        const ay = e.y + rng(-40, 40);
                        spawnEnemy(ax, ay, 'archer');
                    }
                    spawnParticles(e.x, e.y, '#44cc44', 8, 40);
                } else if (ability === 'triple_slash') {
                    // Cao Cao: 3 fast projectiles in spread
                    if (!G.archerBullets) G.archerBullets = [];
                    for (let s = -1; s <= 1; s++) {
                        const angle = Math.atan2(dy, dx) + s * 0.3;
                        G.archerBullets.push({
                            x: e.x, y: e.y,
                            vx: Math.cos(angle) * 150, vy: Math.sin(angle) * 150,
                            dmg: e.dmg * 0.6, life: 1.5
                        });
                    }
                    spawnParticles(e.x, e.y, '#cccccc', 5, 25);
                } else if (ability === 'tiger_charge') {
                    // Sun Jian: charge at player
                    const chargeSpd = 350;
                    e.knockX = (dx / d) * chargeSpd * 0.03;
                    e.knockY = (dy / d) * chargeSpd * 0.03;
                    shake(3, 0.12);
                    spawnParticles(e.x, e.y, '#cc8833', 6, 30);
                    // Damage if close
                    if (d < 40 && P.invincible <= 0) {
                        const dr = getBondDmgReduction();
                        P.hp -= e.dmg * 1.2 * (1 - dr);
                        P.damageFlash = 0.2;
                        P.invincible = 0.4;
                    }
                } else if (ability === 'confusion') {
                    // Diao Chan: confusion debuff
                    if (d < 100) {
                        P.confused = 2.5; // 2.5s reversed controls
                        G.floorAnnounce = { text: '🌀 CONFUSED! 🌀', timer: 1.5 };
                        spawnParticles(P.x, P.y, '#ff66ff', 12, 50);
                        triggerChromatic(2);
                    }
                    spawnParticles(e.x, e.y, '#6688ff', 8, 40);

                    // === Phase H: New General Abilities ===
                } else if (ability === 'crescent_sweep') {
                    // Quan Vũ (Guan Yu): Wide crescent sweep — massive AoE damage arc
                    G.skillEffects.push({
                        type: 'slash_arc', x: e.x, y: e.y,
                        radius: 50, startAngle: Math.atan2(dy, dx) - Math.PI / 3,
                        color: '#22ff22', alpha: 0.8, timer: 0.3
                    });
                    if (d < 55 && P.invincible <= 0) {
                        const dr = getBondDmgReduction();
                        P.hp -= e.dmg * 1.2 * (1 - dr);
                        P.damageFlash = 0.3;
                        P.invincible = 0.4;
                        P.knockX = (dx / d) * -3;
                        P.knockY = (dy / d) * -3;
                    }
                    shake(4, 0.2);
                    spawnElementParticles(e.x, e.y, 'WOOD', 8, 40);

                } else if (ability === 'thunderous_roar') {
                    // Trương Phi (Zhang Fei): Thunderous Roar — AoE stun + knockback
                    G.skillEffects.push({
                        type: 'shockwave', x: e.x, y: e.y,
                        radius: 5, maxRadius: 80, speed: 250,
                        color: '#ff6600', alpha: 0.7, lineWidth: 4, timer: 0.4
                    });
                    // Stun player if in range
                    if (d < 80 && P.invincible <= 0) {
                        P.stunned = 1.5;
                        P.knockX = -(dx / d) * 4;
                        P.knockY = -(dy / d) * 4;
                        G.floorAnnounce = { text: '💫 STUNNED! 💫', timer: 1 };
                    }
                    shake(5, 0.3);
                    spawnParticles(e.x, e.y, '#ff6600', 12, 60);

                } else if (ability === 'sky_piercer') {
                    // Lữ Bố (Lu Bu): Sky Piercer — devastating lunge + AoE explosion
                    const chargeSpd = 500;
                    e.knockX = (dx / d) * chargeSpd * 0.04;
                    e.knockY = (dy / d) * chargeSpd * 0.04;
                    // Impact explosion after delay
                    setTimeout(() => {
                        G.skillEffects.push({
                            type: 'shockwave', x: e.x, y: e.y,
                            radius: 5, maxRadius: 70, speed: 300,
                            color: '#aaaaff', alpha: 0.8, lineWidth: 3, timer: 0.3
                        });
                        if (Math.hypot(P.x - e.x, P.y - e.y) < 50 && P.invincible <= 0) {
                            const dr = getBondDmgReduction();
                            P.hp -= e.dmg * 1.4 * (1 - dr);
                            P.damageFlash = 0.35;
                            P.invincible = 0.5;
                        }
                        shake(6, 0.4);
                        spawnParticles(e.x, e.y, '#aaaaff', 15, 70);
                    }, 200);
                    spawnParticles(e.x, e.y, '#ccccff', 8, 40);

                } else if (ability === 'little_conqueror') {
                    // Tôn Sách (Sun Ce): Ground slam + self speed buff
                    G.skillEffects.push({
                        type: 'impact_crater', x: e.x, y: e.y,
                        radius: 45, color: '#ddaa33', alpha: 0.6, timer: 1.0
                    });
                    if (d < 50 && P.invincible <= 0) {
                        const dr = getBondDmgReduction();
                        P.hp -= e.dmg * 0.9 * (1 - dr);
                        P.damageFlash = 0.2;
                        P.invincible = 0.3;
                    }
                    e.speed *= 1.4; // Speed buff
                    shake(3, 0.15);
                    spawnElementParticles(e.x, e.y, 'EARTH', 8, 35);

                } else if (ability === 'terror_charge') {
                    // Trương Liêu (Zhang Liao): Multi-dash terror charge
                    for (let dash = 0; dash < 3; dash++) {
                        setTimeout(() => {
                            e.knockX = (dx / d) * 200 * 0.03;
                            e.knockY = (dy / d) * 200 * 0.03;
                            spawnParticles(e.x, e.y, '#ff3300', 4, 25);
                            if (Math.hypot(P.x - e.x, P.y - e.y) < 30 && P.invincible <= 0) {
                                const dr = getBondDmgReduction();
                                P.hp -= e.dmg * 0.5 * (1 - dr);
                                P.damageFlash = 0.15;
                            }
                        }, dash * 250);
                    }
                    shake(2, 0.1);

                } else if (ability === 'dragon_thrust') {
                    // Triệu Vân (Zhao Yun): Precise piercing thrust
                    if (!G.archerBullets) G.archerBullets = [];
                    const angle = Math.atan2(dy, dx);
                    G.archerBullets.push({
                        x: e.x, y: e.y,
                        vx: Math.cos(angle) * 220, vy: Math.sin(angle) * 220,
                        dmg: e.dmg * 1.5, life: 2
                    });
                    // Trail VFX
                    G.skillEffects.push({
                        type: 'lightning_trail', x1: e.x, y1: e.y,
                        x2: e.x + Math.cos(angle) * 100, y2: e.y + Math.sin(angle) * 100,
                        color: '#4488ff', alpha: 0.5, timer: 0.3, segments: 6
                    });
                    spawnParticles(e.x, e.y, '#4488ff', 5, 30);

                } else if (ability === 'dark_ritual') {
                    // Tư Mã Ý (Sima Yi): Dark zone that slows + weakens player
                    G.skillEffects.push({
                        type: 'fire_aura', x: P.x, y: P.y,
                        radius: 60, color: '#4466ff', alpha: 0.2, timer: 3
                    });
                    if (d < 100) {
                        P._slowDebuff = 3; // 3s slow
                        P._weakDebuff = 3; // 3s damage reduction
                        G.floorAnnounce = { text: '🌑 WEAKENED! 🌑', timer: 1.5 };
                        spawnParticles(P.x, P.y, '#4466ff', 10, 40);
                        triggerChromatic(1.5);
                    }
                    spawnParticles(e.x, e.y, '#4466ff', 6, 30);
                }
            }

            // Ambient element particles
            if (Math.random() < 0.15) {
                spawnParticles(e.x + rng(-8, 8), e.y + rng(-8, 8), e.lightColor, 1, 15);
            }
        }
        // Archer AI: stop at range and shoot
        if (e.type === 'archer') {
            if (!e.shootCd) e.shootCd = 2;
            e.shootCd -= dt;
            if (d < 120 && d > 60) {
                // Stay in range — don't chase closer
            } else if (d >= 120 && d > 5) {
                e.x += (dx / d) * e.speed * dt;
                e.y += (dy / d) * e.speed * dt;
            } else if (d <= 60 && d > 5) {
                // Retreat if too close
                e.x -= (dx / d) * e.speed * 0.5 * dt;
                e.y -= (dy / d) * e.speed * 0.5 * dt;
            }
            // Fire projectile
            if (e.shootCd <= 0 && d < 150) {
                e.shootCd = 1.8 + Math.random() * 0.5;
                if (!G.archerBullets) G.archerBullets = [];
                const spd = 90;
                G.archerBullets.push({
                    x: e.x, y: e.y,
                    vx: (dx / d) * spd, vy: (dy / d) * spd,
                    dmg: e.dmg * (1 + (G.floor - 1) * 0.1),
                    life: 3
                });
                spawnParticles(e.x, e.y, '#ff44ff', 3, 20);
            }
            continue; // skip normal chase
        }

        if (d > 5) {
            e.x += (dx / d) * e.speed * dt;
            e.y += (dy / d) * e.speed * dt;
        }

        // Collision with player
        if (d < e.r + 6 && P.invincible <= 0) {
            e.attackCd -= dt;
            if (e.attackCd <= 0) {
                // Shield wall blocks all damage
                if (P.shieldWall > 0) {
                    spawnParticles(P.x, P.y, '#ddaa44', 4, 25);
                    e.attackCd = 0.5;
                    continue;
                }
                // L001: Fog blind from STEAM BURST combo — 50% miss chance
                if (e._fogBlind > 0 && Math.random() < 0.5) {
                    spawnDmgNum(e.x, e.y - 12, 'MISS', '#aaccdd', false);
                    e.attackCd = 0.5;
                    continue;
                }
                // Apply bonding damage reduction
                const bondDr = getBondDmgReduction(); // Base bonding DR

                // K002: Blessing Stats (Defensive)
                const bStats = (window.getBlessingStats) ? window.getBlessingStats() : {};
                const blessDr = bStats.dmgReduction || 0;

                let dmg = e.dmg * (1 - bondDr);
                dmg *= (1 - blessDr); // Apply blessing DR

                // Cursed: increased damage taken
                if (bStats.enemyDmgMult) dmg *= bStats.enemyDmgMult;

                // Vanguard passive: -20% damage taken
                const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
                if (hero && hero.passive.stat === 'tankAura') dmg *= 0.80;
                // Equipment armor reduction
                const eqArmor = G.equipment ? G.equipment.armor : null;
                if (eqArmor && eqArmor.def) dmg *= (1 - eqArmor.def);
                // S003: Relic damage reduction (Sacred Tortoise Shell)
                if (typeof getRelicStats === 'function') {
                    const relicS = getRelicStats();
                    if (relicS.dmgReduction > 0) dmg *= (1 - relicS.dmgReduction);
                }
                // Phase G: Ally aura damage reduction
                if (G.allyAura && G.allyAura.dmgReduction > 0) dmg *= (1 - G.allyAura.dmgReduction);
                // Equipment armor reflect
                if (eqArmor && eqArmor.reflect && e.hp > 0) {
                    damageEnemy(e, dmg * eqArmor.reflect, P.element);
                }

                // Blessing Thorns
                if (bStats.hasThorns && e.hp > 0) {
                    damageEnemy(e, e.dmg * bStats.thornsValue, 'WOOD'); // Thorns usually Wood/Nature
                }
                // Blessing Ice Armor (Freeze attacker)
                if (bStats.hasIceArmor) {
                    e.frozen = (e.frozen || 0) + bStats.iceArmorFreeze;
                    spawnDmgNum(e.x, e.y - 20, 'FROZEN!', '#88ccff', true);
                }

                P.hp -= dmg;
                P.damageFlash = 0.15;
                P.invincible = 0.3;
                G.combo = 0; // combo reset on hit!
                G.morale = clamp((G.morale || 0) - 5, 0, 100); // Phase G: Morale loss on hit
                G.yinYang.yin = clamp(G.yinYang.yin + 3, 0, 100);
                shake(3, 0.1);
                spawnDmgNum(P.x, P.y - 12, Math.ceil(dmg), '#ff3333', true);
                spawnParticles(P.x, P.y, '#ff3333', 5, 50);
                SFX.playerHit();
                // N003: Vampiric modifier — heal 10% of damage dealt
                if (e.modifiers && e.modifiers.includes('vampiric') && dmg > 0) {
                    const healAmt = dmg * 0.1;
                    e.hp = Math.min(e.hp + healAmt, e.maxHp);
                    spawnDmgNum(e.x, e.y - 10, '+' + Math.ceil(healAmt), '#aa44cc', false);
                    spawnParticles(e.x, e.y, '#aa44cc', 3, 15);
                }
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
        P.xpNeeded = Math.floor(25 * P.level * Math.pow(1.35, P.level - 1));
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
    // Check for evolution opportunity first
    if (typeof window.getEvolutionChoice === 'function') {
        const evoChoice = window.getEvolutionChoice();
        if (evoChoice) {
            choices.push(evoChoice);
        }
    }

    const available = WEAPON_DEFS.filter(w => {
        // Filter banished weapons (K005 QoL)
        if (G.banishedWeapons && G.banishedWeapons.includes(w.id)) return false;
        // Filter out other heroes' signature weapons
        if (w.heroOnly && w.heroOnly !== P.heroId) return false;
        // BALANCE: Class restriction — don't let a class pick another class's weapons
        if (typeof canHeroUseWeapon === 'function' && !canHeroUseWeapon(w, P.heroId)) return false;
        // BALANCE: Level-gated weapons — tier 2 requires minLevel
        if (w.minLevel && P.level < w.minLevel) return false;
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

    // --- Reroll Button Click (K005 QoL) ---
    const rerollCost = 50 + G.rerollCount * 50;
    const rerollBtnW = 80, rerollBtnH = 22;
    const rerollBtnX = GAME_W / 2 - rerollBtnW - 8;
    const rerollBtnY = startY + boxH + 12;
    if (mx >= rerollBtnX && mx <= rerollBtnX + rerollBtnW &&
        my >= rerollBtnY && my <= rerollBtnY + rerollBtnH) {
        if (G.score >= rerollCost) {
            G.score -= rerollCost;
            G.rerollCount++;
            generateLevelUpChoices();
            SFX.menuClick();
        } else {
            // Not enough gold — flash red
            triggerFlash('#ff0000', 0.15);
        }
        return;
    }

    // --- Banish Buttons (X on each card) ---
    for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        if (c.isEvolution) continue; // Can't banish evolutions
        const bx = startX + i * (boxW + gap);
        const banX = bx + boxW - 16, banY = startY + 2;
        if (mx >= banX && mx <= banX + 14 && my >= banY && my <= banY + 14) {
            // Banish this weapon from the run pool
            if (!G.banishedWeapons.includes(c.def.id)) {
                G.banishedWeapons.push(c.def.id);
            }
            // Re-generate choices without the banished weapon
            generateLevelUpChoices();
            SFX.menuClick();
            return;
        }
    }

    // --- Card Selection (existing) ---
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

    // K002: Handle blessing choice from level-up
    if (choice.isBlessing && choice.blessing) {
        if (typeof addBlessing === 'function') addBlessing(choice.blessing);
        const deity = WU_XING_DEITIES[choice.blessing.deity];
        spawnParticles(P.x, P.y, deity.color, 15, 50);
        spawnParticles(P.x, P.y, deity.light, 10, 35);
        triggerFlash(deity.color, 0.25);
        G.floorAnnounce = {
            text: deity.icon + ' ' + (typeof choice.blessing.name === 'object' ? choice.blessing.name[G.lang || 'vi'] : choice.blessing.name),
            timer: 2.0, color: deity.color
        };
        G.state = 'PLAYING';
        G.levelUpChoices = [];
        SFX.levelUp();
        // K001: After level-up in room, auto-progress if room is cleared
        if (G.roomCleared && G.roomState === 'CLEARED') {
            const remaining = G.roomsPerFloor - G.room;
            if (remaining <= 1) {
                setTimeout(() => { G.roomState = 'DOOR_CHOICE'; generateDoorChoices(); }, 2000);
            } else {
                setTimeout(() => { if (typeof autoProgressRoom === 'function') autoProgressRoom(); }, 1500);
            }
        }
        return;
    }

    // Handle evolution
    if (choice.isEvolution && def.isEvolution) {
        window.applyEvolution(def);
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

    // K001: After level-up in room, auto-progress if room is cleared
    if (G.roomCleared && G.roomState === 'CLEARED') {
        const remaining = G.roomsPerFloor - G.room;
        if (remaining <= 1) {
            setTimeout(() => { G.roomState = 'DOOR_CHOICE'; generateDoorChoices(); }, 2000);
        } else {
            setTimeout(() => { if (typeof autoProgressRoom === 'function') autoProgressRoom(); }, 1500);
        }
    }
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
    const pickupR = 40 * (1 + (window.passives ? window.passives.pickupRange : 0));
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
                // N002: Kill streak XP multiplier + N004: Blood Moon bonus
                const streakMult = G.killStreakXpMult || 1;
                const moonMult = G.bloodMoon ? (G.bloodMoonRewardMult || 1.5) : 1;
                P.xp += p.val * (1 + (window.passives ? window.passives.xpGain : 0)) * streakMult * moonMult;
                SFX.xpPickup();
            } else if (p.type === 'gold') {
                // N004: Blood Moon gold bonus
                const moonGoldMult = G.bloodMoon ? (G.bloodMoonRewardMult || 1.5) : 1;
                G.score += Math.floor(p.val * moonGoldMult);
                SFX.goldPickup();
            } else if (p.type === 'hp') {
                P.hp = Math.min(P.hp + p.val, P.maxHp);
                spawnDmgNum(P.x, P.y - 10, p.val, '#ff4444', false);
                SFX.hpPickup();
            } else if (p.type === 'resource') {
                // P006: Workshop resource pickup from gathering nodes
                if (typeof addResource === 'function') {
                    addResource(p.resourceId, p.val);
                }
                const rDef = (typeof WORKSHOP_RESOURCES !== 'undefined') ? WORKSHOP_RESOURCES[p.resourceId] : null;
                const rName = rDef ? (rDef.icon + '+' + p.val) : ('+' + p.val);
                spawnDmgNum(P.x, P.y - 15, rName, rDef ? rDef.color : '#44ffaa', true);
                SFX.goldPickup();
            }
            G.pickups.splice(i, 1);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// P006: Gathering Nodes — Breakable objects that drop Workshop resources
// ═══════════════════════════════════════════════════════════════

const GATHER_NODE_TYPES = [
    { id: 'jade_deposit', icon: '💎', label: 'Jade', resource: 'spirit_jade', minDrop: 2, maxDrop: 5, color: '#44ffaa', bodyColor: '#22aa66' },
    { id: 'war_scrap', icon: '⚔️', label: 'Iron', resource: 'war_iron', minDrop: 1, maxDrop: 3, color: '#cccccc', bodyColor: '#888899' },
    { id: 'dragon_fossil', icon: '🦴', label: 'Bone', resource: 'dragon_bone', minDrop: 1, maxDrop: 2, color: '#ddbb88', bodyColor: '#997755' },
    { id: 'phoenix_ember', icon: '🔥', label: 'Ash', resource: 'phoenix_ash', minDrop: 1, maxDrop: 2, color: '#ff6622', bodyColor: '#cc4411' },
    { id: 'void_crystal', icon: '🔮', label: 'Ink', resource: 'void_ink', minDrop: 1, maxDrop: 2, color: '#aa44ff', bodyColor: '#772299' }
];

function spawnGatherNodes() {
    G.gatherNodes = [];
    // Only spawn in combat-oriented rooms
    if (!G.roomType || G.roomType === 'SHOP' || G.roomType === 'PURGE') return;

    const count = 3 + Math.floor(Math.random() * 3); // 3-5 nodes per room
    const margin = 150; // Stay away from arena edges
    for (let i = 0; i < count; i++) {
        // Choose node type (weighted: jade is most common)
        let nType;
        const roll = Math.random();
        if (roll < 0.35) nType = GATHER_NODE_TYPES[0]; // jade (35%)
        else if (roll < 0.55) nType = GATHER_NODE_TYPES[1]; // iron (20%)
        else if (roll < 0.70) nType = GATHER_NODE_TYPES[2]; // bone (15%)
        else if (roll < 0.85) nType = GATHER_NODE_TYPES[3]; // ash (15%)
        else nType = GATHER_NODE_TYPES[4]; // void_ink (15%)

        // Random position within arena (avoiding center spawn where player appears)
        let nx, ny, tooClose;
        do {
            nx = margin + Math.random() * (G.arenaW - margin * 2);
            ny = margin + Math.random() * (G.arenaH - margin * 2);
            tooClose = Math.hypot(nx - G.arenaW / 2, ny - G.arenaH / 2) < 100;
        } while (tooClose);

        G.gatherNodes.push({
            ...nType,
            x: nx, y: ny,
            hp: 1, // Destroyed on first hit / proximity
            bobTimer: Math.random() * Math.PI * 2 // Offset for bobbing animation
        });
    }
}

function updateGatherNodes(dt) {
    if (!G.gatherNodes) return;
    for (let i = G.gatherNodes.length - 1; i >= 0; i--) {
        const n = G.gatherNodes[i];
        n.bobTimer += dt * 2;

        // Collect on proximity (player walks near)
        const d = dist(P, n);
        if (d < 25) {
            // Determine drop amount
            const dropAmt = n.minDrop + Math.floor(Math.random() * (n.maxDrop - n.minDrop + 1));

            // Spawn resource pickup
            G.pickups.push({
                type: 'resource', resourceId: n.resource, val: dropAmt,
                x: n.x, y: n.y, life: 8
            });

            // Break VFX
            spawnParticles(n.x, n.y, n.color, 10, 30);
            spawnParticles(n.x, n.y, n.bodyColor, 5, 20);
            if (typeof SFX !== 'undefined' && SFX.hit) SFX.hit();

            // Remove node
            G.gatherNodes.splice(i, 1);
        }
    }
}

function drawGatherNodes() {
    if (!G.gatherNodes) return;
    for (const n of G.gatherNodes) {
        const sx = n.x - G.camX + G.shakeX;
        const sy = n.y - G.camY + G.shakeY;
        if (sx < -20 || sx > GAME_W + 20 || sy < -20 || sy > GAME_H + 20) continue;

        // Bobbing animation
        const bob = Math.sin(n.bobTimer) * 2;

        // Shadow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(sx, sy + 8, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Body (crystal/deposit shape)
        ctx.fillStyle = n.bodyColor;
        ctx.fillRect(sx - 5, sy - 6 + bob, 10, 10);

        // Highlight
        ctx.fillStyle = n.color;
        ctx.fillRect(sx - 3, sy - 8 + bob, 6, 4);

        // Sparkle (periodically)
        if (Math.sin(n.bobTimer * 3) > 0.7) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(sx - 1, sy - 9 + bob, 2, 2);
            ctx.globalAlpha = 1;
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

// --- Stage Clear Blessing System (N006) ---
function nextFloor() {
    // Stage Clear!
    // Instead of immediate next floor, we go to Blessing Select
    G.state = 'BLESSING_SELECT';
    G.blessingChoices = (typeof generateBlessingChoices === 'function')
        ? generateBlessingChoices(3) : [];

    // Fanfare
    SFX.levelUp();
    spawnParticles(P.x, P.y, '#ffd700', 50, 100);
    triggerFlash('#ffffff', 0.5);
    G.floorAnnounce = {
        text: 'STAGE CLEARED!',
        subtitle: 'Choose your Blessing',
        timer: 100, // Stay until chosen
        color: '#ffd700'
    };

    // Auto-save at stage clear
    if (typeof saveRunState === 'function') saveRunState();
}

// Spawns environmental hazards for the current floor
function spawnEnvironment() {
    const numTraps = 3 + Math.floor(G.floor * 1.5); // 4, 6, 7...
    const trapTypes = ['SPIKES', 'POISON_VENT', 'LAVA_POOL'];

    for (let i = 0; i < numTraps; i++) {
        // Pick random trap
        const type = trapTypes[Math.floor(Math.random() * trapTypes.length)];
        // Random position, avoiding center (safe zone)
        let tx, ty, d;
        do {
            tx = rng(50, G.arenaW - 50);
            ty = rng(50, G.arenaH - 50);
            d = Math.hypot(tx - G.arenaW / 2, ty - G.arenaH / 2);
        } while (d < 200); // Keep 200px radius clear around center

        // Spawn via Physics
        if (window.Physics && window.Physics.spawnHazard) {
            window.Physics.spawnHazard(tx, ty, type, rng(40, 70));
        }
    }
}

function startNextFloor() {
    G.floor++;
    G.enemies = [];
    G.bullets = [];
    G.pickups = [];
    G.portalActive = false;
    G.portal = null;
    SFX.portalOpen();
    G.enemiesKilled = 0;
    G._minibossSpawned = false; // Reset mini-boss tracking
    if (P.confused) P.confused = 0; // Clear confusion
    G.spawnRate = Math.max(0.5, 1.5 - G.floor * 0.05);
    G.enemiesPerWave = 8 + G.floor * 2;
    P.x = G.arenaW / 2; P.y = G.arenaH / 2;
    P.hp = Math.min(P.hp + P.maxHp * 0.3, P.maxHp); // heal 30% between floors

    // SPAWN ENVIRONMENT (Traps & Obstacles)
    G.hazards = []; // Clear old hazards
    if (typeof spawnEnvironment === 'function') spawnEnvironment();

    spawnParticles(P.x, P.y, '#ffff00', 30, 100);
    spawnElementParticles(P.x, P.y, P.element, 20, 80);
    shake(4, 0.2);
    triggerFlash('#ffffff', 0.3);
    triggerSpeedLines(0.5);

    // Treasure room every 3rd floor
    if (G.floor % 3 === 0 && G.floor % 5 !== 0) {
        G.treasureRoom = { timer: 12, chests: [], fountain: null, collected: 0, total: 0 };
        G.enemiesNeeded = 0;
        // Spawn chests
        const numChests = 3 + Math.floor(G.floor / 6);
        for (let i = 0; i < numChests; i++) {
            G.treasureRoom.chests.push({
                x: G.arenaW / 2 + Math.cos(i / numChests * Math.PI * 2) * 80,
                y: G.arenaH / 2 + Math.sin(i / numChests * Math.PI * 2) * 60,
                collected: false, pulse: Math.random() * 6, gold: 30 + G.floor * 10
            });
        }
        G.treasureRoom.total = numChests;
        // HP fountain at center
        G.treasureRoom.fountain = { x: G.arenaW / 2, y: G.arenaH / 2 - 30, used: false, pulse: 0 };
        G.floorAnnounce = { text: '🏛️ TREASURE ROOM', timer: 2.5 };
    } else {
        G.treasureRoom = null;
        G.enemiesNeeded = 30 + G.floor * 10;
        // Show biome name
        if (typeof getBiome === 'function') {
            const biome = getBiome();
            G.floorAnnounce = { text: `Floor ${G.floor} — ${biome.name}`, timer: 2.5 };
        }
    }

    // T002: Grant workshop resources on floor clear
    if (typeof grantRunResources === 'function') grantRunResources('floor_clear');

    // Re-init ambient particles for new biome
    if (typeof initAmbientParticles === 'function') initAmbientParticles();

    // K001: Generate new room layout for the floor
    if (typeof generateRoomsForFloor === 'function') generateRoomsForFloor();
    // Start in first room (room 1)
    G.room = 1;
    G.roomType = 'COMBAT'; // First room always combat
    G.roomState = 'FIGHTING';
    if (typeof setupRoom === 'function') setupRoom();

    // Auto-save at floor start
    if (typeof saveRunState === 'function') saveRunState();
}

function selectStageClearBlessing(blessing) {
    if (typeof addBlessing === 'function') addBlessing(blessing);

    // VFX
    const deity = WU_XING_DEITIES[blessing.deity];
    spawnParticles(P.x, P.y, deity.color, 40, 80);
    spawnParticles(P.x, P.y, deity.light, 20, 60);
    triggerFlash(deity.color, 0.4);
    shake(4, 0.3);
    SFX.levelUp();

    // Proceed to next floor
    G.state = 'PLAYING';
    G.blessingChoices = null;
    startNextFloor();
}

function handleBlessingSelectClick(mx, my) {
    if (G.state !== 'BLESSING_SELECT' || !G.blessingChoices) return;
    const choices = G.blessingChoices;
    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 10;

    for (let i = 0; i < choices.length; i++) {
        const bx = startX + i * (boxW + gap);
        if (mx >= bx && mx <= bx + boxW && my >= startY && my <= startY + boxH) {
            selectStageClearBlessing(choices[i]);
            return;
        }
    }
}

// --- Treasure Room Update ---
function updateTreasureRoom(dt) {
    const tr = G.treasureRoom;
    if (!tr) return;
    tr.timer -= dt;
    if (tr.fountain) tr.fountain.pulse += dt * 3;

    // Collect chests by walking over them
    for (const c of tr.chests) {
        if (c.collected) continue;
        c.pulse += dt * 4;
        const d = Math.hypot(P.x - c.x, P.y - c.y);
        if (d < 20) {
            c.collected = true;
            tr.collected++;
            G.score += c.gold;
            SFX.coin();
            spawnDmgNum(c.x, c.y - 10, c.gold, '#ffd700', false);
            spawnParticles(c.x, c.y, '#ffd700', 8, 40);
        }
    }

    // HP fountain
    if (tr.fountain && !tr.fountain.used) {
        const fd = Math.hypot(P.x - tr.fountain.x, P.y - tr.fountain.y);
        if (fd < 20) {
            tr.fountain.used = true;
            const heal = Math.floor(P.maxHp * 0.5);
            P.hp = Math.min(P.hp + heal, P.maxHp);
            SFX.revive();
            spawnDmgNum(tr.fountain.x, tr.fountain.y - 15, heal, '#44ff44', false);
            spawnParticles(tr.fountain.x, tr.fountain.y, '#44ff44', 12, 60);
        }
    }

    // Auto-portal when all collected or timer expires
    if (tr.collected >= tr.total || tr.timer <= 0) {
        G.treasureRoom = null;
        nextFloor();
    }
}

// --- Draw Treasure Room ---
function drawTreasureRoom() {
    const tr = G.treasureRoom;
    if (!tr) return;
    ctx.save();
    ctx.translate(-G.camX, -G.camY);

    // Chests
    for (const c of tr.chests) {
        if (c.collected) continue;
        const bob = Math.sin(c.pulse) * 2;
        // Chest glow
        ctx.globalAlpha = 0.15 + Math.sin(c.pulse) * 0.1;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(c.x, c.y + bob, 14, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        // Chest body
        ctx.fillStyle = '#8B4513'; ctx.fillRect(c.x - 8, c.y - 6 + bob, 16, 12);
        ctx.fillStyle = '#DAA520'; ctx.fillRect(c.x - 7, c.y - 3 + bob, 14, 2);
        ctx.fillStyle = '#ffd700'; ctx.fillRect(c.x - 2, c.y - 5 + bob, 4, 4);
        ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(c.x - 8, c.y - 6 + bob, 16, 12);
    }

    // Fountain
    if (tr.fountain && !tr.fountain.used) {
        const f = tr.fountain;
        const glow = Math.sin(f.pulse) * 0.1 + 0.2;
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#44ff44';
        ctx.beginPath(); ctx.arc(f.x, f.y, 18, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        // Fountain base
        ctx.fillStyle = '#336633'; ctx.fillRect(f.x - 10, f.y - 4, 20, 8);
        ctx.fillStyle = '#44ff44'; ctx.fillRect(f.x - 6, f.y - 8, 12, 6);
        ctx.fillStyle = '#88ffaa'; ctx.fillRect(f.x - 2, f.y - 12, 4, 6);
        drawText('HP', f.x, f.y + 12, { font: 'bold 8px monospace', fill: '#44ff44', align: 'center', outlineWidth: 2 });
    }

    // Timer
    const timeLeft = Math.ceil(tr.timer);
    drawText(`${tr.collected}/${tr.total} chests • ${timeLeft}s`, G.camX + GAME_W / 2, G.camY + 30, { font: 'bold 10px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });

    ctx.restore();
}

// --- Ranged Enemy (Archer) Projectiles ---
function updateArcherProjectiles(dt) {
    if (!G.archerBullets) G.archerBullets = [];
    for (let i = G.archerBullets.length - 1; i >= 0; i--) {
        const b = G.archerBullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.life <= 0) { G.archerBullets.splice(i, 1); continue; }
        // Hit player
        if (P.invincible <= 0 && Math.hypot(P.x - b.x, P.y - b.y) < 8) {
            const dr = typeof getBondDmgReduction === 'function' ? getBondDmgReduction() : 0;
            let dmg = b.dmg * (1 - dr);
            // Phase G: Ally aura damage reduction
            if (G.allyAura && G.allyAura.dmgReduction > 0) dmg *= (1 - G.allyAura.dmgReduction);
            // Equipment armor DR
            if (P.dmgReduction > 0) dmg *= (1 - P.dmgReduction);
            // Reflect projectiles (Borrowed Arrows talisman)
            if (P.reflectProjectiles) {
                // Reverse the arrow back at sender
                b.vx = -b.vx; b.vy = -b.vy;
                b.reflected = true;
                spawnDmgNum(P.x, P.y - 15, 'REFLECT!', '#ffaa00', true);
                spawnParticles(P.x, P.y, '#ffaa00', 5, 25);
                P.invincible = 0.1;
                continue; // Skip damage
            }
            P.hp -= dmg;
            P.damageFlash = 0.15;
            P.invincible = 0.3;
            G.combo = 0;
            G.morale = clamp((G.morale || 0) - 5, 0, 100); // Phase G: Morale loss
            shake(2, 0.1);
            spawnDmgNum(P.x, P.y - 12, Math.ceil(dmg), '#ff3333', true);
            spawnParticles(P.x, P.y, '#ff33ff', 4, 30);
            SFX.playerHit();
            G.archerBullets.splice(i, 1);
        }
    }
}

function drawArcherProjectiles() {
    if (!G.archerBullets) return;
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    for (const b of G.archerBullets) {
        ctx.fillStyle = '#ff44ff';
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff88ff';
        ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
    }
    ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// K001: Room-Based Dungeon Progression System
// ═══════════════════════════════════════════════════════════════

const ROOM_TYPES = {
    COMBAT: { icon: '⚔️', name: { vi: 'Chiến Đấu', en: 'Combat' }, color: '#ff4444' },
    ELITE: { icon: '💀', name: { vi: 'Tinh Nhuệ', en: 'Elite' }, color: '#ff8800' },
    SHOP: { icon: '🛒', name: { vi: 'Cửa Hàng', en: 'Shop' }, color: '#ffdd44' },
    REST: { icon: '💚', name: { vi: 'Nghỉ Ngơi', en: 'Rest' }, color: '#44dd44' },
    TREASURE: { icon: '💎', name: { vi: 'Kho Báu', en: 'Treasure' }, color: '#44ddff' },
    BOSS: { icon: '👹', name: { vi: 'TRÙM', en: 'BOSS' }, color: '#ff0000' },
    BLESSING: { icon: '✨', name: { vi: 'Phước Lành', en: 'Blessing' }, color: '#ffd700' },
    PURGE: { icon: '⛩️', name: { vi: 'Đền Thanh Tẩy', en: 'Purge Shrine' }, color: '#aa44ff' }
};

function generateRoomsForFloor() {
    G.roomsPerFloor = 3 + Math.floor(Math.random() * 3); // 3-5 rooms
    G.room = 1;
    G.roomHistory = [];
}

function generateDoorChoices() {
    const remaining = G.roomsPerFloor - G.room;
    if (remaining <= 0) {
        // Last room = Boss
        G.doorChoices = [{ type: 'BOSS', reward: 'boss' }];
        return;
    }

    const choices = [];
    const numDoors = remaining === 1 ? 1 : (Math.random() < 0.3 ? 2 : 3);

    // Weighted room type selection
    const typePool = [];
    typePool.push('COMBAT', 'COMBAT', 'COMBAT'); // 3x weight
    if (G.floor >= 2) typePool.push('ELITE');
    typePool.push('SHOP');
    typePool.push('REST');
    typePool.push('TREASURE');
    // P001: Purge Shrine — available from floor 3, only if player has active blessings
    if (G.floor >= 3 && typeof BlessingState !== 'undefined' && BlessingState.active.length > 0) {
        typePool.push('PURGE');
    }
    typePool.push('BLESSING'); // 1x weight (was 2x)

    for (let i = 0; i < numDoors; i++) {
        let roomType;
        // Avoid consecutive same types
        do {
            roomType = typePool[Math.floor(Math.random() * typePool.length)];
        } while (choices.find(c => c.type === roomType) && typePool.length > numDoors);

        // Generate reward preview
        let reward;
        switch (roomType) {
            case 'COMBAT': reward = 'xp'; break;
            case 'ELITE': reward = 'weapon'; break;
            case 'SHOP': reward = 'gold'; break;
            case 'REST': reward = 'hp'; break;
            case 'PURGE': reward = 'purge'; break;
            case 'TREASURE': reward = 'item'; break;
            case 'BLESSING': reward = 'blessing'; break;
            default: reward = 'xp';
        }
        choices.push({ type: roomType, reward });
    }

    G.doorChoices = choices;
}

// Auto-progress: skip door choice popup, just move to next room seamlessly
function autoProgressRoom() {
    // Weighted random room type
    const typePool = ['COMBAT', 'COMBAT', 'COMBAT'];
    if (G.floor >= 2) typePool.push('ELITE');
    typePool.push('SHOP');
    typePool.push('REST');
    typePool.push('TREASURE');
    typePool.push('BLESSING');

    // Pick random, avoid repeating last room type
    let roomType;
    do {
        roomType = typePool[Math.floor(Math.random() * typePool.length)];
    } while (roomType === G.roomType && typePool.length > 1);

    G.room++;
    G.roomType = roomType;
    G.roomState = 'TRANSITIONING';
    G.roomTransition = 0.8;
    G.doorChoices = null;
    G.roomCleared = false;
    G.roomHistory.push(roomType);

    // Transition VFX
    triggerFlash('#000000', 0.4);
    SFX.menuClick();

    // Brief room announcement (non-blocking)
    const rt = ROOM_TYPES[roomType] || ROOM_TYPES.COMBAT;
    G.floorAnnounce = {
        text: rt.icon + ' ' + rt.name[G.lang || 'vi'] + ' ' + rt.icon,
        subtitle: (G.lang === 'en' ? 'Room' : 'Phòng') + ' ' + G.room + '/' + G.roomsPerFloor,
        timer: 1.5,
        color: rt.color
    };
}

function selectDoor(doorIndex) {
    if (!G.doorChoices || doorIndex >= G.doorChoices.length) return;
    const door = G.doorChoices[doorIndex];
    G.room++;
    G.roomType = door.type;
    G.roomState = 'TRANSITIONING';
    G.roomTransition = 0.8; // Fade transition duration
    G.doorChoices = null;
    G.roomCleared = false;
    G.roomHistory.push(door.type);

    // Transition VFX
    triggerFlash('#000000', 0.6);
    SFX.menuClick();

    // Announce room type
    const rt = ROOM_TYPES[door.type] || ROOM_TYPES.COMBAT;
    G.floorAnnounce = {
        text: rt.icon + ' ' + rt.name[G.lang || 'vi'] + ' ' + rt.icon,
        subtitle: (G.lang === 'en' ? 'Room' : 'Phòng') + ' ' + G.room + '/' + G.roomsPerFloor,
        timer: 2.0,
        color: rt.color
    };
}

function setupRoom() {
    // Clear enemies and bullets
    G.enemies = [];
    G.bullets = [];
    G.archerBullets = [];
    G.pickups = [];

    // Center player
    P.x = G.arenaW / 2;
    P.y = G.arenaH / 2;

    // P006: Spawn gathering nodes for this room
    if (typeof spawnGatherNodes === 'function') spawnGatherNodes();

    G.roomState = 'FIGHTING';

    switch (G.roomType) {
        case 'COMBAT':
            // Standard combat room
            G.enemiesKilled = 0;
            G.enemiesNeeded = 35 + G.floor * 8 + G.room * 5;
            G.spawnTimer = 0;
            break;

        case 'ELITE':
            // Elite room — mini-boss fight
            G.enemiesKilled = 0;
            G.enemiesNeeded = 1;
            spawnEnemy(G.arenaW / 2 + 100, G.arenaH / 2, 'miniboss');
            // Also some fodder
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const d = rng(80, 150);
                spawnEnemy(G.arenaW / 2 + Math.cos(angle) * d, G.arenaH / 2 + Math.sin(angle) * d, 'fodder');
            }
            G.enemiesNeeded = 6;
            break;

        case 'SHOP':
            // Shop room — auto-clear, show shop UI
            G.roomState = 'CLEARED';
            G.roomCleared = true;
            G.state = 'SHOP';
            G.shopItems = generateShopItems();
            break;

        case 'REST':
            // Rest room — heal 30% HP
            P.hp = Math.min(P.hp + Math.ceil(P.maxHp * 0.3), P.maxHp);
            spawnParticles(P.x, P.y, '#44dd44', 15, 50);
            spawnDmgNum(P.x, P.y - 15, '+' + Math.ceil(P.maxHp * 0.3) + 'HP', '#44ff44', true);
            G.roomState = 'CLEARED';
            G.roomCleared = true;
            // Auto show doors after delay
            setTimeout(() => {
                if (G.roomState === 'CLEARED') {
                    G.roomState = 'DOOR_CHOICE';
                    generateDoorChoices();
                }
            }, 2000);
            break;

        case 'TREASURE':
            // Treasure room — free level up
            G.roomState = 'CLEARED';
            G.roomCleared = true;
            G.state = 'LEVEL_UP';
            generateLevelUpChoices();
            spawnParticles(P.x, P.y, '#ffd700', 20, 60);
            break;

        case 'BLESSING':
            // Blessing room — choose a Wu Xing blessing
            G.roomState = 'CLEARED';
            G.roomCleared = true;
            G.state = 'BLESSING_CHOICE';
            G.blessingChoices = (typeof generateBlessingChoices === 'function')
                ? generateBlessingChoices(3) : [];
            break;

        case 'PURGE':
            // P001: Purge Shrine — player can remove one active blessing
            G.roomState = 'CLEARED';
            G.roomCleared = true;
            G.state = 'PURGE_SHRINE';
            break;

        case 'BOSS':
            // Boss room — spawn floor boss
            G.enemiesKilled = 0;
            G.enemiesNeeded = 1;
            spawnEnemy(G.arenaW / 2, G.arenaH / 2 - 80, 'boss');
            break;
    }
}

function generateShopItems() {
    const items = [];
    // HP restoration
    items.push({
        name: { vi: 'Thuốc Hồi Sinh', en: 'Healing Potion' },
        icon: '❤️', cost: 50, effect: 'heal', value: Math.ceil(P.maxHp * 0.5)
    });
    // Max HP boost
    items.push({
        name: { vi: 'Trái Tim Rồng', en: 'Dragon Heart' },
        icon: '💛', cost: 100, effect: 'maxhp', value: 20
    });
    // Random blessing
    if (typeof generateBlessingChoices === 'function') {
        const bless = generateBlessingChoices(1);
        if (bless.length > 0) {
            const b = bless[0];
            const deity = WU_XING_DEITIES[b.deity];
            items.push({
                name: b.name, icon: deity.icon, cost: 150,
                effect: 'blessing', blessing: b
            });
        }
    }
    return items;
}

function handleShopClick(mx, my) {
    if (G.state !== 'SHOP' || !G.shopItems) return;
    const items = G.shopItems;
    const boxW = 120, boxH = 70, gap = 12;
    const totalW = items.length * boxW + (items.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 10;

    for (let i = 0; i < items.length; i++) {
        const bx = startX + i * (boxW + gap);
        if (mx >= bx && mx <= bx + boxW && my >= startY && my <= startY + boxH) {
            const item = items[i];
            if (G.score >= item.cost) {
                G.score -= item.cost;
                switch (item.effect) {
                    case 'heal':
                        P.hp = Math.min(P.hp + item.value, P.maxHp);
                        spawnParticles(P.x, P.y, '#ff4444', 10, 40);
                        break;
                    case 'maxhp':
                        P.maxHp += item.value;
                        P.hp += item.value;
                        spawnParticles(P.x, P.y, '#ffdd44', 10, 40);
                        break;
                    case 'blessing':
                        if (typeof addBlessing === 'function') addBlessing(item.blessing);
                        spawnParticles(P.x, P.y, '#ffd700', 15, 50);
                        break;
                }
                SFX.menuClick();
                items.splice(i, 1); // Remove purchased item
                // If all items bought, auto-close shop
                if (items.length === 0) {
                    G.state = 'PLAYING';
                    G.roomState = 'DOOR_CHOICE';
                    generateDoorChoices();
                }
            } else {
                triggerFlash('#ff0000', 0.15);
            }
            return;
        }
    }

    // Skip shop button (bottom)
    const skipW = 100, skipH = 24;
    const skipX = GAME_W / 2 - skipW / 2, skipY = startY + boxH + 20;
    if (mx >= skipX && mx <= skipX + skipW && my >= skipY && my <= skipY + skipH) {
        G.state = 'PLAYING';
        G.roomState = 'DOOR_CHOICE';
        generateDoorChoices();
        SFX.menuClick();
    }
}

function handleDoorChoiceClick(mx, my) {
    if (G.roomState !== 'DOOR_CHOICE' || !G.doorChoices) return;
    const doors = G.doorChoices;
    const doorW = 80, doorH = 100, gap = 20;
    const totalW = doors.length * doorW + (doors.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - doorH / 2;

    for (let i = 0; i < doors.length; i++) {
        const dx = startX + i * (doorW + gap);
        if (mx >= dx && mx <= dx + doorW && my >= startY && my <= startY + doorH) {
            selectDoor(i);
            return;
        }
    }
}

function handleBlessingChoiceClick(mx, my) {
    if (G.state !== 'BLESSING_CHOICE' || !G.blessingChoices) return;
    const choices = G.blessingChoices;
    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 5;

    for (let i = 0; i < choices.length; i++) {
        const bx = startX + i * (boxW + gap);
        if (mx >= bx && mx <= bx + boxW && my >= startY && my <= startY + boxH) {
            const blessing = choices[i];
            if (typeof addBlessing === 'function') addBlessing(blessing);
            // VFX
            const deity = WU_XING_DEITIES[blessing.deity];
            spawnParticles(P.x, P.y, deity.color, 20, 60);
            spawnParticles(P.x, P.y, deity.light, 12, 40);
            triggerFlash(deity.color, 0.3);
            shake(3, 0.2);
            SFX.levelUp();
            // Announcement
            G.floorAnnounce = {
                text: deity.icon + ' ' + blessing.name[G.lang || 'vi'],
                subtitle: blessing.desc[G.lang || 'vi'],
                timer: 2.5,
                color: deity.color
            };
            // Return to gameplay
            G.state = 'PLAYING';
            G.blessingChoices = null;
            // Show door choices
            setTimeout(() => {
                if (G.roomState === 'CLEARED') {
                    G.roomState = 'DOOR_CHOICE';
                    generateDoorChoices();
                }
            }, 1000);
            return;
        }
    }
}

// --- Modify Level-Up to Sometimes Offer Blessings ---
const _origGenerateLevelUpChoices = generateLevelUpChoices;
generateLevelUpChoices = function () {
    _origGenerateLevelUpChoices();

    // 25% chance to replace one choice with a blessing
    if (typeof generateBlessingChoices === 'function' && Math.random() < 0.25) {
        const blessings = generateBlessingChoices(1);
        if (blessings.length > 0 && G.levelUpChoices.length > 0) {
            const b = blessings[0];
            const deity = WU_XING_DEITIES[b.deity];
            // Replace last choice with blessing
            G.levelUpChoices[G.levelUpChoices.length - 1] = {
                def: { id: b.id, name: b.name, desc: b.desc, icon: deity.icon, element: deity.element },
                isBlessing: true,
                blessing: b,
                level: b.rarity === 'common' ? 1 : b.rarity === 'rare' ? 2 : 3
            };
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// P003: Battle Scars — Persistent buff/debuff from boss kills
// ═══════════════════════════════════════════════════════════════

const BATTLE_SCARS = [
    {
        id: 'berserker_fury', icon: '🔥',
        name: { vi: 'Cuồng Nộ Chiến Binh', en: 'Berserker Fury' },
        buff: { dmgMult: 0.15, desc: { vi: '+15% sát thương', en: '+15% damage' } },
        debuff: { defMult: -0.10, desc: { vi: '-10% phòng thủ', en: '-10% defense' } },
        color: '#ff4422'
    },
    {
        id: 'iron_skin', icon: '🛡️',
        name: { vi: 'Da Sắt', en: 'Iron Skin' },
        buff: { defMult: 0.20, desc: { vi: '+20% phòng thủ', en: '+20% defense' } },
        debuff: { spdMult: -0.10, desc: { vi: '-10% tốc độ', en: '-10% speed' } },
        color: '#888899'
    },
    {
        id: 'blood_pact', icon: '💉',
        name: { vi: 'Giao Ước Máu', en: 'Blood Pact' },
        buff: { lifesteal: 0.05, desc: { vi: '+5% hút máu', en: '+5% lifesteal' } },
        debuff: { maxHpMult: -0.10, desc: { vi: '-10% HP tối đa', en: '-10% max HP' } },
        color: '#cc2244'
    },
    {
        id: 'windwalker', icon: '💨',
        name: { vi: 'Bộ Phong', en: 'Windwalker' },
        buff: { spdMult: 0.20, desc: { vi: '+20% tốc độ', en: '+20% speed' } },
        debuff: { dmgMult: -0.08, desc: { vi: '-8% sát thương', en: '-8% damage' } },
        color: '#44ddaa'
    },
    {
        id: 'eagle_eye', icon: '🎯',
        name: { vi: 'Mắt Diều Hâu', en: 'Eagle Eye' },
        buff: { critChance: 0.10, desc: { vi: '+10% bạo kích', en: '+10% crit chance' } },
        debuff: { atkSpdMult: -0.12, desc: { vi: '-12% tốc độ tấn công', en: '-12% attack speed' } },
        color: '#ffcc00'
    },
    {
        id: 'tremor_strike', icon: '💥',
        name: { vi: 'Chấn Động', en: 'Tremor Strike' },
        buff: { splashRadius: 20, desc: { vi: '+20 bán kính nổ', en: '+20 splash radius' } },
        debuff: { defMult: -0.08, desc: { vi: '-8% phòng thủ', en: '-8% defense' } },
        color: '#ff8844'
    },
    {
        id: 'dragon_reach', icon: '🐉',
        name: { vi: 'Tay Rồng', en: 'Dragon Reach' },
        buff: { rangeMult: 0.15, desc: { vi: '+15% tầm đánh', en: '+15% range' } },
        debuff: { dmgMult: -0.05, desc: { vi: '-5% sát thương', en: '-5% damage' } },
        color: '#2288ff'
    },
    {
        id: 'shadow_step', icon: '👻',
        name: { vi: 'Bước Bóng', en: 'Shadow Step' },
        buff: { dodgeChance: 0.08, desc: { vi: '+8% né tránh', en: '+8% dodge' } },
        debuff: { maxHpMult: -0.05, desc: { vi: '-5% HP tối đa', en: '-5% max HP' } },
        color: '#7744cc'
    }
];

window.BattleScarState = {
    scars: [],  // Array of scar IDs earned this run
    active: []  // Full scar objects for display
};

function resetBattleScars() {
    window.BattleScarState.scars = [];
    window.BattleScarState.active = [];
}

function grantBattleScar() {
    // Pick a random scar the player doesn't already have
    const available = BATTLE_SCARS.filter(s => !window.BattleScarState.scars.includes(s.id));
    if (available.length === 0) return null;

    const scar = available[Math.floor(Math.random() * available.length)];
    window.BattleScarState.scars.push(scar.id);
    window.BattleScarState.active.push(scar);

    // Apply max HP debuffs immediately
    if (scar.debuff.maxHpMult) {
        const hpLoss = Math.ceil(P.maxHp * Math.abs(scar.debuff.maxHpMult));
        P.maxHp -= hpLoss;
        P.hp = Math.min(P.hp, P.maxHp);
    }

    return scar;
}

function getBattleScarStats() {
    const stats = {
        dmgMult: 0, defMult: 0, spdMult: 0, atkSpdMult: 0,
        lifesteal: 0, critChance: 0, dodgeChance: 0,
        splashRadius: 0, rangeMult: 0
    };
    for (const scar of window.BattleScarState.active) {
        for (const [key, val] of Object.entries(scar.buff)) {
            if (key !== 'desc' && stats[key] !== undefined) stats[key] += val;
        }
        for (const [key, val] of Object.entries(scar.debuff)) {
            if (key !== 'desc' && stats[key] !== undefined) stats[key] += val;
        }
    }
    return stats;
}

// ═══════════════════════════════════════════════════════════════
// P005: Run History & Statistics
// ═══════════════════════════════════════════════════════════════

const RUN_HISTORY_KEY = 'dbd_runHistory';
const RUN_HISTORY_MAX = 50;  // Keep last 50 runs

window.RunHistory = {
    runs: [],
    _startTime: 0,

    load() {
        try {
            const saved = localStorage.getItem(RUN_HISTORY_KEY);
            this.runs = saved ? JSON.parse(saved) : [];
        } catch (e) { this.runs = []; }
    },

    save() {
        try {
            localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(this.runs));
        } catch (e) { /* silently fail */ }
    },

    startRun() {
        this._startTime = Date.now();
    },

    recordRun(outcome) {
        const duration = Math.floor((Date.now() - this._startTime) / 1000);  // seconds
        const run = {
            id: Date.now(),
            hero: P.heroId || 'unknown',
            floor: G.floor || 1,
            kills: G.totalKills || G.enemiesKilled || 0,
            score: G.score || 0,
            combo: G.maxCombo || 0,
            level: P.level || 1,
            duration: duration,
            outcome: outcome,  // 'victory' | 'defeat'
            difficulty: G.difficulty || 0,
            scars: window.BattleScarState ? window.BattleScarState.scars.length : 0,
            blessings: (typeof BlessingState !== 'undefined') ? BlessingState.active.length : 0,
            weapons: G.weapons ? G.weapons.length : 0,
            date: new Date().toISOString()
        };

        this.runs.unshift(run);

        // Cap history
        if (this.runs.length > RUN_HISTORY_MAX) {
            this.runs = this.runs.slice(0, RUN_HISTORY_MAX);
        }

        this.save();
        return run;
    },

    getStats() {
        const runs = this.runs;
        if (runs.length === 0) {
            return {
                totalRuns: 0, totalKills: 0, bestFloor: 0, bestScore: 0,
                winRate: 0, avgKills: 0, avgFloor: 0, totalPlaytime: 0,
                bestCombo: 0, victories: 0
            };
        }

        let totalKills = 0, totalFloors = 0, totalPlaytime = 0;
        let bestFloor = 0, bestScore = 0, bestCombo = 0, victories = 0;

        for (const r of runs) {
            totalKills += r.kills || 0;
            totalFloors += r.floor || 0;
            totalPlaytime += r.duration || 0;
            if (r.floor > bestFloor) bestFloor = r.floor;
            if (r.score > bestScore) bestScore = r.score;
            if ((r.combo || 0) > bestCombo) bestCombo = r.combo;
            if (r.outcome === 'victory') victories++;
        }

        return {
            totalRuns: runs.length,
            totalKills,
            bestFloor,
            bestScore,
            bestCombo,
            victories,
            winRate: Math.round((victories / runs.length) * 100),
            avgKills: Math.round(totalKills / runs.length),
            avgFloor: Math.round((totalFloors / runs.length) * 10) / 10,
            totalPlaytime
        };
    },

    getHeroStats(heroId) {
        const heroRuns = this.runs.filter(r => r.hero === heroId);
        if (heroRuns.length === 0) return null;

        let totalKills = 0, bestFloor = 0, victories = 0;
        for (const r of heroRuns) {
            totalKills += r.kills || 0;
            if (r.floor > bestFloor) bestFloor = r.floor;
            if (r.outcome === 'victory') victories++;
        }

        return {
            runs: heroRuns.length,
            totalKills,
            bestFloor,
            victories,
            winRate: Math.round((victories / heroRuns.length) * 100)
        };
    }
};

// Load on init
window.RunHistory.load();

function getRunHistory() { return window.RunHistory.runs; }
function getRunStats() { return window.RunHistory.getStats(); }

function formatPlaytime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
}


