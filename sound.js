// ============================================================
// DYNASTY BRUHHH DUNGEON - Sound System (Web Audio API)
// ============================================================

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let audioEnabled = false;

function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new AudioCtx();
        audioEnabled = true;
    } catch (e) { audioEnabled = false; }
}

// Initialize on first user interaction
document.addEventListener('click', () => initAudio(), { once: true });
document.addEventListener('touchstart', () => initAudio(), { once: true });

// --- Oscillator-based SFX (no assets needed) ---
function playNote(freq, dur = 0.1, type = 'square', vol = 0.15, delay = 0) {
    if (!audioEnabled || !audioCtx) return;
    try {
        const t = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    } catch (e) { }
}

function playNoise(dur = 0.08, vol = 0.1) {
    if (!audioEnabled || !audioCtx) return;
    try {
        const bufferSize = audioCtx.sampleRate * dur;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        src.buffer = buffer;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
    } catch (e) { }
}

// --- Game Sound Effects ---
const SFX = {
    hit() { playNote(220, 0.06, 'sawtooth', 0.12); playNoise(0.04, 0.08); },
    kill() { playNote(440, 0.08, 'square', 0.1); playNote(660, 0.1, 'square', 0.08, 0.05); },
    playerHit() { playNote(110, 0.15, 'sawtooth', 0.15); playNoise(0.1, 0.1); },
    xpPickup() { playNote(880, 0.05, 'sine', 0.08); playNote(1100, 0.05, 'sine', 0.06, 0.04); },
    goldPickup() { playNote(1200, 0.06, 'triangle', 0.1); playNote(1500, 0.06, 'triangle', 0.08, 0.05); },
    hpPickup() { playNote(440, 0.1, 'sine', 0.1); playNote(550, 0.1, 'sine', 0.08, 0.08); playNote(660, 0.12, 'sine', 0.06, 0.16); },
    levelUp() {
        playNote(523, 0.12, 'triangle', 0.15);
        playNote(659, 0.12, 'triangle', 0.12, 0.1);
        playNote(784, 0.12, 'triangle', 0.1, 0.2);
        playNote(1047, 0.2, 'triangle', 0.15, 0.3);
    },
    weaponFire() { playNote(330, 0.04, 'square', 0.06); },
    portalOpen() {
        playNote(330, 0.2, 'sine', 0.1);
        playNote(440, 0.2, 'sine', 0.08, 0.15);
        playNote(550, 0.3, 'sine', 0.1, 0.3);
    },
    menuClick() { playNote(800, 0.05, 'square', 0.08); },
    gameOver() {
        playNote(330, 0.3, 'sawtooth', 0.12);
        playNote(220, 0.3, 'sawtooth', 0.1, 0.25);
        playNote(165, 0.5, 'sawtooth', 0.08, 0.5);
    },
    combo10() { playNote(660, 0.06, 'triangle', 0.1); playNote(880, 0.08, 'triangle', 0.08, 0.04); },
    combo50() { playNote(880, 0.08, 'triangle', 0.12); playNote(1100, 0.1, 'sine', 0.1, 0.05); playNote(1320, 0.12, 'sine', 0.08, 0.1); },
    revive() {
        playNote(220, 0.15, 'sine', 0.1);
        playNote(330, 0.15, 'sine', 0.1, 0.1);
        playNote(440, 0.15, 'sine', 0.1, 0.2);
        playNote(660, 0.3, 'triangle', 0.15, 0.3);
    },
    bossSpawn() {
        // War horn: deep resonant brass tones
        playNoise(0.3, 0.18);
        playNote(55, 0.6, 'sawtooth', 0.18);
        playNote(73, 0.5, 'sawtooth', 0.14, 0.15);
        playNote(110, 0.5, 'sawtooth', 0.15, 0.3);
        playNote(82, 0.5, 'sawtooth', 0.12, 0.5);
        playNoise(0.15, 0.08);
    },
    coin() { playNote(1200, 0.06, 'triangle', 0.12); playNote(1600, 0.08, 'triangle', 0.1, 0.04); playNote(2000, 0.06, 'sine', 0.06, 0.08); },

    // --- Skill SFX ---
    groundSlam() { playNoise(0.15, 0.18); playNote(80, 0.3, 'sawtooth', 0.2); playNote(60, 0.2, 'sawtooth', 0.15, 0.1); },
    windBurst() { playNoise(0.08, 0.12); playNote(400, 0.15, 'sine', 0.1); playNote(600, 0.1, 'sine', 0.08, 0.05); playNote(800, 0.08, 'sine', 0.05, 0.1); },
    shadowStrike() { playNote(1600, 0.03, 'sawtooth', 0.15); playNote(200, 0.08, 'sawtooth', 0.12, 0.03); playNoise(0.05, 0.1); },
    shieldWall() { playNote(300, 0.2, 'triangle', 0.12); playNote(400, 0.15, 'triangle', 0.1, 0.1); playNote(500, 0.3, 'sine', 0.08, 0.2); },
    lifeDrain() { playNote(220, 0.2, 'sine', 0.1); playNote(330, 0.15, 'sine', 0.08, 0.1); playNote(440, 0.2, 'sine', 0.1, 0.2); },
    rageMode() { playNoise(0.2, 0.2); playNote(110, 0.4, 'sawtooth', 0.2); playNote(165, 0.3, 'sawtooth', 0.15, 0.15); playNote(220, 0.5, 'sawtooth', 0.18, 0.3); },
    eightTrigrams() { playNote(523, 0.1, 'sine', 0.12); playNote(659, 0.1, 'sine', 0.1, 0.08); playNote(784, 0.1, 'sine', 0.08, 0.16); playNote(1047, 0.3, 'triangle', 0.15, 0.24); },
    bladeStorm() { for (let i = 0; i < 5; i++) playNote(800 + i * 200, 0.04, 'sawtooth', 0.1 - i * 0.015, i * 0.06); playNoise(0.15, 0.12); },
    changbanCharge() { playNote(110, 0.5, 'sawtooth', 0.2); playNoise(0.3, 0.15); playNote(82, 0.4, 'sawtooth', 0.15, 0.2); },
    phoenixSummon() { playNote(440, 0.2, 'sine', 0.15); playNote(660, 0.2, 'triangle', 0.12, 0.15); playNote(880, 0.3, 'sine', 0.15, 0.3); playNote(1100, 0.4, 'triangle', 0.12, 0.45); },
};
