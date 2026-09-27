/* Cámara Instantánea Polaroid
 * Pulsa el botón: la cámara imprime una foto que sale revelándose poco a poco… con tu sonrisa.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Polaroid: flash, foto que sale deslizándose y se revela en blanco y sepia → color. */
'use strict';
const camera = document.getElementById('camera');
const flashEl = document.getElementById('flash');
const photos = document.getElementById('photos');
const MEMORIES = [
  ['😊', 'Esa sonrisa', '🌅', 'Amaneceres contigo', '🎡', 'La feria y el vértigo feliz', '☕', 'Cafés que se enfrían por charlar', '🌊', 'El mar y tus secretos', '🎂', 'El deseo ya cumplido', '🌟', 'Noches imposibles', '🎬', 'Nuestra película favorita', '/photo', 'La foto que aún no existe: la haremos pronto']
];
let count = 0;

function shoot() {
  /* Flash */
  flashEl.classList.remove('fired'); void flashEl.offsetWidth;
  flashEl.classList.add('fired');
  shutterSound();
  const m = MEMORIES[(count * 2) % MEMORIES.length];
  const m2 = MEMORIES[(count * 2 + 1) % MEMORIES.length];
  const img = m[1] ? m : m2;                          // coge el par [emoji, caption]
  const emoji = img[0] === '/photo' ? '📷' : img[0];
  const caption = img[1] === 'photo' ? 'La foto que aún no existe' : img[1];
  count++;
  /* La foto sale de la ranura tras un instante */
  setTimeout(function () {
    const el = document.createElement('figure');
    el.className = 'polaroid';
    el.style.setProperty('--rot', ((Math.random() - .5) * 8).toFixed(1) + 'deg');
    var photo = (window.DEDIC ? DEDIC.photo(count) : null) || null;
    el.innerHTML = photo
      ? '<div class="img"><img src="' + photo + '" alt="' + caption + '" style="width:100%;height:100%;object-fit:cover"></div><figcaption>' + caption + '</figcaption>'
      : '<div class="img">' + emoji + '</div><figcaption>' + caption + '</figcaption>';
    photos.appendChild(el);
    printSound();
    /* Revelado químico */
    setTimeout(function () { el.classList.add('revealed'); }, 900);
  }, 500);
}
camera.addEventListener('click', shoot);
camera.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') shoot(); });

function shutterSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .06;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2200;
    const g = a.createGain(); g.gain.value = .3;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function printSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(90, a.currentTime);
    o.frequency.linearRampToValueAtTime(60, a.currentTime + .4);
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5);
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

