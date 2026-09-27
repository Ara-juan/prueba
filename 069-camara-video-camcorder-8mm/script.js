/* Camcorder 8mm
 * Vista de grabadora con REC parpadeante, batería que baja, fecha retro y filtro VHS auténtico.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Camcorder: REC, timecode real, batería que se agota (y se recarga con un clic) y efecto VHS. */
'use strict';
const recEl = document.getElementById('rec');
const timecodeEl = document.getElementById('timecode');
const batteryEl = document.getElementById('battery');
const batLevel = document.getElementById('batLevel');
const dateStamp = document.getElementById('dateStamp');
let recording = true, frames = 0, bat = 100, dateIdx = 0;

const DATES = [
  'JUL.14 1998 PM 7:42',
  'DIC.24 2001 PM 11:05',
  'FEB.14 2004 PM 8:15',
  'HOY PM ' + new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
];
document.getElementById('dateBtn').addEventListener('click', function () {
  dateIdx = (dateIdx + 1) % DATES.length;
  dateStamp.textContent = DATES[dateIdx];
  beep(600);
});
document.getElementById('pauseBtn').addEventListener('click', function () {
  recording = !recording;
  recEl.classList.toggle('paused', !recording);
  recEl.lastChild.textContent = recording ? 'REC' : 'PAUSE';
  document.getElementById('pauseBtn').textContent = recording ? '❚❚ PAUSA' : '▶ GRABAR';
  beep(recording ? 900 : 300);
});
document.getElementById('stopBtn').addEventListener('click', function () {
  /* Detener: rebobina con efecto de cinta y resetea */
  recording = false;
  recEl.classList.add('paused');
  recEl.lastChild.textContent = 'STOP';
  rewindSound();
  frames = 0;
  bat = 100;
  setTimeout(function () {
    recording = true;
    recEl.classList.remove('paused');
    recEl.lastChild.textContent = 'REC';
    beep(900);
  }, 1400);
});
/* Timecode y batería */
setInterval(function () {
  if (recording) frames++;
  const f = frames % 30, s = Math.floor(frames / 30) % 60, m = Math.floor(frames / 1800) % 60, h = Math.floor(frames / 108000);
  timecodeEl.textContent = [h, m, s, f].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  if (recording) bat = Math.max(3, bat - .12);
  batLevel.style.width = bat + '%';
  batteryEl.classList.toggle('low', bat < 22);
  if (bat < 22 && Math.random() < .06) beep(140);
}, 1000 / 30);
function beep(freq) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .1);
  } catch (e) { /* opcional */ }
}
function rewindSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(200, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1400, a.currentTime + 1.2);
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.3);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.3);
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

