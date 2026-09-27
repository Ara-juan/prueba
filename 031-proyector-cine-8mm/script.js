/* Proyector de Cine 8mm
 * Diapositivas de fotos con grano de película, saltos de rollo y el traqueteo del proyector.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Proyector 8mm: carrusel de diapositivas con grano, traqueteo y sonido de proyector. */
'use strict';
const slidesEl = document.getElementById('slides');
const wrap = document.getElementById('screenWrap');

const SLIDES = [
  ['🎥', 'Nuestra Función Privada', 'Bienvenido/a a la única película donde todas las escenas son favoritas.'],
  ['🌅', 'Escena 1: El primer día', 'Recuerda esa mirada de "¿y este/a quién es?"… ya sabes cómo termina la historia.'],
  ['🎢', 'Escena 2: La aventura', 'Donde planeábamos algo simple y terminamos con una historia épica.'],
  ['🍜', 'Escena 3: La sobremesa', 'Tres horas de mesa, risas y "solo una anécdota más".'],
  ['🌧️', 'Escena 4: El día difícil', 'Ahí descubrí que tu hombro es el mejor lugar del mundo.'],
  ['❤️', 'Escena final: Todas las que faltan', 'Continuará… mientras tú sigas siendo mi persona favorita.']
];
let idx = 0, playing = true;

SLIDES.forEach(function (s) {
  const d = document.createElement('div');
  d.className = 'slide';
  d.innerHTML = '<div class="photo">' + s[0] + '</div><h2>' + s[1] + '</h2><p>' + s[2] + '</p>';
  slidesEl.appendChild(d);
});
const slides = [...slidesEl.children];
function show(i) {
  slides.forEach(function (sl, j) { sl.classList.toggle('on', j === i); });
}
show(0);

/* Carrusel automático con "salto de fotograma" */
setInterval(function () {
  if (!playing) return;
  idx = (idx + 1) % slides.length;
  show(idx);
  clack();
}, 3400);

/* Sonido de proyector: traqueteo con ruido filtrado */
let ac = null, noiseOn = false, noiseSrc = null;
function ensureAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const len = ac.sampleRate * 2;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseSrc = ac.createBufferSource();
    noiseSrc.buffer = buf; noiseSrc.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 480; filter.Q.value = .6;
    const g = ac.createGain(); g.gain.value = 0;
    noiseSrc.connect(filter).connect(g).connect(ac.destination);
    noiseSrc.start();
    noiseSrc._gain = g;
    /* LFO para traqueteo */
    const lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.type = 'square'; lfo.frequency.value = 9;
    lg.gain.value = .012;
    lfo.connect(lg).connect(g.gain);
    lfo.start();
  } catch (e) { /* opcional */ }
}
function clack() {
  try {
    ensureAudio();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = 90 + Math.random() * 40;
    g.gain.setValueAtTime(.05, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .07);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .07);
  } catch (e) { /* opcional */ }
}

const toggleBtn = document.getElementById('toggle');
toggleBtn.addEventListener('click', function () {
  playing = !playing;
  toggleBtn.textContent = playing ? '❚❚ Pausar' : '▶ Reproducir';
  wrap.classList.toggle('flicker', playing);
  ensureAudio();
  if (noiseSrc) noiseSrc._gain.gain.value = playing ? .02 : 0;
});
document.getElementById('next').addEventListener('click', function () { idx = (idx + 1) % slides.length; show(idx); clack(); });
document.getElementById('prev').addEventListener('click', function () { idx = (idx - 1 + slides.length) % slides.length; show(idx); clack(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') { idx = (idx + 1) % slides.length; show(idx); clack(); }
  if (e.key === 'ArrowLeft') { idx = (idx - 1 + slides.length) % slides.length; show(idx); clack(); }
});
/* Activar sonido con el primer gesto (política de autoplay) */
document.addEventListener('pointerdown', function once() {
  ensureAudio();
  if (noiseSrc) noiseSrc._gain.gain.value = playing ? .02 : 0;
  document.removeEventListener('pointerdown', once);
}, { once: true });
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

