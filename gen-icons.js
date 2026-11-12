const { createCanvas } = require('canvas');
const fs = require('fs');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const S = size;

  // Background — deep navy gradient
  const bg = ctx.createRadialGradient(S*.5, S*.4, 0, S*.5, S*.5, S*.72);
  bg.addColorStop(0, '#1a2240');
  bg.addColorStop(1, '#0a0d1a');
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, S, S, S * 0.13);
  ctx.fill();

  const cx = S / 2, cy = S / 2;

  // ── Norwegian flag (top center) ──
  const fw = S * .46, fh = S * .30, fx = cx - fw/2, fy = S * .10;
  // Red field
  ctx.fillStyle = '#EF2B2D';
  roundRect(ctx, fx, fy, fw, fh, S * .02);
  ctx.fill();
  // White cross
  ctx.fillStyle = '#fff';
  ctx.fillRect(fx, fy + fh/2 - fh*.12, fw, fh*.24);
  ctx.fillRect(fx + fw*.30, fy, fw*.18, fh);
  // Blue cross
  ctx.fillStyle = '#002868';
  ctx.fillRect(fx, fy + fh/2 - fh*.07, fw, fh*.14);
  ctx.fillRect(fx + fw*.34, fy, fw*.10, fh);

  // ── Open book (bottom) ──
  const bx = cx, by = S * .66;
  const bw = S * .46, bh = S * .26;

  ctx.shadowColor = 'rgba(79,142,247,.4)';
  ctx.shadowBlur = S * .05;

  // Left page
  ctx.fillStyle = '#1e2d50';
  ctx.beginPath();
  ctx.moveTo(bx, by - bh/2);
  ctx.quadraticCurveTo(bx - bw*.52, by - bh*.62, bx - bw*.5, by);
  ctx.quadraticCurveTo(bx - bw*.52, by + bh*.62, bx, by + bh/2);
  ctx.closePath();
  ctx.fill();

  // Right page
  ctx.fillStyle = '#162440';
  ctx.beginPath();
  ctx.moveTo(bx, by - bh/2);
  ctx.quadraticCurveTo(bx + bw*.52, by - bh*.62, bx + bw*.5, by);
  ctx.quadraticCurveTo(bx + bw*.52, by + bh*.62, bx, by + bh/2);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;

  // Spine
  ctx.strokeStyle = '#4f8ef7';
  ctx.lineWidth = S * .012;
  ctx.beginPath();
  ctx.moveTo(bx, by - bh/2);
  ctx.lineTo(bx, by + bh/2);
  ctx.stroke();

  // Text lines — left page
  const lc = 'rgba(79,142,247,.5)', lh = S * .012, lg = S * .036;
  [-2,-1,0,1,2].forEach(i => {
    const lw = i === 2 ? bw*.22 : i === -2 ? bw*.30 : bw*.34;
    ctx.fillStyle = i === -2 ? 'rgba(79,142,247,.85)' : lc;
    roundRect(ctx, bx - bw*.44, by + i*lg - lh/2, lw, lh, lh/2);
    ctx.fill();
  });

  // Text lines — right page
  [-2,-1,0,1,2].forEach(i => {
    const lw = i === 2 ? bw*.16 : i === 0 ? bw*.26 : bw*.32;
    ctx.fillStyle = lc;
    roundRect(ctx, bx + bw*.08, by + i*lg - lh/2, lw, lh, lh/2);
    ctx.fill();
  });

  // Glow dot at spine top
  const grd = ctx.createRadialGradient(bx, by - bh/2, 0, bx, by - bh/2, S*.04);
  grd.addColorStop(0, 'rgba(79,142,247,.9)');
  grd.addColorStop(1, 'rgba(79,142,247,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(bx, by - bh/2, S*.04, 0, Math.PI*2);
  ctx.fill();

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

[192, 512].forEach(size => {
  const canvas = drawIcon(size);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon-${size}.png`, buf);
  console.log(`✓ icon-${size}.png (${buf.length} bytes)`);
});
