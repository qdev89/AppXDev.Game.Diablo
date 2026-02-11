/**
 * generate-icons.js — Run this once to create PWA icons
 * Usage: node generate-icons.js
 * Creates icons/icon-192.png and icons/icon-512.png
 */

// Since we're asset-free, we create a simple script to generate icons
// This uses a canvas-like approach via a simple HTML file

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate a simple icon as an HTML file that can be screenshotted,
// or we use the built-in canvas in the browser.
// For now, create a generator HTML that auto-downloads the icons.

const html = `<!DOCTYPE html>
<html>
<head><title>Icon Generator</title></head>
<body style="background:#000;display:flex;gap:20px;padding:20px;">
<script>
function generateIcon(size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  
  // Background — dark with gold border
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, size, size);
  
  // Gold border
  const bw = size * 0.04;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = bw;
  ctx.strokeRect(bw, bw, size - bw*2, size - bw*2);
  
  // Inner glow
  const g = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.45);
  g.addColorStop(0, 'rgba(255,215,0,0.15)');
  g.addColorStop(1, 'rgba(255,215,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  
  // Wu Xing elements circle
  const elements = [
    { char: '木', color: '#00ff88' },
    { char: '火', color: '#ff4444' },
    { char: '土', color: '#cc8800' },
    { char: '金', color: '#cccccc' },
    { char: '水', color: '#4488ff' }
  ];
  
  const cx = size / 2;
  const cy = size / 2 - size * 0.05;
  const r = size * 0.28;
  const fs = size * 0.12;
  
  ctx.font = 'bold ' + fs + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  elements.forEach((el, i) => {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    
    ctx.shadowColor = el.color;
    ctx.shadowBlur = size * 0.03;
    ctx.fillStyle = el.color;
    ctx.fillText(el.char, x, y);
  });
  
  ctx.shadowBlur = 0;
  
  // Center text "DBD"
  const titleSize = size * 0.15;
  ctx.font = 'bold ' + titleSize + 'px monospace';
  ctx.fillStyle = '#ffd700';
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = size * 0.04;
  ctx.fillText('DBD', cx, cy);
  ctx.shadowBlur = 0;
  
  // Subtitle
  const subSize = size * 0.05;
  ctx.font = subSize + 'px monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('DYNASTY BRUHHH', cx, size - size * 0.12);
  
  // Download
  const link = document.createElement('a');
  link.download = 'icon-' + size + '.png';
  link.href = c.toDataURL('image/png');
  link.click();
  
  // Also display
  document.body.appendChild(c);
  c.style.border = '1px solid #333';
}

generateIcon(192);
generateIcon(512);
document.title = 'Icons generated! Check downloads.';
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'generate-icons.html'), html);
console.log('✅ Created generate-icons.html');
console.log('   Open in browser to download icon-192.png and icon-512.png');
console.log('   Then move them to the icons/ folder');
