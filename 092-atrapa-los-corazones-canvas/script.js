/* Atrapa los Corazones
 * Lluvia de ítems en Canvas: mueve la cesta, llena la barra de cariño y desbloquea la dedicatoria.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Atrapa corazones: cesta que sigue el puntero, caída de ítems y meta del 100%. */
'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bar = document.getElementById('bar');
const overlay = document.getElementById('overlay');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const GAME_TIME = 40;
let items, basket, score, caught, running, t0, spawnAcc;
const ITEMS = ['💖', '💗', '💞', '🌧️', '⭐'];

function start() {
  items = [];
  basket = { x: W / 2, w: 110 };
  score = 0; caught = 0; spawnAcc = 0;
  running = true;
  t0 = performance.now();
  overlay.classList.add('hidden');
  document.getElementById('finalCard').classList.remove('show');
  requestAnimationFrame(loop);
}
document.getElementById('startBtn').addEventListener('click', start);

/* Control: puntero / dedo / flechas */
canvas.addEventListener('pointermove', function (e) { if (basket) basket.x = e.clientX; });
canvas.addEventListener('touchmove', function (e) { e.preventDefault(); if (basket) basket.x = e.touches[0].clientY ? e.touches[0].clientX : basket.x; }, { passive: false });
addEventListener('keydown', function (e) {
  if (!running) return;
  if (e.key === 'ArrowLeft') basket.x = Math.max(60, basket.x - 46);
  if (e.key === 'ArrowRight') basket.x = Math.min(W - 60, basket.x + 46);
});

function spawn() {
  const type = ITEMS[Math.random() < .16 ? 3 : Math.floor(Math.random() * 3)];
  items.push({
    x: 40 + Math.random() * (W - 80), y: -40,
    vy: 2 + Math.random() * 2.6 + caught * .04,
    type: type,
    bad: type === '🌧️',
    rot: Math.random() * 7, vr: (Math.random() - .5) * .1
  });
}
function loop(now) {
  if (!running) return;
  const elapsed = (now - t0) / 1000;
  timeEl.textContent = Math.max(0, Math.ceil(GAME_TIME - elapsed));
  /* Fondo degradado + burbujitas */
  ctx.fillStyle = '#2a1420'; ctx.fillRect(0, 0, W, H);
  /* Spawner */
  spawnAcc += 1;
  if (spawnAcc > Math.max(16, 42 - caught / 2)) { spawnAcc = 0; spawn(); }
  /* Cesta */
  const by = H - 74;
  ctx.save();
  ctx.translate(basket.x, by);
  /* Cuerpo de cesta */
  ctx.fillStyle = '#c98a4a';
  ctx.beginPath();
  ctx.moveTo(-55, 0); ctx.quadraticCurveTo(0, 66, 55, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 3;
  for (let i = -40; i <= 40; i += 20) {
    ctx.beginPath(); ctx.moveTo(i, 4); ctx.lineTo(i * .55, 40); ctx.stroke();
  }
  ctx.restore();
  /* Ítems */
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.y += it.vy; it.rot += it.vr;
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.rot);
    ctx.font = '30px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(it.type, 0, 0);
    ctx.restore();
    /* ¿Atrapado? */
    if (it.y > by - 18 && it.y < by + 26 && Math.abs(it.x - basket.x) < 55) {
      items.splice(i, 1);
      if (it.bad) { score = Math.max(0, score - 8); buzz(); }
      else {
        score += 10; caught++;
        ding(500 + Math.random() * 300);
        /* Estrellitas al atrapar */
        for (let k = 0; k < 3; k++) sparkle(it.x, by);
      }
      scoreEl.textContent = score;
      bar.style.width = Math.min(100, score / 2) + '%';
      if (score >= 200) return win();
      continue;
    }
    if (it.y > H + 40) items.splice(i, 1);
  }
  /* Fin de tiempo */
  if (elapsed >= GAME_TIME) {
    running = false;
    overlay.classList.remove('hidden');
    overlay.querySelector('h1').textContent = caught >= 15 ? '¡Buen brazo! 🧺' : '¡Casi! El cariño no se rinde';
    overlay.querySelector('p').textContent = 'Atrapaste ' + caught + ' corazones. La barra guarda tu progreso… ¡pero puedes llenarla del todo!';
    document.getElementById('startBtn').textContent = 'Reintentar';
    return;
  }
  requestAnimationFrame(loop);
}
function win() {
  running = false;
  document.getElementById('finalCard').classList.add('show');
  fanfare();
}
function sparkle(x, y) {
  const s = document.createElement('div');
  s.textContent = '✨';
  s.style.cssText = 'position:fixed;z-index:5;pointer-events:none;left:' + x + 'px;top:' + y + 'px;font-size:14px;transition:transform .5s,opacity .5s';
  document.body.appendChild(s);
  requestAnimationFrame(function () {
    s.style.transform = 'translate(' + ((Math.random() - .5) * 60) + 'px,-46px)';
    s.style.opacity = '0';
  });
  setTimeout(function () { s.remove(); }, 520);
}
function ding(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .25);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .25);
  } catch (e) { /* opcional */ }
}
function buzz() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 140;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .2);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .2);
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

