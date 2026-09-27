/* Interfaz Persona 5
 * Menú con la paleta rojo/negro/blanco, ángulos agresivos y sonidos de selección.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Interfaz estilo Persona 5: entrada en cascada, hover con sonido y detalles diagonales. */
'use strict';
const menu = document.getElementById('menu');
const detailTitle = document.getElementById('detailTitle');
const detailText = document.getElementById('detailText');

const ITEMS = [
  ['CONOCERTE', 'Mejor side-quest que he jugado. Sin tutorial y aún así todo fluye.'],
  ['TU RISA', 'Sonido de victoria desbloqueado cada vez que aparece.'],
  ['TU VALOR', 'Ataque de área que limpió todas mis dudas de un golpe.'],
  ['NUESTRO FUTURO', 'DLC gratuito: se desbloquea pasando más tiempo juntos.']
];
let selIndex = 0;

/* Sonido de selección: blip agresivo con decay rápido */
let ac = null;
function tick(freq) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .09);
    o.connect(g).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + .09);
  } catch (e) { /* opcional */ }
}

ITEMS.forEach(function (it, i) {
  const el = document.createElement('button');
  el.className = 'item';
  el.innerHTML = '<span>' + it[0] + '</span><small>0' + (i + 1) + '</small>';
  el.addEventListener('mouseenter', function () {
    selIndex = i; update(); tick(700 + i * 90);
  });
  el.addEventListener('click', function () { selIndex = i; update(); tick(1200); });
  menu.appendChild(el);
  /* Entrada escalonada */
  setTimeout(function () { el.classList.add('in'); }, 120 + i * 130);
});

function update() {
  [...menu.children].forEach(function (el, i) { el.classList.toggle('sel', i === selIndex); });
  detailTitle.textContent = ITEMS[selIndex][0];
  detailText.textContent = ITEMS[selIndex][1];
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    selIndex = (selIndex + (e.key === 'ArrowDown' ? 1 : -1) + ITEMS.length) % ITEMS.length;
    update(); tick(700 + selIndex * 90);
  }
  if (e.key === 'Enter') tick(1200);
});
update();
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

