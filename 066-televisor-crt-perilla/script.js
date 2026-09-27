/* Televisor CRT con Perilla
 * Tele viejo con estática en Canvas: gira la perilla y zapea entre canales llenos de recuerdos.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* TV CRT: estática en canvas + 4 canales con recuerdos, perilla giratoria. */
'use strict';
const canvas = document.getElementById('tube');
const ctx = canvas.getContext('2d');
const knob = document.getElementById('knob');
const chNum = document.getElementById('chNum');
let W, H;
function resize() { W = canvas.width = canvas.clientWidth * 2; H = canvas.height = canvas.clientHeight * 2; }
resize(); addEventListener('resize', resize);

const CHANNELS = [
  { name: 'CH 3', title: 'CANAL: NUESTRA HISTORIA', text: 'Documental premiado sobre la persona más increíble. Emisión: diaria e ininterrumpida.', emoji: '📺' },
  { name: 'CH 5', title: 'DEPORTES: RACHA INVICTA', text: 'Tu equipo favorito (el mío también) gana todo. La estrella: obviamente tú.', emoji: '🏆' },
  { name: 'CH 8', title: 'CARTELERA DE LA NOCHE', text: 'Hoy: "Un Martes Contigo". Repetirán: "Un Miércoles Contigo". Y así toda la semana.', emoji: '🎬' },
  { name: 'CH 11', title: 'MÚSICA: TU CANCIÓN', text: 'Sonando ahora: la que bailamos sin razón. Siguiente: la misma, otra vez.', emoji: '🎵' }
];
let ch = 2, staticT = 0, switching = 0;

/* Estática */
function drawStatic() {
  const img = ctx.createImageData(W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
/* Canal: contenido sobre fondo con scanlines */
function drawChannel(c) {
  ctx.fillStyle = '#101018';
  ctx.fillRect(0, 0, W, H);
  /* Emoji grande */
  ctx.font = '90px serif';
  ctx.textAlign = 'center';
  ctx.fillText(c.emoji, W / 2, H * .42);
  /* Texto */
  ctx.fillStyle = '#e8e2c8';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(c.title, W / 2, H * .58);
  /* Título con salto de línea simple */
  ctx.font = '18px monospace';
  ctx.fillStyle = 'rgba(232,226,200,.85)';
  const words = c.text.split(' ');
  let line = '', y = H * .66;
  for (const w of words) {
    if (ctx.measureText(line + w).width > W * .8) { ctx.fillText(line, W / 2, y); y += 24; line = ''; }
    line += w + ' ';
  }
  ctx.fillText(line, W / 2, y);
  /* Scanlines */
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  for (let y2 = 0; y2 < H; y2 += 6) ctx.fillRect(0, y2, W, 3);
  /* Número de canal en pantalla */
  ctx.fillStyle = '#e8c84a';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(c.name, W - 24, 34);
  ctx.textAlign = 'center';
}
function frame() {
  if (switching > 0) {
    switching--;
    drawStatic();
    if (Math.random() < .1) clickNoise();
  } else {
    drawChannel(CHANNELS[ch]);
  }
  /* Viñeta y curvatura CRT */
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75);
  vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  requestAnimationFrame(frame);
}
frame();

/* Perilla: arrastrar en círculo o clic para zapear */
let dragging = false, lastAngle = 0;
function angleOf(e) {
  const r = knob.getBoundingClientRect();
  return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
}
knob.addEventListener('pointerdown', function (e) {
  dragging = true; lastAngle = angleOf(e);
  knob.setPointerCapture(e.pointerId);
});
knob.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  const a = angleOf(e);
  let d = a - lastAngle;
  if (d > 180) d -= 360; if (d < -180) d += 360;
  lastAngle = a;
  if (Math.abs(d) > 30) {
    zap(d > 0 ? 1 : -1);
    lastAngle = a;
  }
});
addEventListener('pointerup', function () { dragging = false; });
knob.addEventListener('click', function () { zap(1); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') zap(1);
  if (e.key === 'ArrowLeft') zap(-1);
});
function zap(dir) {
  ch = (ch + dir + CHANNELS.length) % CHANNELS.length;
  chNum.textContent = CHANNELS[ch].name;
  knob.style.transform = 'rotate(' + (ch * 90) + 'deg)';
  switching = 22;                                    // fotogramas de estática
  beepStatic();
}
function clickNoise() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 100 + Math.random() * 400;
    g.gain.setValueAtTime(.02, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .05);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .05);
  } catch (e) { /* opcional */ }
}
function beepStatic() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .3;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * .5;
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1000;
    const g = a.createGain(); g.gain.value = .12;
    src.connect(f).connect(g).connect(a.destination); src.start();
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

