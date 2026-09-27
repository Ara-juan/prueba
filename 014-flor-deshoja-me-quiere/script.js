/* Flor Deshoja "¿Me quiere?"
 * Quita los pétalos uno a uno… hasta descubrir el mensaje final.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Deshojar la margarita: cada clic suelta un pétalo con física simple. */
const canvas = document.getElementById('flower');
const ctx = canvas.getContext('2d');
const counter = document.getElementById('counter');
const finalEl = document.getElementById('final');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const TOTAL = 12;
const PHRASES = ['Me quiere', 'No me quiere', 'Me quiere', 'Mucho', 'Un montón', '¿En serio?', 'Me quiere', 'A lo loco', 'Con todo', 'Para siempre', 'Ya sabes…', 'Última chance'];
let petals = [], falling = [], remaining = TOTAL;

function build() {
  petals = [];
  remaining = TOTAL;
  for (let i = 0; i < TOTAL; i++) {
    petals.push({ angle: i / TOTAL * Math.PI * 2, len: 92, wig: Math.random() * 7, alive: true });
  }
  falling = [];
}
build();

function petalPath(x, y, angle, len, t, wig) {
  const tip = len * (1 + Math.sin(t * .001 + wig) * .03);
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * .38, -len * .16, len * .5, -len * .42, tip, -len * .18);
  ctx.bezierCurveTo(len * .58, -len * .05, len * .58, len * .05, tip, len * .18);
  ctx.bezierCurveTo(len * .5, len * .42, len * .38, len * .16, 0, 0);
  ctx.fillStyle = '#ffe3ee'; ctx.fill();
  ctx.strokeStyle = '#f3a7c3'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.restore();
}

canvas.addEventListener('pointerdown', function (e) {
  const cx = W / 2, cy = H / 2 - 20;
  if (remaining <= 0) return;
  /* Busca el pétalo vivo más cercano al clic */
  let hit = null, best = 1e9;
  for (const p of petals) {
    if (!p.alive) continue;
    const px = cx + Math.cos(p.angle) * 70, py = cy + Math.sin(p.angle) * 70;
    const d = Math.hypot(e.clientX - px, e.clientY - py);
    if (d < best) { best = d; hit = p; }
  }
  if (!hit || best > 90) return;
  hit.alive = false; remaining--;
  falling.push({ angle: hit.angle, x: cx + Math.cos(hit.angle) * 70, y: cy + Math.sin(hit.angle) * 70, vx: (Math.random() - .5) * 3, vy: -2 - Math.random() * 2, rot: 0, rotV: (Math.random() - .5) * .2, len: hit.len, t: 0 });
  chime(320 + (TOTAL - remaining) * 28);
  counter.textContent = remaining > 0
    ? '"' + PHRASES[TOTAL - remaining - 1] + '" · quedan ' + remaining + ' pétalos'
    : '…';
  if (remaining === 0) setTimeout(function () { finalEl.classList.add('show'); }, 700);
});

function chime(freq) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .4);
  } catch (e) { /* opcional */ }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 - 20;
  /* Tallo y hoja */
  ctx.strokeStyle = '#4c7a3d'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy + 30); ctx.quadraticCurveTo(cx - 10, cy + 130, cx - 4, cy + 230); ctx.stroke();
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(cx - 34, cy + 120, 26, 10, -.6, 0, Math.PI * 2); ctx.fill();
  /* Centro */
  ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#f6c445'; ctx.fill();
  ctx.fillStyle = '#c98a1e';
  for (let s = 0; s < 12; s++) {
    const a = s / 12 * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18, 3, 0, Math.PI * 2); ctx.fill();
  }
  /* Pétalos vivos */
  for (const p of petals) if (p.alive) petalPath(cx, cy, p.angle, p.len, t, p.wig);
  /* Pétalos cayendo */
  for (let i = falling.length - 1; i >= 0; i--) {
    const f = falling[i];
    f.vy += .09; f.x += f.vx; f.y += f.vy; f.rot += f.rotV; f.t += 16;
    if (f.y > H + 60) { falling.splice(i, 1); continue; }
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
    ctx.fillStyle = 'rgba(255,227,238,.9)';
    ctx.beginPath(); ctx.ellipse(0, 0, f.len * .5, f.len * .18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
/* Rendimiento: los bucles de animación se pausan con la pestaña en segundo plano */
(function () {
  var raf = window.requestAnimationFrame.bind(window);
  var pendientes = [];
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && pendientes.length) {
      var q = pendientes.splice(0);
      q.forEach(function (cb) { raf(cb); });
    }
  });
  window.requestAnimationFrame = function (cb) {
    if (document.hidden) { pendientes.push(cb); return 0; }
    return raf(cb);
  };
})();

