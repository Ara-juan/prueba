/* Menú Matcha Coffee Shop
 * Cafetería estética: las bebidas son momentos compartidos y el recibo impreso es la dedicatoria.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Café matcha: pedido de momentos + recibo imprimible con dedicatoria. */
'use strict';
const ITEMS = [
  ['Matcha Latte del Primer Encuentro', 'con espuma de nervios bonitos', '4.5'],
  ['Frappé de Risas Infinitas', 'tamaño: enorme, como la conversación', '5.0'],
  ['Té Chai de las Madrugadas', 'especiado con secretos compartidos', '4.0'],
  ['Espresso Doble de Energía Mutua', 'para días largos y abrazos cortos', '3.5'],
  ['Chocolate Caliente de Consuelo', 'con malvaviscos de "todo va a estar bien"', '4.8'],
  ['Agua de Horchata y Nostalgia', 'sabor a tardes que no volverán… pero dejaron todo', '3.8']
];
const itemsEl = document.getElementById('items');
const rItems = document.getElementById('rItems');
const rTotal = document.getElementById('rTotal');
const totalEl = document.getElementById('total');
const order = [];

ITEMS.forEach(function (it, i) {
  const row = document.createElement('div');
  row.className = 'item';
  row.innerHTML = '<div class="name">' + it[0] + '<small>' + it[1] + '</small></div><span class="price">♥ ' + it[2] + '</span>';
  row.addEventListener('click', function () {
    order.push(it);
    totalEl.textContent = order.length + (order.length === 1 ? ' momento' : ' momentos');
    renderReceipt();
    chime(500 + i * 60);
  });
  itemsEl.appendChild(row);
});

function renderReceipt() {
  if (!order.length) { rItems.innerHTML = '<div class="row"><span>— pedido vacío —</span></div>'; rTotal.textContent = '0%'; return; }
  rItems.innerHTML = order.map(function (it) {
    return '<div class="row"><span>1× ' + it[0] + '</span><span>♥' + it[2] + '</span></div>';
  }).join('');
  const sum = order.reduce(function (a, it) { return a + parseFloat(it[2]); }, 0);
  rTotal.textContent = Math.min(100, Math.round(sum / 26 * 100)) + '%';
}
document.getElementById('printBtn').addEventListener('click', function () {
  const r = document.getElementById('receipt');
  r.classList.remove('printed'); void r.offsetWidth;
  r.classList.add('printed');
  printSound();
  /* Sobrescribe la nota de agradecimiento con dedicatoria dinámica */
  r.querySelector('.thanks').innerHTML = order.length
    ? 'Pedido de: <b>mi persona favorita</b>.<br>Cada "bebida" fue un instante<br>que valió cada segundo. ♥'
    : 'Aún no pides nada…<br>pero ya eres lo mejor<br>de este menú. ♥';
});
function chime(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .35);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .35);
  } catch (e) { /* opcional */ }
}
function printSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .8;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      /* Traqueteo de impresora térmica */
      d[i] = (Math.sin(i * .35) > 0 ? 1 : -1) * (Math.random() * 2 - 1) * .4 * (1 - i / len);
    }
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2000; f.Q.value = .8;
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

