/* Revista Teen Collage 90s
 * Collage recargado: recortes, pegatinas, washi tape y notas manuscritas sobre TI, la portada.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Revista 90s: pegatinas arrastrables + estampado de stickers con clic en la página. */
'use strict';
const mag = document.getElementById('mag');

/* Pegatinas colocadas aleatoriamente, arrastrables */
const STICKERS = ['⭐', '💗', '🌈', '💿', '📼', '✌️', '🦄', '📸'];
STICKERS.forEach(function (s, i) {
  const el = document.createElement('div');
  el.className = 'sticker';
  el.textContent = s;
  el.style.left = (8 + Math.random() * 80) + '%';
  el.style.top = (8 + Math.random() * 80) + '%';
  mag.appendChild(el);
  dragSticker(el);
});
function dragSticker(el) {
  let drag = null;
  el.addEventListener('pointerdown', function (e) {
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = '50';
  });
  el.addEventListener('pointermove', function (e) {
    if (!drag) return;
    const mr = mag.getBoundingClientRect();
    el.style.left = Math.max(0, Math.min(mr.width - 40, e.clientX - mr.left - drag.dx)) + 'px';
    el.style.top = Math.max(0, Math.min(mr.height - 40, e.clientY - mr.top - drag.dy)) + 'px';
  });
  addEventListener('pointerup', function () { drag = null; });
}
/* Clic en la revista: estampa una pegatina nueva en ese punto */
const EXTRA = ['🌟', '💖', '✨', '🌈', '🌼', '🧸', '🍬', '📎'];
mag.addEventListener('pointerdown', function (e) {
  if (e.target.closest('.sticker')) return;
  const r = mag.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'sticker';
  el.textContent = EXTRA[Math.floor(Math.random() * EXTRA.length)];
  el.style.left = (e.clientX - r.left - 16) + 'px';
  el.style.top = (e.clientY - r.top - 16) + 'px';
  el.style.transform = 'rotate(' + ((Math.random() - .5) * 30) + 'deg) scale(0)';
  mag.appendChild(el);
  dragSticker(el);
  pop();
  requestAnimationFrame(function () {
    el.style.transform = 'rotate(' + ((Math.random() - .5) * 30) + 'deg) scale(1)';
  });
  el.style.transition = 'transform .3s cubic-bezier(.2,1.6,.3,1)';
});
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 700 + Math.random() * 500;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .12);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .12);
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

