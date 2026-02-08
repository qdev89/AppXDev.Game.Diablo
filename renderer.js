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

            // Multiple afterimage arcs (3 layers)
            for (let layer = 0; layer < 3; layer++) {
                const t = alpha - layer * 0.1;
                if (t <= 0) continue;
                ctx.strokeStyle = color;
                ctx.lineWidth = (4 - layer) * t;
                ctx.globalAlpha = t * 0.6;
                const rScale = 1 - (1 - alpha) * 0.5 - layer * 0.05;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.range * rScale, b.angle - b.arc / 2, b.angle + b.arc / 2);
                ctx.stroke();
            }

            // Glow at slash center
            drawGlow(b.x + Math.cos(b.angle) * b.range * 0.5, b.y + Math.sin(b.angle) * b.range * 0.5, 15, color, alpha * 0.3);

            // Slash tip particles
            if (Math.random() < 0.5) {
                const tipAngle = b.angle + rng(-b.arc / 2, b.arc / 2);
                const el2 = b.el || 'FIRE';
                spawnElementParticles(
                    b.x + Math.cos(tipAngle) * b.range * 0.8,
                    b.y + Math.sin(tipAngle) * b.range * 0.8,
                    el2, 1, 20
                );
            }

            ctx.globalAlpha = 1;

        } else if (b.type === 'bullet') {
            b.x += b.vx * G.dt; b.y += b.vy * G.dt;
            const el = b.el ? ELEMENTS[b.el] : null;
            const color = el ? el.light : b.color;

            // Glowing bullet
            drawGlow(b.x, b.y, b.r * 3, color, 0.3);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();

            // Trail particles
            if (Math.random() < 0.4) {
                G.particles.push({
                    x: b.x + rng(-2, 2), y: b.y + rng(-2, 2),
                    vx: -b.vx * 0.05 + rng(-5, 5), vy: -b.vy * 0.05 + rng(-5, 5),
                    life: 0.3, decay: 3, color, size: rng(1, 2), glow: true
                });
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
