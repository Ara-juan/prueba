/* Reproductor Estilo Spotify
 * Barra de progreso funcional, portada giratoria y letras sincronizadas: "Nuestra Canción".
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Reproductor: progreso funcional, letras sincronizadas por tiempo y audio generativo. */
'use strict';
const LYRICS = [
  [0, 'La primera vez que te vi…'],
  [6, 'supe que esta canción iba de ti'],
  [13, 'Y cada verso que escribo'],
  [19, 'se equivoca de tema y habla de ti otra vez'],
  [27, 'Porque eres el estribillo'],
  [33, 'que no quiero que termine jamás'],
  [41, 'Nuestra canción no necesita radio'],
  [48, 'suena cada vez que estás. ♥']
];
const DUR = 56;                                       // segundos "de la canción"
const player = document.getElementById('player');
const fill = document.getElementById('fill');
const bar = document.getElementById('bar');
const cur = document.getElementById('cur');
const playBtn = document.getElementById('play');
const lyricsEl = document.getElementById('lyrics');
let t = 0, playing = false, liked = false, ac = null;

/* Render de letras */
LYRICS.forEach(function (l) {
  const d = document.createElement('div');
  d.className = 'line';
  d.textContent = l[1];
  lyricsEl.appendChild(d);
});
function updateLyrics() {
  let active = 0;
  LYRICS.forEach(function (l, i) { if (t >= l[0]) active = i; });
  [...lyricsEl.children].forEach(function (el, i) { el.classList.toggle('active', i === active); });
  /* Scroll suave hacia la línea activa */
  if (lyricsEl.children[active]) {
    lyricsEl.scrollTo({ top: lyricsEl.children[active].offsetTop - lyricsEl.clientHeight / 3, behavior: 'smooth' });
  }
}
function fmt(s) { return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }

setInterval(function () {
  if (!playing) return;
  t = (t + .25) % DUR;
  cur.textContent = fmt(t);
  fill.style.width = (t / DUR * 100) + '%';
  updateLyrics();
  /* Música: nota cada intervalo acorde al progreso */
  if (Math.abs(t % 1) < .25) playNote();
}, 250);

function playNote() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const MELODY = [392, 440, 494, 587, 523, 494, 440, 392];
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = MELODY[Math.floor(t / 2) % MELODY.length];
    g.gain.setValueAtTime(.05, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .6);
    o.connect(g).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + .65);
  } catch (e) { /* opcional */ }
}
playBtn.addEventListener('click', function () {
  playing = !playing;
  player.classList.toggle('playing', playing);
  playBtn.textContent = playing ? '❚❚' : '▶';
  if (playing) playNote();
});
bar.addEventListener('click', function (e) {
  const r = bar.getBoundingClientRect();
  t = (e.clientX - r.left) / r.width * DUR;
  cur.textContent = fmt(t);
  fill.style.width = (t / DUR * 100) + '%';
  updateLyrics();
});
document.getElementById('prev').addEventListener('click', function () { t = 0; });
document.getElementById('next').addEventListener('click', function () { t = 0; });
document.getElementById('shuffle').addEventListener('click', function () { t = Math.random() * DUR; updateLyrics(); });
document.getElementById('repeat').addEventListener('click', function () { t = 0; });
document.getElementById('like').addEventListener('click', function () {
  liked = !liked;
  this.textContent = liked ? '💚' : '🤍';
  this.classList.toggle('liked', liked);
});
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

