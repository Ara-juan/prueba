/* Colección Prensado Botánico
 * Álbum de enciclopedia: gira las fichas de especimenes prensados para leer los pensamientos.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Herbario: fichas volteables con SVG de especimenes prensados y pensamientos. */
const grid = document.getElementById('grid');
const SPECIMENS = [
  ['Trébol de cuatro hojas', 'Trifolium repens', 'La suerte ya me encontró: se llama como tú.'],
  ['Girasol', 'Helianthus annuus', 'Aprendí de él a girar siempre hacia lo que ilumina.'],
  ['Lavanda', 'Lavandula angustifolia', 'Tu calma vale más que mil campos en flor.'],
  ['Helecho', 'Pteridium aquilinum', 'Resiste mil eras; nosotros también.'],
  ['Romero', 'Salvia rosmarinus', 'Para el recuerdo: hojita a hojita, día a día.'],
  ['Amapola', 'Papaver rhoeas', 'Breve y brillante, como los mejores días.']
];

/* SVG prensado por especie: tallo + hojas simples, estilo lámina científica */
function specimenSVG(i) {
  const strokes = ['#5d7a4a', '#7a6b3d', '#6b7a4a', '#4a6b5d', '#7a4a5d', '#a05038'];
  const c = strokes[i % strokes.length];
  const shapes = [
    '<path d="M40,10 C46,60 42,110 40,150 M40,40 C24,34 16,22 14,10 M40,40 C56,34 64,22 66,10 M40,75 C22,68 14,56 12,44 M40,75 C58,68 66,56 68,44 M40,110 C24,104 16,94 14,82 M40,110 C56,104 64,94 66,82"/>',
    '<path d="M40,150 L40,20 M40,20 C22,30 20,48 40,40 C60,48 58,30 40,20 M40,50 C24,58 22,74 40,66 C58,74 56,58 40,50 M40,80 C26,88 24,102 40,94 C56,102 54,88 40,80"/>',
    '<path d="M40,150 L40,30 M40,30 L24,48 M40,30 L56,48 M40,55 L20,76 M40,55 L60,76 M40,80 L24,102 M40,80 L56,102"/>',
    '<path d="M40,150 C36,110 44,70 40,20 M40,45 C30,40 26,30 28,22 M40,45 C50,40 54,30 52,22 M40,80 C28,76 22,66 24,56 M40,80 C52,76 58,66 56,56 M40,115 C30,112 26,104 28,96 M40,115 C50,112 54,104 52,96"/>',
    '<path d="M40,150 L40,20 M40,30 C30,44 30,58 40,66 C50,58 50,44 40,30 M40,70 C30,84 30,98 40,106 C50,98 50,84 40,70 M40,110 C32,120 32,132 40,138 C48,132 48,120 40,110"/>',
    '<path d="M40,150 L40,26 M40,26 C24,30 16,44 20,58 C30,54 38,42 40,26 M40,26 C56,30 64,44 60,58 C50,54 42,42 40,26 M40,60 C28,66 22,80 26,92 C34,86 40,74 40,60"/>'
  ];
  return '<svg class="press" width="120" height="170" viewBox="0 0 80 160" fill="none" aria-hidden="true">'
    + '<path d="' + shapes[i % shapes.length] + '" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round"/></svg>';
}

SPECIMENS.forEach(function (s, i) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML =
    '<div class="card-inner">'
    + '<div class="face front">'
    + '<span class="no">Nº ' + String(i + 1).padStart(2, '0') + '</span>'
    + specimenSVG(i)
    + '<h2>' + s[0] + '</h2>'
    + '<div class="latin">' + s[1] + '</div>'
    + '</div>'
    + '<div class="face back">'
    + '<span class="stamp">Pensamiento</span>'
    + '<p class="thought">' + s[2] + '</p>'
    + '</div>'
    + '</div>';
  card.addEventListener('click', function () { card.classList.toggle('flipped'); });
  grid.appendChild(card);
});
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

