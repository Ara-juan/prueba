/* Vitral de Catedral
 * Ventanal de colores que, al recibir la luz, proyecta sombras multicolores y frases sobre el suelo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Vitral: al dejar entrar el sol, la proyección cobra vida y bendice la estancia. */
'use strict';
const sunBtn = document.getElementById('sunBtn');
const projection = document.getElementById('projection');
const blessing = document.getElementById('blessing');
const hint = document.querySelector('.hint');
let shining = false;

sunBtn.addEventListener('click', function () {
  shining = !shining;
  if (shining) {
    sunBtn.textContent = '🌙 Volver a la penumbra';
    hint.textContent = 'Modo: plena luz';
    /* La proyección brilla más y las frases aparecen */
    projection.style.opacity = '1';
    projection.style.filter = 'blur(1px) saturate(1.4)';
    blessing.classList.add('show');
    sunChime();
    /* Rayos animados cruzando la proyección */
    startRays();
  } else {
    sunBtn.textContent = '☀️ Dejar entrar el sol';
    hint.textContent = 'Modo: penumbra';
    projection.style.opacity = '.35';
    projection.style.filter = 'blur(3px)';
    blessing.classList.remove('show');
  }
});

/* Rayos de polvo dorado flotando en la luz */
let rayTimer = null;
function startRays() {
  clearInterval(rayTimer);
  rayTimer = setInterval(function () {
    if (!shining) { clearInterval(rayTimer); return; }
    const dust = document.createElement('div');
    dust.textContent = '✨';
    dust.style.cssText = 'position:fixed;font-size:' + (8 + Math.random() * 10) + 'px;z-index:5;pointer-events:none;left:' + (20 + Math.random() * 60) + 'vw;top:30vh;opacity:.9;transition:transform 3s linear,opacity 3s';
    document.body.appendChild(dust);
    requestAnimationFrame(function () {
      dust.style.transform = 'translate(' + (Math.random() * 80 - 40) + 'px,' + (innerHeight * .5) + 'px)';
      dust.style.opacity = '0';
    });
    setTimeout(function () { dust.remove(); }, 3100);
  }, 700);
}

function sunChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    [523, 659, 784, 988].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .16); });
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.2);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.2);
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

