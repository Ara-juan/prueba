/* Galería Estilo Pinterest
 * Cuadrícula masonry pastel con hover suave y modales elegantes para cada "pin" de cariño.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pinterest pastel: masonry con CSS columns + modal detallado + botón guardar. */
'use strict';
const PINS = [
  ['🌻', 'Tu risa', 'La mejor descubrimiento de esta temporada. Lo pinneo cada día.'],
  ['☕', 'Tardes lentas', 'Combinación perfecta: tú, un café y cero prisa.'],
  ['🌙', 'Conversaciones nocturnas', 'Ideas brillantes ocurren contigo a las 2 a.m.'],
  ['🌊', 'El mar de nuestros planes', 'Tablero de sueños: la próxima ola la surfteamos juntos.'],
  ['🍰', 'Recetas de la felicidad', 'Ingredientes: tu compañía. Procedimiento: repetir siempre.'],
  ['📚', 'Recomendaciones del alma', 'Libros que leo pensando "a ti le gustaría esto".'],
  [' spotify', '🎵', 'Nuestra playlist', 'Vibe comprobado: mejora cualquier trayecto en un 200%.'],
  ['🌱', 'Cosas que crecen', 'Como lo nuestro: con luz, agua y muchos cuidados.'],
  ['🎨', 'Colores que me recuerdan a ti', 'Paleta cálida, con toques de sorpresa y un dorado especial.'],
  ['📸', 'Momentos en cámara lenta', 'Los mejores segundos del año, reproducidos en bucle.'],
  ['💌', 'Mensajes guardados', 'Capturas que jamás borraré: tu forma de escribirme.'],
  ['⭐', 'Futuro cercano', 'Boceto de planes: más aventuras, más risas, más nosotros.']
];
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');

PINS.forEach(function (p) {
  const emoji = p[0] === ' spotify' ? p[1] : p[0];
  const title = p[0] === ' spotify' ? p[2] : p[1];
  const text = p[0] === ' spotify' ? p[3] : p[2];
  const card = document.createElement('article');
  card.className = 'pin';
  card.innerHTML = '<div class="visual">' + emoji + '</div><button class="save">Guardar</button><div class="txt"><b>' + title + '</b><span>Tablero: "Cosas buenas"</span></div>';
  card.addEventListener('click', function (e) {
    if (e.target.classList.contains('save')) return;
    document.getElementById('mVisual').textContent = emoji;
    document.getElementById('mVisual').style.background = card.querySelector('.visual').style.background || getComputedStyle(card.querySelector('.visual')).backgroundColor;
    document.getElementById('mTitle').textContent = title;
    document.getElementById('mText').textContent = text;
    modal.classList.add('show');
  });
  card.querySelector('.save').addEventListener('click', function (e) {
    e.stopPropagation();
    const b = e.currentTarget;
    b.classList.add('saved');
    b.textContent = '♥ Guardado';
    pop();
  });
  grid.appendChild(card);
});
document.getElementById('mClose').addEventListener('click', function () { modal.classList.remove('show'); pop(); });
modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('show'); });
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 780;
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

