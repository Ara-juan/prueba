/* Eclipse de Mensajes
 * Arrastra la luna, descubre el sol y revela las cartas ocultas tras su luz.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Eclipse: la luna se arrastra con el puntero; al alejarse del sol se revelan cartas. */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const MESSAGES = [
  'Brillas incluso cuando alguien intenta taparte la luz.',
  'Tu risa es mi eclipse favorito: no puedo dejar de mirarte.',
  'Gracias por iluminar mis días grises.',
  'Contigo hasta la oscuridad es hermosa.',
  'Eres sol en cada uno de mis amaneceres.'
];
const sun = { x: W / 2, y: H * .42, r: Math.min(W, H) * .18 };
const moon = { x: sun.x, y: sun.y, r: sun.r * 1.06, drag: false, off: 0 };
const letters = MESSAGES.map(function (txt, i) {
  const el = document.createElement('div');
  el.className = 'letter';
  el.innerHTML = '<b>Carta ' + (i + 1) + '</b>' + txt;
  document.body.appendChild(el);
  return el;
});
const shown = new Set();

function positionLetters(reveal) {
  const count = letters.length;
  letters.forEach(function (el, i) {
    if (!reveal) { el.classList.remove('show'); return; }
    const a = -Math.PI / 2 + (i - (count - 1) / 2) * .34;
    const d = sun.r * 2.15;
    el.style.left = (sun.x + Math.cos(a) * d - 150) + 'px';
    el.style.top = (sun.y + Math.sin(a) * d - 40) + 'px';
    el.classList.add('show');
  });
}

canvas.addEventListener('pointerdown', function (e) {
  if (Math.hypot(e.clientX - moon.x, e.clientY - moon.y) < moon.r + 14) moon.drag = true;
});
addEventListener('pointerup', function () { moon.drag = false; });
addEventListener('pointermove', function (e) {
  if (!moon.drag) return;
  moon.x = e.clientX; moon.y = e.clientY;
  moon.off = Math.hypot(moon.x - sun.x, moon.y - sun.y);
  const reveal = moon.off > sun.r * .9;
  if (reveal && shown.size === 0) chime();
  positionLetters(reveal);
});

function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 440;
    g.gain.setValueAtTime(.001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.1, a.currentTime + .3);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime + 1.2);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.2);
  } catch (e) { /* opcional */ }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Estrellas de fondo parpadeantes */
  if (!frame.dust) frame.dust = Array.from({ length: 110 }, function () { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, p: Math.random() * 7 }; });
  for (const d of frame.dust) {
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + (.25 + .35 * Math.sin(t * .002 + d.p)) + ')'; ctx.fill();
  }
  /* Corona del sol: brillo proporcional a lo descubierto */
  const open = Math.min(1, moon.off / (sun.r * 1.4));
  const glow = ctx.createRadialGradient(sun.x, sun.y, sun.r * .4, sun.x, sun.y, sun.r * (1.4 + open * 1.6));
  glow.addColorStop(0, 'rgba(255,215,106,' + (.55 * open + .05) + ')');
  glow.addColorStop(1, 'rgba(255,215,106,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  /* Sol */
  ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
  const sunGrad = ctx.createRadialGradient(sun.x - sun.r * .3, sun.y - sun.r * .3, sun.r * .1, sun.x, sun.y, sun.r);
  sunGrad.addColorStop(0, '#ffe9ad'); sunGrad.addColorStop(1, '#f2b23c');
  ctx.fillStyle = sunGrad; ctx.fill();
  /* Luna */
  ctx.beginPath(); ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  const moonGrad = ctx.createRadialGradient(moon.x - moon.r * .35, moon.y - moon.r * .35, moon.r * .1, moon.x, moon.y, moon.r);
  moonGrad.addColorStop(0, '#d9dde8'); moonGrad.addColorStop(1, '#8d93a5');
  ctx.fillStyle = moonGrad; ctx.fill();
  /* Cráteres */
  ctx.fillStyle = 'rgba(90,96,115,.35)';
  [[.3, -.2, .18], [-.25, .3, .13], [.1, .45, .09], [-.4, -.35, .1]].forEach(function (c) {
    ctx.beginPath(); ctx.arc(moon.x + c[0] * moon.r, moon.y + c[1] * moon.r, c[2] * moon.r, 0, Math.PI * 2); ctx.fill();
  });
  /* Halo punteado que marca la zona de arrastre */
  if (!moon.drag) {
    ctx.setLineDash([4, 8]); ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.r * 2, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
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

