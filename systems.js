// ============================================================
// DYNASTY BRUHHH DUNGEON - Enemies & Spawning
// ============================================================

function spawnEnemy(x, y, type) {
    const el = rngEl();
    const elDef = ELEMENTS[el];
    const floorMult = 1 + (G.floor - 1) * 0.20;
    // K004: Difficulty tier multiplier
    const diffTier = (typeof DIFFICULTY_TIERS !== 'undefined' && DIFFICULTY_TIERS[G.difficulty]) ? DIFFICULTY_TIERS[G.difficulty] : { hpMult: 1, spdMult: 1 };
    const types = {
        fodder: { hp: 5, speed: 25, dmg: 2, r: 4, xp: 1 },
        grunt: { hp: 20, speed: 35, dmg: 5, r: 6, xp: 3 },
        fast: { hp: 12, speed: 65, dmg: 3, r: 5, xp: 4 },
        tank: { hp: 60, speed: 20, dmg: 10, r: 9, xp: 8 },
        archer: { hp: 15, speed: 25, dmg: 7, r: 6, xp: 5 },
        elite: { hp: 120, speed: 30, dmg: 15, r: 11, xp: 20 },
        miniboss: { hp: 300, speed: 28, dmg: 18, r: 13, xp: 50 },
        boss: { hp: 600, speed: 18, dmg: 25, r: 16, xp: 100 }
    };
    const t = types[type] || types.grunt;
    const enemy = {
        x, y, vx: 0, vy: 0,
        hp: t.hp * floorMult * diffTier.hpMult, maxHp: t.hp * floorMult * diffTier.hpMult,
        speed: t.speed * diffTier.spdMult, dmg: t.dmg * floorMult * diffTier.hpMult,
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
}

function spawnWave() {
    const cx = P.x, cy = P.y;
    // DW-style: majority fodder + some officers
    const fodderCount = 10 + G.floor * 2; // 12, 14, 16...
    const officerCount = 3 + Math.floor(G.floor * 0.8); // 3, 4, 4...
    const totalCount = fodderCount + officerCount;

    // Spawn fodder
    for (let i = 0; i < fodderCount; i++) {
        const angle = rng(0, Math.PI * 2);
        const d = rng(150, 280);
        const x = clamp(cx + Math.cos(angle) * d, 30, G.arenaW - 30);
        const y = clamp(cy + Math.sin(angle) * d, 30, G.arenaH - 30);
        spawnEnemy(x, y, 'fodder');
    }
    // Spawn officers
    for (let i = 0; i < officerCount; i++) {
        const angle = rng(0, Math.PI * 2);
        const d = rng(180, 320);
        const x = clamp(cx + Math.cos(angle) * d, 30, G.arenaW - 30);
        const y = clamp(cy + Math.sin(angle) * d, 30, G.arenaH - 30);
        const roll = Math.random();
        let type = 'grunt';
        if (roll < 0.06 && G.floor >= 3) type = 'elite';
        else if (roll < 0.15 && G.floor >= 2) type = 'archer';
        else if (roll < 0.30) type = 'tank';
        else if (roll < 0.55) type = 'fast';
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

        // Phase H: Slow debuff tick-down
        if (e._slowTimer > 0) {
            e._slowTimer -= dt;
            e.speed = e._origSpeed * (1 - (e._slowPct || 0.3));
            if (e._slowTimer <= 0) {
                e.speed = e._origSpeed;
            }
        }

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
                // Apply bonding damage reduction
                const dr = getBondDmgReduction();
                let dmg = e.dmg * (1 - dr);
                // Vanguard passive: -20% damage taken
                const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
                if (hero && hero.passive.stat === 'tankAura') dmg *= 0.80;
                // Equipment armor reduction
                const eqArmor = G.equipment ? G.equipment.armor : null;
                if (eqArmor && eqArmor.def) dmg *= (1 - eqArmor.def);
                // Phase G: Ally aura damage reduction
                if (G.allyAura && G.allyAura.dmgReduction > 0) dmg *= (1 - G.allyAura.dmgReduction);
                // Equipment armor reflect
                if (eqArmor && eqArmor.reflect && e.hp > 0) {
                    damageEnemy(e, dmg * eqArmor.reflect, P.element);
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
        P.xpNeeded = Math.floor(20 * Math.pow(1.35, P.level - 1));
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
        // Filter banished weapons (K005 QoL)
        if (G.banishedWeapons && G.banishedWeapons.includes(w.id)) return false;
        // Filter out other heroes' signature weapons
        if (w.heroOnly && w.heroOnly !== P.heroId) return false;
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
        // K001: After level-up in room, show doors if room is cleared
        if (G.roomCleared && G.roomState === 'CLEARED') {
            setTimeout(() => { G.roomState = 'DOOR_CHOICE'; generateDoorChoices(); }, 500);
        }
        return;
    }

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

    // K001: After level-up in room, show doors if room is cleared
    if (G.roomCleared && G.roomState === 'CLEARED') {
        setTimeout(() => { G.roomState = 'DOOR_CHOICE'; generateDoorChoices(); }, 500);
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
    G._minibossSpawned = false; // Reset mini-boss tracking
    if (P.confused) P.confused = 0; // Clear confusion
    G.spawnRate = Math.max(0.5, 1.5 - G.floor * 0.05);
    G.enemiesPerWave = 8 + G.floor * 2;
    P.x = G.arenaW / 2; P.y = G.arenaH / 2;
    P.hp = Math.min(P.hp + P.maxHp * 0.3, P.maxHp); // heal 30% between floors
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

    // Re-init ambient particles for new biome
    if (typeof initAmbientParticles === 'function') initAmbientParticles();
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
    BLESSING: { icon: '✨', name: { vi: 'Phước Lành', en: 'Blessing' }, color: '#ffd700' }
};

function generateRoomsForFloor() {
    G.roomsPerFloor = 5 + Math.floor(Math.random() * 3); // 5-7 rooms
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
    typePool.push('BLESSING', 'BLESSING'); // 2x weight

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
            case 'TREASURE': reward = 'item'; break;
            case 'BLESSING': reward = 'blessing'; break;
            default: reward = 'xp';
        }
        choices.push({ type: roomType, reward });
    }

    G.doorChoices = choices;
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

    G.roomState = 'FIGHTING';

    switch (G.roomType) {
        case 'COMBAT':
            // Standard combat room
            G.enemiesKilled = 0;
            G.enemiesNeeded = 25 + G.floor * 5 + G.room * 3;
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
