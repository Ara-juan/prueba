/* Velas en la Oscuridad
 * Pantalla negra: tu cursor es la llama de una vela que revela los secretos ocultos de la carta.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Vela: la oscuridad se abre paso con la llama del cursor (CSS custom properties). */
'use strict';
const darkness = document.getElementById('darkness');
const flame = document.getElementById('flame');
let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;

addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; });
/* En táctil: la llama sigue el dedo */
addEventListener('touchmove', function (e) {
  tx = e.touches[0].clientX; ty = e.touches[0].clientY;
}, { passive: true });

(function loop() {
  x += (tx - x) * .18;                                 // la llama tiene inercia
  y += (ty - y) * .18;
  const flicker = 130 + Math.sin(performance.now() * .02) * 9 + Math.random() * 7;
  darkness.style.setProperty('--x', x + 'px');
  darkness.style.setProperty('--y', y + 'px');
  darkness.style.setProperty('--r', flicker + 'px');
  flame.style.left = x + 'px';
  flame.style.top = y + 'px';
  requestAnimationFrame(loop);
})();
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

