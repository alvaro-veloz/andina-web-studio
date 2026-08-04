/* ============================================================
   Andina Web Studio — notas-de-ruta.js
   Cubre: cursor custom, listado/filtro por categoría desde
   data/posts.json, carrusel Swiper, reveals GSAP, y en páginas
   de post: progreso de lectura, TOC automática, copiar link.
============================================================ */

function nrFormatDate(iso) {
  var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var d = new Date(iso + 'T12:00:00');
  return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
}

/* ---------- Menú mobile (hamburguesa) ---------- */
(function () {
  var btn = document.getElementById('nrHamburger');
  var menu = document.getElementById('nrMobileMenu');
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

/* ---------- Cursor personalizado — solo desktop ---------- */
(function () {
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;
  var cur = document.getElementById('nrCursor');
  var ring = document.getElementById('nrCursorRing');
  if (!cur || !ring) return;
  var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
  cur.style.opacity = '0'; ring.style.opacity = '0';
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    cur.style.opacity = '1'; ring.style.opacity = '1';
  });
  (function anim() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a, .nr-cat-tile, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', function () { ring.style.width = '36px'; ring.style.height = '36px'; });
  });
})();

/* ---------- Índice / filtro por categoría (notas-de-ruta.html) ---------- */
(function () {
  var listMount = document.getElementById('nrList');
  var carouselMount = document.getElementById('nrCarouselWrapper');
  var tiles = document.querySelectorAll('.nr-cat-tile');
  var resetBtn = document.getElementById('nrCatReset');
  if (!listMount && !tiles.length) return; // no estamos en el índice

  var allPosts = [];
  var activeCategory = null;

  function renderList(posts) {
    if (!listMount) return;
    if (!posts.length) {
      listMount.innerHTML = '<p class="nr-empty">Todavía no hay notas en esta categoría.</p>';
      return;
    }
    listMount.innerHTML = posts.map(function (p) {
      return (
        '<a class="nr-entry nr-reveal" href="' + p.url + '">' +
        '  <div class="nr-entry-date">' + nrFormatDate(p.date) + '</div>' +
        '  <div class="nr-entry-body">' +
        '    <h3>' + p.title + '</h3>' +
        '    <p class="nr-entry-dek">' + p.dek + '</p>' +
        '  </div>' +
        '</a>'
      );
    }).join('');
    if (window.gsap) {
      gsap.to('#nrList .nr-reveal', { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' });
    } else {
      listMount.querySelectorAll('.nr-reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }

  function renderCarousel(posts) {
    if (!carouselMount) return;
    var recent = posts.slice(0, 8);
    carouselMount.innerHTML = recent.map(function (p) {
      return (
        '<div class="swiper-slide">' +
        '  <a class="nr-card" href="' + p.url + '">' +
        '    <div class="nr-card-img"><img src="' + p.cover + '" alt="" loading="lazy"></div>' +
        '    <div class="nr-card-body">' +
        '      <div class="nr-card-meta">' + p.category + ' — ' + nrFormatDate(p.date) + '</div>' +
        '      <h3>' + p.title + '</h3>' +
        '    </div>' +
        '  </a>' +
        '</div>'
      );
    }).join('');
    if (window.Swiper) {
      new Swiper('.nr-swiper', {
        slidesPerView: 1.15,
        spaceBetween: 20,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.3 }
        },
        navigation: { nextEl: '.nr-swiper .swiper-button-next', prevEl: '.nr-swiper .swiper-button-prev' },
        pagination: { el: '.nr-swiper .swiper-pagination', clickable: true }
      });
    }
  }

  function applyFilter(category) {
    activeCategory = category;
    tiles.forEach(function (t) {
      t.classList.toggle('active', t.dataset.category === category);
    });
    if (resetBtn) resetBtn.classList.toggle('visible', !!category);
    var filtered = category ? allPosts.filter(function (p) { return p.category === category; }) : allPosts;
    renderList(filtered);
  }

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var cat = tile.dataset.category;
      applyFilter(activeCategory === cat ? null : cat);
      if (listMount) listMount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () { applyFilter(null); });
  }

  fetch('data/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      allPosts = posts;
      renderCarousel(posts);
      renderList(posts);
    })
    .catch(function (err) {
      console.error('No se pudo cargar data/posts.json', err);
      if (listMount) listMount.innerHTML = '<p class="nr-empty">No se pudo cargar el listado de notas.</p>';
    });
})();

/* ---------- Hero cinematográfico: typewriter + scroll-pin ---------- */
(function () {
  var hero = document.getElementById('nrHero');
  var eyebrow = document.getElementById('nrHeroEyebrow');
  if (!hero) return;

  /* Typewriter del eyebrow */
  if (eyebrow) {
    var text = 'ANDINA WEB STUDIO';
    var i = 0;
    (function type() {
      eyebrow.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) setTimeout(type, 45);
    })();
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: '#nrHero',
      start: 'top top',
      end: '+=90%',
      scrub: 0.4,
      pin: true,
      anticipatePin: 1
    }
  })
    .to('.nr-hero-bar-top', { yPercent: -100, ease: 'none' }, 0)
    .to('.nr-hero-bar-bottom', { yPercent: 100, ease: 'none' }, 0)
    .to('.nr-hero-title-left', { xPercent: -60, opacity: 0, ease: 'none' }, 0)
    .to('.nr-hero-title-right', { xPercent: 60, opacity: 0, ease: 'none' }, 0)
    .to('.nr-hero-eyebrow, .nr-hero-sub, .nr-scroll-cue', { opacity: 0, y: -16, ease: 'none' }, 0)
    .to('.nr-hero-media', { scale: 1.18, ease: 'none' }, 0);
})();

/* ---------- Reveals GSAP para hero/categorías (independiente del listado) ---------- */
(function () {
  if (typeof gsap === 'undefined') return;
  gsap.from('.nr-hero-eyebrow, .nr-hero-title, .nr-hero-sub', {
    opacity: 0, y: 24, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.3
  });
  gsap.utils.toArray('.nr-cat-tile').forEach(function (tile, i) {
    gsap.from(tile, {
      opacity: 0, y: 30, duration: 0.7, delay: 0.1 * i, ease: 'power2.out',
      scrollTrigger: { trigger: tile, start: 'top 90%' }
    });
  });
})();

/* ---------- Barra de progreso de lectura (páginas de post) ---------- */
(function () {
  var fill = document.getElementById('nrProgressFill');
  var article = document.querySelector('.nr-article');
  if (!fill || !article) return;
  function update() {
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight * 0.5;
    var scrolled = -rect.top;
    var pct = Math.min(Math.max(scrolled / total, 0), 1) * 100;
    fill.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- Tabla de contenidos lateral con scroll-spy (páginas de post) ---------- */
(function () {
  var toc = document.getElementById('nrToc');
  var article = document.querySelector('.nr-article');
  if (!toc || !article) return;
  var headings = article.querySelectorAll('h2');
  if (headings.length < 2) { toc.style.display = 'none'; return; }

  toc.classList.add('nr-toc-sidebar');

  var toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'nr-toc-mobile-toggle';
  toggleBtn.innerHTML = 'En esta nota <svg width="10" height="6" viewBox="0 0 9 6" fill="none">' +
    '<path d="M1 1l3.5 3.5L8 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  toggleBtn.addEventListener('click', function () { toc.classList.toggle('open'); });
  toc.appendChild(toggleBtn);

  var titleEl = document.createElement('div');
  titleEl.className = 'nr-toc-title';
  titleEl.textContent = 'En esta nota';
  toc.appendChild(titleEl);

  var ol = document.createElement('ol');
  var links = [];
  headings.forEach(function (h, i) {
    if (!h.id) h.id = 'seccion-' + (i + 1);
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ol.appendChild(li);
    links.push(a);
  });
  toc.appendChild(ol);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = toc.querySelector('a[href="#' + entry.target.id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    headings.forEach(function (h) { observer.observe(h); });
  }
})();

/* ---------- Copiar link ---------- */
(function () {
  var btn = document.getElementById('nrCopyLink');
  if (!btn) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(function () {
      var original = btn.textContent;
      btn.textContent = 'Link copiado ✓';
      setTimeout(function () { btn.textContent = original; }, 2000);
    });
  });
})();
