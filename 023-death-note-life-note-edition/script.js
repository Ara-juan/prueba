/* Death Note (Life Note Edition)
 * Escribe un nombre en el libro gótico y recibe un certificado con las razones por las que esa persona es especial.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Life Note: al escribir un nombre se genera un certificado con razones góticamente bonitas. */
'use strict';
const input = document.getElementById('who');
const btn = document.getElementById('write');
const cert = document.getElementById('cert');
const certName = document.getElementById('certName');
const reasonsEl = document.getElementById('reasons');

const REASONS = [
  'porque su sonrisa desactiva cualquier día gris',
  'porque escucha como si el mundo se detuviera',
  'porque convierte lo ordinario en aventura',
  'porque su risa debería estar en museos',
  'porque regala paz incluso en plena tormenta',
  'porque el universo claramente la escribió con esmero'
];

function bell() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = 196;
    g.gain.setValueAtTime(.12, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.4);
  } catch (e) { /* opcional */ }
}

function reveal() {
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  /* Selecciona 3 razones aleatorias sin repetir */
  const picked = REASONS.slice().sort(function () { return Math.random() - .5; }).slice(0, 3);
  certName.textContent = name;
  reasonsEl.innerHTML = '';
  picked.forEach(function (r, i) {
    const li = document.createElement('li');
    li.textContent = (i + 1) + '. ' + r + ';';
    li.style.opacity = '0';
    li.style.transition = 'opacity .6s ' + (i * .35 + .2) + 's';
    reasonsEl.appendChild(li);
    requestAnimationFrame(function () { requestAnimationFrame(function () { li.style.opacity = '1'; }); });
  });
  cert.style.display = 'block';
  requestAnimationFrame(function () { cert.classList.add('show'); });
  bell();
  cert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
btn.addEventListener('click', reveal);
input.addEventListener('keydown', function (e) { if (e.key === 'Enter') reveal(); });
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

