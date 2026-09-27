/* Antología de Poemas
 * Interfaz minimalista: elige un marcapáginas y el poema cambia junto con su estilo tipográfico.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Antología: cada marcapáginas trae su poema y su propia tipografía/paleta. */
'use strict';
const POEMS = [
  {
    title: 'Soneto de lo cotidiano',
    lines: 'No es la luna lo que me enamora:\nes tu risa a deshora en la mañana,\nel café que se enfría mientras charlamos\ny la nada que contigo es algo ahora.',
    author: '— Versos clásicos, corazón moderno',
    font: 'Georgia, serif', bg: '#faf8f4', ink: '#2a2620', accent: '#8a3a3a'
  },
  {
    title: 'Haiku del atardecer',
    lines: 'Luz entre los dos —\nel día aprende a despedirse\npara volver contigo.',
    author: '— Tres líneas que caben en la mano',
    font: "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif", bg: '#f5f2ea', ink: '#33403a', accent: '#3a6b5d'
  },
  {
    title: 'Caligrama de un abrazo',
    lines: '    entre   tus   brazos\n        el  mundo\n      cabe  entero,\n   y sobra  espacio\n para un "quédate".',
    author: '— Dibujado con palabras',
    font: "'Courier New', monospace", bg: '#f4f1fa', ink: '#3a2a4a', accent: '#5d3a8a'
  },
  {
    title: 'Oda a tu risa',
    lines: 'Oh risa mía, campana sin torre,\nme llama sin costar moneda alguna:\nla suerte de escucharte es tan grande\nque pagan por ella los días grises.',
    author: '— Condecorada con aplausos internos',
    font: "'Palatino Linotype', 'Book Antiqua', Georgia, serif", bg: '#faf4ec', ink: '#4a3a20', accent: '#b06a2a'
  },
  {
    title: 'Elegía (invertida)',
    lines: 'No llores lo que pasa:\ncelebra lo que quedó.\nY de todo lo que queda,\ntú eres lo que quiero yo.',
    author: '— Para despedir los días malos',
    font: 'Georgia, serif', bg: '#f0f2f4', ink: '#26303a', accent: '#3a5d8a'
  }
];
const marksEl = document.getElementById('marks');
const poemEl = document.getElementById('poem');
let current = -1;

POEMS.forEach(function (p, i) {
  const b = document.createElement('button');
  b.className = 'mark';
  b.innerHTML = '<i style="--c:' + p.accent + '">' + (i + 1) + '</i>';
  b.addEventListener('click', function () { select(i); });
  marksEl.appendChild(b);
});

function select(i) {
  if (i === current) return;
  current = i;
  [...marksEl.children].forEach(function (m, j) { m.classList.toggle('active', j === i); });
  const p = POEMS[i];
  poemEl.classList.add('switching');
  setTimeout(function () {
    document.getElementById('pTitle').textContent = p.title;
    document.getElementById('pLines').textContent = p.lines;
    document.getElementById('pAuthor').textContent = p.author;
    poemEl.style.fontFamily = p.font;
    document.getElementById('pTitle').style.color = p.accent;
    document.body.style.background = p.bg;
    document.body.style.color = p.ink;
    poemEl.classList.remove('switching');
  }, 480);
  pageTurn();
}

function pageTurn() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .15;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
    const g = a.createGain(); g.gain.value = .09;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
/* Flechas para navegar los poemas */
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') select((current + 1) % POEMS.length);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') select((current - 1 + POEMS.length) % POEMS.length);
});
select(0);
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

