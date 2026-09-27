/* Rasca y Gana
 * Capa plateada en Canvas que se raspa con el cursor como billete de lotería: ¿qué sorpresa hay?
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Rasca y gana: capa descratch con destination-out y detección de porcentaje. */
'use strict';
const area = document.getElementById('area');
const canvas = document.getElementById('scratch');
const ctx = canvas.getContext('2d');
const percentEl = document.getElementById('percent');
const hint = document.getElementById('hint');
let clearedPx = 0, totalPx = 0, done = false;

function initScratch() {
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(area.clientWidth * dpr);
  canvas.height = Math.round(area.clientHeight * dpr);
  totalPx = canvas.width * canvas.height;
  clearedPx = 0;
  done = false;
  /* Capa plateada con textura */
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, '#c8c8d0'); g.addColorStop(.5, '#e8e8ee'); g.addColorStop(1, '#b8b8c2');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  /* Texto "RASCA AQUÍ" */
  ctx.fillStyle = 'rgba(90,90,110,.6)';
  ctx.font = 'bold ' + Math.max(18, canvas.width * .06) + 'px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('RASCA AQUÍ 💰', canvas.width / 2, canvas.height / 2);
  percentEl.textContent = '0%';
  percentEl.classList.remove('show');
}
initScratch();
addEventListener('resize', function () {
  if (!done) initScratch();
});

let scratching = false;
function scratch(e) {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (canvas.width / r.width);
  const y = (e.clientY - r.top) * (canvas.height / r.height);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();
  /* Muestreo del porcentaje limpiado */
  clearedPx += 26 * 26 * 2.2;                        // aproximación
  const pct = Math.min(100, Math.round(clearedPx / totalPx * 100));
  percentEl.textContent = pct + '%';
  if (pct > 8) percentEl.classList.add('show');
  if (pct >= 55 && !done) {
    done = true;
    hint.style.display = 'none';
    /* Limpia el resto automáticamente con una animación */
    const fade = setInterval(function () {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < .3) clearInterval(fade);
    }, 50);
    setTimeout(function () {
      canvas.style.transition = 'opacity .8s';
      canvas.style.opacity = '0';
    }, 500);
    winSound();
    setTimeout(fanfare, 400);
  }
}
area.addEventListener('pointerdown', function (e) { scratching = true; scratch(e); });
addEventListener('pointerup', function () { scratching = false; });
area.addEventListener('pointermove', function (e) {
  if (scratching) { e.preventDefault(); scratch(e); }
});
function winSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(660, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, a.currentTime + .4);
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
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

