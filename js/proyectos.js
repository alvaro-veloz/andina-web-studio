    // ── CURSOR — solo desktop ──
    (function () {
      var isTouch = window.matchMedia('(pointer: coarse)').matches;
      if (isTouch) return;
      var cur = document.getElementById('cursor');
      var ring = document.getElementById('cursorRing');
      if (!cur || !ring) return;
      var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
      cur.style.opacity = '0'; ring.style.opacity = '0';
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        cur.style.opacity = '1'; ring.style.opacity = '1';
      });
      (function anim() {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(anim);
      })();
      document.querySelectorAll('a,.pf-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.style.width = '52px'; ring.style.height = '52px'; });
        el.addEventListener('mouseleave', function () { ring.style.width = '36px'; ring.style.height = '36px'; });
      });
    })();

    // ── GSAP card reveals ──
    if (typeof gsap !== 'undefined') {
      gsap.from('.pf-card', {
        opacity: 0, y: 40, scale: 0.97,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: undefined,
        delay: 0.3
      });
    }

    // ── STICKY FOOTER REVEAL ──
    // El footer ya es sticky por CSS — el main tiene z-index:1 y el footer z-index:0

    // ── VINILO ──
    (function () {
      var audio = document.getElementById('vinylAudio');
      var disc = document.getElementById('vinylDisc');
      var outer = disc ? disc.querySelector('.vinyl-outer') : null;
      var info = document.getElementById('vinylInfo');
      var trackName = document.getElementById('vinylTrackName');
      var shuffle = document.getElementById('vinylShuffle');
      if (!audio || !disc) return;

      var tracks = [
        { src: 'assets/audio/track1.mp3', title: 'Always — DISTRXCT' },
        { src: 'assets/audio/track2.mp3', title: 'Stylish Lifestyle — Dope Cat' },
      ];
      var current = 0;
      var infoTimer = null;
      audio.volume = 0.5;

      function showInfo() {
        clearTimeout(infoTimer);
        info.classList.add('visible');
        infoTimer = setTimeout(function () { info.classList.remove('visible'); }, 3000);
      }

      function loadTrack(idx) {
        audio.src = tracks[idx].src;
        trackName.textContent = tracks[idx].title;
        showInfo();
      }

      disc.addEventListener('click', function () {
        if (!audio.src || audio.src === window.location.href) loadTrack(current);
        if (audio.paused) {
          audio.play(); outer.classList.add('spinning'); showInfo();
        } else {
          audio.pause(); outer.classList.remove('spinning');
        }
      });

      audio.addEventListener('ended', function () {
        current = (current + 1) % tracks.length;
        loadTrack(current); audio.play(); outer.classList.add('spinning');
      });

      shuffle.addEventListener('click', function () {
        current = (current + 1) % tracks.length;
        loadTrack(current);
        if (!audio.paused) { audio.play(); outer.classList.add('spinning'); }
      });

      disc.addEventListener('mouseenter', showInfo);
    })();

    // ── LOGOS ROTANTES ──
    (function () {
      var items = document.querySelectorAll('.pf-brand-item');
      if (!items.length) return;
      var current = 0;
      setInterval(function () {
        items[current].classList.remove('active');
        current = (current + 1) % items.length;
        items[current].classList.add('active');
      }, 2500);
    })();

  window.addEventListener('load', function () {
    if (typeof Swup === 'undefined') return;
    var swup = new Swup({
      containers: ['#swup'],
      animationSelector: '[class*="transition-"]'
    });
  });

/* Menú mobile — hamburguesa */
(function () {
  var hamburger = document.getElementById('pfHamburger');
  var mobileMenu = document.getElementById('pfMobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  window.pfCloseMobile = function () {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  };
})();
