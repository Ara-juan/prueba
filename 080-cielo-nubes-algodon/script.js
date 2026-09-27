/* Cielo de Nubes de Algodón
 * Nubes pastel que se desplazan lentamente y se abren con un clic para dejar ver el mensaje.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Nubes de algodón: composición de círculos, desplazamiento lento y apertura interactiva. */
'use strict';
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const MESSAGES = [
  'Eres mi cielo despejado',
  'Contigo hasta la lluvia brilla',
  'Nubes pasajeras, nosotros permanentes',
  'Mi clima favorito: tú',
  'Hoy el cielo votó por ti',
  'Sorpresa: te quiero muchísimo'
];
const clouds = [];
function spawnCloud(x, fromLeft) {
  const puffs = [];
  const n = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    puffs.push({ ox: (i - n / 2) * 26 + Math.random() * 14, oy: Math.sin(i) * 12, r: 26 + Math.random() * 26 });
  }
  clouds.push({
    x: x !== undefined ? x : (fromLeft ? -160 : W + 160),
    y: H * (.12 + Math.random() * .5),
    v: .18 + Math.random() * .3,
    puffs: puffs,
    open: 0,
    msg: MESSAGES[clouds.length % MESSAGES.length],
    tint: 200 + Math.random() * 20
  });
}
for (let i = 0; i < 7; i++) spawnCloud(Math.random() * W);
setInterval(function () { spawnCloud(undefined, true); }, 4200);

canvas.addEventListener('pointerdown', function (e) {
  for (const c of clouds) {
    if (Math.abs(e.clientY - c.y) < 70 && Math.abs(e.clientX - c.x) < 110) {
      if (c.open < 1) { c.open = 1; chime(); }
      return;
    }
  }
});
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(523, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(784, a.currentTime + .4);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
  } catch (e) { /* opcional */ }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Sol suave */
  const sunX = W * .82, sunY = H * .16;
  const sun = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 130);
  sun.addColorStop(0, 'rgba(255,236,180,.85)');
  sun.addColorStop(1, 'rgba(255,236,180,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - 130, sunY - 130, 260, 260);
  /* Nubes de atrás hacia adelante */
  clouds.sort(function (a, b) { return a.y - b.y; });
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.v;
    c.open = Math.max(0, c.open - .002);
    if (c.x > W + 200) { clouds.splice(i, 1); continue; }
    /* Sombra suave */
    ctx.fillStyle = 'rgba(180,160,200,.14)';
    for (const p of c.puffs) {
      ctx.beginPath(); ctx.arc(c.x + p.ox + 8, c.y + p.oy + 10, p.r, 0, Math.PI * 2); ctx.fill();
    }
    /* Cuerpo de la nube: se separa al abrirse */
    for (const p of c.puffs) {
      const spread = c.open * 30;
      ctx.beginPath();
      ctx.arc(c.x + p.ox + (p.ox < 0 ? -spread : spread), c.y + p.oy, p.r * (1 + c.open * .1), 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + c.tint + ',60%,99%,.96)';
      ctx.fill();
    }
    /* Mensaje revelado dentro de la nube */
    if (c.open > .05) {
      ctx.fillStyle = 'rgba(120,110,150,' + c.open + ')';
      ctx.font = 'italic ' + Math.max(14, Math.min(19, W * .024)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.msg, c.x, c.y + 8);
    }
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

