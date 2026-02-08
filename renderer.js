// ============================================================
// DYNASTY BRUHHH DUNGEON - Renderer
// ============================================================

function drawGame() {
    ctx.save();
    ctx.translate(-G.camX + G.shakeX, -G.camY + G.shakeY);

    drawFloor();
    drawPickups();
    drawPortal();
    drawEnemies();
    drawBullets();
    drawPlayer();
    drawParticlesWorld();
    drawDmgNums();

    ctx.restore();

    // HUD (screen-space)
    drawHUD();
}

// --- Floor / Background ---
function drawFloor() {
    // Dark grid floor
    ctx.fillStyle = '#0d0d15';
    ctx.fillRect(0, 0, G.arenaW, G.arenaH);
    ctx.strokeStyle = '#1a1a2a';
    ctx.lineWidth = 0.5;
    const gs = 40;
    const sx = Math.floor(G.camX / gs) * gs;
    const sy = Math.floor(G.camY / gs) * gs;
    for (let x = sx; x < G.camX + GAME_W + gs; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, G.camY); ctx.lineTo(x, G.camY + GAME_H); ctx.stroke();
    }
    for (let y = sy; y < G.camY + GAME_H + gs; y += gs) {
        ctx.beginPath(); ctx.moveTo(G.camX, y); ctx.lineTo(G.camX + GAME_W, y); ctx.stroke();
    }
    // Arena border
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, G.arenaW, G.arenaH);
}

// --- Player ---
function drawPlayer() {
    const px = Math.round(P.x), py = Math.round(P.y);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px - 5, py + 5, 10, 4);

    // Flash when hit
    if (P.damageFlash > 0) {
        ctx.fillStyle = P.invincible > 0 && Math.floor(G.time * 20) % 2 === 0 ? 'rgba(255,255,255,0.7)' : '#ff0000';
    } else {
        // Pixel art body
        ctx.fillStyle = '#e8c170'; // skin
    }
    // Head
    ctx.fillRect(px - 4, py - 12, 8, 8);
    // Body (armor colored by element)
    const elColor = ELEMENTS[P.element].color;
    ctx.fillStyle = P.damageFlash > 0 ? '#ffffff' : elColor;
    ctx.fillRect(px - 5, py - 4, 10, 8);
    // Legs
    ctx.fillStyle = '#4a3728';
    ctx.fillRect(px - 4, py + 4, 3, 5);
    ctx.fillRect(px + 1, py + 4, 3, 5);
    // Weapon indicator (small square)
    ctx.fillStyle = ELEMENTS[P.element].light;
    ctx.fillRect(px + P.facing * 7, py - 4, 3, 8);
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 2, py - 10, 2, 2);
    ctx.fillRect(px + 1, py - 10, 2, 2);

    // Yin-Yang aura
    const yy = G.yinYang;
    if (yy.state === 'HARMONY') {
        ctx.strokeStyle = `rgba(255,215,0,${0.5 + Math.sin(G.time * 5) * 0.3})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.stroke();
    } else if (yy.state === 'CHAOS') {
        ctx.strokeStyle = `rgba(255,0,0,${0.5 + Math.sin(G.time * 8) * 0.3})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.stroke();
    } else if (yy.state === 'SERENITY') {
        ctx.strokeStyle = `rgba(100,150,255,${0.5 + Math.sin(G.time * 3) * 0.3})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.stroke();
    }

    // Orbital weapons
    for (const w of G.weapons) {
        if (w.type === 'orbital') {
            const orbCount = (w.count || 3) + Math.floor(w.level / 2);
            const range = w.range + w.level * 8;
            const el = ELEMENTS[w.el];
            for (let i = 0; i < orbCount; i++) {
                const a = w.orbitAngle + (Math.PI * 2 / orbCount) * i;
                const ox = px + Math.cos(a) * range;
                const oy = py + Math.sin(a) * range;
                ctx.fillStyle = el.light;
                ctx.fillRect(ox - 3, oy - 3, 6, 6);
                ctx.fillStyle = el.color;
                ctx.fillRect(ox - 2, oy - 2, 4, 4);
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
        if (ex < G.camX - 20 || ex > G.camX + GAME_W + 20 || ey < G.camY - 20 || ey > G.camY + GAME_H + 20) continue;

        const flash = e.flash > 0;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(ex - e.r * 0.6, ey + e.r * 0.5, e.r * 1.2, 3);
        // Body
        ctx.fillStyle = flash ? '#ffffff' : e.color;
        if (e.type === 'grunt') {
            ctx.fillRect(ex - e.r / 2, ey - e.r, e.r, e.r * 1.5);
        } else if (e.type === 'fast') {
            // Triangle-ish
            ctx.beginPath(); ctx.moveTo(ex, ey - e.r); ctx.lineTo(ex - e.r, ey + e.r * 0.5);
            ctx.lineTo(ex + e.r, ey + e.r * 0.5); ctx.fill();
        } else if (e.type === 'tank') {
            ctx.fillRect(ex - e.r, ey - e.r * 0.7, e.r * 2, e.r * 1.4);
        } else if (e.type === 'elite') {
            ctx.fillRect(ex - e.r, ey - e.r, e.r * 2, e.r * 2);
            ctx.fillStyle = '#ffdd00'; ctx.fillRect(ex - 2, ey - e.r - 4, 4, 4); // crown
        } else if (e.type === 'boss') {
            ctx.fillRect(ex - e.r, ey - e.r, e.r * 2, e.r * 2);
            ctx.fillStyle = '#ff0000'; ctx.fillRect(ex - 4, ey - e.r - 6, 8, 6);
            ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 1; ctx.strokeRect(ex - e.r - 1, ey - e.r - 1, e.r * 2 + 2, e.r * 2 + 2);
        }
        // Element dot
        ctx.fillStyle = e.lightColor;
        ctx.fillRect(ex - 1, ey - e.r + 2, 3, 3);
        // Eyes
        if (!flash) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(ex - 3, ey - e.r * 0.3, 2, 2);
            ctx.fillRect(ex + 1, ey - e.r * 0.3, 2, 2);
        }
        // HP bar (only if damaged)
        if (e.hp < e.maxHp) {
            const bw = e.r * 2, bh = 2;
            ctx.fillStyle = '#333'; ctx.fillRect(ex - bw / 2, ey - e.r - 5, bw, bh);
            ctx.fillStyle = '#00ff00'; ctx.fillRect(ex - bw / 2, ey - e.r - 5, bw * (e.hp / e.maxHp), bh);
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
            ctx.strokeStyle = b.color; ctx.lineWidth = 3;
            ctx.globalAlpha = alpha;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.range * (1 - alpha * 0.5), b.angle - b.arc / 2, b.angle + b.arc / 2);
            ctx.stroke(); ctx.globalAlpha = 1;
        } else if (b.type === 'bullet') {
            b.x += b.vx * G.dt; b.y += b.vy * G.dt;
            ctx.fillStyle = b.color;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
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
            ctx.strokeStyle = b.color; ctx.lineWidth = 2;
            ctx.globalAlpha = alpha * 0.6;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (1 - alpha * 0.3), 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
}

// --- Pickups ---
function drawPickups() {
    for (const p of G.pickups) {
        const pulse = 1 + Math.sin(G.time * 5 + p.x) * 0.2;
        ctx.fillStyle = p.color;
        if (p.type === 'xp') {
            // Diamond shape
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4);
            ctx.fillRect(-p.r * pulse / 2, -p.r * pulse / 2, p.r * pulse, p.r * pulse);
            ctx.restore();
        } else if (p.type === 'gold') {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2); ctx.fill();
        } else if (p.type === 'hp') {
            // Cross shape
            ctx.fillRect(p.x - 1, p.y - 3, 2, 6);
            ctx.fillRect(p.x - 3, p.y - 1, 6, 2);
        }
    }
}

// --- Portal ---
function drawPortal() {
    if (!G.portalActive || !G.portal) return;
    const p = G.portal;
    const pulse = Math.sin(p.pulse) * 5;
    ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.6 + pulse * 0.5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `rgba(255,200,0,${0.3 + Math.sin(p.pulse * 2) * 0.2})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2); ctx.fill();
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
        ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

// --- Damage Numbers ---
function drawDmgNums() {
    for (let i = G.dmgNums.length - 1; i >= 0; i--) {
        const d = G.dmgNums[i];
        d.y += d.vy * G.dt; d.vy += 60 * G.dt; d.life -= G.dt * 1.5;
        if (d.life <= 0) { G.dmgNums.splice(i, 1); continue; }
        ctx.globalAlpha = d.life;
        ctx.fillStyle = d.color;
        ctx.font = d.big ? 'bold 10px monospace' : '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(d.val > 0 ? d.val : 'EFFECTIVE!', d.x, d.y);
    }
    ctx.globalAlpha = 1;
}
