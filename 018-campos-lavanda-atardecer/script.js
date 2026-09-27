/* Campos de Lavanda al Atardecer
 * Paisaje vectorial animado: el viento mece las flores de lavanda mientras el sol se pone.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Paisaje de lavanda: hileras de flores con viento ondulante y sol poniente. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

/* Genera hileras de lavanda con profundidad */
const rows = [];
for (let r = 0; r < 7; r++) {
  const depth = r / 6;                                 // 0 lejos → 1 cerca
  const plants = [];
  const count = 14 + r * 6;
  for (let i = 0; i < count; i++) {
    plants.push({
      x: (i + Math.random() * .7) / count,
      h: 30 + depth * 90 + Math.random() * 20,
      phase: Math.random() * 7,
      hue: 268 + Math.random() * 22
    });
  }
  rows.push({ depth: depth, plants: plants });
}

function drawLavender(p, x, baseY, t, depth) {
  const bend = Math.sin(t * .0011 + p.phase + x * .01) * (6 + depth * 14);
  /* Tallo */
  ctx.strokeStyle = 'rgba(90,120,70,' + (.5 + depth * .5) + ')';
  ctx.lineWidth = 1 + depth * 2;
  ctx.beginPath(); ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + bend * .4, baseY - p.h * .5, x + bend, baseY - p.h);
  ctx.stroke();
  /* Espiga de flores: pequeños óvalos apilados */
  for (let s = 0; s < 5; s++) {
    const f = s / 5;
    const sx = x + bend * (.55 + f * .45), sy = baseY - p.h * (.55 + f * .13);
    ctx.fillStyle = 'hsla(' + p.hue + ',55%,' + (52 - s * 4) + '%,' + (.55 + depth * .45) + ')';
    ctx.beginPath(); ctx.ellipse(sx, sy, (2.6 + depth * 2.6) * (1 - f * .3), (5 + depth * 5) * (1 - f * .3), 0, 0, Math.PI * 2); ctx.fill();
  }
}

function frame(t) {
  /* Cielo de atardecer */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#3a2560'); sky.addColorStop(.45, '#a14e7a'); sky.addColorStop(.75, '#e98a5e'); sky.addColorStop(1, '#ffc27a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  /* Sol poniente */
  const sunY = H * .62 + Math.sin(t * .00008) * 8;
  const sunGlow = ctx.createRadialGradient(W * .5, sunY, 10, W * .5, sunY, Math.min(W, H) * .5);
  sunGlow.addColorStop(0, 'rgba(255,220,140,.95)'); sunGlow.addColorStop(.25, 'rgba(255,180,100,.5)'); sunGlow.addColorStop(1, 'rgba(255,150,80,0)');
  ctx.fillStyle = sunGlow; ctx.fillRect(0, 0, W, H);
  ctx.beginPath(); ctx.arc(W * .5, sunY, Math.min(W, H) * .09, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe9b0'; ctx.fill();
  /* Colinas lejanas */
  ctx.fillStyle = 'rgba(70,40,90,.55)';
  ctx.beginPath(); ctx.moveTo(0, H * .68);
  ctx.quadraticCurveTo(W * .25, H * .6, W * .5, H * .66);
  ctx.quadraticCurveTo(W * .75, H * .72, W, H * .64);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  /* Hileras de lavanda de atrás hacia adelante */
  const horizon = H * .7;
  for (const row of rows) {
    const baseY = horizon + row.depth * (H - horizon) + 8;
    /* Franja de tierra entre hileras */
    ctx.fillStyle = 'rgba(40,25,55,' + (.25 + row.depth * .5) + ')';
    ctx.fillRect(0, baseY - 4, W, 10 + row.depth * 16);
    for (const p of row.plants) drawLavender(p, p.x * W, baseY, t, row.depth);
  }
  /* Luciérnagas sutiles */
  for (let i = 0; i < 14; i++) {
    const fx = (Math.sin(t * .0004 + i * 2.4) * .5 + .5) * W;
    const fy = H * (.75 + Math.sin(t * .0006 + i * 1.7) * .1);
    const a = .3 + .7 * Math.abs(Math.sin(t * .002 + i));
    ctx.beginPath(); ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,150,' + a + ')';
    ctx.shadowColor = '#ffefa0'; ctx.shadowBlur = 8;
    ctx.fill(); ctx.shadowBlur = 0;
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

