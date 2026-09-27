/* Pantalla de Carga de Videojuego
 * Barra de progreso con "tips de amor" mientras carga… una carta interactiva al 100%.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pantalla de carga: tips rotativos, barra animada y carta final interactiva. */
'use strict';
const pct = document.getElementById('pct');
const fill = document.getElementById('fill');
const tipEl = document.getElementById('tip');
const letter = document.getElementById('letter');

const TIPS = [
  ['Tip de amor #1:', 'la paciencia también es cariño…'],
  ['Tip de amor #2:', 'si te ríes solo/a, es que la carga va bien.'],
  ['Tip de amor #3:', 'el 90% de mi día mejora cuando apareces.'],
  ['Dato curioso:', 'eres la mejor decisión que tomó mi corazón.'],
  ['Consejo pro:', 'abrazar 5 segundos recarga el ánimo completo.'],
  ['Advertencia:', 'nivel de cariño excesivamente alto. No se puede bajar.']
];
let progress = 0, tipIdx = 0, done = false;

const tipTimer = setInterval(function () {
  tipIdx = (tipIdx + 1) % TIPS.length;
  tipEl.style.opacity = '0';
  setTimeout(function () {
    tipEl.innerHTML = '<b>' + TIPS[tipIdx][0] + '</b> ' + TIPS[tipIdx][1];
    tipEl.style.opacity = '.85';
  }, 300);
}, 1700);

const loadTimer = setInterval(function () {
  /* Avance irregular, realista */
  progress = Math.min(100, progress + (progress < 70 ? Math.random() * 7 : Math.random() * 2.2));
  pct.textContent = Math.floor(progress) + '%';
  fill.style.width = progress + '%';
  if (progress >= 100) {
    clearInterval(loadTimer); clearInterval(tipTimer);
    done = true;
    setTimeout(function () {
      letter.classList.add('show');
      chime();
    }, 400);
  }
}, 140);

/* Chispas de cariño al hacer clic en el papel */
document.querySelector('.letter .paper').addEventListener('click', function (e) {
  for (let i = 0; i < 8; i++) spawnHeart(e.clientX + (Math.random() - .5) * 60, e.clientY - Math.random() * 30);
  pop();
});
function spawnHeart(x, y) {
  const el = document.createElement('div');
  el.textContent = ['💖', '✨', '💕', '🌟'][Math.floor(Math.random() * 4)];
  el.style.cssText = 'position:fixed;pointer-events:none;z-index:9;font-size:' + (14 + Math.random() * 14) + 'px;left:' + x + 'px;top:' + y + 'px;transition:transform 1.1s ease,opacity 1.1s ease';
  document.body.appendChild(el);
  requestAnimationFrame(function () {
    el.style.transform = 'translate(' + ((Math.random() - .5) * 120) + 'px,' + (-80 - Math.random() * 80) + 'px) rotate(' + ((Math.random() - .5) * 90) + 'deg)';
    el.style.opacity = '0';
  });
  setTimeout(function () { el.remove(); }, 1200);
}
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 700 + Math.random() * 500;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .25);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .25);
  } catch (e) { /* opcional */ }
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .1); });
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .9);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .9);
  } catch (e) { /* opcional */ }
}
document.getElementById('closeLetter').addEventListener('click', function () {
  letter.classList.remove('show');
  progress = 0; done = false;
  fill.style.width = '0%';
  pct.textContent = '0%';
  clearInterval(tipTimer);
  const restart = setInterval(function () {
    progress = Math.min(100, progress + Math.random() * 6);
    pct.textContent = Math.floor(progress) + '%';
    fill.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(restart);
      setTimeout(function () { letter.classList.add('show'); }, 300);
    }
  }, 140);
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

