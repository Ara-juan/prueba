/* Constelación de Nuestro Amor
 * Mueve el cursor para conectar las estrellas y dibujar la silueta de un corazón entre estrellas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Constelación: acercar el cursor a las estrellas dibuja el corazón al completarse. */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

/* Puntos del corazón paramétrico (curva clásica 16t²·sin³t …) */
const HEART = [];
for (let i = 0; i <= 40; i++) {
  const t = Math.PI * 2 * i / 40;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  HEART.push({ x: x, y: -y });
}
/* Escala el corazón al viewport */
(function fitHeart() {
  let minX = 99, maxX = -99, minY = 99, maxY = -99;
  HEART.forEach(function (p) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
  const scale = Math.min(W, H) * .62 / Math.max(maxX - minX, maxY - minY);
  HEART.forEach(function (p) { p.x = (p.x - (minX + maxX) / 2) * scale; p.y = (p.y - (minY + maxY) / 2) * scale; });
})();

const stars = HEART.map(function (p, i) {
  return { hx: p.x, hy: p.y, x: (Math.random() - .5) * W, y: (Math.random() - .5) * H, size: 2.2 + Math.random() * 1.4, tw: Math.random() * 6 };
});
/* Estrellas de fondo decorativas */
const dust = Array.from({ length: 130 }, function () {
  return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, a: Math.random() * .5 + .15 };
});

const mouse = { x: -9999, y: -9999 };
addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
addEventListener('pointerdown', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });

/* Audio: nota suave cada vez que se enciende una estrella */
let audioCtx = null, litCount = 0;
function note(i) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    const scale = [523.25, 587.33, 659.25, 783.99, 880];
    osc.frequency.value = scale[i % scale.length];
    osc.type = 'triangle';
    g.gain.setValueAtTime(.08, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .6);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + .6);
  } catch (e) { /* sin audio */ }
}

let progress = 0;
function frame(time) {
  ctx.clearRect(0, 0, W, H);
  for (const d of dust) {
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,190,255,' + (d.a * (.6 + .4 * Math.sin(time * .001 + d.x))) + ')'; ctx.fill();
  }
  /* Las estrellas tienden hacia su posición del corazón cuando el cursor pasa cerca */
  litCount = 0;
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const tx = W / 2 + s.hx, ty = H / 2 + s.hy;
    const near = Math.hypot(mouse.x - tx, mouse.y - ty) < 140;
    const k = near ? .09 : .02;                        // atrae cerca del cursor, vuelve lejos de él
    s.x += (tx - s.x) * k;
    s.y += (ty - s.y) * k;
    if (Math.hypot(s.x - tx, s.y - ty) < 8) {
      if (!s.lit) { s.lit = true; note(i); }
      litCount++;
    } else if (!near && Math.hypot(s.x - tx, s.y - ty) > 60 && s.lit && Math.random() < .002) {
      s.lit = false;                                   // decaimiento lento si abandonas la zona
    }
    const tw = .6 + .4 * Math.sin(time * .003 + s.tw);
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = s.lit ? 'rgba(255,214,232,' + tw + ')' : 'rgba(190,200,235,.45)';
    ctx.shadowColor = s.lit ? '#ffd6e8' : 'transparent';
    ctx.shadowBlur = s.lit ? 12 : 0;
    ctx.fill(); ctx.shadowBlur = 0;
  }
  /* Líneas entre estrellas consecutivas ya encendidas */
  ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(255,214,232,.55)';
  ctx.beginPath();
  let started = false;
  for (const s of stars) {
    if (!s.lit) { started = false; continue; }
    if (!started) { ctx.moveTo(s.x, s.y); started = true; } else ctx.lineTo(s.x, s.y);
  }
  ctx.stroke();
  progress = litCount / stars.length;
  if (progress > .97) document.body.classList.add('done'); else document.body.classList.remove('done');
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

