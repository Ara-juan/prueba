/* Carta Agradecimiento Tríptico
 * Estructura tipo tríptico que se abre en 3 partes con animaciones horizontales escalonadas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tríptico 3D: apertura escalonada de las dos solapas con sonido de papel. */
'use strict';
const triptych = document.getElementById('triptych');
const openBtn = document.getElementById('openBtn');
let open = false;

openBtn.addEventListener('click', function () {
  open = !open;
  triptych.classList.toggle('open', open);
  openBtn.textContent = open ? 'Cerrar carta ✉️' : 'Abrir carta 💌';
  paperSound();
  if (open) setTimeout(chime, 700);
});
function paperSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .25;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
    const g = a.createGain(); g.gain.value = .12;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    [523, 659, 784].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .15); });
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .8);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .8);
  } catch (e) { /* opcional */ }
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

