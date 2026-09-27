/* Test de Compatibilidad (Siempre 100%)
 * Cuestionario tipo revista con animación de medición y resultado garantizado: 100%
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Test de compatibilidad: cualquier respuesta lleva al 100% con veredicto tierno. */
'use strict';
/* DEDIC: el test se presenta a la persona del link compartido */
(function () {
  if (window.DEDIC && (DEDIC.para !== 'Ti' || DEDIC.msg)) {
    var sub = document.querySelector('.sub');
    if (sub) sub.textContent = 'Análisis de compatibilidad preparado para ' + DEDIC.para + (DEDIC.msg ? ' — ' + DEDIC.msg : '');
  }
})();
const QUESTIONS = [
  { q: '¿Cómo reaccionas cuando esa persona te escribe?', o: ['Sonrío como idiota', 'Respondo al instante', 'Leo el mensaje 4 veces', 'Todas las anteriores'] },
  { q: '¿Qué plan suena mejor para un sábado?', o: ['Cualquiera, si va con esa persona', 'Películas y manta', 'Aventura improvisada', 'Ambos: primero película, luego aventura'] },
  { q: '¿Qué sientes al recordar sus risas?', o: ['Calor inmediato', 'Ganas de causar otra', 'Nostalgia bonita', 'Todo eso a la vez'] },
  { q: '¿Compatibilidad esperada con esa persona?', o: ['Alta, lo presiento', 'Media-alta', 'Off the charts', 'Prefiero que la calculen por mí'] }
];
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
let answered = 0, picked = [];

function render() {
  quiz.innerHTML = '';
  answered = 0; picked = [];
  result.classList.remove('show');
  QUESTIONS.forEach(function (item, qi) {
    const q = document.createElement('div');
    q.className = 'q';
    q.innerHTML = '<h2>' + (qi + 1) + '. ' + item.q + '</h2>';
    const opts = document.createElement('div');
    opts.className = 'opts';
    item.o.forEach(function (o, oi) {
      const b = document.createElement('button');
      b.className = 'opt';
      b.type = 'button';
      b.textContent = o;
      b.addEventListener('click', function () {
        q.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('picked'); });
        b.classList.add('picked');
        picked[qi] = oi;
        if (q.dataset.answered !== '1') { answered++; q.dataset.answered = '1'; }
        blip();
        if (answered === QUESTIONS.length) setTimeout(showResult, 500);
      });
      opts.appendChild(b);
    });
    q.appendChild(opts);
    quiz.appendChild(q);
  });
}
function showResult() {
  quiz.innerHTML = '';
  result.classList.add('show');
  /* Animación del medidor hasta 100% */
  const arc = document.getElementById('arc');
  const pct = document.getElementById('pct');
  arc.style.strokeDashoffset = '283';
  setTimeout(function () {
    arc.style.strokeDashoffset = '0';               // semicírculo completo = 100%
  }, 80);
  /* Contador animado */
  let n = 0;
  const iv = setInterval(function () {
    n = Math.min(100, n + 2);
    pct.textContent = n + '%';
    if (n >= 100) clearInterval(iv);
  }, 36);
  document.getElementById('verdict').innerHTML =
    'Resultados del laboratorio: compatibilidad <b>PERFECTA</b>.<br>Diagnóstico: insalvable. Receta: más tiempo juntos.<br><i>Nota del científico: el test estaba amañado desde el principio… a favor tuyo. ♥</i>';
  fanfare();
}
document.getElementById('again').addEventListener('click', render);
function blip() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 620 + Math.random() * 200;
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

