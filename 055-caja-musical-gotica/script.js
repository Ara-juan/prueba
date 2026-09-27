/* Caja Musical Gótica
 * Gira la manivela con arrastres circulares: la caja interpreta una melodía mientras sus grabados brillan.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Caja musical: arrastre circular → rotación → notas de la melodía + partículas musicales. */
'use strict';
const crank = document.getElementById('crank');
const arm = document.getElementById('arm');
const ornament = document.getElementById('ornament');
let angle = 0, lastAngle = null, accumulated = 0, lastNote = 0;
let ac = null;

/* Melodía: "Für Elise" simplificada (dominio público) */
const MELODY = [
  [659.25, 0], [622.25, 1], [659.25, 2], [622.25, 3], [659.25, 4], [493.88, 5], [587.33, 6], [523.25, 7],
  [440.00, 8], [261.63, 9], [329.63, 10], [440.00, 11], [493.88, 12], [329.63, 13], [415.30, 14], [493.88, 15]
];
let noteIdx = 0;

function ensureAC() {
  if (!ac) {
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* opcional */ }
  }
}
function playNote(freq) {
  ensureAC();
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(.11, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .8);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + .85);
  /* Armónico de campanita */
  const o2 = ac.createOscillator(), g2 = ac.createGain();
  o2.type = 'sine'; o2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(.04, ac.currentTime);
  g2.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .6);
  o2.connect(g2).connect(ac.destination);
  o2.start(); o2.stop(ac.currentTime + .65);
}

/* Ángulo del puntero respecto al centro de la manivela */
function pointerAngle(e) {
  const r = crank.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
}

let dragging = false;
crank.addEventListener('pointerdown', function (e) {
  dragging = true;
  lastAngle = pointerAngle(e);
  crank.setPointerCapture(e.pointerId);
  ensureAC();
});
crank.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  const a = pointerAngle(e);
  let d = a - lastAngle;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  angle += d;
  lastAngle = a;
  arm.style.transform = 'rotate(' + angle + 'deg)';
  accumulated += Math.abs(d);
  ornament.classList.add('singing');
  /* Cada 55° de giro toca la siguiente nota */
  if (accumulated - lastNote > 55) {
    lastNote = accumulated;
    const n = MELODY[noteIdx % MELODY.length];
    playNote(n[0]);
    spawnNote(n[0]);
    noteIdx++;
  }
});
addEventListener('pointerup', function () {
  dragging = false;
  setTimeout(function () { ornament.classList.remove('singing'); }, 600);
});

/* Nota flotante que escapa de la caja */
function spawnNote(freq) {
  const el = document.createElement('div');
  el.className = 'notes';
  el.textContent = ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)];
  const r = crank.getBoundingClientRect();
  el.style.left = (r.left + r.width / 2) + 'px';
  el.style.top = (r.top + r.height / 2 - 60) + 'px';
  el.style.color = 'hsl(' + Math.round(freq / 4) + ',70%,75%)';
  document.body.appendChild(el);
  requestAnimationFrame(function () {
    el.style.transform = 'translate(' + ((Math.random() - .5) * 120) + 'px,' + (-140 - Math.random() * 100) + 'px) rotate(' + ((Math.random() - .5) * 60) + 'deg)';
    el.style.opacity = '0';
  });
  setTimeout(function () { el.remove(); }, 1700);
}
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

