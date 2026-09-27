/* Botón Escurridizo: ¿Quieres ser mi…?
 * El botón "No" huye del ratón por toda la pantalla mientras el botón "Sí" crece sin piedad.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Botón escurridizo: el "No" huye con cálculo de posición y mensajes que se burlan. */
'use strict';
/* DEDIC: la pregunta incluye el nombre del link compartido */
(function () {
  if (window.DEDIC && DEDIC.para && DEDIC.para !== 'Ti') {
    var h1 = document.querySelector('h1');
    if (h1) h1.textContent = '¿' + DEDIC.para + ', quieres seguir siendo mi persona favorita? 💘';
  }
})();
const no = document.getElementById('no');
const yes = document.getElementById('yes');
const yay = document.getElementById('yay');
const SUBS = [
  '¿Segura/o? Piénsalo otra vez…',
  'Vaya, el botón se resbala. Qué raro.',
  'El "No" está cansado de huir. El "Sí" espera paciente…',
  'Última oportunidad antes de que el "Sí" ocupe la pantalla',
  'El destino ha hablado: solo queda una opción decente'
];
let flees = 0, yesScale = 1;

/* El "No" huye cuando el cursor se acerca (antes de poder hacer clic) */
document.addEventListener('pointermove', function (e) {
  if (no.classList.contains('fleeing')) {
    const r = no.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (d < 110) flee();
  }
});
no.addEventListener('pointerenter', flee);
no.addEventListener('click', function (e) { e.preventDefault(); flee(); });

function flee() {
  flees++;
  /* El "Sí" crece sin piedad */
  yesScale = Math.min(2.6, 1 + flees * .22);
  yes.style.transform = 'scale(' + yesScale + ')';
  yes.classList.add('growing');
  /* Muestra el botón NO flotando por la pantalla */
  if (!no.classList.contains('fleeing')) {
    const r = no.getBoundingClientRect();
    no.classList.add('fleeing');
    no.style.left = r.left + 'px';
    no.style.top = r.top + 'px';
    no.style.margin = '0';
  }
  /* Nueva posición aleatoria lejos del cursor y dentro de la ventana */
  const w = no.offsetWidth, h = no.offsetHeight;
  const nx = 16 + Math.random() * (innerWidth - w - 32);
  const ny = 16 + Math.random() * (innerHeight - h - 32);
  no.style.left = nx + 'px';
  no.style.top = ny + 'px';
  /* Se encoge un poco cada vez */
  no.style.transform = 'scale(' + Math.max(.5, 1 - flees * .1) + ')';
  boing();
  /* Mensajes burlones */
  document.querySelector('.sub').textContent = SUBS[Math.min(SUBS.length - 1, Math.floor(flees / 2))];
  /* Si huyó muchas veces, se rinde y se convierte en otro "Sí" */
  if (flees >= 8) {
    no.textContent = '¡Vale, SÍ! 🏳️';
    no.style.background = 'var(--green)';
    no.style.color = '#fff';
    no.style.border = 'none';
    no.onpointerenter = null;
    no.onclick = function () { win(); };
  }
}
yes.addEventListener('click', win);
function win() {
  yay.classList.add('show');
  fanfare();
  heartRain();
}
/* Lluvia de corazones */
function heartRain() {
  for (let i = 0; i < 50; i++) {
    setTimeout(function () {
      const h = document.createElement('div');
      h.textContent = ['💖', '💕', '💗', '💞', '❤️'][Math.floor(Math.random() * 5)];
      h.style.cssText = 'position:fixed;z-index:70;pointer-events:none;font-size:' + (14 + Math.random() * 22) + 'px;left:' + (Math.random() * 100) + 'vw;top:-40px;transition:transform 2.4s linear,opacity 2.4s';
      document.body.appendChild(h);
      requestAnimationFrame(function () {
        h.style.transform = 'translateY(' + (innerHeight + 90) + 'px) rotate(' + ((Math.random() - .5) * 90) + 'deg)';
      });
      setTimeout(function () { h.remove(); }, 2600);
    }, i * 60);
  }
}
function boing() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300 + Math.random() * 200, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(150, a.currentTime + .12);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .16);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .16);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046, 1318].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .11); });
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.1);
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

