/* Galaxia de Recuerdos 3D
 * Espiral de estrellas interactiva: haz clic en una estrella para enfocarla y leer su recuerdo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Galaxia de recuerdos: espiral 3D proyectada a 2D con arrastre para orbitar. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const card = document.getElementById('card');
const cardTitle = document.getElementById('cardTitle');
const cardText = document.getElementById('cardText');
document.getElementById('cardClose').addEventListener('click', function () { card.classList.remove('open'); });

const MEMORIES = [
  ['El día que nos conocimos', 'Una chispa más en el universo… pero fue la única que lo iluminó todo.'],
  ['Nuestra primera risa', 'Reímos tanto que las estrellas se pusieron celosas.'],
  ['Ese viaje sin plan', 'Nos perdimos a propósito y encontramos el mejor lugar del mundo.'],
  ['Las madrugadas eternas', 'Hablar contigo hasta que el cielo se aclara es mi pasatiempo favorito.'],
  ['Tu manera de escuchar', 'Conviertes el silencio en el lugar más seguro del mundo.'],
  ['Un futuro entre estrellas', 'Quiero seguir orbitando contigo, siempre.']
];

/* --- Estrellas en una espiral con coordenadas 3D --- */
const stars = [];
(function buildGalaxy() {
  const arms = 3;
  for (let i = 0; i < 260; i++) {
    const arm = i % arms;
    const t = Math.pow(Math.random(), 0.7);           // 0 centro → 1 borde
    const angle = t * 4.4 + arm * (Math.PI * 2 / arms) + (Math.random() - .5) * .6;
    const radius = 60 + t * 520;
    stars.push({
      x: Math.cos(angle) * radius,
      y: (Math.random() - .5) * 90,
      z: Math.sin(angle) * radius,
      size: Math.random() < .08 ? 3.4 : 1 + Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2,
      memory: i < MEMORIES.length && t < .5 ? i : -1,
      focus: 0
    });
  }
  stars.forEach(function (s, idx) {                   // reparte recuerdos entre las más cercanas al centro
    if (idx < MEMORIES.length) { stars[idx * 9].memory = idx; stars[idx * 9].size = 4; }
  });
})();

let rotY = 0, rotX = -0.45, dragging = false, lastX = 0, lastY = 0, velY = 0.0022, W = 0, H = 0;

function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

function project(s) {
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  let x = s.x * cosY - s.z * sinY;
  let z = s.x * sinY + s.z * cosY;
  let y = s.y * cosX - z * sinX;
  z = s.y * sinX + z * cosX;
  const scale = 620 / (620 + z);
  return { x: W / 2 + x * scale, y: H / 2 + y * scale, scale: scale, z: z };
}

function draw(time) {
  ctx.fillStyle = 'rgba(5,6,15,.4)';                  // estela suave entre fotogramas
  ctx.fillRect(0, 0, W, H);
  const pts = stars.map(function (s) { return { s: s, p: project(s) }; })
    .sort(function (a, b) { return b.p.z - a.p.z; });
  for (const o of pts) {
    const twinkle = .55 + .45 * Math.sin(time * .002 + o.s.tw);
    const r = o.s.size * o.p.scale * (1 + o.s.focus * .8);
    ctx.beginPath();
    ctx.arc(o.p.x, o.p.y, Math.max(r, .4), 0, Math.PI * 2);
    ctx.fillStyle = o.s.memory >= 0
      ? 'rgba(255,236,170,' + (.75 + .25 * twinkle + o.s.focus * .2) + ')'
      : 'rgba(180,215,255,' + (.5 * twinkle) + ')';
    ctx.shadowColor = o.s.memory >= 0 ? '#ffe9a8' : '#9fd0ff';
    ctx.shadowBlur = o.s.memory >= 0 ? 14 * o.p.scale : 6 * o.p.scale;
    ctx.fill();
    ctx.shadowBlur = 0;
    o.p.r = r;                                        // radio proyectado para hit-test
  }
  window.__pts = pts;                                 // cache para los clics
  if (!dragging) rotY += velY;
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* --- Interacción: arrastrar orbita la galaxia, clic enfoca una estrella --- */
canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; });
addEventListener('pointerup', function () { dragging = false; });
addEventListener('pointermove', function (e) {
  if (!dragging) return;
  rotY += (e.clientX - lastX) * .004;
  rotX = Math.max(-1.2, Math.min(1.2, rotX + (e.clientY - lastY) * .003));
  lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener('click', function (e) {
  if (Math.abs(e.clientX - lastX) > 4) return;        // era un arrastre, no un clic
  let best = null, bestD = 26;
  for (const o of window.__pts || []) {
    if (o.s.memory < 0) continue;
    const d = Math.hypot(o.p.x - e.clientX, o.p.y - e.clientY);
    if (d < bestD + o.p.r) { bestD = d; best = o; }
  }
  if (!best) return;
  stars.forEach(function (s) { s.focus = 0; });
  best.s.focus = 1;
  chime(660, .12); chime(990, .18);
  cardTitle.textContent = MEMORIES[best.s.memory][0];
  cardText.textContent = MEMORIES[best.s.memory][1];
  card.classList.add('open');
});

/* --- Campanita con Web Audio API --- */
function chime(freq, dur) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const audio = new AC();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12, audio.currentTime + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(); osc.stop(audio.currentTime + dur);
  } catch (err) { /* audio opcional */ }
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

