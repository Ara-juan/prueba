/* Manga Reader Interactivo
 * Viñetas en blanco y negro con paso de página efecto flip y un final dibujado para ti.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Manga: páginas con viñetas B/N, flash blanco y giro 3D al pasar hoja. */
'use strict';
const book = document.getElementById('book');
const pgnum = document.getElementById('pgnum');

/* Contenido de las 4 páginas */
const PAGES = [
  [
    { panel: 'tall', sfx: 'Zzz…', caption: 'Un martes cualquiera, en una habitación cualquiera…', emoji: '🛏️', note: 'alguien despertó con una idea' },
    { panel: '', sfx: '¡PLINK!', caption: 'La idea era simple: hacer sonreír a alguien especial.', emoji: '💡' }
  ],
  [
    { panel: 'tall', sfx: 'MODO MANGAKA ON', caption: 'Así que pasó horas dibujando… con el corazón.', emoji: '✍️' },
    { panel: '', sfx: 'FFFF', caption: 'Borrador tras borrador…', emoji: '🌀' }
  ],
  [
    { panel: 'tall', sfx: '¡TA-DÁ!', caption: 'El resultado: esta pequeña historia para ti.', emoji: '📖' },
    { panel: '', sfx: '…', caption: '¿Y sabes qué fue lo más difícil?', emoji: '🤔' }
  ],
  [
    { panel: 'tall', sfx: 'FIN ♥', caption: 'Expresar en viñetas lo mucho que vales.', emoji: '❤️' },
    { panel: '', sfx: '¡GRACIAS POR EXISTIR!', caption: '— Fin del capítulo 1 — (Habrá más, porque tú vales capítulos enteros.)', emoji: '✨' }
  ]
];
let current = 0;

function buildPage(items) {
  const page = document.createElement('div');
  page.className = 'page';
  const content = document.createElement('div');
  content.className = 'content';
  items.forEach(function (it) {
    const panel = document.createElement('div');
    panel.className = 'panel' + (it.panel ? ' tall' : '');
    panel.innerHTML =
      '<div class="halftone"></div>'
      + '<div style="font-size:2.6rem;filter:grayscale(1) contrast(1.2)">' + it.emoji + '</div>'
      + '<div class="sfx outline">' + it.sfx + '</div>'
      + (it.note ? '<div class="sfx" style="right:10px;top:10px;font-size:1rem;transform:rotate(6deg)">' + it.note + '</div>' : '')
      + '<div class="caption">' + it.caption + '</div>'
      + (it.panel ? '<div class="speed"></div>' : '');
    content.appendChild(panel);
  });
  page.appendChild(content);
  return page;
}

/* Páginas apiladas: la última abajo */
for (let i = PAGES.length - 1; i >= 0; i--) book.appendChild(buildPage(PAGES[i]));

function updateNum() { pgnum.textContent = (current + 1) + ' / ' + PAGES.length; }

/* Flash blanco de transición estilo manga */
const flash = document.createElement('div');
flash.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .12s;z-index:50';
document.body.appendChild(flash);

function go(dir) {
  const pages = book.children;
  if (dir > 0 && current < PAGES.length - 1) {
    flash.style.opacity = '.9';
    setTimeout(function () { flash.style.opacity = '0'; }, 130);
    pages[current].classList.add('turned');
    current++;
  } else if (dir < 0 && current > 0) {
    current--;
    pages[current].classList.remove('turned');
  }
  updateNum();
}
document.getElementById('next').addEventListener('click', function () { go(1); });
document.getElementById('prev').addEventListener('click', function () { go(-1); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.code === 'Space') { e.preventDefault(); go(1); }
  if (e.key === 'ArrowLeft') go(-1);
});
updateNum();
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

