/* Carta Envuelta en Enredaderas
 * Una carta antigua que las enredaderas dibujan progresivamente con trazo SVG animado.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Enredaderas: al completarse el trazo, las hojas temblarán con el viento del cursor. */
const paths = document.querySelectorAll('.vine-path');
const leaves = document.querySelectorAll('.leaf');
let windX = 0;
addEventListener('pointermove', function (e) {
  windX = (e.clientX / innerWidth - .5) * 2;           // -1 izquierda → 1 derecha
});

/* Las hojas ya dibujadas se mecen suavemente con el viento */
(function swayLeaves() {
  const t = performance.now() * .001;
  leaves.forEach(function (leaf, i) {
    if (getComputedStyle(leaf).opacity === '0') return;
    const base = leaf.dataset.base || (leaf.dataset.base = leaf.getAttribute('transform') || '');
    const wobble = Math.sin(t * 1.6 + i * 1.3) * 4 * (1 + Math.abs(windX));
    const m = base.match(/rotate\(([-\d.]+)/);
    const deg = m ? parseFloat(m[1]) : 0;
    leaf.setAttribute('transform', (base ? base.replace(/rotate([^)]*)/, '') : '') + ' rotate(' + (deg + wobble) + ' ' + (leaf.getAttribute('cx') || 0) + ' ' + (leaf.getAttribute('cy') || 0) + ')');
  });
  requestAnimationFrame(swayLeaves);
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

