/* Cinta VHS Retro
 * Inserta el casete en el reproductor: glitch analógico y una "grabación" con tu dedicatoria.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* VHS: arrastra el casete al reproductor → glitch, carretes girando y TV encendida. */
'use strict';
const tape = document.getElementById('tape');
const slot = document.getElementById('slot');
const tv = document.getElementById('tv');
const led = document.getElementById('led');
let inserted = false;

/* --- Arrastre del casete (pointer events) --- */
let dragging = false, offX = 0, offY = 0, homeRect = null;
tape.addEventListener('pointerdown', function (e) {
  if (inserted) return;
  dragging = true;
  homeRect = tape.getBoundingClientRect();
  offX = e.clientX - homeRect.left;
  offY = e.clientY - homeRect.top;
  tape.setPointerCapture(e.pointerId);
});
tape.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  tape.style.position = 'fixed';
  tape.style.left = (e.clientX - offX) + 'px';
  tape.style.top = (e.clientY - offY) + 'px';
  tape.style.zIndex = '20';
  tape.style.width = homeRect.width + 'px';
});
tape.addEventListener('pointerup', function (e) {
  if (!dragging) return;
  dragging = false;
  const r = tape.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  const over = r.left < s.right && r.right > s.left && r.top < s.bottom + 30 && r.bottom > s.top - 60;
  if (over) {                                        // suelto sobre la ranura → insertar
    inserted = true;
    tape.style.position = '';
    tape.style.left = ''; tape.style.top = '';
    tape.classList.add('inserted');
    mechSound();
    setTimeout(function () {
      led.classList.add('on');
      tv.classList.add('on', 'glitching');
      tape.classList.add('playing');
      staticBurst();
      setTimeout(function () { tv.classList.remove('glitching'); }, 1600);
    }, 700);
  } else {
    tape.style.position = '';
    tape.style.left = ''; tape.style.top = '';
  }
});
/* Fallback por clic si el arrastre no es cómodo (móvil) */
tape.addEventListener('click', function () {
  if (inserted) return;
  inserted = true;
  tape.classList.add('inserted');
  mechSound();
  setTimeout(function () {
    led.classList.add('on');
    tv.classList.add('on', 'glitching');
    tape.classList.add('playing');
    staticBurst();
    setTimeout(function () { tv.classList.remove('glitching'); }, 1600);
  }, 500);
});

/* Sonidos */
function mechSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(70, a.currentTime);
    o.frequency.linearRampToValueAtTime(45, a.currentTime + .5);
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .6);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .6);
  } catch (e) { /* opcional */ }
}
function staticBurst() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * 1.2;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, .6);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200;
    const g = a.createGain(); g.gain.value = .14;
    src.connect(f).connect(g).connect(a.destination); src.start();
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

