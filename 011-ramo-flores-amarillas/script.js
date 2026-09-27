/* Ramo de Flores Amarillas
 * Un ramo que florece pétalo a pétalo al abrir la página, con ambiente suave y flores interactivas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Ramo de flores amarillas: flores procedurales que florecen con animación y sonido ambiental. */
const canvas = document.getElementById('meadow');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

/* Ambiente: acorde suave en loop con Web Audio API */
let ambient = null;
function startAmbient() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ambient = new AC();
    const master = ambient.createGain();
    master.gain.value = .05;
    master.connect(ambient.destination);
    [261.63, 329.63, 392.0].forEach(function (f, i) {   // acorde C-E-G suave
      const o = ambient.createOscillator(), g = ambient.createGain(), lfo = ambient.createOscillator(), lg = ambient.createGain();
      o.type = 'sine'; o.frequency.value = f;
      lfo.frequency.value = .1 + i * .05; lg.gain.value = .02;
      lfo.connect(lg).connect(g.gain);
      g.gain.value = .12;
      o.connect(g).connect(master);
      o.start(); lfo.start();
    });
  } catch (e) { /* audio opcional */ }
}
document.addEventListener('click', function once() { startAmbient(); document.removeEventListener('click', once); }, { once: true });

function pluck(freq) {
  try {
    if (!ambient) return;
    const o = ambient.createOscillator(), g = ambient.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(.08, ambient.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ambient.currentTime + .5);
    o.connect(g).connect(ambient.destination);
    o.start(); o.stop(ambient.currentTime + .5);
  } catch (e) { /* opcional */ }
}

/* Flores con estado de crecimiento y colores */
const flowers = [];
function addFlower(x, y, big) {
  const hues = big ? [48, 45, 52] : [48, 55, 40, 60];
  flowers.push({
    x: x, y: y,
    petals: big ? 10 : 8 + Math.floor(Math.random() * 4),
    petalLen: big ? 34 : 16 + Math.random() * 14,
    hue: hues[Math.floor(Math.random() * hues.length)],
    grow: 0, speed: .006 + Math.random() * .006, bloomAt: performance.now() + Math.random() * 2500,
    wobble: Math.random() * 7, picked: 0
  });
}
for (let i = 0; i < 7; i++) addFlower(W * (.12 + i * .13), H * (.55 + Math.random() * .3), true);

canvas.addEventListener('pointerdown', function (e) {
  const r = canvas.getBoundingClientRect();
  addFlower(e.clientX - r.left, e.clientY - r.top, false);
  pluck(500 + Math.random() * 400);
});

function drawFlower(f, t) {
  if (performance.now() > f.bloomAt && f.grow < 1) f.grow = Math.min(1, f.grow + f.speed);
  const g = f.grow;
  if (g <= 0) return;
  const sway = Math.sin(t * .0012 + f.wobble) * 6;
  /* Tallo */
  ctx.strokeStyle = '#4c7a3d'; ctx.lineWidth = 3 * g;
  ctx.beginPath(); ctx.moveTo(f.x, f.y + 130 * g);
  ctx.quadraticCurveTo(f.x + sway * .5, f.y + 60 * g, f.x + sway, f.y); ctx.stroke();
  /* Hojas */
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(f.x + sway * .5 - 14 * g, f.y + 70 * g, 14 * g, 5 * g, -.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(f.x + sway * .5 + 14 * g, f.y + 95 * g, 14 * g, 5 * g, .5, 0, Math.PI * 2); ctx.fill();
  /* Pétalos: se abren escalonadamente */
  const open = Math.max(0, (g - .4) / .6);
  for (let p = 0; p < f.petals; p++) {
    const petalOpen = Math.max(0, Math.min(1, open * 1.6 - p * .06));
    if (petalOpen <= 0) continue;
    const a = p / f.petals * Math.PI * 2 + t * .0003;
    const len = f.petalLen * petalOpen;
    ctx.save();
    ctx.translate(f.x + sway, f.y);
    ctx.rotate(a);
    ctx.fillStyle = 'hsla(' + f.hue + ',85%,60%,' + (.75 + .25 * petalOpen) + ')';
    ctx.beginPath();
    ctx.ellipse(len * .55, 0, len * .5, f.petalLen * .3 * petalOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  /* Corazón de la flor */
  if (open > 0) {
    ctx.beginPath(); ctx.arc(f.x + sway, f.y, f.petalLen * .38 * open, 0, Math.PI * 2);
    ctx.fillStyle = '#a5661a'; ctx.fill();
    ctx.fillStyle = 'rgba(140,90,20,.6)';
    for (let s = 0; s < 8; s++) {
      const sa = s / 8 * Math.PI * 2, sr = f.petalLen * .38 * open * .6;
      ctx.beginPath(); ctx.arc(f.x + sway + Math.cos(sa) * sr, f.y + Math.sin(sa) * sr, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Colina de césped */
  ctx.fillStyle = '#a8c98a';
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H * .8);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H * .8 + Math.sin(x * .01) * 10);
  ctx.lineTo(W, H); ctx.fill();
  flowers.sort(function (a, b) { return a.y - b.y; });
  for (const f of flowers) drawFlower(f, t);
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

