/* Trivia de Nuestra Película
 * Cuestionario con opciones múltiples sobre los hitos de la relación: ¡todas las respuestas cuentan!
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Trivia: cada respuesta suma y revela una escena; el final siempre es un 100% amoroso. */
'use strict';
const card = document.getElementById('card');
const scoreEl = document.getElementById('score');
const bar = document.getElementById('bar');

const QUESTIONS = [
  {
    q: '¿Cuál fue la mejor escena de nuestra historia (hasta ahora)?',
    options: ['Cuando nos conocimos', 'Nuestra primera aventura', 'Todas las anteriores', 'La que viene'],
    all: true,
    note: 'Respuesta correcta: TODAS. Y las que faltan prometen ser épicas. 🎬'
  },
  {
    q: '¿Quién se ríe primero en nuestros chistes internos?',
    options: ['Yo, obviamente', 'Tú, obviamente', 'Los dos a la vez', 'El chiste, del nervio'],
    all: true,
    note: 'Correcto: los dos a la vez. Sincronización nivel: telenovela. 😂'
  },
  {
    q: '¿Cuál es el ingrediente secreto de nuestros mejores días?',
    options: ['Buena música', 'Comida rica', 'Planificación perfecta', 'Estar juntos'],
    all: true,
    note: 'Spoiler: es la última opción (aunque la música ayuda muchísimo). ✨'
  },
  {
    q: '¿Qué rating le damos a esta amistad/relación?',
    options: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐ con palomitas', '5 estrellas y un maratón', 'Todas las anteriores'],
    all: true,
    note: 'Crítica especializada (yo): "Obra maestra. Deseando el segundo capítulo." 🏆'
  }
];
let current = 0, score = 0;

function render() {
  const item = QUESTIONS[current];
  card.innerHTML =
    '<div class="q-num">Escena ' + (current + 1) + ' de ' + QUESTIONS.length + '</div>'
    + '<h2 class="question">' + item.q + '</h2>'
    + '<div class="options" id="options"></div>'
    + '<p class="note" id="note"></p>'
    + '<button class="next" id="nextBtn">' + (current === QUESTIONS.length - 1 ? 'Ver resultado final 🏆' : 'Siguiente escena ▶') + '</button>';
  const options = card.querySelector('#options');
  item.options.forEach(function (opt, i) {
    const b = document.createElement('button');
    b.className = 'option';
    b.textContent = opt;
    b.addEventListener('click', function () { answer(b, item); });
    options.appendChild(b);
  });
  bar.style.width = (current / QUESTIONS.length * 100) + '%';
  card.querySelector('#nextBtn').addEventListener('click', function () {
    current++;
    if (current < QUESTIONS.length) render(); else renderFinal();
  });
}

function answer(btn, item) {
  /* Cualquier opción es válida: la peli es nuestra */
  [...card.querySelectorAll('.option')].forEach(function (o) { o.classList.add('correct'); });
  score += 25;
  scoreEl.textContent = 'Puntos: ' + score;
  card.querySelector('#note').textContent = item.note;
  card.querySelector('#nextBtn').classList.add('show');
  pop();
}

function renderFinal() {
  bar.style.width = '100%';
  card.innerHTML =
    '<div class="final">'
    + '<div class="big">¡100% 🏆!</div>'
    + '<h2 class="question">Has completado "Nuestra Película"</h2>'
    + '<p>Puntuación final: <b>' + score + '/100</b> — el máximo posible, claro.<br>Porque cualquier respuesta era correcta: la mejor parte de esta historia eres tú.</p>'
    + '<button class="again" id="again">Volver a verla 🔁</button>'
    + '</div>';
  fanfare();
  card.querySelector('#again').addEventListener('click', function () {
    current = 0; score = 0;
    scoreEl.textContent = 'Puntos: 0';
    render();
  });
}

function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(660, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(990, a.currentTime + .12);
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .3);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .3);
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
render();
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

