/* Certificado de Cine de Oro
 * Placa dorada con tipografía de época y cortinas rojas que se abren para revelar el premio.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Certificado de oro: las cortinas se abren con animación y música de fanfarria. */
'use strict';
const startBtn = document.getElementById('startBtn');
let opened = false;

startBtn.addEventListener('click', function () {
  if (opened) return;
  opened = true;
  document.body.classList.add('open');
  fanfare();
});

/* Fanfarria de gala con Web Audio API */
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const notes = [[392, 0], [523, .18], [659, .36], [784, .54], [1046, .78]];
    notes.forEach(function (n) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'triangle'; o.frequency.value = n[0];
      g.gain.setValueAtTime(.001, a.currentTime + n[1]);
      g.gain.exponentialRampToValueAtTime(.09, a.currentTime + n[1] + .04);
      g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + n[1] + .8);
      o.connect(g).connect(a.destination);
      o.start(a.currentTime + n[1]); o.stop(a.currentTime + n[1] + .9);
    });
  } catch (e) { /* opcional */ }
}

/* Destello sutil que recorre el certificado */
const style = document.createElement('style');
style.textContent = '@keyframes sweepGold{0%{background-position:-300% 0}100%{background-position:300% 0}}'
  + '.certificate h1{background-size:200% auto;animation:sweepGold 5s linear infinite}';
document.head.appendChild(style);
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

