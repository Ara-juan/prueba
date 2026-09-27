/* Terrario de Luciérnagas
 * Un frasco de vidrio: ábrelo con un clic y libera luciérnagas que iluminan la noche.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Terrario: frasco de vidrio dibujado en canvas; clic libera luciérnagas con vuelo browniano. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const quoteEl = document.getElementById('quote');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const JAR = { x: 0, y: 0, w: 260, h: 360 };            // se recalcula al redimensionar
function layoutJar() { JAR.x = W / 2 - JAR.w / 2; JAR.y = H * .48; }
layoutJar(); addEventListener('resize', layoutJar);

const QUOTES = [
  'Brillas más cuando te atreves a salir del frasco.',
  'Tu luz no necesita permiso para iluminar.',
  'Hay noches que solo se arreglan contigo.',
  'Cuanto más compartes tu luz, más brillas.',
  'Eres la chispa que este mundo necesitaba.'
];
let quoteIdx = -1;
function showQuote() {
  quoteIdx = (quoteIdx + 1) % QUOTES.length;
  quoteEl.textContent = QUOTES[quoteIdx];
  quoteEl.classList.add('show');
  clearTimeout(showQuote.timer);
  showQuote.timer = setTimeout(function () { quoteEl.classList.remove('show'); }, 4200);
}

/* Luciérnagas: dentro del frasco (atrapadas) o libres */
const bugs = [];
function spawnBugs(n, free) {
  for (let i = 0; i < n; i++) {
    bugs.push({
      x: JAR.x + 30 + Math.random() * (JAR.w - 60),
      y: JAR.y + JAR.h - 60 - Math.random() * (JAR.h - 120),
      vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8,
      free: free, phase: Math.random() * 7, size: 2.4 + Math.random() * 1.8
    });
  }
}
spawnBugs(9, false);

canvas.addEventListener('pointerdown', function (e) {
  const inJar = e.clientX > JAR.x - 20 && e.clientX < JAR.x + JAR.w + 20 && e.clientY > JAR.y - 20 && e.clientY < JAR.y + JAR.h + 20;
  if (inJar) {
    /* Libera hasta 5 luciérnagas */
    let freed = 0;
    for (const b of bugs) {
      if (!b.free && freed < 5) { b.free = true; freed++; }
    }
    if (freed === 0) spawnBugs(4, true);               // si ya no quedan, nacen nuevas libres
    showQuote();
    chime();
  }
});

function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, a.currentTime + .4);
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .8);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .8);
  } catch (e) { /* opcional */ }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Hierba del suelo */
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, H * .92, W, H * .08);
  ctx.strokeStyle = 'rgba(40,90,50,.5)'; ctx.lineWidth = 2;
  for (let x = 10; x < W; x += 24) {
    ctx.beginPath(); ctx.moveTo(x, H * .93);
    ctx.quadraticCurveTo(x + Math.sin(t * .001 + x) * 6, H * .88, x + Math.sin(t * .001 + x) * 9, H * .86);
    ctx.stroke();
  }
  /* Frasco de vidrio */
  ctx.save();
  ctx.fillStyle = 'rgba(160,200,235,.08)';
  ctx.strokeStyle = 'rgba(190,220,245,.5)'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(JAR.x, JAR.y, JAR.w, JAR.h, [40, 40, 26, 26]);
  ctx.fill(); ctx.stroke();
  /* Cuello y tapa */
  ctx.fillStyle = 'rgba(190,220,245,.35)';
  ctx.fillRect(JAR.x + JAR.w * .3, JAR.y - 34, JAR.w * .4, 34);
  ctx.fillStyle = '#7a5a3a';
  ctx.beginPath(); ctx.roundRect(JAR.x + JAR.w * .26, JAR.y - 52, JAR.w * .48, 22, 6); ctx.fill();
  /* Brillo del vidrio */
  ctx.fillStyle = 'rgba(255,255,255,.10)';
  ctx.beginPath(); ctx.ellipse(JAR.x + JAR.w * .26, JAR.y + JAR.h * .4, 14, JAR.h * .3, -.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  /* Luciérnagas */
  for (const b of bugs) {
    /* Vuelo browniano suave */
    b.vx += (Math.random() - .5) * .12;
    b.vy += (Math.random() - .5) * .12;
    if (!b.free) {
      /* Contenidas dentro del frasco */
      if (b.x < JAR.x + 16) b.vx = Math.abs(b.vx);
      if (b.x > JAR.x + JAR.w - 16) b.vx = -Math.abs(b.vx);
      if (b.y < JAR.y + 16) b.vy = Math.abs(b.vy);
      if (b.y > JAR.y + JAR.h - 14) b.vy = -Math.abs(b.vy);
    } else {
      /* Libres: vagan por la pantalla y evitan bordes */
      if (b.x < 20) b.vx = Math.abs(b.vx) + .3;
      if (b.x > W - 20) b.vx = -Math.abs(b.vx) - .3;
      if (b.y < 20) b.vy = Math.abs(b.vy) + .3;
      if (b.y > H - 40) b.vy = -Math.abs(b.vy) - .3;
      b.vx *= .995; b.vy *= .995;
    }
    const vmax = b.free ? 1.6 : .7;
    b.vx = Math.max(-vmax, Math.min(vmax, b.vx));
    b.vy = Math.max(-vmax, Math.min(vmax, b.vy));
    b.x += b.vx; b.y += b.vy;
    const glow = .35 + .65 * Math.abs(Math.sin(t * .0025 + b.phase));
    ctx.beginPath(); ctx.arc(b.x, b.y, b.size * (1 + glow), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,236,150,' + glow + ')';
    ctx.shadowColor = '#ffe98a'; ctx.shadowBlur = 16 * glow;
    ctx.fill(); ctx.shadowBlur = 0;
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

