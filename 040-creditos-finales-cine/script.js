/* Créditos Finales de Cine
 * Rollo ascendente estilo película con menciones especiales y música emotiva de fondo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Créditos finales: rollo ascendente, música emotiva generativa y reinicio con clic. */
'use strict';
const credits = document.getElementById('credits');

/* Reinicio al hacer clic */
credits.addEventListener('animationend', function () {
  credits.style.animation = 'none'; void credits.offsetWidth;
  credits.style.animation = '';
});

/* Música emotiva: progresión de acordes con Web Audio API */
let ac = null, musicOn = false, musicTimer = null;
const CHORDS = [
  [220.00, 277.18, 329.63],   // Am
  [246.94, 311.13, 369.99],   // Bm
  [196.00, 246.94, 293.66],   // G
  [174.61, 220.00, 261.63]    // F
];
let chordIdx = 0;
function playChord() {
  if (!musicOn || !ac) return;
  const now = ac.currentTime;
  CHORDS[chordIdx % CHORDS.length].forEach(function (f, i) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.001, now);
    g.gain.exponentialRampToValueAtTime(.045, now + .4);
    g.gain.exponentialRampToValueAtTime(.0001, now + 3.4);
    o.connect(g).connect(ac.destination);
    o.start(now + i * .06); o.stop(now + 3.6);
  });
  /* Melodía superior suave */
  const melody = [523.25, 587.33, 659.25, 493.88];
  const o2 = ac.createOscillator(), g2 = ac.createGain();
  o2.type = 'triangle'; o2.frequency.value = melody[chordIdx % melody.length];
  g2.gain.setValueAtTime(.001, now + .8);
  g2.gain.exponentialRampToValueAtTime(.05, now + 1);
  g2.gain.exponentialRampToValueAtTime(.0001, now + 3);
  o2.connect(g2).connect(ac.destination);
  o2.start(now + .8); o2.stop(now + 3.2);
  chordIdx++;
}
function toggleMusic() {
  musicOn = !musicOn;
  if (musicOn) {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    playChord();
    musicTimer = setInterval(playChord, 3600);
  } else {
    clearInterval(musicTimer);
  }
}
document.addEventListener('click', toggleMusic);
document.addEventListener('keydown', function (e) { if (e.key.toLowerCase() === 'm') toggleMusic(); });
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

