/* Página de Novela Iluminada
 * Manuscrito medieval con letra capital decorada, pergamino e ilustraciones laterales.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Novela iluminada: parallax sutil de manchas, brillo dorado interactivo y modo vela. */
'use strict';
const folio = document.querySelector('.folio');
const stains = document.querySelectorAll('.stain');

/* Parallax de las manchas con el cursor */
addEventListener('pointermove', function (e) {
  const dx = (e.clientX / innerWidth - .5) * 2;
  const dy = (e.clientY / innerHeight - .5) * 2;
  stains.forEach(function (s, i) {
    const f = (i + 1) * 6;
    s.style.transform = 'translate(' + (dx * f) + 'px,' + (dy * f) + 'px)';
  });
});

/* La letra capital brilla al pasar el cursor (mini-iluminación de oro) */
const cap = document.querySelector('.cap');
cap.style.transition = 'text-shadow .4s';
cap.addEventListener('mouseenter', function () {
  cap.style.textShadow = '0 0 18px rgba(212,175,55,.9)';
  chime();
});
cap.addEventListener('mouseleave', function () { cap.style.textShadow = 'none'; });

/* Doble clic en el folio: enciende/apaga "modo vela" (luz cálida tenue) */
let candle = false;
const candleEl = document.createElement('div');
candleEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;opacity:0;transition:opacity .8s;background:radial-gradient(circle at 50% 30%,transparent 22%,rgba(20,10,4,.55) 75%)';
document.body.appendChild(candleEl);
folio.addEventListener('dblclick', function () {
  candle = !candle;
  candleEl.style.opacity = candle ? '1' : '0';
  chime();
});

function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5);
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

