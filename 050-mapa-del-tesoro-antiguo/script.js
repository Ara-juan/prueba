/* Mapa del Tesoro Antiguo
 * Pergamino con X que revela ubicaciones especiales e historias al tocar cada punto.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Mapa del tesoro: puntos X clicables que revelan historias; lupa sigue al cursor. */
'use strict';
const map = document.getElementById('map');
const lens = document.getElementById('lens');
const storyEl = document.getElementById('story');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const progressEl = document.getElementById('progress');

/* Contorno de la isla dibujado dinámicamente */
const SVG_NS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(SVG_NS, 'svg');
svg.setAttribute('viewBox', '0 0 680 510');
svg.innerHTML =
  '<path class="coast" d="M60,300 C80,180 180,90 320,80 C460,70 600,140 620,250 C640,360 520,450 360,455 C220,460 40,420 60,300 Z"/>'
  + '<path class="river" d="M300,90 C320,170 280,240 330,300 C370,350 420,380 430,440"/>'
  + '<path class="mountain" d="M150,260 L190,180 L230,260 Z"/>'
  + '<path class="mountain" d="M210,265 L245,200 L285,265 Z"/>';
map.appendChild(svg);
/* Árboles decorativos */
[[110, 330], [150, 360], [520, 160], [560, 200], [470, 350], [250, 150]].forEach(function (pos) {
  const t = document.createElement('span');
  t.className = 'tree';
  t.textContent = '🌲';
  t.style.left = pos[0] + 'px'; t.style.top = pos[1] + 'px';
  map.appendChild(t);
});

const POINTS = [
  ['La Costa del Primer Encuentro', 'Aquí desembarcó nuestra historia sin permiso ni aviso. La marea nunca la devolvió.', 26, 60],
  ['El Bosque de las Risas', 'Árboles que escucharon chistes internos y juraron no contarlos nunca.', 72, 30],
  ['La Montaña del Esfuerzo Compartido', 'La subida era difícil; arriba descubrimos que valía por cada paso.', 30, 38],
  ['La Cueva de los Secretos', 'Todo lo que se confiesa aquí, se queda aquí. Susurros en custodia eterna.', 55, 72],
  ['⭐ EL TESORO ⭐', 'Tras recorrer todo el mapa… el tesoro siempre fuiste tú. La X estaba marcada desde el principio.', 78, 55]
];
let found = 0;

POINTS.forEach(function (p, i) {
  const m = document.createElement('div');
  m.className = 'mark';
  m.style.left = p[2] + '%';
  m.style.top = p[3] + '%';
  m.innerHTML = '<span class="x">✕</span>';
  m.addEventListener('click', function (e) {
    e.stopPropagation();
    m.classList.add('found');
    if (!m.dataset.counted) {
      m.dataset.counted = '1';
      found++;
      progressEl.textContent = 'Tesoro: ' + found + '/' + POINTS.length;
      revealSound(i === POINTS.length - 1);
    }
    storyTitle.textContent = '📍 ' + p[0];
    storyText.textContent = p[1];
    storyEl.classList.remove('hidden');
    clearTimeout(storyEl.timer);
    storyEl.timer = setTimeout(function () { storyEl.classList.add('hidden'); }, 5200);
  });
  map.appendChild(m);
});

/* Lupa que sigue al cursor sobre el mapa */
map.addEventListener('pointermove', function (e) {
  lens.style.display = 'block';
  lens.style.left = e.clientX + 'px';
  lens.style.top = e.clientY + 'px';
});
map.addEventListener('pointerleave', function () { lens.style.display = 'none'; });

function revealSound(isTreasure) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    if (isTreasure) {
      [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
      g.gain.setValueAtTime(.09, a.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    } else {
      o.frequency.setValueAtTime(660, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, a.currentTime + .15);
      g.gain.setValueAtTime(.07, a.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .4);
    }
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.1);
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

