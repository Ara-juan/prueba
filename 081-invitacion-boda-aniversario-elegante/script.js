/* Invitación de Boda/Aniversario
 * Tarjeta elegante con cuenta regresiva en vivo, mapa decorado y RSVP con modal.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Invitación elegante: cuenta regresiva en vivo, pin del mapa y modal RSVP. */
'use strict';
/* --- Cuenta regresiva hasta la boda (se renueva sola si la fecha pasó) --- */
function nextTarget() {
  const now = new Date();
  let t = new Date(now.getFullYear(), 1, 14, 17, 0, 0);   // próximo 14 de febrero, 17:00
  if (t - now <= 0) t = new Date(now.getFullYear() + 1, 1, 14, 17, 0, 0);
  return t;
}
let TARGET = nextTarget();
function tickCountdown() {
  const diff = TARGET - new Date();
  if (diff <= 0) { TARGET = nextTarget(); return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  document.getElementById('cdD').textContent = d;
  document.getElementById('cdH').textContent = String(h).padStart(2, '0');
  document.getElementById('cdM').textContent = String(m).padStart(2, '0');
  document.getElementById('cdS').textContent = String(s).padStart(2, '0');
}
setInterval(tickCountdown, 1000);
tickCountdown();

/* --- Mapa: el pin rebota y muestra un toast al pulsarlo --- */
const pin = document.getElementById('venuePin');
let bounce = 0;
setInterval(function () {
  bounce += .1;
  pin.setAttribute('cy', 75 - Math.abs(Math.sin(bounce)) * 6);
}, 60);
document.getElementById('map').addEventListener('click', function () {
  toast('📍 Jardín Los Robles · Camino del Valle 143 · Estacionamiento gratis');
});

/* --- Modal RSVP --- */
const modal = document.getElementById('modal');
document.getElementById('rsvpOpen').addEventListener('click', function () {
  modal.classList.add('show');
  chime();
});
modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
document.getElementById('rsvpForm').addEventListener('submit', function (e) {
  e.preventDefault();
  [...this.querySelectorAll('.field, button[type=submit], h2')].forEach(function (el) { el.style.display = 'none'; });
  document.getElementById('thanksMsg').style.display = 'block';
  fanfare();
});

/* Toast flotante */
function toast(text) {
  const t = document.createElement('div');
  t.textContent = text;
  t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:#3a3428;color:#faf6ee;padding:12px 22px;border-radius:999px;font-size:.85rem;z-index:60;opacity:0;transition:.4s;max-width:90vw;text-align:center';
  document.body.appendChild(t);
  requestAnimationFrame(function () { t.style.opacity = '1'; t.style.transform = 'translateX(-50%)'; });
  setTimeout(function () { t.style.opacity = '0'; }, 3200);
  setTimeout(function () { t.remove(); }, 3700);
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 784;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .13); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
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

