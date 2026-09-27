/* Tiras de Fotogramas Vintage
 * Rollos de película que se deslizan horizontalmente con paralaje: cada fotograma es un recuerdo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tiras de fotogramas con paralaje: el cursor desplaza cada tira a distinta velocidad. */
'use strict';
const STRIP_DATA = [
  ['🌅', 'El amanecer que nos sorprendió despiertos', '001A'],
  ['🎡', 'La feria y su algodón de azúcar', '002A'],
  ['☕', 'Mañanas lentas, café rápido', '003A'],
  ['🌊', 'El mar escuchando nuestros secretos', '004A'],
  ['🎬', 'La película que recitamos de memoria', '005A'],
  ['🍕', 'Viernes de sobremesa infinita', '006A']
];
const STRIP_DATA2 = [
  ['🎵', 'La canción que se volvió nuestra', '011B'],
  ['🚗', 'Rutas sin mapa', '012B'],
  ['📚', 'Silencios compartidos leyendo', '013B'],
  ['🌧️', 'Bailando bajo la lluvia (sin querer)', '014B'],
  ['🌟', 'La noche de las estrellas fugaces', '015B'],
  ['🎂', 'El deseo que ya se cumplió', '016B']
];
const STRIP_DATA3 = [
  ['📷', 'Clic fortuito, sonrisa eterna', '021C'],
  ['🍂', 'Otoño dorado', '022C'],
  ['🎨', 'El cuadro que pintamos sin saber', '023C'],
  ['🏔️', 'La cima y el aliento corto', '024C'],
  ['💌', 'Esta carta, hoy', '025C']
];

function fillStrip(id, data) {
  const frames = document.querySelector('#' + id + ' .frames');
  data.forEach(function (d) {
    const f = document.createElement('div');
    f.className = 'frame';
    f.innerHTML = '<span class="num">' + d[2] + '</span><span class="emoji">' + d[0] + '</span><p>' + d[1] + '</p>';
    frames.appendChild(f);
  });
}
fillStrip('s1', STRIP_DATA);
fillStrip('s2', STRIP_DATA2);
fillStrip('s3', STRIP_DATA3);

/* Paralaje: normalizado -0.5 → 0.5 según posición del puntero */
const strips = [
  { el: document.getElementById('s1'), factor: -70, offset: 0 },
  { el: document.getElementById('s2'), factor: -130, offset: -120 },
  { el: document.getElementById('s3'), factor: -45, offset: -60 }
];
let targetX = 0, currentX = 0;

addEventListener('pointermove', function (e) {
  targetX = (e.clientX / innerWidth - .5) * 2;       // -1 → 1
});
/* También con arrastre táctil */
let touchStartX = 0;
addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
addEventListener('touchmove', function (e) {
  const dx = e.touches[0].clientX - touchStartX;
  targetX = Math.max(-1, Math.min(1, dx / (innerWidth * .35)));
}, { passive: true });

(function animate() {
  currentX += (targetX - currentX) * .06;            // suavizado del paralaje
  strips.forEach(function (s) {
    s.el.style.transform = 'translateX(' + (s.offset + currentX * s.factor) + 'px)';
  });
  requestAnimationFrame(animate);
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

