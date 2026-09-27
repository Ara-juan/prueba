/* Efecto Transición Demon Slayer
 * Cortes de espada dividen la pantalla para revelar el contenido entre destellos de acero.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Transición tipo cuchillada: línea de corte, apartado de mitades y chispas de acero. */
'use strict';
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

let cutting = false;
const sparks = [];
const content = document.getElementById('content');

function slashSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    /* Ruido blanco filtrado = silbido de espada */
    const len = a.sampleRate * .35;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const filter = a.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 2400; filter.Q.value = 1.2;
    const g = a.createGain(); g.gain.value = .25;
    src.connect(filter).connect(g).connect(a.destination);
    src.start();
    /* Chispazo metálico */
    const o = a.createOscillator(), og = a.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(3200, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(700, a.currentTime + .18);
    og.gain.setValueAtTime(.08, a.currentTime);
    og.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .2);
    o.connect(og).connect(a.destination); o.start(); o.stop(a.currentTime + .2);
  } catch (e) { /* opcional */ }
}

function doSlash() {
  if (cutting) return;
  cutting = true;
  slashSound();
  const start = performance.now();
  const dur = 620;
  const angle = (Math.random() * .5 + .35) * (Math.random() < .5 ? -1 : 1);   // inclinación del corte
  const x0 = -100, y0 = H * .5 + Math.sin(angle) * W * .7;

  function anim(now) {
    const p = Math.min(1, (now - start) / dur);
    ctx.clearRect(0, 0, W, H);
    /* Línea de corte creciente con brillo */
    const tipX = x0 + (W + 200) * p;
    const tipY = y0 + Math.tan(angle) * (tipX - x0);
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, 'rgba(160,240,255,0)');
    grad.addColorStop(.5, '#e8fbff');
    grad.addColorStop(1, 'rgba(120,220,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 6 * (1 - p * .5);
    ctx.shadowColor = '#8ae8ff'; ctx.shadowBlur = 26;
    ctx.beginPath();
    ctx.moveTo(Math.max(-100, tipX - 500 * (1 - p)), tipY - Math.tan(angle) * 500 * (1 - p));
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    /* Chispas en la punta */
    for (let i = 0; i < 4; i++) {
      sparks.push({ x: tipX, y: tipY, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, life: 1 });
    }
    if (p >= 1 && !content.classList.contains('revealed')) {
      content.classList.add('revealed');
      setTimeout(function () { cutting = false; }, 350);
    }
    requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
}

/* Chispas persistentes */
function sparkLoop() {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx; s.y += s.vy; s.vy += .18; s.life -= .03;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    ctx.fillStyle = 'rgba(180,240,255,' + s.life + ')';
    ctx.fillRect(s.x, s.y, 2.4, 2.4);
  }
  requestAnimationFrame(sparkLoop);
}
sparkLoop();

document.getElementById('slash').addEventListener('click', function () {
  content.classList.remove('revealed');
  setTimeout(doSlash, 60);
});
document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !cutting) {
    e.preventDefault();
    content.classList.remove('revealed');
    doSlash();
  }
});
/* Corte inicial al cargar */
setTimeout(doSlash, 500);
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

