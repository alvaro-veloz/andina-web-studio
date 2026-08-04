/* ============================================================
   Andina Web Studio — about.js
   Script propio de about.html (diseño editorial, sin dependencias)
============================================================ */

(function () {
  var btn = document.getElementById('abHamburger');
  var menu = document.getElementById('abMobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();
