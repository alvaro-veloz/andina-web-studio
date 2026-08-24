/* ============================================================
   Andina Web Studio — musica.js
   - Menú mobile (hamburger)
   - Crossfade del video de fondo del hero al pasar el mouse
     sobre cada nombre de mix (desktop) / al tocarlo (mobile)
   - Modal reproductor: se abre con click en cualquier [data-yt]
     (tanto los items del hero como las tarjetas del grid)
============================================================ */

/* ---------- Menú mobile ---------- */
(function () {
  var btn = document.getElementById('muHamburger');
  var menu = document.getElementById('muMobileMenu');
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

/* ---------- Crossfade del video de fondo del hero ---------- */
(function () {
  var hero = document.getElementById('muHero');
  var items = document.querySelectorAll('.mu-mixitem');
  if (!hero || !items.length) return;

  var videoA = hero.querySelector('.mu-bg-video.mu-bg-a');
  var videoB = hero.querySelector('.mu-bg-video.mu-bg-b');
  var front = videoA; // el que está visible ahora
  var back = videoB;  // el que se prepara para entrar
  var currentSrc = null;
  var loadToken = 0; // evita carreras si el usuario pasa el mouse rápido por varios items

  // Detecta si el dispositivo realmente soporta hover (evita "sticky hover" en touch)
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  function setBackground(item) {
    var src = item.getAttribute('data-video');
    var poster = item.getAttribute('data-poster');

    // Poster/imagen de respaldo mientras no exista el .mp4 real todavía
    if (poster) front.setAttribute('poster', poster);

    if (!src || src === currentSrc) return;
    currentSrc = src;

    var myToken = ++loadToken;
    back.setAttribute('poster', poster || '');
    back.src = src;
    back.load();

    var onReady = function () {
      if (myToken !== loadToken) return; // llegó tarde, ya cambiamos de nuevo
      back.play().catch(function () {});
      front.classList.remove('is-active');
      back.classList.add('is-active');
      var tmp = front;
      front = back;
      back = tmp;
      back.removeEventListener('loadeddata', onReady);
    };
    back.addEventListener('loadeddata', onReady);
  }

  function setActiveItem(item) {
    items.forEach(function (i) { i.classList.remove('is-active'); });
    item.classList.add('is-active');
  }

  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  items.forEach(function (item) {
    if (canHover) {
      item.addEventListener('mouseenter', function () {
        setActiveItem(item);
        setBackground(item);
      });
    }
    // En touch, el primer tap sobre un item ya lo activa como fondo;
    // el click (más abajo) además abre el reproductor.
    item.addEventListener('touchstart', function () {
      setActiveItem(item);
      setBackground(item);
    }, { passive: true });

    // Click en escritorio: salta al bloque grande de abajo en vez de abrir
    // el modal de YouTube (que se rompe por copyright). Se registra antes
    // que el modal genérico (más abajo en el archivo), y con
    // stopImmediatePropagation() evita que ese otro handler también corra.
    item.addEventListener('click', function (e) {
      var section = document.getElementById('mix-' + slugify(item.textContent.trim()));
      if (section) {
        e.stopImmediatePropagation();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // si no existe el bloque todavía, se deja pasar el click al modal (fallback)
    });
  });

  // Carga inicial: el primer mix activo define el video de fondo desde el arranque
  var initial = document.querySelector('.mu-mixitem.is-active') || items[0];
  if (initial) {
    var src = initial.getAttribute('data-video');
    if (src) {
      currentSrc = src;
      front.src = src;
      front.load();
      front.play().catch(function () {});
    }
  }
})();

/* ---------- Playlist: arco disperso + reproductor vinilo ----------
   Fuente de datos: iTunes Search API (gratis, sin API key, sin login).
   Solo definís el término de búsqueda por canción acá abajo — el JS
   trae carátula real (600x600) y el preview de 30s automáticamente.
   ⚠️ Reemplazá TRACKS con las canciones/mixes reales que quieras mostrar. */
(function () {
  var arc = document.getElementById('muArc');
  if (!arc) return;

  var TRACKS = [
    { q: 'Rufus Du Sol Innerbloom' },
    { q: 'Joy Crookes Feet Dont Fail Me Now' },
    { q: 'Calvin Harris Thinking About You Ayah Marar' },
    { q: 'Gustavo Cerati Vivo' },
    { q: 'LONOWN Worry' },
    { q: 'Duke Dumont Ocean Drive' },
    { q: 'DJ Snake Let Me Love You' },
    { q: 'DJ Snake Middle Bipolar Sunshine' },
    { q: 'Feid Quemando Calorias' },
    { q: 'Omar Courtz Lakenoshi' },
    { q: 'Omar Courtz Luces De Colores' },
    { q: 'Sentinel Alesso Freedom' },
    { q: 'Rick Ross Stay Schemin Drake French Montana' },
    { q: 'Qloo Young Cister Kreamly' }
  ];

  var audio = document.getElementById('muAudio');
  var disc = document.getElementById('muVinylDisc');
  var art = document.getElementById('muVinylArt');
  var label = document.getElementById('muVinylLabel');
  var trackEl = document.getElementById('muVinylTrack');
  var timeEl = document.getElementById('muVinylTime');
  var toggleBtn = document.getElementById('muVinylToggle');
  var playIcon = document.getElementById('muVinylPlayIcon');
  var pauseIcon = document.getElementById('muVinylPauseIcon');

  var activeBtn = null;

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function setPlayingUI(isPlaying) {
    disc.classList.toggle('is-spinning', isPlaying);
    playIcon.style.display = isPlaying ? 'none' : '';
    pauseIcon.style.display = isPlaying ? '' : 'none';
  }

  function playTrack(btn, data) {
    if (activeBtn) activeBtn.classList.remove('is-playing');
    activeBtn = btn;
    btn.classList.add('is-playing');

    art.src = data.artwork;
    art.classList.add('has-art');
    label.textContent = 'Reproduciendo';
    trackEl.textContent = data.artist + ' — ' + data.title;
    toggleBtn.disabled = false;

    audio.src = data.preview;
    audio.currentTime = 0;
    audio.play().then(function () { setPlayingUI(true); }).catch(function () { setPlayingUI(false); });
  }

  toggleBtn.addEventListener('click', function () {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().then(function () { setPlayingUI(true); });
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });

  audio.addEventListener('timeupdate', function () {
    timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
  });
  audio.addEventListener('ended', function () { setPlayingUI(false); });
  audio.addEventListener('pause', function () { setPlayingUI(false); });

  var isRingMode = window.matchMedia('(max-width: 760px)').matches;
  if (isRingMode) arc.classList.add('is-ring');

  // Coloca cada carátula formando un arco parejo, repartido según cuántas
  // efectivamente cargaron — así nunca se pisan aunque falte alguna búsqueda.
  // (Modo escritorio — sin cambios respecto a lo que ya te gustó.)
  function layoutArc(entries) {
    var n = entries.length;
    if (!n) return;
    var amplitude = 42; // cuánto sube el centro respecto a los extremos (px)

    entries.forEach(function (data, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mu-arc-item';
      btn.setAttribute('aria-label', data.artist + ' — ' + data.title + ' (preview)');
      btn.innerHTML = '<img src="' + data.artwork + '" alt="" loading="lazy" />';

      var norm = n === 1 ? 0 : (i / (n - 1)) * 2 - 1; // -1 .. 1, 0 = centro
      var leftPct = n === 1 ? 50 : 5 + (i / (n - 1)) * 90;
      var yOffset = amplitude * (norm * norm) - amplitude * 0.55; // centro sube, extremos bajan
      var rot = norm * 10 + ((i % 2 === 0) ? -1 : 1) * 2;

      btn.style.left = leftPct + '%';
      btn.style.setProperty('--mu-tf', 'translate(-50%, calc(-50% + ' + yOffset.toFixed(1) + 'px)) rotate(' + rot.toFixed(1) + 'deg)');

      btn.addEventListener('click', function () { playTrack(btn, data); });
      arc.appendChild(btn);

      setTimeout(function () { btn.classList.add('is-visible'); }, 60 + i * 55);
    });
  }

  // Modo mobile — mismas carátulas, pero en círculo completo alrededor de un
  // centro, tipo "rueda" que se puede arrastrar para girar (como pediste:
  // mismo diseño de 6-9 portadas, pero funcionando como carrusel).
  function layoutRing(entries) {
    var n = entries.length;
    if (!n) return;

    var center = document.createElement('div');
    center.className = 'mu-ring-center';
    center.innerHTML =
      '<span class="mu-ring-center-dot"></span>' +
      '<span class="mu-ring-center-hint">Arrastrá o<br>tocá una carátula</span>';
    arc.appendChild(center);

    var radius = 40; // % del contenedor (cuadrado)
    var ringRotation = 0; // grados — se actualiza al arrastrar
    var items = []; // { btn, baseAngle }

    function place(btn, angleDeg, tilt) {
      var rad = (angleDeg * Math.PI) / 180;
      var x = 50 + radius * Math.cos(rad);
      var y = 50 + radius * Math.sin(rad);
      btn.style.left = x + '%';
      btn.style.top = y + '%';
      btn.style.setProperty('--mu-tf', 'translate(-50%, -50%) rotate(' + tilt + 'deg)');
    }

    entries.forEach(function (data, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mu-arc-item';
      btn.setAttribute('aria-label', data.artist + ' — ' + data.title + ' (preview)');
      btn.innerHTML = '<img src="' + data.artwork + '" alt="" loading="lazy" />';

      var baseAngle = (i / n) * 360 - 90; // arranca arriba, en sentido horario
      var tilt = ((i % 2 === 0) ? -1 : 1) * 7;
      place(btn, baseAngle, tilt);

      btn.addEventListener('click', function () {
        if (arc.classList.contains('is-dragging-moved')) return; // fue arrastre, no toque
        playTrack(btn, data);
      });

      arc.appendChild(btn);
      items.push({ btn: btn, baseAngle: baseAngle, tilt: tilt });
      setTimeout(function () { btn.classList.add('is-visible'); }, 60 + i * 45);
    });

    function updateRing() {
      items.forEach(function (it) { place(it.btn, it.baseAngle + ringRotation, it.tilt); });
    }

    // Arrastre para girar el anillo — con umbral para no confundir con un tap
    var dragging = false;
    var startPointerAngle = 0;
    var startRotation = 0;

    function pointerAngle(x, y) {
      var rect = arc.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
    }

    arc.addEventListener('pointerdown', function (e) {
      dragging = true;
      arc.classList.remove('is-dragging-moved');
      startPointerAngle = pointerAngle(e.clientX, e.clientY);
      startRotation = ringRotation;
      arc.setPointerCapture(e.pointerId);
    });

    arc.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var cur = pointerAngle(e.clientX, e.clientY);
      var delta = cur - startPointerAngle;
      if (Math.abs(delta) > 3) arc.classList.add('is-dragging-moved');
      ringRotation = startRotation + delta;
      updateRing();
    });

    function endDrag() {
      dragging = false;
      // deja un instante la marca de "fue arrastre" para que el click del
      // botón (que dispara justo después del pointerup) no abra un preview
      setTimeout(function () { arc.classList.remove('is-dragging-moved'); }, 80);
    }
    arc.addEventListener('pointerup', endDrag);
    arc.addEventListener('pointercancel', endDrag);
  }

  // Trae las canciones de la iTunes Search API.
  // ⚠️ Antes esto disparaba las 14 búsquedas en paralelo (Promise.all), lo que
  // en la práctica pega contra el límite de requests por IP de la API de
  // iTunes (no documentado, pero real) y hace que TODAS fallen en silencio
  // — quedando el arco vacío sin ningún aviso. Eso es lo que se veía en el
  // celular: nada de carátulas y el reproductor sin nada para tocar.
  //
  // Fix: 1) cachea el resultado en sessionStorage — una vez que carga bien,
  //         no vuelve a golpear la API en cada visita/recarga durante la
  //         misma sesión (además de evitar el límite, carga instantáneo).
  //      2) las requests salen una atrás de la otra con una pequeña pausa,
  //         no las 14 juntas.
  //      3) si una búsqueda falla, reintenta una vez antes de darla por
  //         perdida.
  //      4) si a pesar de todo no logra traer ninguna, muestra un aviso en
  //         vez de dejar la sección vacía sin explicación.
  var CACHE_KEY = 'muTracksCache_v1';

  function fetchTrack(t, attempt) {
    var url = 'https://itunes.apple.com/search?term=' + encodeURIComponent(t.q) + '&media=music&limit=1';
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) {
        var r = json.results && json.results[0];
        if (!r || !r.previewUrl) return null; // sin resultado o sin preview disponible
        return {
          title: r.trackName,
          artist: r.artistName,
          artwork: (r.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
          preview: r.previewUrl
        };
      })
      .catch(function (err) {
        if (!attempt) {
          // un solo reintento, con una pequeña espera (a veces alcanza)
          return new Promise(function (resolve) {
            setTimeout(function () { resolve(fetchTrack(t, 1)); }, 500);
          });
        }
        console.warn('[musica] no se pudo traer "' + t.q + '":', err && err.message);
        return null;
      });
  }

  // Encadena las búsquedas de a una, con ~120ms entre cada una, en vez de
  // dispararlas todas juntas.
  function fetchAllSequential(tracks) {
    var out = [];
    return tracks.reduce(function (chain, t) {
      return chain.then(function () {
        return fetchTrack(t, 0).then(function (data) {
          out.push(data);
          return new Promise(function (resolve) { setTimeout(resolve, 120); });
        });
      });
    }, Promise.resolve()).then(function () { return out; });
  }

  function showEmptyState() {
    arc.innerHTML = '';
    var msg = document.createElement('p');
    msg.className = 'mu-arc-empty';
    msg.textContent = 'No pudimos cargar las canciones ahora — probá recargar la página.';
    arc.appendChild(msg);
  }

  function render(loaded) {
    if (!loaded.length) { showEmptyState(); return; }
    if (isRingMode) layoutRing(loaded); else layoutArc(loaded);
  }

  var cached = null;
  try {
    var raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) cached = JSON.parse(raw);
  } catch (e) { cached = null; }

  if (cached && cached.length) {
    render(cached);
  } else {
    fetchAllSequential(TRACKS).then(function (results) {
      var loaded = results.filter(Boolean);
      if (loaded.length) {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(loaded)); } catch (e) {}
      }
      render(loaded);
    });
  }
})();

/* ---------- Mobile: hero tipo "reels" (un video full-screen por mix) ----------
   Reutiliza los mismos data-video / data-poster / data-yt / data-tag que ya
   tienen los botones de #muMixlist — no hay datos duplicados. Solo corre en
   mobile; en escritorio no hace nada y se usa el hero con crossfade normal. */
(function () {
  var isMobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  if (!isMobile) return;

  var slidesWrap = document.getElementById('muHeroSlides');
  var navWrap = document.getElementById('muSlideNav');
  var sourceItems = document.querySelectorAll('.mu-mixitem');
  if (!slidesWrap || !navWrap || !sourceItems.length) return;

  var slides = []; // { el, video, navBtn }

  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // saca acentos
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  sourceItems.forEach(function (item, i) {
    var title = item.textContent.trim();
    var tag = item.getAttribute('data-tag') || '';
    var videoSrc = item.getAttribute('data-video');
    var poster = item.getAttribute('data-poster') || '';
    var yt = item.getAttribute('data-yt');
    var targetId = '#mix-' + slugify(title);

    var slide = document.createElement('div');
    slide.className = 'mu-hero-slide';
    slide.style.zIndex = String(i + 1);
    slide.setAttribute('role', 'button');
    slide.setAttribute('tabindex', '0');
    slide.setAttribute('aria-label', 'Escuchar ' + title);

    var video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    if (poster) video.poster = poster;
    if (videoSrc) video.src = videoSrc;

    var vignette = document.createElement('span');
    vignette.className = 'mu-hero-slide-vignette';

    var text = document.createElement('div');
    text.className = 'mu-hero-slide-text';
    text.innerHTML =
      (tag ? '<span class="mu-hero-slide-tag">' + tag + '</span>' : '') +
      '<span class="mu-hero-slide-title">' + title + '</span>';

    var cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'mu-hero-slide-cta';
    cta.innerHTML = 'Escuchar <span aria-hidden="true">→</span>';

    // Salta a la sección grande de ese mix más abajo en la página. Si esa
    // sección todavía no existe (se agrega en el próximo paso), cae de
    // respaldo al modal de YouTube para no romper nada mientras tanto.
    function goToMix() {
      var section = document.querySelector(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (yt) {
        var evt = new Event('click', { bubbles: true });
        var tmp = document.createElement('span');
        tmp.setAttribute('data-yt', yt);
        document.body.appendChild(tmp);
        tmp.dispatchEvent(evt);
        document.body.removeChild(tmp);
      }
    }
    cta.addEventListener('click', function (e) { e.stopPropagation(); goToMix(); });
    slide.addEventListener('click', goToMix);

    slide.appendChild(video);
    slide.appendChild(vignette);
    slide.appendChild(text);
    slide.appendChild(cta);
    slidesWrap.appendChild(slide);

    var navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'mu-slide-nav-item' + (i === 0 ? ' is-active' : '');
    navBtn.innerHTML = '<span class="mu-slide-nav-label">' + title + '</span><span class="mu-slide-nav-arrow">→</span>';
    navBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    navWrap.appendChild(navBtn);

    slides.push({ el: slide, video: video, navBtn: navBtn });
  });

  function setActive(index) {
    slides.forEach(function (s, i) { s.navBtn.classList.toggle('is-active', i === index); });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var idx = slides.findIndex(function (s) { return s.el === entry.target; });
      if (idx === -1) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        slides[idx].video.play().catch(function () {});
        setActive(idx);
      } else {
        slides[idx].video.pause();
      }
    });
  }, { threshold: [0.6] });

  slides.forEach(function (s) { observer.observe(s.el); });
})();

/* ---------- Showcase: bloque grande por mix ----------
   Clip corto de fondo (muteado, con toggle de sonido) + foto recortada +
   link "Ver el set completo en YouTube" + el video real embebido (carga
   (sin tocar su diseño) en su propio bloque debajo. Alterna de lado en
   cada mix. Todo sale de los mismos data-* de #muMixlist. */
(function () {
  var showcase = document.getElementById('muShowcase');
  var sourceItems = document.querySelectorAll('.mu-mixitem');
  if (!showcase || !sourceItems.length) return;

  var blocks = []; // { el, video }

  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Chip del tag ("Andes · House") con punto de color, texto plano calmo
  function tagHTML(tag) {
    var mountain = '<svg class="mu-showcase-tag-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M3 19h18L14.5 6 10 13.5 7.5 10 3 19z"/></svg>';
    return '<span class="mu-showcase-tag">' + mountain + tag + '</span>';
  }

  // "Disfrutá del set de" en tono calmo + el nombre del DJ como único momento de color
  function djLineHTML(dj) {
    var icon = '<span class="mu-showcase-djline-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/></svg></span>';
    var intro = '<span class="mu-showcase-djline-intro">Disfrutá del set de</span>';
    var tag = '<span class="mu-showcase-djtag">' + dj + '</span>';
    return icon + intro + tag;
  }

  sourceItems.forEach(function (item, i) {
    var clip = item.getAttribute('data-clip');
    var cutout = item.getAttribute('data-cutout');
    if (!clip || !cutout) return; // este mix todavía no tiene sus assets — no arma bloque

    var title = item.textContent.trim();
    var tag = item.getAttribute('data-tag') || '';
    var yt = item.getAttribute('data-yt');
    var dj = item.getAttribute('data-dj') || '';
    var instagram = item.getAttribute('data-instagram');

    var block = document.createElement('section');
    block.className = 'mu-showcase-block';
    block.id = 'mix-' + slugify(title);

    var clipWrap = document.createElement('div');
    clipWrap.className = 'mu-showcase-clip';
    var video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    // el src se asigna recién cuando el bloque entra en pantalla (ver el
    // observer más abajo) — así no quedan los 4 cargados en memoria desde
    // que abrís la página
    clipWrap.appendChild(video);

    var vignette = document.createElement('div');
    vignette.className = 'mu-showcase-vignette';

    var muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'mu-showcase-mute';
    muteBtn.setAttribute('aria-label', 'Activar o silenciar el video');
    var iconMuted = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>';
    var iconOn = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
    muteBtn.innerHTML = iconMuted;
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? iconMuted : iconOn;
      muteBtn.classList.toggle('is-on', !video.muted);
    });

    // Orden tipo "sándwich": tag → frase de color → FOTO → título grande → link
    var inner = document.createElement('div');
    inner.className = 'mu-showcase-inner';
    inner.innerHTML =
      (tag ? tagHTML(tag) : '') +
      (dj ? '<p class="mu-showcase-djline">' + djLineHTML(dj) + '</p>' : '') +
      '<div class="mu-showcase-cutout-wrap"><div class="mu-showcase-cutout"><img src="' + cutout + '" alt="" loading="lazy" /></div></div>' +
      '<h2 class="mu-showcase-title">' + title + '</h2>' +
      (yt ? '<span class="mu-showcase-yt-hint">Mirá el set<br>en YouTube</span>' : '') +
      (yt ? '<a class="mu-showcase-yt" href="https://www.youtube.com/watch?v=' + yt + '" target="_blank" rel="noopener" aria-label="Ver el set completo en YouTube">' +
        '<svg width="13" height="13" viewBox="0 0 18 18" fill="currentColor"><path d="M5 3.5v11l9-5.5-9-5.5z"/></svg>' +
        '<span class="mu-showcase-yt-label">Ver el set completo en YouTube</span></a>' : '') +
      (instagram ? '<a class="mu-showcase-ig" href="' + instagram + '" target="_blank" rel="noopener" aria-label="Instagram de ' + (dj || 'la DJ') + '">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="2" y="2" width="20" height="20" rx="5.5"/>' +
        '<circle cx="12" cy="12" r="4.6"/>' +
        '<circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none"/>' +
        '</svg></a>' : '');

    block.appendChild(clipWrap);
    block.appendChild(vignette);
    block.appendChild(muteBtn);
    block.appendChild(inner);
    showcase.appendChild(block);

    blocks.push({ el: block, video: video, clip: clip, cutoutWrap: inner.querySelector('.mu-showcase-cutout-wrap') });
  });

  // Solo reproduce el clip que está realmente en pantalla, y dispara la
  // animación de entrada del texto la primera vez que el bloque se ve
  if (blocks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var b = blocks.find(function (x) { return x.el === entry.target; });
        if (!b) return;
        if (entry.isIntersecting) {
          // si lo habíamos descargado de memoria, lo restauramos antes de reproducir
          if (!b.video.src) b.video.src = b.clip;
          b.video.play().catch(function () {});
          entry.target.classList.add('is-seen');
        } else {
          b.video.pause();
          // libera la memoria del decodificador — no lo dejamos "pausado
          // pero cargado" indefinidamente, que era lo que inflaba la RAM
          b.video.removeAttribute('src');
          b.video.load();
        }
      });
    }, { threshold: 0.35 });
    blocks.forEach(function (b) { observer.observe(b.el); });
  }

  // Parallax liviano — la foto se mueve un poco más lento que el fondo al
  // scrollear. Solo en escritorio (en mobile la posición de la foto la
  // define directo el CSS mobile, sin parallax, para no pelear con eso).
  var isDesktopForParallax = window.matchMedia('(min-width: 761px)').matches;
  if (isDesktopForParallax && blocks.some(function (b) { return b.cutoutWrap; })) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      blocks.forEach(function (b) {
        if (!b.cutoutWrap) return;
        var rect = b.el.getBoundingClientRect();
        // si está bien lejos de la pantalla, ni tocamos su transform —
        // evita trabajo de repintado innecesario en los otros 3 bloques
        if (rect.bottom < -vh || rect.top > vh * 2) return;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // ~-1..1
        var offset = Math.max(-1, Math.min(1, progress)) * -34; // 34px de amplitud
        b.cutoutWrap.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }
})();

/* ---------- Modal reproductor — click en cualquier [data-yt] ---------- */
(function () {
  var modal = document.getElementById('muPlayer');
  var backdrop = document.getElementById('muPlayerBackdrop');
  var closeBtn = document.getElementById('muPlayerClose');
  var embed = document.getElementById('muPlayerEmbed');
  if (!modal || !embed) return;

  function openPlayer(id) {
    if (!id) return;
    embed.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = 'Reproductor de mix';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    embed.appendChild(iframe);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closePlayer() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    embed.innerHTML = ''; // corta el audio al cerrar
  }

  document.querySelectorAll('[data-yt]').forEach(function (el) {
    el.addEventListener('click', function () {
      openPlayer(el.getAttribute('data-yt'));
    });
  });

  if (backdrop) backdrop.addEventListener('click', closePlayer);
  if (closeBtn) closeBtn.addEventListener('click', closePlayer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePlayer();
  });
})();

/* ---------- Footer: "Volver arriba" ---------- */
(function () {
  var topBtn = document.getElementById('muFooterTop');
  if (!topBtn) return;
  topBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
