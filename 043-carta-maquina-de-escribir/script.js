/* Carta a Máquina de Escribir
 * Papel rugoso, fuente Courier y la carta impresa letra a letra con sonido de tecleo real.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Máquina de escribir: tipeo letra a letra con clac metálico y retorno de carro. */
'use strict';
const sheet = document.getElementById('sheet');
const slider = document.getElementById('slider');
const LETTER = 'PARA TI:\n\nEscribo esta carta a maquina porque las cosas importantes merecen proceso, tinta y esfuerzo. Cada letra tiene su clac, como cada recuerdo tiene su lugar.\n\nEres de esas personas que convierten un martes gris en una fecha memorable. Gracias por tu paciencia, por tu risa y por leerme hasta la ultima linea.\n\nCon carino indiscutible,\nquien te escribe.';
let typed = 0, typing = false;

function typeNext() {
  if (typed >= LETTER.length) { typing = false; return; }
  const ch = LETTER[typed];
  const needCursor = sheet.querySelector('.cursor');
  if (needCursor) needCursor.remove();
  sheet.innerHTML = escapeHTML(LETTER.slice(0, typed + 1)) + '<span class="cursor"></span>';
  typed++;
  typeKeySound(ch);
  /* El carro se desplaza y regresa al saltar de línea */
  const col = typed % 52;
  slider.style.left = 'calc(' + (col / 52 * 100) + '% - 18px)';
  if (ch === '\n') { ding(); slider.style.left = '0px'; }
  setTimeout(typeNext, ch === '\n' ? 260 : 38 + Math.random() * 46);
}
function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

/* Sonido de tecla: click corto + variación */
let ac = null;
function typeKeySound(ch) {
  if (ch === ' ') return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const len = ac.sampleRate * .04;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = ac.createBufferSource(); src.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 800;
    const g = ac.createGain(); g.gain.value = .16;
    src.connect(f).connect(g).connect(ac.destination); src.start();
  } catch (e) { /* opcional */ }
}
function ding() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = 1568;
    g.gain.setValueAtTime(.12, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .6);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .6);
  } catch (e) { /* opcional */ }
}

document.getElementById('typeBtn').addEventListener('click', function () {
  if (typing) return;
  typed = 0; typing = true;
  sheet.innerHTML = '<span class="cursor"></span>';
  typeNext();
});
document.getElementById('dingBtn').addEventListener('click', ding);
/* Arranque automático al primer clic/tactear en la página */
document.addEventListener('pointerdown', function once() {
  if (!typing && typed === 0) { typing = true; typeNext(); }
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

