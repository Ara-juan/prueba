/* Tarot de la Dedicatoria
 * Baraja mística: elige tres cartas, voltéalas y lee los augurios más bonitos del universo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tarot: baraja mezclada, volteo 3D y lectura de augurios al revelar las tres cartas. */
'use strict';
const DECK = [
  ['☀️', 'El Sol Radiante', 'XIX', 'Tu energía calienta todo lo que toca. Augurio: días dorados en abundancia.'],
  ['🌙', 'La Luna Cómplice', 'XVIII', 'Custodia tus noches y tus sueños. Augurio: descanso reparador e ideas brillantes.'],
  ['🌟', 'La Estrella Guiadora', 'XVII', 'Iluminas caminos sin darte cuenta. Augurio: esperanza confirmada por el universo.'],
  ['❤️', 'El Corazón Eterno', '∞', 'Capacidad de amar: ilimitada. Augurio: vínculos que ninguna distancia dobla.'],
  ['🛡️', 'La Fuerza Serena', 'XI', 'Tu calma vence batallas sin levantar la voz. Augurio: todo desafío, a tu tamaño.'],
  ['🌸', 'La Primavera Perpetua', '0', 'Renuevas lo que tocas. Augurio: comienzos hermosos una y otra vez.'],
  ['🗝️', 'La Llave de los Deseos', 'VI', 'Abre lo que otros ni siquiera ven cerrado. Augurio: tus deseos, escuchados al fin.'],
  ['🔮', 'La Videncia Feliz', 'XIII', 'Ve lo bueno incluso en los martes grises. Augurio: optimismo a prueba de todo.']
];
const spread = document.getElementById('spread');
const readingEl = document.getElementById('reading');
const hint = document.getElementById('hint');
let flipped = 0, revealed = [];

/* Mezcla y toma 3 cartas */
const hand = DECK.slice().sort(function () { return Math.random() - .5; }).slice(0, 3);

hand.forEach(function (c, i) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML =
    '<div class="face back"></div>'
    + '<div class="face front">'
    + '<div class="roman">' + c[2] + '</div>'
    + '<div class="glyph">' + c[0] + '</div>'
    + '<h3>' + c[1] + '</h3>'
    + '<p>' + c[3] + '</p>'
    + '</div>';
  el.addEventListener('click', function () {
    if (el.classList.contains('flipped')) return;
    el.classList.add('flipped');
    flipped++;
    revealed.push(c);
    chime(flipped);
    if (flipped === 3) {
      hint.style.display = 'none';
      setTimeout(function () {
        readingEl.innerHTML = '"Las cartas han hablado: <b>' + revealed.map(function (r) { return r[1]; }).join('</b>, <b>') + '</b>. Lectura final: quien recibe estas cartas está rodeado de una energía extraordinariamente buena… y es que el universo tiene favoritos, y claramente eres uno de ellos." ✨';
        readingEl.classList.add('show');
      }, 600);
    }
  });
  spread.appendChild(el);
});

function chime(n) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 440 * Math.pow(2, n / 4);
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
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

