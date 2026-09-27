/* Mapa Estelar Interactivo
 * Recreación de un cielo en una fecha y lugar especiales, con un puntero luminoso de coordenadas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Mapa estelar: cielo pseudoaleatorio sembrado con una fecha + retícula y lupa luminosa. */
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const coords = document.getElementById('coords');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

/* PRNG sembrado (mulberry32): el mismo cielo en cada visita, "fijado" a la fecha */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(14022024);
const STARS = Array.from({ length: 240 }, function () {
  return { x: rnd() * 3000, y: rnd() * 2000, r: rnd() * 1.8 + .4, b: rnd() };
});
const CONSTELLATION = [                              // mini constelación en forma de corazón
  { x: 1500, y: 980 }, { x: 1560, y: 900 }, { x: 1640, y: 880 }, { x: 1720, y: 910 },
  { x: 1770, y: 990 }, { x: 1720, y: 1080 }, { x: 1630, y: 1150 }, { x: 1550, y: 1080 }
];

const mouse = { x: -1e4, y: -1e4 };
addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
addEventListener('pointerleave', function () { mouse.x = -1e4; });

function toCoords(x, y) {
  const ra = (x / W * 24), dec = 90 - (y / H * 180) * .5;
  const h = Math.floor(ra), m = Math.floor((ra - h) * 60);
  const sign = dec >= 0 ? '+' : '−';
  return 'α ' + String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm · δ ' + sign + Math.abs(dec).toFixed(0) + '°';
}

function frame(t) {
  ctx.fillStyle = '#03040c'; ctx.fillRect(0, 0, W, H);
  /* Retícula de observatorio */
  ctx.strokeStyle = 'rgba(159,216,255,.07)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  /* Estrellas (parallax sutil con el cursor) */
  for (const s of STARS) {
    const x = (s.x - mouse.x * .02) % 3000, y = s.y - mouse.y * .01;
    if (x < 0 || x > W || y < 0 || y > H) continue;
    const tw = .4 + .6 * Math.abs(Math.sin(t * .001 + s.b * 10));
    ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220,235,255,' + (s.b * tw) + ')'; ctx.fill();
  }
  /* Constelación con líneas que se iluminan cerca del cursor */
  ctx.lineWidth = 1.5;
  for (let i = 0; i < CONSTELLATION.length; i++) {
    const a = CONSTELLATION[i], b = CONSTELLATION[(i + 1) % CONSTELLATION.length];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const d = Math.hypot(mouse.x - mx, mouse.y - my);
    ctx.strokeStyle = 'rgba(255,180,220,' + Math.max(.15, .8 - d / 400) + ')';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,230,.9)'; ctx.fill();
  }
  /* Lupa/retícula del puntero */
  if (mouse.x > -999) {
    ctx.strokeStyle = 'rgba(159,216,255,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mouse.x - 60, mouse.y); ctx.lineTo(mouse.x - 30, mouse.y);
    ctx.moveTo(mouse.x + 30, mouse.y); ctx.lineTo(mouse.x + 60, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 60); ctx.lineTo(mouse.x, mouse.y - 30);
    ctx.moveTo(mouse.x, mouse.y + 30); ctx.lineTo(mouse.x, mouse.y + 60); ctx.stroke();
    coords.textContent = toCoords(mouse.x, mouse.y);
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

