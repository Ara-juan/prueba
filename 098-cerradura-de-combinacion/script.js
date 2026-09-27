/* Cerradura de Combinación
 * Caja fuerte con dial: gira las tres ruedas hasta la clave especial y descubre lo que guarda.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Cerradura: 3 diales arrastrables/clicables; clave 14-02-143 (el tercero modular 0-99). */
'use strict';
const CODE = [14, 2, 43];                              // el tercer dial guarda 143 % 100 = 43 (guiño 1:43)
const MAX = [31, 12, 99];                             // día, mes, número libre
const dialsEl = document.getElementById('dials');
const arrowsEl = document.getElementById('arrows');
const status = document.getElementById('status');
const handle = document.getElementById('handle');
const content = document.getElementById('content');
const values = [1, 1, 1];
let unlocked = false;

/* Construye los diales */
for (let i = 0; i < 3; i++) {
  const col = document.createElement('div');
  col.className = 'dial-col';
  const dial = document.createElement('div');
  dial.className = 'dial';
  dial.innerHTML = '<span class="mark">▼</span><span class="num">01</span>';
  dial.dataset.idx = i;
  col.appendChild(dial);
  dialsEl.appendChild(col);
  /* Botones ↑ ↓ por dial */
  const up = document.createElement('button');
  up.textContent = '▲';
  up.addEventListener('click', function () { turn(i, 1); });
  const down = document.createElement('button');
  down.textContent = '▼';
  down.addEventListener('click', function () { turn(i, -1); });
  arrowsEl.appendChild(up);
  arrowsEl.appendChild(down);
  /* Arrastre vertical */
  let dragY = null;
  dial.addEventListener('pointerdown', function (e) { dragY = e.clientY; dial.setPointerCapture(e.pointerId); });
  dial.addEventListener('pointermove', function (e) {
    if (dragY === null) return;
    if (Math.abs(e.clientY - dragY) > 26) {
      turn(i, e.clientY < dragY ? 1 : -1);
      dragY = e.clientY;
    }
  });
  dial.addEventListener('pointerup', function () { dragY = null; });
}
const dialEls = [...dialsEl.querySelectorAll('.dial')];

function turn(idx, dir) {
  if (unlocked) return;
  values[idx] = ((values[idx] - 1 + dir + MAX[idx]) % MAX[idx]) + 1;
  render(idx);
  clickSound();
  check();
}
function render(idx) {
  dialEls[idx].querySelector('.num').textContent = String(values[idx]).padStart(2, '0');
  dialEls[idx].style.transform = 'rotate(' + (values[idx] * 24) + 'deg)';
}
function check() {
  const ok = values.every(function (v, i) { return v === CODE[i]; });
  if (ok && !unlocked) {
    unlocked = true;
    status.textContent = '¡CLAVE CORRECTA! Girando el pestillo…';
    status.className = 'status ok';
    handle.classList.add('open');
    unlockSound();
    setTimeout(function () {
      content.classList.add('show');
      fanfare();
    }, 1100);
  } else if (!ok) {
    status.textContent = 'Combinación: ' + values.map(function (v) { return String(v).padStart(2, '0'); }).join(' · ');
    status.className = 'status';
  }
}
/* Teclado: flechas para girar los diales */
document.addEventListener('keydown', function (e) {
  if (unlocked) return;
  if (e.key === 'ArrowUp') { e.preventDefault(); turn(1, 1); }
  if (e.key === 'ArrowDown') { e.preventDefault(); turn(1, -1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); turn(2, 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); turn(2, -1); }
});
function clickSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 340;
    g.gain.setValueAtTime(.045, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .07);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .07);
  } catch (e) { /* opcional */ }
}
function unlockSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [392, 523, 659].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .15); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
  } catch (e) { /* opcional */ }
}
[0, 1, 2].forEach(render);
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

