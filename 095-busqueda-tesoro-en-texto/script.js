/* Búsqueda del Tesoro en Texto
 * Carta con letras brillantes escondidas: haz clic en el orden correcto y forma la frase secreta.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Búsqueda del tesoro: letras marcadas en orden forman la frase secreta. */
'use strict';
const SECRET = 'TEQUIERO';
/* Texto con las letras secretas marcadas: [letra, esSecreta] */
const TEXT = [
  ['T', 1], ['odo empezó un día cualquiera, ', 0],
  ['E', 1], ['ntre risas y cafés descubrí que la vida ', 0],
  ['Q', 1], ['uiere sorprenderme: te puso a ti en mi camino. ', 0],
  ['U', 1], ['n mundo entero de personas, y justamente tú. ', 0],
  ['I', 1], ['mposible explicarlo con lógica: ', 0],
  ['E', 1], ['l corazón eligió antes que la cabeza. ', 0],
  ['R', 1], ['ecuerdas ese día gris que se volvió dorado? ', 0],
  ['I', 1], ['ba yo por la vida sin saber que faltaba algo. ', 0],
  ['O', 1], ['bviamente, lo que faltabas eras tú.']
];
const carta = document.getElementById('carta');
const foundBar = document.getElementById('foundBar');
const victory = document.getElementById('victory');
let progress = 0;

/* Construye la carta con spans clicables */
TEXT.forEach(function (seg) {
  const text = seg[0], isSecret = seg[1] === 1;
  const span = document.createElement('span');
  span.textContent = text;
  if (isSecret) {
    span.className = 'l secret';
    span.dataset.expected = SECRET[progress];          // la primera letra correcta aún no hallada
    span.dataset.char = text;
    span.addEventListener('click', onSecretClick);
  } else {
    span.className = 'l';
  }
  carta.appendChild(span);
});
/* Nota: la primera letra secreta de cada segmento es la que vale.
   Marcamos con dataset qué índice de la frase representa: usamos el orden */
const secretSpans = [...carta.querySelectorAll('.secret')];
secretSpans.forEach(function (s, i) {
  s.dataset.order = i;                                 // orden correcto = posición en la frase secreta
  delete s.dataset.expected;
});

function onSecretClick(e) {
  const s = e.currentTarget;
  if (s.classList.contains('found') || done()) return;
  const idx = Number(s.dataset.order);
  if (idx === progress) {
    /* ¡Correcto! */
    s.classList.add('found');
    s.style.pointerEvents = 'none';
    renderBar();
    progress++;
    ding(600 + progress * 40);
    if (progress === SECRET.length) setTimeout(win, 500);
  } else {
    /* Incorrecto: sacudida breve */
    s.classList.add('wrong');
    buzz();
    setTimeout(function () { s.classList.remove('wrong'); }, 450);
    /* No penaliza el progreso: solo feedback */
  }
}
function done() { return progress >= SECRET.length; }
function renderBar() {
  foundBar.innerHTML = '';
  for (let i = 0; i < SECRET.length; i++) {
    const c = document.createElement('span');
    if (i < progress) { c.textContent = SECRET[i]; }
    else { c.textContent = '·'; c.className = 'pending'; }
    foundBar.appendChild(c);
  }
}
function win() {
  victory.classList.add('show');
  fanfare();
}
function ding(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .3);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .3);
  } catch (e) { /* opcional */ }
}
function buzz() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 130;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .16);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .16);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
  } catch (e) { /* opcional */ }
}
renderBar();
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

