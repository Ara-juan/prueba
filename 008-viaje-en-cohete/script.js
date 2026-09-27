/* Viaje en Cohete
 * Mini juego: esquiva los meteoritos con el cohete y llega al planeta con la dedicatoria final.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Mini juego de esquivar meteoritos con dedicación final. */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const progressEl = document.getElementById('progress');
const livesEl = document.getElementById('lives');
document.getElementById('start').addEventListener('click', startGame);

let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

let rocket, meteors, stars, running, progress, lives, t0;
const keys = {};

function startGame() {
  rocket = { x: 90, y: H / 2, vy: 0, r: 16 };
  meteors = []; running = true; progress = 0; lives = 3; t0 = performance.now();
  stars = Array.from({ length: 90 }, function () { return { x: Math.random() * W, y: Math.random() * H, s: Math.random() * 2 + .6 }; });
  overlay.classList.add('hidden');
  requestAnimationFrame(loop);
}
addEventListener('keydown', function (e) { keys[e.key] = true; if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault(); });
addEventListener('keyup', function (e) { keys[e.key] = false; });
canvas.addEventListener('pointermove', function (e) { if (running) rocket.y = Math.max(30, Math.min(H - 30, e.clientY)); });
canvas.addEventListener('touchmove', function (e) { e.preventDefault(); if (running) rocket.y = e.touches[0].clientY; }, { passive: false });

function spawn(dt) {
  if (Math.random() < .022 + progress / 4000) {
    meteors.push({ x: W + 40, y: Math.random() * H, r: 12 + Math.random() * 22, vx: -(2.4 + Math.random() * 2.4 + progress / 300), rot: Math.random() * 7 });
  }
}

function loop(now) {
  if (!running) return;
  const dt = (now - t0) / 16.7; t0 = now;
  /* Fondo */
  ctx.fillStyle = '#04060f'; ctx.fillRect(0, 0, W, H);
  for (const s of stars) {
    s.x -= s.s * (1 + progress / 120);
    if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fillRect(s.x, s.y, s.s, s.s);
  }
  /* Control vertical */
  if (keys.ArrowUp) rocket.vy -= .55 * dt;
  if (keys.ArrowDown) rocket.vy += .55 * dt;
  if (!keys.ArrowUp && !keys.ArrowDown) rocket.vy *= .92;
  rocket.y += rocket.vy * dt;
  rocket.y = Math.max(26, Math.min(H - 26, rocket.y));
  /* Cohete */
  ctx.save(); ctx.translate(rocket.x, rocket.y);
  ctx.fillStyle = '#e8eef7';
  ctx.beginPath(); ctx.moveTo(24, 0); ctx.quadraticCurveTo(-6, -13, -18, -8); ctx.lineTo(-18, 8); ctx.quadraticCurveTo(-6, 13, 24, 0); ctx.fill();
  ctx.fillStyle = '#7fd8ff'; ctx.beginPath(); ctx.arc(6, 0, 5, 0, Math.PI * 2); ctx.fill();
  /* Llama animada */
  const flame = 12 + Math.random() * 8;
  ctx.fillStyle = Math.random() < .5 ? '#ff9d3c' : '#ffd23c';
  ctx.beginPath(); ctx.moveTo(-18, -5); ctx.lineTo(-18 - flame, 0); ctx.lineTo(-18, 5); ctx.fill();
  ctx.restore();
  /* Meteoritos */
  spawn(dt);
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.vx * dt; m.rot += .05;
    if (m.x < -50) { meteors.splice(i, 1); continue; }
    ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.rot);
    ctx.fillStyle = '#6b5b4a';
    ctx.beginPath();
    for (let a = 0; a < 9; a++) {
      const ang = a / 9 * Math.PI * 2, rr = m.r * (.8 + .3 * Math.sin(a * 3 + m.r));
      ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4a3d31';
    ctx.beginPath(); ctx.arc(-m.r * .25, -m.r * .2, m.r * .22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    /* Colisión */
    if (Math.hypot(m.x - rocket.x, m.y - rocket.y) < m.r + rocket.r) {
      meteors.splice(i, 1);
      lives--;
      livesEl.textContent = '❤'.repeat(Math.max(0, lives)) + '♡'.repeat(3 - Math.max(0, lives));
      if (lives <= 0) return gameOver(false);
      rocket.x = 90; rocket.y = H / 2; rocket.vy = 0;
    }
  }
  /* Progreso */
  progress = Math.min(100, progress + .055 * dt);
  progressEl.textContent = Math.floor(progress);
  if (progress >= 100) return gameOver(true);
  requestAnimationFrame(loop);
}

function gameOver(win) {
  running = false;
  overlay.querySelector('h1').textContent = win ? 'Has aterrizado 🚀' : 'Misión interrumpida';
  overlay.querySelector('p').innerHTML = win
    ? 'Cruzaste todo el universo para llegar hasta aquí…<br><b>Eres mi lugar favorito en el espacio.</b>'
    : 'El universo puso obstáculos, pero nadie llega tan lejos rendirse tan cerca. Vuelve a intentarlo.';
  overlay.querySelector('button').textContent = win ? 'Volar de nuevo' : 'Reintentar';
  overlay.classList.remove('hidden');
  if (win) celebrate();
}

/* Confeti al ganar */
function celebrate() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square';
    [523, 659, 784, 1046].forEach(function (f, i) {
      o.frequency.setValueAtTime(f, a.currentTime + i * .12);
    });
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

