/* Espejo Encantado
 * Espejo empañado con niebla animada: limpia con el cursor para revelar el mensaje oculto.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Espejo empañado: canvas de niebla que se borra con destination-out. */
'use strict';
const mirror = document.getElementById('mirror');
const fogCanvas = document.getElementById('fogCanvas');
const ctx = fogCanvas.getContext('2d');
let cleared = 0, fogW, fogH;

function resizeFog() {
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  fogW = mirror.clientWidth; fogH = mirror.clientHeight;
  fogCanvas.width = Math.round(fogW * dpr); fogCanvas.height = Math.round(fogH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  /* Repinta la niebla (con textura de vaho) */
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, 0, fogW, fogH);
  g.addColorStop(0, 'rgba(205,215,235,.55)');
  g.addColorStop(.5, 'rgba(185,195,220,.42)');
  g.addColorStop(1, 'rgba(200,210,232,.5)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, fogW, fogH);
  /* Gotitas de condensación */
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * fogW, Math.random() * fogH, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(230,238,250,.25)';
    ctx.fill();
  }
  cleared = 0;
}
resizeFog();
addEventListener('resize', resizeFog);

let wiping = false;
mirror.addEventListener('pointerdown', function (e) { wiping = true; wipe(e); });
addEventListener('pointerup', function () { wiping = false; });
mirror.addEventListener('pointermove', function (e) {
  if (wiping || Math.random() < .5) wipe(e);        // también limpia levemente al pasar el cursor
});
function wipe(e) {
  const r = mirror.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  ctx.globalCompositeOperation = 'destination-out';
  const brush = ctx.createRadialGradient(x, y, 4, x, y, 44);
  brush.addColorStop(0, 'rgba(0,0,0,.9)');
  brush.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = brush;
  ctx.beginPath(); ctx.arc(x, y, 44, 0, Math.PI * 2); ctx.fill();
  cleared++;
  if (cleared === 40) shimmerSound();
  if (cleared === 110) mirror.classList.add('clear');  // bastante limpio: revela el mensaje
}

function shimmerSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(660, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, a.currentTime + .5);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .8);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .8);
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

