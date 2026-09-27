/* Cupón de Cita Especial
 * Cupón interactivo con botón "Canjear cita": confeti animado y validad por el corazón.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Cupón de cita: canjear dispara confeti, sello y deshabilita (hasta re-clik para renovar). */
'use strict';
const btn = document.getElementById('redeemBtn');
const stamp = document.getElementById('stamp');
const coupon = document.getElementById('coupon');
const CONFETTI = ['💖', '✨', '🎉', '🌟', '💕', '🎊'];

btn.addEventListener('click', function () {
  if (btn.disabled) {
    /* Segundo clic: renovar cupón */
    btn.disabled = false;
    btn.textContent = 'Canjear cita 💌';
    stamp.classList.remove('show');
    coupon.classList.remove('redeemed');
    return;
  }
  btn.disabled = true;
  btn.textContent = '¡Cita canjeada! ✓ (clic para otra)';
  stamp.classList.add('show');
  coupon.classList.add('redeemed');
  chime();
  confettiBurst();
});
/* Confeti con canvas overlay ligero: elementos DOM animados */
function confettiBurst() {
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 42; i++) {
    const el = document.createElement('div');
    el.textContent = CONFETTI[Math.floor(Math.random() * CONFETTI.length)];
    el.style.cssText = 'position:fixed;z-index:50;pointer-events:none;font-size:' + (13 + Math.random() * 14) + 'px;left:' + cx + 'px;top:' + cy + 'px;transition:transform 1.4s cubic-bezier(.15,.8,.3,1),opacity 1.4s';
    document.body.appendChild(el);
    const ang = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    requestAnimationFrame(function () {
      el.style.transform = 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist - 90) + 'px) rotate(' + ((Math.random() - .5) * 540) + 'deg)';
      el.style.opacity = '0';
    });
    setTimeout(function () { el.remove(); }, 1500);
  }
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [659, 784, 988, 1318].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .1); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .9);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .9);
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

