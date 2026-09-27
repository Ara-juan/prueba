/* Scrapbook: Álbum de Recortes
 * Cuaderno de espiral con fotos pegadas con washi tape, sellos y notas breves que puedes mover.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Scrapbook: elementos arrastrables dentro del álbum, con rotación leve al soltar. */
'use strict';
const book = document.getElementById('book');

function makeDraggable(el) {
  let drag = null;
  el.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const br = book.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, ox: r.left - br.left, oy: r.top - br.top };
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = '20';
    el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/, '') + ' rotate(0deg) scale(1.04)';
  });
  el.addEventListener('pointermove', function (e) {
    if (!drag) return;
    const br = book.getBoundingClientRect();
    const x = Math.max(0, Math.min(br.width - el.offsetWidth, e.clientX - br.left - drag.dx));
    const y = Math.max(0, Math.min(br.height - el.offsetHeight, e.clientY - br.top - drag.dy));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  });
  addEventListener('pointerup', function () {
    if (!drag) return;
    drag = null;
    el.style.zIndex = '';
    el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/, '') + ' rotate(' + ((Math.random() - .5) * 7).toFixed(1) + 'deg)';
  });
}
document.querySelectorAll('.photo, .note, .stamp').forEach(makeDraggable);

/* Doble clic en una nota: ciclo de colores */
document.querySelectorAll('.note').forEach(function (n) {
  n.addEventListener('dblclick', function () {
    const colors = ['#fff3b8', '#ffd9e4', '#d4f0ff', '#e4ffd9', '#ffe8cc'];
    n.style.background = colors[(colors.indexOf(getComputedStyle(n).backgroundColor) + 1) % colors.length] || colors[0];
    pop();
  });
});
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = 640;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .18);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .18);
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

