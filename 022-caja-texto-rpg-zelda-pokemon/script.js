/* Caja de Texto RPG
 * Diálogo clásico con efecto typewriter, pitidos de 8 bits y opciones de respuesta.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Caja de texto RPG: typewriter con pitidos 8-bit, ramificación de diálogo y navegación por teclado. */
'use strict';
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');
const sceneEl = document.getElementById('scene');

/* Árbol de diálogo */
const NODES = {
  start: {
    speaker: 'Guía del camino', sprite: '🧝',
    text: '¡Hola, viajero! Dicen que por estos lares vive alguien con el corazón más valiente del reino… ¿Acaso eres tú?',
    choices: [
      { label: '¡Sí, soy esa persona!', next: 'brave' },
      { label: 'Solo pasaba por aquí…', next: 'humble' }
    ]
  },
  brave: {
    speaker: 'Guía del camino', sprite: '🧝',
    text: '¡Lo sabía! Tu inventario guarda algo muy valioso: la amistad de quien te escribió esta carta.',
    choices: [{ label: 'Continuar la aventura ▶', next: 'final' }]
  },
  humble: {
    speaker: 'Guía del camino', sprite: '🧝',
    text: 'Los héroes nunca se creen héroes… por eso lo eres. La persona que te envía este mensaje lo tiene claro.',
    choices: [{ label: 'Continuar la aventura ▶', next: 'final' }]
  },
  final: {
    speaker: 'Guía del camino', sprite: '✨',
    text: 'Que tu quest esté llena de risas, tesoros y abrazos. ¡Sigue adelante, NIVEL DE CARIÑO +100!',
    choices: [{ label: 'Reiniciar la historia ↺', next: 'start' }]
  }
};

let typing = false, typeTimer = null, pendingChoices = [];
let selIndex = 0;

/* Pitido 8-bit por carácter */
let audioCtx = null;
function blip() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 620 + Math.random() * 160;
    g.gain.setValueAtTime(.025, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .06);
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + .06);
  } catch (e) { /* opcional */ }
}

function showNode(key) {
  const node = NODES[key];
  sceneEl.textContent = node.sprite;
  pendingChoices = node.choices || [];
  selIndex = 0;
  typeWriter(node.text, function () { renderChoices(); });
}

function typeWriter(str, done) {
  typing = true;
  textEl.classList.remove('done');
  textEl.textContent = '';
  choicesEl.innerHTML = '';
  let i = 0;
  clearInterval(typeTimer);
  typeTimer = setInterval(function () {
    textEl.textContent += str[i];
    if (str[i] !== ' ') blip();
    i++;
    if (i >= str.length) {
      clearInterval(typeTimer);
      typing = false;
      textEl.classList.add('done');
      if (done) done();
    }
  }, 34);
}

function renderChoices() {
  choicesEl.innerHTML = '';
  pendingChoices.forEach(function (c, i) {
    const b = document.createElement('button');
    b.className = 'choice' + (i === selIndex ? ' sel' : '');
    b.textContent = (i === selIndex ? '▶ ' : '　') + c.label;
    b.addEventListener('click', function () { selIndex = i; advance(); });
    choicesEl.appendChild(b);
  });
}

function advance() {
  if (typing || !pendingChoices.length) {
    if (typing) {                                  // acelerar el texto con un clic
      clearInterval(typeTimer);
      typing = false;
      textEl.classList.add('done');
      renderChoices();
    }
    return;
  }
  blip();
  showNode(pendingChoices[selIndex].next);
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { e.preventDefault(); advance(); }
  if (!pendingChoices.length) return;
  if (e.key === 'ArrowDown') { selIndex = (selIndex + 1) % pendingChoices.length; renderChoices(); }
  if (e.key === 'ArrowUp') { selIndex = (selIndex - 1 + pendingChoices.length) % pendingChoices.length; renderChoices(); }
});
document.querySelector('.dialog').addEventListener('click', advance);
showNode('start');
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

