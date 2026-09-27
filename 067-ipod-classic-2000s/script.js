/* iPod Classic 2000s
 * Rueda de clic funcional: navega la lista de "canciones" que en realidad son nuestros momentos.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* iPod: menú navegable con rueda de clic y "canciones" = momentos. */
'use strict';
const SONGS = [
  'Tu risa en la cocina — 4:33',
  'Llamadas de 3 horas — 3:00:12',
  'El chiste interno #7 — 0:47',
  'Amanecer sin dormirnos — 5:56',
  'Playlist de la carretera — 1:58:00',
  'Bailar sin razón — 3:21',
  'Silencio cómodo — ∞',
  'Este momento ahora mismo — 0:01 (en reproducción)'
];
const menuArea = document.getElementById('menuArea');
const titleRow = document.getElementById('titleRow');
const npRow = document.getElementById('npRow');
const thumb = document.getElementById('thumb');
let sel = 0, playing = false, elapsed = 0;

function render() {
  titleRow.textContent = 'MOMENTOS ♥ (' + SONGS.length + ')';
  menuArea.innerHTML = SONGS.map(function (s, i) {
    return '<div class="mi' + (i === sel ? ' sel' : '') + '">' + (i + 1) + '. ' + s + '</div>';
  }).join('');
  /* Mini reproductor abajo */
  npRow.textContent = (playing ? '▶ ' : '❙❙ ') + fmt(elapsed) + ' ♪ ' + SONGS[sel].split(' — ')[0];
  /* Scrollbar proporcional */
  const vis = Math.min(SONGS.length, 7);
  thumb.style.height = (vis / SONGS.length * 100) + '%';
  thumb.style.top = (sel / SONGS.length * (100 - vis / SONGS.length * 100)) + '%';
  /* Mantener selección visible */
  const items = menuArea.children;
  if (items[sel]) items[sel].scrollIntoView({ block: 'nearest' });
}
function fmt(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}
setInterval(function () {
  if (playing) { elapsed++; npRow.textContent = (playing ? '▶ ' : '❙❙ ') + fmt(elapsed) + ' ♪ ' + SONGS[sel].split(' — ')[0]; }
}, 1000);

function act(a) {
  click();
  if (a === 'next') { sel = (sel + 1) % SONGS.length; elapsed = 0; }
  if (a === 'prev') { sel = (sel - 1 + SONGS.length) % SONGS.length; elapsed = 0; }
  if (a === 'play') { playing = !playing; if (playing) tickSound(); }
  if (a === 'menu') { sel = 0; elapsed = 0; playing = false; }
  if (a === 'select') {
    playing = true; elapsed = 0;
    /* Sorpresa: el iPod "dice" algo bonito */
    const msg = ['♪ Está sonando: nuestro momento favorito', '♪ Dedicatoria cargada al 100%', '♪ Este tema nunca se acaba', '♪ Reproduciendo: tú'][sel % 4];
    npRow.textContent = msg;
    setTimeout(render, 1800);
    return;
  }
  render();
}
/* La rueda: también deslizable en círculo para desplazar la selección */
const wheel = document.getElementById('wheel');
let wheelDrag = false, lastWheelAngle = 0, wheelAccum = 0;
function wAngle(e) {
  const r = wheel.getBoundingClientRect();
  return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
}
wheel.addEventListener('pointerdown', function (e) {
  if (e.target.dataset.act) return;                  // los botones usan click
  wheelDrag = true; lastWheelAngle = wAngle(e); wheelAccum = 0;
});
wheel.addEventListener('pointermove', function (e) {
  if (!wheelDrag) return;
  const a = wAngle(e);
  let d = a - lastWheelAngle;
  if (d > 180) d -= 360; if (d < -180) d += 360;
  wheelAccum += d;
  lastWheelAngle = a;
  if (wheelAccum > 24) { sel = (sel + 1) % SONGS.length; wheelAccum = 0; click(); render(); }
  if (wheelAccum < -24) { sel = (sel - 1 + SONGS.length) % SONGS.length; wheelAccum = 0; click(); render(); }
});
addEventListener('pointerup', function () { wheelDrag = false; });
wheel.querySelectorAll('[data-act]').forEach(function (b) {
  b.addEventListener('click', function () { act(b.dataset.act); });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowDown') act('next');
  if (e.key === 'ArrowUp') act('prev');
  if (e.key === 'Enter') act('select');
  if (e.key === ' ') { e.preventDefault(); act('play'); }
});
function click() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 1800;
    g.gain.setValueAtTime(.025, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .04);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .04);
  } catch (e) { /* opcional */ }
}
function tickSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .2);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .2);
  } catch (e) { /* opcional */ }
}
render();
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

