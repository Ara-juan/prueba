/* Cinta Cassette Mixtape
 * Escribe el título en la etiqueta, mira girar los carretes y déjate llevar por el lado B del cariño.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Cassette mixtape: título personalizado, carretes girando y música de fondo lo-fi. */
'use strict';
const tape = document.getElementById('tape');
const playBtn = document.getElementById('playBtn');
const titleInput = document.getElementById('titleInput');
const tracklist = document.getElementById('tracklist');
let playing = false, ac = null, timer = null;

/* Lista de temas que crece con el título personalizado */
titleInput.addEventListener('input', function () {
  const t = titleInput.value.trim();
  tracklist.textContent = t
    ? 'Track 01: ' + t + ' (∞) · Track 02: la canción que se volvió nuestra · Track 03: todos los demás solo hacen espera'
    : 'Track 01: tu risa (4:33) · Track 02: nuestras llamadas eternas (58:12) · Track 03: el silencio cómodo (∞)';
});

const CHORD = [261.63, 329.63, 392.00];
const MELODY = [523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 523.25, 392.00];
let step = 0;
function ensureAC() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* opcional */ } } }
function tick() {
  if (!playing) return;
  const now = ac.currentTime;
  /* Acolchado de acorde */
  if (step % 2 === 0) {
    CHORD.forEach(function (f) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = f / 2;
      g.gain.setValueAtTime(.03, now);
      g.gain.exponentialRampToValueAtTime(.0001, now + .9);
      o.connect(g).connect(ac.destination);
      o.start(now); o.stop(now + 1);
    });
  }
  /* Melodía suave */
  const o2 = ac.createOscillator(), g2 = ac.createGain();
  o2.type = 'sine'; o2.frequency.value = MELODY[step % MELODY.length];
  g2.gain.setValueAtTime(.06, now);
  g2.gain.exponentialRampToValueAtTime(.0001, now + .5);
  o2.connect(g2).connect(ac.destination);
  o2.start(now); o2.stop(now + .55);
  step++;
}
playBtn.addEventListener('click', function () {
  ensureAC();
  playing = !playing;
  tape.classList.toggle('playing', playing);
  playBtn.classList.toggle('on', playing);
  playBtn.textContent = playing ? '❚❚ PAUSE' : '▶ PLAY';
  if (playing) {
    ensureAC(); tick(); clearInterval(timer); timer = setInterval(tick, 420);
    hiss();
  } else {
    clearInterval(timer);
  }
});
document.getElementById('stopBtn').addEventListener('click', function () {
  playing = false;
  clearInterval(timer);
  tape.classList.remove('playing');
  playBtn.classList.remove('on');
  playBtn.textContent = '▶ PLAY';
});
/* Siseo analógico de fondo */
function hiss() {
  try {
    const len = ac.sampleRate * 2;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * .06;
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5000;
    const g = ac.createGain(); g.gain.value = .02;
    src.connect(f).connect(g).connect(ac.destination);
    src.start();
    const iv = setInterval(function () { if (!playing) { src.stop(); clearInterval(iv); } }, 500);
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

