/* Brote de Amor
 * Una semilla que echa raíces y crece cada vez que presionas el botón de "dar amor".
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Brote de amor: la planta crece por etapas según los clics recibidos. */
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('loveBtn');
const counter = document.getElementById('counter');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const STAGES = [
  'Una semilla llena de intención…',
  '¡Las raíces buscan su lugar!',
  'El primer brote asoma 🌱',
  'Ya tiene hojas que saludan al sol.',
  'Crece fuerte y seguro.',
  'Un capullo aparece…',
  '¡FLORECIÓ! 🌸 Esto es lo que hacemos juntos.'
];
let love = 0, heartFloat = [];

function grow() {
  love = Math.min(love + 1, STAGES.length * 10);
  counter.textContent = love + (love === 1 ? ' clic de amor' : ' clics de amor');
  btn.textContent = love >= STAGES.length * 10 ? '🌸 ¡Amor completo!' : '🌱 Dar amor';
  /* Corazoncitos flotantes desde el botón */
  const r = btn.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    heartFloat.push({ x: r.left + r.width / 2 + (Math.random() - .5) * 40, y: r.top, vy: -(1 + Math.random() * 1.6), vx: (Math.random() - .5) * 1.2, life: 1, s: 10 + Math.random() * 8 });
  }
  chime(392 + love * 12);
}
btn.addEventListener('click', grow);

function chime(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5);
  } catch (e) { /* opcional */ }
}

/* Dibuja un corazón en (x,y) de tamaño s */
function heart(x, y, s, alpha) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 30, s / 30);
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.bezierCurveTo(-14, -4, -8, -16, 0, -8);
  ctx.bezierCurveTo(8, -16, 14, -4, 0, 10);
  ctx.fillStyle = 'rgba(231,90,139,' + alpha + ')';
  ctx.fill(); ctx.restore();
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  const groundY = H * .84, cx = W / 2;
  const stageF = love / (STAGES.length * 10);          // 0 → 1
  /* Suelo */
  ctx.fillStyle = '#a58a5f';
  ctx.beginPath(); ctx.ellipse(cx, groundY + 26, 120, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a6f47';
  ctx.beginPath(); ctx.ellipse(cx, groundY + 8, 92, 18, 0, Math.PI, 0); ctx.fill();
  /* Semilla visible en etapas tempranas */
  if (stageF < .15) {
    ctx.fillStyle = '#6b4a2e';
    ctx.beginPath(); ctx.ellipse(cx, groundY - 2, 10, 13, .3, 0, Math.PI * 2); ctx.fill();
  }
  /* Planta: altura según progreso */
  const h = stageF * (H * .6);
  const sway = Math.sin(t * .0012) * 3;
  if (h > 6) {
    ctx.strokeStyle = '#4c7a3d'; ctx.lineWidth = Math.max(3, 7 * stageF); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, groundY);
    ctx.quadraticCurveTo(cx + sway, groundY - h * .5, cx + sway * 1.5, groundY - h);
    ctx.stroke();
    /* Raíces en la etapa 2 */
    if (stageF > .12) {
      ctx.strokeStyle = 'rgba(120,90,60,.8)'; ctx.lineWidth = 2;
      for (let r = 0; r < 4; r++) {
        const dx = (r - 1.5) * 22;
        ctx.beginPath(); ctx.moveTo(cx, groundY + 4);
        ctx.quadraticCurveTo(cx + dx * .5, groundY + 16, cx + dx, groundY + 24 + Math.abs(dx) * .2);
        ctx.stroke();
      }
    }
    /* Hojas cada ~20% de progreso */
    const leafPairs = Math.floor(stageF * 5);
    for (let l = 0; l < leafPairs; l++) {
      const ly = groundY - h * (.25 + l * .18);
      const side = l % 2 ? 1 : -1;
      ctx.fillStyle = 'hsl(105,42%,' + (40 + l * 4) + '%)';
      ctx.beginPath(); ctx.ellipse(cx + sway + side * 30, ly, 30 - l * 3, 11, side * .45, 0, Math.PI * 2); ctx.fill();
    }
    /* Capullo / flor final */
    if (stageF > .8) {
      const bloom = (stageF - .8) / .2;
      const fx = cx + sway * 1.5, fy = groundY - h;
      for (let p = 0; p < 7; p++) {
        const a = p / 7 * Math.PI * 2 + t * .0004;
        ctx.fillStyle = 'rgba(240,140,180,' + bloom + ')';
        ctx.beginPath(); ctx.ellipse(fx + Math.cos(a) * 16 * bloom, fy + Math.sin(a) * 16 * bloom, 13 * bloom, 8 * bloom, a, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#f6c445';
      ctx.beginPath(); ctx.arc(fx, fy, 8 * bloom, 0, Math.PI * 2); ctx.fill();
    }
  }
  /* Texto de etapa */
  ctx.fillStyle = 'rgba(74,56,38,.85)';
  ctx.font = 'italic ' + (W < 500 ? 14 : 17) + 'px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(STAGES[Math.min(STAGES.length - 1, Math.floor(stageF * (STAGES.length - .01)))], cx, groundY + 66);
  /* Corazones flotantes */
  for (let i = heartFloat.length - 1; i >= 0; i--) {
    const hf = heartFloat[i];
    hf.x += hf.vx; hf.y += hf.vy; hf.life -= .012;
    if (hf.life <= 0) { heartFloat.splice(i, 1); continue; }
    heart(hf.x, hf.y, hf.s, hf.life);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
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

