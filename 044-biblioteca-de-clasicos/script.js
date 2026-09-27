/* Biblioteca de Clásicos
 * Elige un lomo de la estantería: el libro se extrae y se abre en su capítulo dedicado.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Biblioteca: lomos interactivos; al elegir uno se "extrae" y abre su capítulo. */
'use strict';
const shelf = document.getElementById('shelf');
const reader = document.getElementById('reader');

const BOOKS = [
  ['Cien Años de Nuestros Chistes', 'Capítulo único: risa compartida', 'Había una vez un chiste interno tan bueno que decidimos contarlo mil veces, y cada vez fue como la primera.', ['#7a3a2a', '#5d2a1e']],
  ['El Principito (Versión Nosotros)', 'Capítulo VII: lo esencial', 'Lo esencial no solo es invisible a los ojos: también es la persona que te escucha a las 2 a.m. sin juzgarte.', ['#2a4a6b', '#1e3650']],
  ['Orgullo y Prejuicio y Tú', 'Capítulo favorito: el diario', 'Es una verdad universalmente reconocida que cualquier día mejora con un mensaje tuyo a tiempo.', ['#4a5d2a', '#365026']],
  ['Moby Dick (Edición Corta)', 'Capítulo: persigue tus ballenas', 'Hay sueños tan grandes que dan miedo. Persíguelos igual: yo remaba contigo.', ['#5d2a4a', '#4a1e3a']],
  ['Don Quijote de la Amistad', 'Capítulo: los molinos', 'Luchamos contra molinos de viento ridículos juntos… y eso hizo que valiera la pena.', ['#6b5a2a', '#50421e']],
  ['Frankenstein (Pero Bonito)', 'Capítulo: creación', 'Creo que la amistad funciona igual que la ciencia: con paciencia, chispas y algo de locura.', ['#2a5d4a', '#1e503a']],
  ['Rayuela (Orden Recomendado)', 'Capítulo: el tablero', 'Leer contigo la vida es jugar la rayuela del corazón: saltando casillas, riéndonos de las reglas.', ['#5d4a2a', '#4a3a1e']],
  ['La Metamorfosis (Sin Bichos)', 'Capítulo: transformaciones', 'Un día desperté convertido en una persona más feliz. El culpable: haberte conocido.', ['#3a3a5d', '#2a2a4a']]
];
BOOKS.forEach(function (b, i) {
  const el = document.createElement('div');
  el.className = 'book3d';
  el.style.background = 'linear-gradient(90deg,' + b[4][0] + ' 0%,' + b[4][1] + ' 85%,#1a0f08 100%)';
  el.style.boxShadow = 'inset 3px 0 6px rgba(255,255,255,.15), 4px 0 8px rgba(0,0,0,.5)';
  el.title = b[0];
  el.innerHTML = '<span class="spine-txt">' + b[0] + '</span>';
  el.addEventListener('click', function () {
    document.querySelectorAll('.book3d').forEach(function (x) { x.classList.remove('chosen'); });
    el.classList.add('chosen');
    openBook(b);
  });
  shelf.appendChild(el);
});

function openBook(b) {
  document.getElementById('rTitle').textContent = b[0];
  document.getElementById('rChapter').textContent = b[1];
  document.getElementById('rBody').innerHTML =
    '<p>' + b[2] + '</p>'
    + '<p><i>Y como en todo clásico que se precie, esta historia no envejece: se releen sus páginas cada vez que estamos juntos, y siempre encuentra la manera de sorprender.</i></p>'
    + '<p style="text-align:right;font-family:\'Segoe Script\',cursive;font-size:1.1rem">— Dedicatoria secreta ♥</p>';
  reader.classList.add('show');
  openSound();
}
document.getElementById('rClose').addEventListener('click', function () {
  reader.classList.remove('show');
  document.querySelectorAll('.book3d').forEach(function (x) { x.classList.remove('chosen'); });
});
reader.addEventListener('click', function (e) { if (e.target === reader) document.getElementById('rClose').click(); });

function openSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .2;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .7;
    const g = a.createGain(); g.gain.value = .18;
    src.connect(f).connect(g).connect(a.destination); src.start();
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

