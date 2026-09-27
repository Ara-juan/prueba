/* Puerta de Calcifer (Castillo Ambulante)
 * Gira el picaporte del portal mágico: cada posición cambia el mundo (y su historia) por completo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Puerta de Calcifer: cada giro de la rueda cambia el fondo (gradiente animado) y la historia. */
'use strict';
const dial = document.getElementById('dial');
const frame = document.getElementById('frame');
const door = document.getElementById('door');
const world = document.getElementById('world');
const worldName = document.getElementById('worldName');
const storyEl = document.getElementById('story');
const pipsEl = document.getElementById('pips');

const WORLDS = [
  { name: 'Reino de Páramos', sky: ['#8a9ab0', '#c7c2a8', '#6b7563'], story: 'Marismas susurrantes y un cielo que huele a aventura. Aquí las nubes viajan más que los reyes.' },
  { name: 'Ciudad de Puertos', sky: ['#5d8ab0', '#a8c7d4', '#e8d4a8'], story: 'Barcos, gaviotas y pan recién hecho. El puerto donde todos los regresos saben a hogar.' },
  { name: 'Jardín Secreto', sky: ['#7ab06b', '#b0d48a', '#f0e6b0'], story: 'Un jardín escondido que florece solo para quien sabe sonreír de verdad.' },
  { name: 'Noche Estrellada', sky: ['#1a1a3a', '#3a2a5a', '#8a5a7a'], story: 'La avenida de las estrellas: hasta el castillo se detiene a mirarlas contigo.' }
];
let idx = 0, turning = false;

WORLDS.forEach(function () {
  const p = document.createElement('span');
  p.className = 'pip';
  pipsEl.appendChild(p);
});
function updatePips() {
  [...pipsEl.children].forEach(function (p, i) { p.classList.toggle('on', i <= idx); });
}

/* Fondo procedural en canvas: colinas + cielo del mundo activo */
const ctx = world.getContext ? null : null;          // (world es un div; el fondo se pinta con CSS)
function paintWorld() {
  const w = WORLDS[idx];
  world.style.background = 'linear-gradient(180deg,' + w.sky[0] + ' 0%,' + w.sky[1] + ' 55%,' + w.sky[2] + ' 100%)';
  worldName.textContent = w.name;
  worldName.style.animation = 'none'; void worldName.offsetWidth;
  worldName.style.animation = 'fadeUp .9s ease';
  typeStory(w.story);
  updatePips();
}
/* Animación de entrada del texto del mundo */
const style = document.createElement('style');
style.textContent = '@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}';
document.head.appendChild(style);

/* Historia con typewriter suave */
let storyTimer = null;
function typeStory(text) {
  clearInterval(storyTimer);
  storyEl.textContent = '';
  let i = 0;
  storyTimer = setInterval(function () {
    storyEl.textContent += text[i]; i++;
    if (i >= text.length) clearInterval(storyTimer);
  }, 26);
}

/* Sonido de manivela: clics metálicos */
function creak() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(140, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, a.currentTime + .3);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .35);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .35);
  } catch (e) { /* opcional */ }
}

frame.addEventListener('click', function () {
  if (turning) return;
  turning = true;
  creak();
  frame.classList.add('open');                       // la puerta gira
  setTimeout(function () {
    idx = (idx + 1) % WORLDS.length;
    dial.style.transform = 'rotate(' + (idx * 90 + 360) + 'deg)';
    paintWorld();
  }, 500);
  setTimeout(function () { frame.classList.remove('open'); turning = false; }, 1500);
});
paintWorld();
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

