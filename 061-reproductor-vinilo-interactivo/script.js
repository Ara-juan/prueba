/* Tocadiscos de Vinilo
 * Arrastra la aguja hacia el disco: el vinilo gira, suena la música y la portada es nuestra historia.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tocadiscos: la aguja se arrastra; sobre el disco → gira y suena melodía de vinilo. */
'use strict';
const deck = document.getElementById('deck');
const tonearm = document.getElementById('tonearm');
const status = document.getElementById('status');
let playing = false, ac = null, musicTimer = null;

/* Melodía lo-fi dulce en loop */
const NOTES = [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63, 293.66];
let step = 0;
function ensureAC() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* opcional */ } } }
function playNote() {
  if (!playing || !ac) return;
  const f = NOTES[step % NOTES.length];
  /* Vinilo: nota con un pelín de crujido */
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(.001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(.08, ac.currentTime + .04);
  g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 1.1);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + 1.2);
  step++;
}
function startMusic() {
  ensureAC();
  clearInterval(musicTimer);
  playNote();
  musicTimer = setInterval(playNote, 480);
}
function stopMusic() { clearInterval(musicTimer); }

/* Arrastre de la aguja */
let dragging = false, home = null;
tonearm.addEventListener('pointerdown', function (e) {
  dragging = true;
  home = tonearm.getBoundingClientRect();
  tonearm.setPointerCapture(e.pointerId);
});
tonearm.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  const deckR = deck.getBoundingClientRect();
  /* ¿Está el puntero sobre el vinilo? */
  const vx = deckR.left + deckR.width * .41, vy = deckR.top + deckR.height * .41, vr = deckR.width * .33;
  const overVinyl = Math.hypot(e.clientX - vx, e.clientY - vy) < vr;
  document.body.style.cursor = 'grabbing';
  if (overVinyl && !playing) drop(); else if (!overVinyl && playing) lift();
});
addEventListener('pointerup', function () {
  dragging = false;
  document.body.style.cursor = '';
});

function drop() {
  playing = true;
  deck.classList.add('playing');
  status.textContent = '♪ Sonando: «Cada segundo contigo»';
  startMusic();
  crackle();
}
function lift() {
  playing = false;
  deck.classList.remove('playing');
  status.textContent = 'Aguja en reposo — el silencio espera';
  stopMusic();
}
/* Crujido de vinilo: ruido con picos aleatorios */
function crackle() {
  try {
    ensureAC();
    const len = ac.sampleRate * 2;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() < .002 ? (Math.random() * 2 - 1) * .8 : (Math.random() * 2 - 1) * .02);
    }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 3000;
    const g = ac.createGain(); g.gain.value = .05;
    src.connect(f).connect(g).connect(ac.destination);
    src.start();
    /* Se detiene al levantar la aguja */
    const iv = setInterval(function () { if (!playing) { src.stop(); clearInterval(iv); } }, 400);
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

