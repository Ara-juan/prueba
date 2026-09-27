/* Reloj de Arena Interactivo
 * La arena carmesí cae con física real en Canvas; al agotarse, libera el mensaje sellado.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Reloj de arena con partículas de arena y física simple de caída. */
'use strict';
const canvas = document.getElementById('hourglass');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('msg');
const hint = document.getElementById('hint');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = Math.min(420, innerWidth * .8); H = Math.min(560, innerHeight * .72); canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const TOP = { x0: .3, x1: .7, y0: .08, y1: .48 };    // proporciones del bulbo superior
const GRAINS = 340;
const grains = [];
function initGrains() {
  grains.length = 0;
  for (let i = 0; i < GRAINS; i++) {
    grains.push({ x: TOP.x0 + Math.random() * (TOP.x1 - TOP.x0), y: TOP.y0 + Math.random() * (TOP.y1 - TOP.y0 - .06), settled: true, delay: i * 9 + Math.random() * 40 });
  }
}
initGrains();
let t0 = performance.now(), flowStart = null, done = false;

function frame(now) {
  if (!flowStart) flowStart = now;
  const elapsed = now - flowStart;
  ctx.clearRect(0, 0, W, H);
  /* Marco de madera */
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(W * .2, H * .02, W * .6, 12);
  ctx.fillRect(W * .2, H * .94, W * .6, 12);
  ctx.fillRect(W * .44, H * .02, W * .12, 6);
  ctx.fillRect(W * .44, H * .94, W * .12, 6);
  /* Cristal (dos bulbos triangulares) */
  ctx.strokeStyle = 'rgba(200,190,210,.4)'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(W * .22, H * .06); ctx.lineTo(W * .5, H * .5); ctx.lineTo(W * .22, H * .94);
  ctx.moveTo(W * .78, H * .06); ctx.lineTo(W * .5, H * .5); ctx.lineTo(W * .78, H * .94);
  ctx.stroke();
  /* Grano de arena */
  function drawGrain(x, y, r) {
    ctx.beginPath(); ctx.arc(x * W, y * H, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(194,60,78,.9)';
    ctx.fill();
  }
  let remaining = 0;
  for (const gr of grains) {
    if (gr.settled) {
      /* Reposo: dibuja en su posición del bulbo superior apilada */
      drawGrain(gr.x, gr.y, 1.6);
      remaining++;
      /* Empieza a caer según su retraso */
      if (!done && elapsed > gr.delay) {
        gr.settled = false;
        gr.vy = 0;
        gr.x = .5 + (Math.random() - .5) * .012;
        gr.y = TOP.y1 - .04;
      }
      continue;
    }
    /* Física de caída */
    gr.vy += .00035;
    gr.y += gr.vy;
    /* Se apila abajo */
    const floor = .9 - (GRAINS - remaining) / GRAINS * .3;
    if (gr.y >= floor) {
      gr.y = floor; gr.settled = true; gr.done = true;
      /* Reinicia en el pila inferior (dibujo) */
      gr.x = .5 + (Math.random() - .5) * .3;
    }
    drawGrain(gr.x, gr.y, 1.5);
  }
  /* Montículo de arena acumulada abajo */
  const poured = grains.filter(function (g) { return g.done; }).length;
  if (poured > 0) {
    const pileH = (poured / GRAINS) * .26;
    ctx.fillStyle = 'rgba(194,60,78,.85)';
    ctx.beginPath();
    ctx.moveTo(W * .5 - W * .24, H * .92);
    ctx.quadraticCurveTo(W * .5, H * .92 - pileH * H, W * .5 + W * .24, H * .92);
    ctx.closePath(); ctx.fill();
  }
  /* Chorro de arena en el cuello */
  if (!done) {
    ctx.strokeStyle = 'rgba(232,168,184,.85)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(W * .5, H * .49); ctx.lineTo(W * .5, H * .58); ctx.stroke();
  }
  if (poured >= GRAINS && !done) {
    done = true;
    hint.style.display = 'none';
    setTimeout(function () { msg.classList.add('show'); chime(); }, 500);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

document.getElementById('again').addEventListener('click', function () {
  msg.classList.remove('show');
  done = false; flowStart = null;
  initGrains();
  hint.style.display = '';
});
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    [523, 659, 784].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .14); });
    g.gain.setValueAtTime(.07, a.currentTime);
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

