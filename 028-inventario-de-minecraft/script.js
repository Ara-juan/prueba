/* Inventario de Minecraft
 * Cuadrícula de ítems personalizados con tooltips estilo juego y descripciones dedicadas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Inventario estilo Minecraft: ítems con tooltip dedicado y sonido de pickup. */
'use strict';
const grid = document.getElementById('grid');
const tooltip = document.getElementById('tooltip');

const ITEMS = [
  ['🎂', 'Pastel de Cumpleaños', 'Reduzca el estrés en 8 pedazos. Efecto: felicidad instantánea.', 'COMÚN'],
  ['❤️', 'Poción de Amor', 'Bebible. Cura 10 corazones y causa mariposas en el estómago.', 'RARO'],
  ['⭐', 'Estrella de tu Risa', 'Fuente de luz que nunca se agota. Ilumina cualquier día gris.', 'ÉPICO'],
  ['🛡️', 'Escudo de Apoyo', 'Absorbe el 100% de los malos días. Durabilidad: infinita.', 'RARO'],
  ['🗝️', 'Llave de Confianza', 'Abre cualquier conversación difícil. Nunca se rompe.', 'ÉPICO'],
  ['☕', 'Taza de Tardes Juntas', 'Regeneración II mientras se comparta.', 'COMÚN'],
  ['🌱', 'Semilla del Futuro', 'Plántala hoy. Florece recuerdos para siempre.', 'LEGENDARIO'],
  ['🎧', 'Amuleto de la Playlist', 'Convierte cualquier trayecto en aventura épica.', 'RARO'],
  ['🧭', 'Brújula del Corazón', 'Siempre apunta hacia lo que importa de verdad.', 'ÉPICO'],
  ['📜', 'Mapa del Tesoro', 'El tesoro: cada día que pasamos juntos. Marca: todas las X.', 'LEGENDARIO']
];
let selected = -1;

/* Sonido de xp/pickup */
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(320 + Math.random() * 240, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, a.currentTime + .09);
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .16);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .16);
  } catch (e) { /* opcional */ }
}

ITEMS.forEach(function (it, i) {
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.innerHTML = it[0] + '<span class="count">' + (i === 3 ? 64 : 1) + '</span>';
  slot.addEventListener('mouseenter', function (e) { showTip(it, slot); pop(); });
  slot.addEventListener('mousemove', moveTip);
  slot.addEventListener('mouseleave', function () { tooltip.style.display = 'none'; });
  slot.addEventListener('click', function () {
    selected = i;
    [...grid.children].forEach(function (s, j) { s.classList.toggle('sel', j === i); });
    showTip(it, slot); pop();
  });
  grid.appendChild(slot);
});

function showTip(it, slot) {
  tooltip.innerHTML = '<div class="t-name">' + it[1] + '</div>'
    + '<div class="t-rare">✦ ' + it[3] + ' ✦</div>'
    + '<div class="t-lore">' + it[2] + '</div>';
  tooltip.style.display = 'block';
  moveTip({ clientX: slot.getBoundingClientRect().right + 8, clientY: slot.getBoundingClientRect().top });
}
function moveTip(e) {
  const x = Math.min(e.clientX + 14, innerWidth - 260);
  const y = Math.min(e.clientY + 14, innerHeight - 120);
  tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
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

