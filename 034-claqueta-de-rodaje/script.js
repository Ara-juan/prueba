/* Claqueta de Rodaje
 * La claqueta baja con un ¡ACCIÓN! que activa la escena con fotos, música y dedicatoria.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Claqueta: golpe de varillas, flash de ¡ACCIÓN! y take incrementable con sonido. */
'use strict';
const clapper = document.getElementById('clapper');
const topStick = document.getElementById('topStick');
const scene = document.getElementById('scene');
const action = document.getElementById('action');
const takeNum = document.getElementById('takeNum');
let take = 1, rolling = false;

function clap() {
  if (rolling) return;
  rolling = true;
  topStick.classList.add('open');                    // varilla arriba
  setTimeout(function () {
    topStick.classList.remove('open');               // ¡golpe!
    clapSound();
  }, 220);
  setTimeout(function () {
    take++;
    takeNum.textContent = String(take).padStart(3, '0');
    scene.querySelector('.take-tag').textContent = '● REC — TAKE ' + String(take).padStart(3, '0');
    action.classList.remove('go'); void action.offsetWidth;
    action.classList.add('go');
    scene.classList.add('on');
  }, 340);
  setTimeout(function () { rolling = false; }, 800);
}
clapper.addEventListener('click', clap);
clapper.addEventListener('keydown', function (e) { if (e.key === 'Enter') clap(); });
document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { e.preventDefault(); clap(); }
});

function clapSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    /* Golpe seco: ruido corto + click */
    const len = a.sampleRate * .09;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 700;
    const g = a.createGain(); g.gain.value = .4;
    src.connect(f).connect(g).connect(a.destination); src.start();
    const o = a.createOscillator(), og = a.createGain();
    o.type = 'square'; o.frequency.value = 180;
    og.gain.setValueAtTime(.15, a.currentTime);
    og.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .08);
    o.connect(og).connect(a.destination); o.start(); o.stop(a.currentTime + .08);
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

