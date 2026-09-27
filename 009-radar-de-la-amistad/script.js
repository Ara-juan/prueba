/* Radar de la Amistad
 * Radar retro que barre la pantalla y detecta señales de cariño: haz clic en cada punto.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Radar retro: barrido rotatorio + blips clicables de "señales de cariño". */
const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');
const log = document.getElementById('log');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const SIGNALS = [
  'Señal #01: alguien piensa en ti ahora mismo.',
  'Señal #02: tu risa transmite a 88.8 MHz.',
  'Señal #03: amistad detectada a 100% de intensidad.',
  'Señal #04: te extraño a 3.000 km/s.',
  'Señal #05: abrazo entrante… ¡acéptalo!',
  'Señal #06: gracias por existir. Fin de la transmisión.'
];
const blips = SIGNALS.map(function (msg, i) {
  const a = Math.random() * Math.PI * 2, d = .3 + Math.random() * .6;
  return { msg: msg, a: a, d: d, found: false, pulse: 0 };
});
let sweep = 0, foundCount = 0;

function blip() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .35);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .35);
  } catch (e) { /* opcional */ }
}

canvas.addEventListener('pointerdown', function (e) {
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .42;
  for (const b of blips) {
    if (b.found) continue;
    const bx = cx + Math.cos(b.a) * b.d * R, by = cy + Math.sin(b.a) * b.d * R;
    if (Math.hypot(e.clientX - bx, e.clientY - by) < 26) {
      b.found = true; b.pulse = 1; foundCount++;
      blip();
      const line = document.createElement('span');
      line.textContent = '> ' + b.msg;
      log.appendChild(line);
      while (log.children.length > 6) log.removeChild(log.firstChild);
      if (foundCount === blips.length) {
        const fin = document.createElement('span');
        fin.style.color = '#b6ffcf';
        fin.textContent = '> ❖ TODAS LAS SEÑALES RECIBIDAS: eres increíble.';
        log.appendChild(fin);
      }
    }
  }
});

function frame(t) {
  sweep += .022;
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .42;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  /* Rejilla circular */
  ctx.strokeStyle = 'rgba(61,255,136,.35)'; ctx.lineWidth = 1;
  for (let r = R / 4; r <= R; r += R / 4) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
  }
  /* Estela del barrido (sector con degradado) */
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  grad.addColorStop(0, 'rgba(61,255,136,.25)'); grad.addColorStop(1, 'rgba(61,255,136,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, sweep - .8, sweep); ctx.closePath(); ctx.fill();
  /* Línea del barrido */
  ctx.strokeStyle = 'rgba(160,255,190,.9)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); ctx.stroke();
  /* Blips */
  for (const b of blips) {
    const x = cx + Math.cos(b.a) * b.d * R, y = cy + Math.sin(b.a) * b.d * R;
    const da = Math.abs(((sweep - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
    const justSwept = da < .06 || da > Math.PI * 2 - .06;
    if (b.found) {
      b.pulse = Math.max(0, b.pulse - .01);
      ctx.strokeStyle = 'rgba(61,255,136,.9)';
      ctx.beginPath(); ctx.arc(x, y, 8 + (1 - b.pulse) * 18, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(61,255,136,.95)';
    } else {
      ctx.fillStyle = justSwept ? 'rgba(190,255,210,1)' : 'rgba(61,255,136,.55)';
    }
    ctx.beginPath(); ctx.arc(x, y, b.found ? 4 : 5, 0, Math.PI * 2); ctx.fill();
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

