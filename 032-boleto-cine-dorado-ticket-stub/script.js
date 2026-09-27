/* Boleto de Cine Dorado
 * Entrada dorada con talón punteado: haz clic para rasgarla y pasar a la dedicatoria.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Boleto dorado: al rasgar, animación de talones + revelado de la dedicatoria. */
'use strict';
/* DEDIC: aplica nombre/fecha del link compartido al boleto */
(function () {
  if (window.DEDIC && (DEDIC.para !== 'Ti' || DEDIC.fecha || DEDIC.msg)) {
    var admit = document.querySelector('.admit');
    if (admit) admit.textContent = 'Admite a ' + DEDIC.para + (DEDIC.fecha ? ' · ' + DEDIC.fecha : '');
    var h1 = document.querySelector('.ticket h1');
    if (h1 && DEDIC.msg) h1.textContent = DEDIC.msg;
  }
})();
const ticket = document.getElementById('ticket');
const revealed = document.getElementById('revealed');
const hint = document.getElementById('hint');
let ripped = false;

function tear() {
  if (ripped) return;
  ripped = true;
  hint.style.display = 'none';
  ticket.classList.add('ripped');
  ripSound();
  setTimeout(function () {
    revealed.classList.add('show');
    fanfare();
  }, 700);
}
ticket.addEventListener('click', tear);
ticket.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') tear(); });

/* Sonido de papel rasgándose: ráfaga de ruido */
function ripSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .5;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      /* Ráfagas irregulares simulando el rasgado */
      d[i] = (Math.random() * 2 - 1) * (Math.sin(i * .02) > 0 ? 1 : .2) * (1 - i / len);
    }
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 900;
    const g = a.createGain(); g.gain.value = .22;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [392, 523, 659, 784].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .13); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
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

