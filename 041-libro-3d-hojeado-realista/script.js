/* Libro 3D Hojeable
 * Libro interactivo en CSS 3D: pasa las páginas con clics o flechas y lee las notas escritas a mano.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Libro 3D: páginas apiladas con giro CSS 3D real. */
'use strict';
const book = document.getElementById('book');

/* Contenido de las caras: [front, back] por hoja */
const LEAVES = [
  [
    '<div class="cover-page"><span>✦ ✦ ✦</span><b>Historias de Nosotros</b><span>Edición única e irrepetible</span><span style="margin-top:14px;font-size:2rem">📖</span></div>',
    '<div class="hand"><h2>Prólogo</h2><span class="dropcap">H</span>ay libros que se leen, y hay libros que se sienten. Este es el segundo tipo. Cada página guarda un instante que la memoria se negó a borrar.</div><div class="num">2</div>'
  ],
  [
    '<div class="hand"><h2>Capítulo I — El primer día</h2><span class="dropcap">N</span>ada hacía presagiar que un día cualquiera se convertiría en el inicio de mi historia favorita. Pero ahí estabas: sin saberlo, abriendo el primer capítulo.</div><div class="illu">☕</div><div class="num">3</div>',
    '<div class="hand">Y como en toda gran historia, hubo risas inoportunas, silencios cómodos y esa certeza extraña de haberse conocido antes, en algún otro tiempo.</div><div class="num">4</div>'
  ],
  [
    '<div class="hand"><h2>Capítulo II — Las aventuras</h2><span class="dropcap">S</span>i nos buscaran en el mapa, apareceríamos en cada camino equivocado que terminó siendo el correcto.</div><div class="illu">🗺️</div><div class="num">5</div>',
    '<div class="hand">Porque los mejores planes son los que se deshacen, y los mejores lugares, los que descubrimos perdidos de la mano.</div><div class="num">6</div>'
  ],
  [
    '<div class="hand"><h2>Capítulo III — Los días grises</h2><span class="dropcap">T</span>ambién hay capítulos nublados. Pero descubrí que tu voz es el paraguas más confiable de este mundo.</div><div class="illu">🌧️</div><div class="num">7</div>',
    '<div class="hand">Y aprendí que abrazar no borra la tormenta, pero la hace innecesariamente pequeña.</div><div class="num">8</div>'
  ],
  [
    '<div class="hand"><h2>Capítulo final — Todavía</h2><span class="dropcap">E</span>ste libro no termina: solo descansa. Las mejores historias se escriben a varias manos, a varios años, a varioslatte.</div><div class="illu">✨</div><div class="num">9</div>',
    '<div class="hand" style="text-align:center"><h2 style="text-align:center">Continuará…</h2>Mientras tú sigas aquí,<br>este libro seguirá escribiéndose.<br><br><b style="font-size:1.5rem">♥</b></div><div class="num">10</div>'
  ]
];

/* Construye las hojas: la primera hoja tiene cubierta al frente */
LEAVES.forEach(function (leaf, i) {
  const page = document.createElement('div');
  page.className = 'page';
  page.style.zIndex = String(LEAVES.length - i);
  page.innerHTML = '<div class="front">' + leaf[0] + '</div><div class="back">' + leaf[1] + '</div>';
  page.addEventListener('click', function (e) {
    /* Clic en mitad derecha → avanzar; mitad izquierda → retroceder */
    const r = page.getBoundingClientRect();
    if (e.clientX > r.left + r.width / 2) turn(1); else turn(-1);
  });
  book.appendChild(page);
});
const pages = [...book.querySelectorAll('.page')];
let current = 0;

function turn(dir) {
  if (dir > 0 && current < pages.length) {
    pages[current].classList.add('turned');
    pages[current].style.zIndex = String(pages.length + current);
    current++;
    pageSound();
  } else if (dir < 0 && current > 0) {
    current--;
    pages[current].classList.remove('turned');
    pages[current].style.zIndex = String(pages.length - current);
    pageSound();
  }
}
document.getElementById('next').addEventListener('click', function () { turn(1); });
document.getElementById('prev').addEventListener('click', function () { turn(-1); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') turn(1);
  if (e.key === 'ArrowLeft') turn(-1);
});

/* Susurro de página: ráfaga de ruido corto */
function pageSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .18;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2400;
    const g = a.createGain(); g.gain.value = .1;
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

