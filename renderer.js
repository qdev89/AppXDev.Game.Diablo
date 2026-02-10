// ============================================================
// DYNASTY BRUHHH DUNGEON - Renderer (Premium Upgrade)
// ============================================================

function drawGame() {
    ctx.save();
    ctx.translate(-G.camX + G.shakeX, -G.camY + G.shakeY);

    // --- World layers ---
    drawFloorTiles();          // Biome-aware tiled floor (from postfx.js)
    drawAmbientParticles();    // Floating dust/embers (from postfx.js)
    drawPickups();
    drawPortal();
    drawEnemies();
    drawBullets();
    drawPlayer();
    drawSkillEffects();
    drawParticlesWorld();
    drawDmgNums();

    ctx.restore();

    // --- HUD (screen-space) ---
    drawHUD();

    // --- Post-processing (screen-space) ---
    applyPostFX();
}

// --- Player ---
function drawPlayer() {
    const px = Math.round(P.x), py = Math.round(P.y);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(px, py + 7, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Invincible ghost effect
    if (P.invincible > 0 && Math.floor(G.time * 20) % 3 === 0) {
        ctx.globalAlpha = 0.3;
    }

    // Determine tint
    let tint = null;
    if (P.damageFlash > 0) tint = '#ffffff';

    // Draw pixel art sprite
    const flipX = P.facing < 0;
    drawPlayerSprite(px, py + 8, P.element, 0, flipX, tint);

    ctx.globalAlpha = 1;

    // Movement trail particles
    if (Math.abs(P.vx) > 30 || Math.abs(P.vy) > 30) {
        if (Math.random() < 0.3) {
            const elDef = ELEMENTS[P.element];
            G.particles.push({
                x: px + rng(-3, 3), y: py + 5,
                vx: -P.vx * 0.1 + rng(-10, 10), vy: rng(-5, 5),
                life: 0.4, decay: 2.5, color: elDef.light, size: rng(1, 2)
            });
        }
    }

    // Yin-Yang aura
    const yy = G.yinYang;
    if (yy.state === 'HARMONY') {
        drawGlow(px, py, 30, '#ffd700', 0.3 + Math.sin(G.time * 5) * 0.15);
        ctx.strokeStyle = `rgba(255,215,0,${0.6 + Math.sin(G.time * 5) * 0.3})`;
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.stroke();
    } else if (yy.state === 'CHAOS') {
        drawGlow(px, py, 25, '#ff2222', 0.25 + Math.sin(G.time * 8) * 0.15);
        ctx.strokeStyle = `rgba(255,50,50,${0.6 + Math.sin(G.time * 8) * 0.3})`;
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.stroke();
    } else if (yy.state === 'SERENITY') {
        drawGlow(px, py, 28, '#4488ff', 0.2 + Math.sin(G.time * 3) * 0.15);
        ctx.strokeStyle = `rgba(100,150,255,${0.6 + Math.sin(G.time * 3) * 0.3})`;
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.stroke();
    }

    // --- Active Buff Auras ---
    // Rage Mode: fire glow aura
    if (P.rageModeTimer > 0) {
        const pulse = 0.2 + Math.sin(G.time * 8) * 0.1;
        drawGlow(px, py, 25, '#ff4400', pulse);
        ctx.strokeStyle = `rgba(255,68,0,${0.5 + Math.sin(G.time * 6) * 0.3})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 18 + Math.sin(G.time * 10) * 3, 0, Math.PI * 2); ctx.stroke();
        // Fire particles
        if (Math.random() < 0.4) {
            G.particles.push({
                x: px + rng(-8, 8), y: py + rng(-5, 5),
                vx: rng(-15, 15), vy: rng(-30, -10),
                life: 0.3, decay: 3, color: Math.random() > 0.5 ? '#ff4400' : '#ff8800', size: rng(1, 3)
            });
        }
    }
    // Shield Wall: golden dome
    if (P.shieldWall > 0) {
        const shimmer = 0.25 + Math.sin(G.time * 4) * 0.1;
        ctx.strokeStyle = `rgba(255,215,0,${shimmer + 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(255,215,0,${shimmer * 0.3})`;
        ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill();
        // Sparkle particles on dome surface
        if (Math.random() < 0.3) {
            const sparkA = Math.random() * Math.PI * 2;
            G.particles.push({
                x: px + Math.cos(sparkA) * 20, y: py + Math.sin(sparkA) * 20,
                vx: Math.cos(sparkA) * 5, vy: Math.sin(sparkA) * 5 - 10,
                life: 0.3, decay: 3, color: '#ffe066', size: 1
            });
        }
    }

    // Orbital weapons with glow
    for (const w of G.weapons) {
        if (w.type === 'orbital') {
            const orbCount = (w.count || 3) + Math.floor(w.level / 2);
            const range = w.range + w.level * 8;
            const el = ELEMENTS[w.el];

            // Connecting chain aura
            ctx.strokeStyle = el.light;
            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;

            for (let i = 0; i < orbCount; i++) {
                const a = w.orbitAngle + (Math.PI * 2 / orbCount) * i;
                const ox = px + Math.cos(a) * range;
                const oy = py + Math.sin(a) * range;

                // Glow
                drawGlow(ox, oy, 10, el.light, 0.3);

                // Orb sprite (small diamond)
                ctx.fillStyle = el.light;
                ctx.save();
                ctx.translate(ox, oy);
                ctx.rotate(G.time * 3 + i);
                ctx.fillRect(-3, -3, 6, 6);
                ctx.restore();
                ctx.fillStyle = el.color;
                ctx.fillRect(ox - 2, oy - 2, 4, 4);

                // Trail particle
                if (Math.random() < 0.2) {
                    G.particles.push({
                        x: ox, y: oy,
                        vx: rng(-10, 10), vy: rng(-10, 10),
                        life: 0.3, decay: 3, color: el.light, size: 1
                    });
                }
            }
        }
    }
}

// --- Enemies ---
function drawEnemies() {
    for (const e of G.enemies) {
        if (e.dead) continue;
        const ex = Math.round(e.x), ey = Math.round(e.y);
        // Cull
        if (ex < G.camX - 30 || ex > G.camX + GAME_W + 30 || ey < G.camY - 30 || ey > G.camY + GAME_H + 30) continue;

        // Spawn animation (first 0.3s)
        if (e.spawnAnim && e.spawnAnim > 0) {
            const t = e.spawnAnim;
            ctx.globalAlpha = 1 - t;
            drawGlow(ex, ey, 15 * t, '#aa44ff', 0.3 * t);
        }

        const flash = e.flash > 0;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(ex, ey + e.r * 0.4, e.r * 0.7, e.r * 0.2 + 1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Elite aura
        if (e.type === 'elite' || e.type === 'boss') {
            const auraColor = e.type === 'boss' ? '#ff2222' : '#ffdd00';
            const auraR = e.r * 1.8;
            drawGlow(ex, ey, auraR, auraColor, 0.2 + Math.sin(G.time * 4) * 0.1);
        }

        // Draw pixel art sprite
        const tint = flash ? '#ffffff' : null;
        drawEnemySprite(ex, ey + e.r * 0.3, e, tint);

        // Restore alpha after spawn anim
        if (e.spawnAnim && e.spawnAnim > 0) {
            ctx.globalAlpha = 1;
        }

        // HP bar (only if damaged)
        if (e.hp < e.maxHp) {
            const bw = Math.max(e.r * 2, 12), bh = 2;
            const hpPct = e.hp / e.maxHp;
            const barY = ey - e.r - 6;
            ctx.fillStyle = '#111'; ctx.fillRect(ex - bw / 2 - 1, barY - 1, bw + 2, bh + 2);
            ctx.fillStyle = hpPct > 0.5 ? '#22cc22' : hpPct > 0.25 ? '#ccaa22' : '#cc2222';
            ctx.fillRect(ex - bw / 2, barY, bw * hpPct, bh);
        }
    }
}

// --- Bullets/Effects ---
function drawBullets() {
    for (let i = G.bullets.length - 1; i >= 0; i--) {
        const b = G.bullets[i];
        b.life -= G.dt;
        if (b.life <= 0) { G.bullets.splice(i, 1); continue; }

        if (b.type === 'slash') {
            const alpha = b.life / b.maxLife;
            const el = b.el ? ELEMENTS[b.el] : null;
            const color = el ? el.light : b.color;
            const isFire = b.el === 'FIRE';

            // Fire slashes get extra glowing gradient fill inside the arc
            if (isFire) {
                ctx.globalAlpha = alpha * 0.35;
                const fireGrad = ctx.createRadialGradient(b.x, b.y, b.range * 0.2, b.x, b.y, b.range);
                fireGrad.addColorStop(0, '#ffd700');
                fireGrad.addColorStop(0.5, '#ff6600');
                fireGrad.addColorStop(1, 'rgba(255,34,0,0)');
                ctx.fillStyle = fireGrad;
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                ctx.arc(b.x, b.y, b.range, b.angle - b.arc / 2, b.angle + b.arc / 2);
                ctx.closePath();
                ctx.fill();
            }

            // Multiple afterimage arcs (3 layers)
            for (let layer = 0; layer < 3; layer++) {
                const t = alpha - layer * 0.1;
                if (t <= 0) continue;
                ctx.strokeStyle = isFire && layer === 0 ? '#ffd700' : color;
                ctx.lineWidth = (isFire ? 5 - layer : 4 - layer) * t;
                ctx.globalAlpha = t * (isFire ? 0.8 : 0.6);
                const rScale = 1 - (1 - alpha) * 0.5 - layer * 0.05;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.range * rScale, b.angle - b.arc / 2, b.angle + b.arc / 2);
                ctx.stroke();
            }

            // Glow at slash center (bigger for fire)
            const glowSize = isFire ? 22 : 15;
            const glowAlpha = isFire ? alpha * 0.5 : alpha * 0.3;
            drawGlow(b.x + Math.cos(b.angle) * b.range * 0.5, b.y + Math.sin(b.angle) * b.range * 0.5, glowSize, color, glowAlpha);

            // Slash tip particles (more for fire)
            const tipChance = isFire ? 0.8 : 0.5;
            if (Math.random() < tipChance) {
                const tipAngle = b.angle + rng(-b.arc / 2, b.arc / 2);
                const el2 = b.el || 'FIRE';
                spawnElementParticles(
                    b.x + Math.cos(tipAngle) * b.range * 0.8,
                    b.y + Math.sin(tipAngle) * b.range * 0.8,
                    el2, isFire ? 2 : 1, isFire ? 35 : 20
                );
            }

            // Fire-specific: spawn rising embers along the arc
            if (isFire && Math.random() < 0.6) {
                const emA = b.angle + rng(-b.arc / 2, b.arc / 2);
                const emR = b.range * (0.4 + Math.random() * 0.5);
                G.particles.push({
                    x: b.x + Math.cos(emA) * emR, y: b.y + Math.sin(emA) * emR,
                    vx: rng(-8, 8), vy: rng(-25, -8),
                    life: 0.35, decay: 2.5,
                    color: Math.random() > 0.5 ? '#ff4400' : '#ffd700',
                    size: rng(1, 2.5), glow: true
                });
            }

            ctx.globalAlpha = 1;

        } else if (b.type === 'bullet') {
            // Homing logic (e.g., Sima Yi's Dark Scepter)
            if (b.homing) {
                let target = b.homingTarget;
                if (!target || target.dead) {
                    // Find new nearest enemy
                    let nd = 200;
                    for (const e of G.enemies) {
                        if (e.dead) continue;
                        const d = Math.hypot(e.x - b.x, e.y - b.y);
                        if (d < nd) { nd = d; target = e; }
                    }
                    b.homingTarget = target;
                }
                if (target && !target.dead) {
                    const ta = Math.atan2(target.y - b.y, target.x - b.x);
                    const ca = Math.atan2(b.vy, b.vx);
                    let da = ta - ca;
                    while (da > Math.PI) da -= Math.PI * 2;
                    while (da < -Math.PI) da += Math.PI * 2;
                    const turnRate = 4; // radians/sec
                    const na = ca + Math.sign(da) * Math.min(Math.abs(da), turnRate * G.dt);
                    const spd = Math.hypot(b.vx, b.vy);
                    b.vx = Math.cos(na) * spd;
                    b.vy = Math.sin(na) * spd;
                }
            }
            b.x += b.vx * G.dt; b.y += b.vy * G.dt;
            const el = b.el ? ELEMENTS[b.el] : null;
            const color = el ? el.light : b.color;

            // Glowing bullet
            drawGlow(b.x, b.y, b.r * 3, color, 0.3);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();

            // Trail particles — enhanced per element
            const trailChance = b.el === 'FIRE' ? 0.7 : b.homing ? 0.6 : 0.4;
            if (Math.random() < trailChance) {
                if (b.el === 'FIRE') {
                    // Fire trail — embers + orange glow
                    G.particles.push({
                        x: b.x + rng(-3, 3), y: b.y + rng(-3, 3),
                        vx: -b.vx * 0.08 + rng(-8, 8), vy: -b.vy * 0.08 + rng(-15, -3),
                        life: 0.4, decay: 2.5,
                        color: Math.random() > 0.5 ? '#ff4400' : '#ff8800',
                        size: rng(1.5, 3), glow: true
                    });
                    G.particles.push({
                        x: b.x, y: b.y,
                        vx: -b.vx * 0.02, vy: -b.vy * 0.02,
                        life: 0.15, decay: 6,
                        color: '#ffd700', size: rng(0.5, 1.5), glow: true
                    });
                } else if (b.homing) {
                    // Homing trail — wavy energy trail
                    G.particles.push({
                        x: b.x + rng(-4, 4), y: b.y + rng(-4, 4),
                        vx: -b.vx * 0.06 + Math.sin(G.time * 20) * 8,
                        vy: -b.vy * 0.06 + Math.cos(G.time * 20) * 8,
                        life: 0.35, decay: 2.8,
                        color: '#5588ff', size: rng(1, 2.5), glow: true
                    });
                } else {
                    G.particles.push({
                        x: b.x + rng(-2, 2), y: b.y + rng(-2, 2),
                        vx: -b.vx * 0.05 + rng(-5, 5), vy: -b.vy * 0.05 + rng(-5, 5),
                        life: 0.3, decay: 3, color, size: rng(1, 2), glow: true
                    });
                }
            }

            // Hit enemies
            for (const e of G.enemies) {
                if (e.dead) continue;
                if (dist(b, e) < b.r + e.r) {
                    damageEnemy(e, b.dmg, b.el);
                    if (b.pierce > 0) { b.pierce--; } else { b.life = 0; }
                    break;
                }
            }

        } else if (b.type === 'aoe_ring') {
            const alpha = b.life / b.maxLife;
            const el = b.el ? ELEMENTS[b.el] : null;
            const color = el ? el.light : b.color;
            const currentR = b.r * (1 - alpha * 0.3);

            // Multiple expanding rings
            for (let ring = 0; ring < 2; ring++) {
                const rAlpha = alpha * (1 - ring * 0.3);
                if (rAlpha <= 0) continue;
                ctx.strokeStyle = color;
                ctx.lineWidth = (3 - ring * 1.5) * rAlpha;
                ctx.globalAlpha = rAlpha * 0.5;
                ctx.beginPath();
                ctx.arc(b.x, b.y, currentR - ring * 5, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Ground glow
            drawGlow(b.x, b.y, currentR, color, alpha * 0.2);

            // Ring edge particles
            if (Math.random() < 0.3) {
                const pAngle = rng(0, Math.PI * 2);
                const el2 = b.el || 'EARTH';
                spawnElementParticles(
                    b.x + Math.cos(pAngle) * currentR,
                    b.y + Math.sin(pAngle) * currentR,
                    el2, 1, 15
                );
            }

            ctx.globalAlpha = 1;
        }
    }
}

// --- Pickups ---
function drawPickups() {
    for (const p of G.pickups) {
        const pulse = 1 + Math.sin(G.time * 5 + p.x) * 0.2;

        // Glow under pickup
        const glowColor = p.type === 'xp' ? '#44ffff' : p.type === 'gold' ? '#ffdd00' : '#ff4444';
        drawGlow(p.x, p.y, 8 * pulse, glowColor, 0.2);

        // Draw sprite
        drawPickupSprite(p.x, p.y, p.type);

        // Sparkle particle
        if (Math.random() < 0.03) {
            G.particles.push({
                x: p.x + rng(-4, 4), y: p.y + rng(-4, 4),
                vx: rng(-8, 8), vy: rng(-15, -5),
                life: 0.5, decay: 2, color: glowColor, size: 1
            });
        }
    }
}

// --- Portal ---
function drawPortal() {
    if (!G.portalActive || !G.portal) return;
    const p = G.portal;
    const pulse = Math.sin(p.pulse) * 5;

    // Outer glow
    drawGlow(p.x, p.y, p.r * 3 + pulse * 2, '#ffdd00', 0.25);

    // Inner glow  
    drawGlow(p.x, p.y, p.r * 1.5 + pulse, '#ffffff', 0.2);

    // Rings
    ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.6 + pulse * 0.5, 0, Math.PI * 2); ctx.stroke();

    // Inner fill
    ctx.fillStyle = `rgba(255,200,0,${0.3 + Math.sin(p.pulse * 2) * 0.2})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2); ctx.fill();

    // Portal particles
    if (Math.random() < 0.3) {
        const a = rng(0, Math.PI * 2);
        G.particles.push({
            x: p.x + Math.cos(a) * (p.r + 5), y: p.y + Math.sin(a) * (p.r + 5),
            vx: -Math.cos(a) * 20, vy: -Math.sin(a) * 20 - 10,
            life: 0.6, decay: 2, color: '#ffee44', size: rng(1, 2), glow: true
        });
    }

    // Arrow pointing to portal if off-screen
    if (dist(P, p) > GAME_W * 0.4) {
        const a = Math.atan2(p.y - P.y, p.x - P.x);
        const ix = P.x + Math.cos(a) * 60, iy = P.y + Math.sin(a) * 60;
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * 5, iy + Math.sin(a) * 5);
        ctx.lineTo(ix + Math.cos(a + 2.5) * 5, iy + Math.sin(a + 2.5) * 5);
        ctx.lineTo(ix + Math.cos(a - 2.5) * 5, iy + Math.sin(a - 2.5) * 5);
        ctx.fill();
    }
}

// --- Particles ---
function drawParticlesWorld() {
    for (let i = G.particles.length - 1; i >= 0; i--) {
        const p = G.particles[i];
        p.x += p.vx * G.dt; p.y += p.vy * G.dt;
        p.life -= p.decay * G.dt;
        if (p.life <= 0) { G.particles.splice(i, 1); continue; }

        // Ring particles (death explosion rings)
        if (p.isRing) {
            const ringR = p.size * (1 - p.life);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.lineWidth = 2 * p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            continue;
        }

        // Glowing particles use additive blending
        if (p.glow) {
            ctx.globalCompositeOperation = 'lighter';
        }

        ctx.globalAlpha = Math.min(p.life, 1);
        ctx.fillStyle = p.color;
        const s = p.size * Math.min(p.life * 2, 1);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);

        if (p.glow) {
            ctx.globalCompositeOperation = 'source-over';
        }
    }
    ctx.globalAlpha = 1;
}

// --- Damage Numbers ---
function drawDmgNums() {
    for (let i = G.dmgNums.length - 1; i >= 0; i--) {
        const d = G.dmgNums[i];
        d.y += d.vy * G.dt; d.vy += 60 * G.dt; d.life -= G.dt * 1.5;
        if (d.life <= 0) { G.dmgNums.splice(i, 1); continue; }

        ctx.globalAlpha = Math.min(d.life, 1);
        const text = d.val > 0 ? d.val.toString() : 'EFFECTIVE!';

        if (d.big) {
            // Big crit/effective numbers - scale up
            const scale = 1 + (1 - d.life) * 0.3;
            drawText(text, d.x, d.y, {
                font: `bold ${Math.floor(11 * scale)}px monospace`,
                fill: d.color, align: 'center',
                outline: true, outlineColor: '#000', outlineWidth: 3
            });
        } else {
            drawText(text, d.x, d.y, {
                font: 'bold 8px monospace',
                fill: d.color, align: 'center',
                outline: true, outlineColor: '#000', outlineWidth: 2
            });
        }
    }
    ctx.globalAlpha = 1;
}

// ============================================================
// SKILL EFFECTS ENGINE
// ============================================================

function updateSkillEffects(dt) {
    for (let i = G.skillEffects.length - 1; i >= 0; i--) {
        const fx = G.skillEffects[i];
        fx.timer -= dt;
        if (fx.timer <= 0) { G.skillEffects.splice(i, 1); continue; }

        // Follow player for persistent effects
        if (fx.followPlayer) { fx.x = P.x; fx.y = P.y; }

        // Type-specific updates
        switch (fx.type) {
            case 'shockwave':
            case 'heal_pulse':
                fx.radius = Math.min(fx.radius + fx.speed * dt, fx.maxRadius);
                fx.alpha *= 0.97;
                break;
            case 'crack':
                fx.length = Math.min(fx.length + fx.speed * dt, fx.maxLength);
                fx.alpha *= 0.98;
                break;
            case 'wind_cone':
                fx.radius = Math.min(fx.radius + fx.speed * dt, fx.maxRadius);
                fx.alpha *= 0.95;
                break;
            case 'leaf':
                fx.x += fx.vx * dt;
                fx.y += fx.vy * dt;
                fx.vy += 30 * dt;
                fx.rotation += fx.rotSpeed * dt;
                fx.alpha *= 0.97;
                break;
            case 'afterimage':
                fx.alpha *= 0.93;
                break;
            case 'lightning_trail':
                fx.alpha *= 0.92;
                break;
            case 'impact_flash':
                fx.radius += 60 * dt;
                fx.alpha *= 0.85;
                break;
            case 'golden_dome':
                break;
            case 'sparkle':
                fx.angle += fx.speed * dt;
                if (fx.followPlayer) {
                    fx.x = P.x + Math.cos(fx.angle) * fx.orbRadius;
                    fx.y = P.y + Math.sin(fx.angle) * fx.orbRadius;
                }
                break;
            case 'drain_beam':
                if (fx.followTarget) { fx.x2 = P.x; fx.y2 = P.y; }
                fx.alpha *= 0.95;
                break;
            case 'fire_aura':
                if (Math.random() < 0.3) {
                    G.particles.push({
                        x: fx.x + rng(-12, 12), y: fx.y + rng(-8, 8),
                        vx: rng(-10, 10), vy: rng(-25, -8),
                        life: 0.3, decay: 3,
                        color: Math.random() > 0.5 ? '#ff4400' : '#ff8800', size: rng(1, 2)
                    });
                }
                break;
            case 'speed_line':
                fx.length = Math.min(fx.length + fx.speed * dt, fx.maxLength);
                fx.alpha *= 0.93;
                break;
            case 'yinyang_symbol':
                fx.rotation += fx.rotSpeed * dt;
                fx.alpha *= 0.98;
                break;
            case 'trigram_circle':
                fx.rotation += fx.rotSpeed * dt;
                fx.alpha *= 0.98;
                break;
            case 'slash_arc':
                fx.alpha *= 0.88;
                break;
            case 'dash_line':
                fx.alpha *= 0.85;
                break;
            case 'fire_pillar':
                fx.height = Math.min(fx.height + fx.speed * dt, fx.maxHeight);
                fx.alpha *= 0.98;
                break;
            case 'phoenix_wings':
                fx.spread = Math.min(fx.spread + fx.speed * dt, fx.maxSpread);
                fx.alpha *= 0.98;
                break;
            case 'ember':
                fx.x += (fx.vx || 0) * dt;
                fx.y += fx.vy * dt;
                fx.vy -= 10 * dt;
                fx.alpha *= 0.97;
                break;
            case 'dust_trail':
                if (Math.random() < 0.5) {
                    G.particles.push({
                        x: fx.x + rng(-5, 5), y: fx.y + 5,
                        vx: -fx.facing * rng(10, 30) + rng(-5, 5), vy: rng(-10, 0),
                        life: 0.4, decay: 2.5, color: '#aa8844', size: rng(2, 4)
                    });
                }
                break;
            case 'impact_crater':
                fx.alpha *= 0.98;
                break;
            case 'player_blur':
                fx.alpha *= 0.99;
                break;
        }
    }
}

function drawSkillEffects() {
    if (!G.skillEffects || G.skillEffects.length === 0) return;

    for (const fx of G.skillEffects) {
        ctx.save();
        ctx.globalAlpha = fx.alpha;

        switch (fx.type) {
            case 'shockwave': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = fx.lineWidth || 2;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.stroke();
                const grad = ctx.createRadialGradient(fx.x, fx.y, fx.radius * 0.8, fx.x, fx.y, fx.radius);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(1, fx.color);
                ctx.strokeStyle = grad;
                ctx.lineWidth = (fx.lineWidth || 2) * 0.5;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius * 0.85, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
            case 'crack': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(fx.x, fx.y);
                const steps = 5;
                for (let s = 1; s <= steps; s++) {
                    const t = s / steps;
                    const cx = fx.x + Math.cos(fx.angle) * fx.length * t + (Math.random() - 0.5) * 4;
                    const cy = fx.y + Math.sin(fx.angle) * fx.length * t + (Math.random() - 0.5) * 4;
                    ctx.lineTo(cx, cy);
                }
                ctx.stroke();
                break;
            }
            case 'wind_cone': {
                ctx.fillStyle = fx.color;
                const coneAngle = fx.angle / 2;
                const baseAngle = fx.facing > 0 ? 0 : Math.PI;
                ctx.beginPath();
                ctx.moveTo(fx.x, fx.y);
                ctx.arc(fx.x, fx.y, fx.radius, baseAngle - coneAngle, baseAngle + coneAngle);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'leaf': {
                ctx.fillStyle = fx.color;
                ctx.save();
                ctx.translate(fx.x, fx.y);
                ctx.rotate(fx.rotation);
                ctx.beginPath();
                ctx.moveTo(0, -fx.size);
                ctx.lineTo(fx.size * 0.5, 0);
                ctx.lineTo(0, fx.size);
                ctx.lineTo(-fx.size * 0.5, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            }
            case 'afterimage': {
                ctx.fillStyle = fx.color;
                ctx.fillRect(fx.x - fx.w / 2, fx.y - fx.h, fx.w, fx.h);
                break;
            }
            case 'lightning_trail': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fx.x1, fx.y1);
                const segs = fx.segments || 8;
                for (let s = 1; s <= segs; s++) {
                    const t = s / segs;
                    const lx = fx.x1 + (fx.x2 - fx.x1) * t + (s < segs ? (Math.random() - 0.5) * 10 : 0);
                    const ly = fx.y1 + (fx.y2 - fx.y1) * t + (s < segs ? (Math.random() - 0.5) * 10 : 0);
                    ctx.lineTo(lx, ly);
                }
                ctx.stroke();
                ctx.globalAlpha = fx.alpha * 0.3;
                ctx.lineWidth = 5;
                ctx.stroke();
                break;
            }
            case 'impact_flash': {
                const g = ctx.createRadialGradient(fx.x, fx.y, 0, fx.x, fx.y, fx.radius);
                g.addColorStop(0, fx.color);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'golden_dome': {
                const shimmer = Math.sin(G.time * 4) * 0.1;
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = fx.alpha + shimmer;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = fx.color;
                ctx.globalAlpha = (fx.alpha * 0.3) + shimmer * 0.5;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'sparkle': {
                ctx.fillStyle = fx.color;
                const sparkSize = 1.5 + Math.sin(G.time * 10) * 0.5;
                ctx.fillRect(fx.x - sparkSize / 2, fx.y - sparkSize / 2, sparkSize, sparkSize);
                break;
            }
            case 'drain_beam': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = fx.width || 2;
                ctx.beginPath();
                ctx.moveTo(fx.x1, fx.y1);
                const bs = 6;
                for (let s = 1; s <= bs; s++) {
                    const t = s / bs;
                    const bx = fx.x1 + (fx.x2 - fx.x1) * t + Math.sin(G.time * 15 + s) * 3;
                    const by = fx.y1 + (fx.y2 - fx.y1) * t + Math.cos(G.time * 15 + s) * 3;
                    ctx.lineTo(bx, by);
                }
                ctx.stroke();
                break;
            }
            case 'heal_pulse': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
            case 'fire_aura': {
                const fg = ctx.createRadialGradient(fx.x, fx.y, 5, fx.x, fx.y, fx.radius);
                fg.addColorStop(0, 'rgba(255,68,0,' + (fx.alpha * 0.5) + ')');
                fg.addColorStop(0.7, 'rgba(255,136,0,' + (fx.alpha * 0.2) + ')');
                fg.addColorStop(1, 'transparent');
                ctx.fillStyle = fg;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'speed_line': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(fx.x, fx.y);
                ctx.lineTo(
                    fx.x + Math.cos(fx.angle) * fx.length,
                    fx.y + Math.sin(fx.angle) * fx.length
                );
                ctx.stroke();
                break;
            }
            case 'yinyang_symbol': {
                ctx.save();
                ctx.translate(fx.x, fx.y);
                ctx.rotate(fx.rotation);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(0, 0, fx.radius * 0.4, 0, Math.PI * 2); ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(0, 0, fx.radius * 0.4, -Math.PI / 2, Math.PI / 2); ctx.fill();
                ctx.fillStyle = '#111111';
                ctx.beginPath(); ctx.arc(0, 0, fx.radius * 0.4, Math.PI / 2, Math.PI * 1.5); ctx.fill();
                ctx.fillStyle = '#111111';
                ctx.beginPath(); ctx.arc(0, -fx.radius * 0.2, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(0, fx.radius * 0.2, 3, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                break;
            }
            case 'trigram_circle': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 1;
                for (let i = 0; i < fx.boltCount; i++) {
                    const a = fx.rotation + (Math.PI * 2 / fx.boltCount) * i;
                    const bx = fx.x + Math.cos(a) * fx.radius;
                    const by = fx.y + Math.sin(a) * fx.radius;
                    ctx.beginPath();
                    ctx.arc(bx, by, 3, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.globalAlpha = fx.alpha * 0.3;
                    ctx.beginPath(); ctx.moveTo(fx.x, fx.y); ctx.lineTo(bx, by); ctx.stroke();
                    ctx.globalAlpha = fx.alpha;
                }
                break;
            }
            case 'slash_arc': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(fx.x, fx.y, fx.radius, fx.startAngle, fx.startAngle + Math.PI * 0.6);
                ctx.stroke();
                break;
            }
            case 'dash_line': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = fx.width || 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(fx.x1, fx.y1);
                ctx.lineTo(fx.x2, fx.y2);
                ctx.stroke();
                ctx.setLineDash([]);
                break;
            }
            case 'fire_pillar': {
                const pg = ctx.createLinearGradient(fx.x, fx.y, fx.x, fx.y - fx.height);
                pg.addColorStop(0, fx.color);
                pg.addColorStop(0.5, '#ff8800');
                pg.addColorStop(1, '#ffd700');
                ctx.fillStyle = pg;
                ctx.fillRect(fx.x - fx.width / 2, fx.y - fx.height, fx.width, fx.height);
                if (typeof drawGlow === 'function') drawGlow(fx.x, fx.y, fx.width, fx.color, fx.alpha * 0.4);
                break;
            }
            case 'phoenix_wings': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fx.x, fx.y);
                ctx.quadraticCurveTo(fx.x - fx.spread * 0.6, fx.y - fx.spread * 0.8, fx.x - fx.spread, fx.y - fx.spread * 0.3);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(fx.x, fx.y);
                ctx.quadraticCurveTo(fx.x + fx.spread * 0.6, fx.y - fx.spread * 0.8, fx.x + fx.spread, fx.y - fx.spread * 0.3);
                ctx.stroke();
                if (typeof drawGlow === 'function') drawGlow(fx.x, fx.y, fx.spread * 0.5, '#ff6600', fx.alpha * 0.3);
                break;
            }
            case 'ember': {
                ctx.fillStyle = fx.color;
                const es = fx.size || 2;
                ctx.fillRect(fx.x - es / 2, fx.y - es / 2, es, es);
                break;
            }
            case 'dust_trail': {
                break;
            }
            case 'impact_crater': {
                ctx.strokeStyle = fx.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(fx.x, fx.y + 3, fx.radius, fx.radius * 0.3, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = fx.color;
                ctx.globalAlpha = fx.alpha * 0.2;
                ctx.beginPath();
                ctx.ellipse(fx.x, fx.y + 3, fx.radius * 0.8, fx.radius * 0.25, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'player_blur': {
                ctx.globalAlpha = fx.alpha * 0.3;
                for (let i = 1; i <= 3; i++) {
                    const offsetX = P.facing * i * -3;
                    ctx.fillStyle = 'rgba(200,200,255,' + (fx.alpha * 0.2 / i) + ')';
                    ctx.fillRect(P.x - P.w / 2 + offsetX, P.y - P.h + i, P.w, P.h);
                }
                break;
            }
        }

        ctx.restore();
    }
}
