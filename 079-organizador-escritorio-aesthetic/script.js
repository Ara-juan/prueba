/* Organizador Aesthetic (Post-its)
 * Panel tipo Notion pastel: listas de razones, notas adhesivas arrastrables y fotos del tablero.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tablero aesthetic: checkboxes animados, añadir razones y post-its arrastrables. */
'use strict';
const REASONS = ['Tu paciencia infinita', 'Tu manera de celebrarme', 'Cómo conviertes lunes en viernes', 'Tus chismes de calidad premium', 'Ese humor que nunca falla', 'Tu valentía silenciosa'];
const PLANS = ['Picnic al atardecer', 'Cocinar juntos (y reírnos del resultado)', 'Aprender algo nuevo en pareja', 'Día de spa casero'];
let reasonIdx = 0, planIdx = 0;

/* Checks interactivos */
document.querySelectorAll('.check').forEach(function (c) {
  c.addEventListener('click', function () {
    c.classList.toggle('done');
    const box = c.querySelector('.box');
    box.textContent = c.classList.contains('done') ? '✓' : '';
    pop(c.classList.contains('done') ? 700 : 420);
  });
});
document.querySelectorAll('.add-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    const list = document.getElementById('list' + b.dataset.list);
    const pool = b.dataset.list === '1' ? REASONS : PLANS;
    const idx = b.dataset.list === '1' ? reasonIdx++ : planIdx++;
    const item = document.createElement('div');
    item.className = 'check';
    item.innerHTML = '<span class="box"></span><span class="txt">' + pool[idx % pool.length] + '</span>';
    item.addEventListener('click', function () {
      item.classList.toggle('done');
      item.querySelector('.box').textContent = item.classList.contains('done') ? '✓' : '';
      pop(700);
    });
    list.insertBefore(item, b);
    pop(600);
  });
});

/* Post-its arrastrables dentro de la zona */
const zone = document.getElementById('zone');
function dragSticky(el) {
  let drag = null;
  el.addEventListener('pointerdown', function (e) {
    const r = el.getBoundingClientRect();
    const zr = zone.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = '10';
  });
  el.addEventListener('pointermove', function (e) {
    if (!drag) return;
    const zr = zone.getBoundingClientRect();
    const x = Math.max(0, Math.min(zone.clientWidth - el.offsetWidth, e.clientX - zr.left - drag.dx));
    const y = Math.max(0, Math.min(zone.clientHeight - el.offsetHeight, e.clientY - zr.top - drag.dy));
    el.style.left = x + 'px'; el.style.top = y + 'px';
  });
  addEventListener('pointerup', function () {
    if (!drag) return;
    drag = null;
    el.style.zIndex = '';
    /* Pequeña rotación aleatoria al soltar */
    el.style.transform = 'rotate(' + ((Math.random() - .5) * 8).toFixed(1) + 'deg)';
  });
}
document.querySelectorAll('.sticky').forEach(dragSticky);
/* Doble clic en la zona: nuevo post-it */
zone.addEventListener('dblclick', function (e) {
  if (e.target.closest('.sticky')) return;
  const colors = ['s-pink', 's-lav', 's-mint', 's-butter'];
  const texts = ['Nueva nota: te aprecio muchísimo ♥', 'Recordatorio: eres importante', 'Idea: abrazo pronto. Urgente.', 'Dato: este tablero te quiere'];
  const el = document.createElement('div');
  el.className = 'sticky ' + colors[Math.floor(Math.random() * colors.length)];
  el.textContent = texts[Math.floor(Math.random() * texts.length)];
  const fold = document.createElement('span');
  fold.className = 'fold';
  el.appendChild(fold);
  const zr = zone.getBoundingClientRect();
  el.style.left = Math.max(0, e.clientX - zr.left - 70) + 'px';
  el.style.top = Math.max(0, e.clientY - zr.top - 50) + 'px';
  zone.appendChild(el);
  dragSticky(el);
  pop(820);
});
function pop(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .2);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .2);
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

