(function () {
  'use strict';

  /* ==========================================================
     DATA — fragmentos reales de andinawebstudio.com
     ========================================================== */
  var CASES = [
    {
      name: 'Lookback',
      tag: 'Galería / animación',
      file: 'lookback.js',
      diff: { add: 34, del: 6 },
      code: [
        '<span class="tk-c">// Estantería de libros — cada lomo es una foto real</span>',
        '<span class="tk-p">lookbackItems.</span><span class="tk-f">forEach</span><span class="tk-p">(</span><span class="tk-k">function</span><span class="tk-p">(item, index) {</span>',
        '  <span class="tk-k">var</span> <span class="tk-p">spine = document.</span><span class="tk-f">createElement</span><span class="tk-p">(</span><span class="tk-s">\'div\'</span><span class="tk-p">);</span>',
        '  <span class="tk-p">spine.className = </span><span class="tk-s">\'lookback-spine\'</span><span class="tk-p">;</span>',
        '  <span class="tk-p">spine.</span><span class="tk-f">setAttribute</span><span class="tk-p">(</span><span class="tk-s">\'aria-label\'</span><span class="tk-p">, </span><span class="tk-s">\'Ver \'</span> <span class="tk-p">+ item.etiqueta);</span>',
        '',
        '  <span class="tk-p">spine.</span><span class="tk-f">addEventListener</span><span class="tk-p">(</span><span class="tk-s">\'click\'</span><span class="tk-p">, </span><span class="tk-k">function</span> <span class="tk-p">() {</span>',
        '    <span class="tk-p">shelf.classList.</span><span class="tk-f">add</span><span class="tk-p">(</span><span class="tk-s">\'is-open\'</span><span class="tk-p">);</span>',
        '  <span class="tk-p">});</span>',
        '<span class="tk-p">});</span>',
        '',
        '<span class="tk-c">// sonido de apertura — oscilador Web Audio, sin archivos .mp3</span>',
        '<span class="tk-k">var</span> <span class="tk-p">osc = ctx.</span><span class="tk-f">createOscillator</span><span class="tk-p">();</span>',
        '<span class="tk-p">osc.</span><span class="tk-f">frequency</span><span class="tk-p">.</span><span class="tk-f">exponentialRampToValueAtTime</span><span class="tk-p">(</span><span class="tk-u">480</span><span class="tk-p">, ctx.currentTime + </span><span class="tk-u">0.14</span><span class="tk-p">);</span>'
      ],
      log: [
        { t: 'cargando 19 fotos desde Cloudinary…', ok: false },
        { t: 'construyendo estantería <span class="muted">(19 lomos)</span>', ok: false },
        { t: 'sintetizando sonido de apertura <span class="muted">220→480Hz</span>', ok: false },
        { t: 'Lookback listo', ok: true }
      ]
    },
    {
      name: 'Vinyl Player',
      tag: 'Componente interactivo',
      file: 'vinyl-player.js',
      diff: { add: 27, del: 3 },
      code: [
        '<span class="tk-c">// clic en el disco = play / pause, gira mientras suena</span>',
        '<span class="tk-p">disc.</span><span class="tk-f">addEventListener</span><span class="tk-p">(</span><span class="tk-s">\'click\'</span><span class="tk-p">, </span><span class="tk-k">function</span> <span class="tk-p">() {</span>',
        '  <span class="tk-k">if</span> <span class="tk-p">(audio.paused) {</span>',
        '    <span class="tk-p">audio.</span><span class="tk-f">play</span><span class="tk-p">();</span>',
        '    <span class="tk-p">outer.classList.</span><span class="tk-f">add</span><span class="tk-p">(</span><span class="tk-s">\'spinning\'</span><span class="tk-p">);</span>',
        '  <span class="tk-p">} </span><span class="tk-k">else</span> <span class="tk-p">{</span>',
        '    <span class="tk-p">audio.</span><span class="tk-f">pause</span><span class="tk-p">();</span>',
        '    <span class="tk-p">outer.classList.</span><span class="tk-f">remove</span><span class="tk-p">(</span><span class="tk-s">\'spinning\'</span><span class="tk-p">);</span>',
        '  <span class="tk-p">}</span>',
        '<span class="tk-p">});</span>',
        '',
        '<span class="tk-c">// el brazo del tocadiscos sigue el progreso real del audio</span>',
        '<span class="tk-k">var</span> <span class="tk-p">deg = </span><span class="tk-u">-18</span> <span class="tk-p">+ (audio.currentTime / audio.duration) * </span><span class="tk-u">22</span><span class="tk-p">;</span>',
        '<span class="tk-p">tonearm.style.transform = </span><span class="tk-s">\'rotate(\'</span> <span class="tk-p">+ deg + </span><span class="tk-s">\'deg)\'</span><span class="tk-p">;</span>'
      ],
      log: [
        { t: 'inicializando reproductor…', ok: false },
        { t: 'pista: <span class="muted">Always — DISTRXCT</span>', ok: false },
        { t: 'sincronizando brazo con audio.currentTime', ok: false },
        { t: 'disco girando', ok: true }
      ]
    },
    {
      name: 'Booking',
      tag: 'Supabase / reservas',
      file: 'booking.js',
      diff: { add: 41, del: 9 },
      code: [
        '<span class="tk-c">// trae del backend los horarios ya ocupados del mes</span>',
        '<span class="tk-p">supabase</span>',
        '  <span class="tk-p">.</span><span class="tk-f">from</span><span class="tk-p">(</span><span class="tk-s">\'citas\'</span><span class="tk-p">)</span>',
        '  <span class="tk-p">.</span><span class="tk-f">select</span><span class="tk-p">(</span><span class="tk-s">\'fecha, hora\'</span><span class="tk-p">)</span>',
        '  <span class="tk-p">.</span><span class="tk-f">eq</span><span class="tk-p">(</span><span class="tk-s">\'estado\'</span><span class="tk-p">, </span><span class="tk-s">\'confirmada\'</span><span class="tk-p">)</span>',
        '  <span class="tk-p">.</span><span class="tk-f">gte</span><span class="tk-p">(</span><span class="tk-s">\'fecha\'</span><span class="tk-p">, start).</span><span class="tk-f">lte</span><span class="tk-p">(</span><span class="tk-s">\'fecha\'</span><span class="tk-p">, end)</span>',
        '  <span class="tk-p">.</span><span class="tk-f">then</span><span class="tk-p">(</span><span class="tk-k">function</span><span class="tk-p">(res) { renderMonth(res.data); });</span>',
        '',
        '<span class="tk-c">// marca como ocupado cada día que ya tiene cita</span>',
        '<span class="tk-p">ocupados.</span><span class="tk-f">forEach</span><span class="tk-p">(</span><span class="tk-k">function</span><span class="tk-p">(dia) {</span>',
        '  <span class="tk-p">calendario.querySelector(</span><span class="tk-s">\'[data-dia="\'</span><span class="tk-p">+dia+</span><span class="tk-s">\'"]\'</span><span class="tk-p">)</span>',
        '    <span class="tk-p">.classList.</span><span class="tk-f">add</span><span class="tk-p">(</span><span class="tk-s">\'ocupado\'</span><span class="tk-p">);</span>',
        '<span class="tk-p">});</span>'
      ],
      log: [
        { t: 'conectando con Supabase…', ok: false },
        { t: 'SELECT fecha, hora <span class="muted">WHERE estado = confirmada</span>', ok: false },
        { t: 'bloqueando horarios ocupados', ok: false },
        { t: 'calendario actualizado', ok: true }
      ]
    },
    {
      name: 'Reveals',
      tag: 'GSAP / ScrollTrigger',
      file: 'reveals.js',
      diff: { add: 22, del: 4 },
      code: [
        '<span class="tk-c">// entrada suave cuando la sección aparece en pantalla</span>',
        '<span class="tk-p">gsap.</span><span class="tk-f">registerPlugin</span><span class="tk-p">(ScrollTrigger);</span>',
        '',
        '<span class="tk-p">gsap.</span><span class="tk-f">from</span><span class="tk-p">(</span><span class="tk-s">\'#testimonios .t-inner\'</span><span class="tk-p">, {</span>',
        '  <span class="tk-t">opacity</span><span class="tk-p">: </span><span class="tk-u">0</span><span class="tk-p">, </span><span class="tk-t">y</span><span class="tk-p">: </span><span class="tk-u">40</span><span class="tk-p">,</span>',
        '  <span class="tk-t">ease</span><span class="tk-p">: </span><span class="tk-s">\'power3.out\'</span><span class="tk-p">,</span>',
        '  <span class="tk-t">stagger</span><span class="tk-p">: </span><span class="tk-u">0.08</span><span class="tk-p">,</span>',
        '  <span class="tk-t">scrollTrigger</span><span class="tk-p">: {</span>',
        '    <span class="tk-t">trigger</span><span class="tk-p">: </span><span class="tk-s">\'#testimonios\'</span><span class="tk-p">,</span>',
        '    <span class="tk-t">start</span><span class="tk-p">: </span><span class="tk-s">\'top 75%\'</span>',
        '  <span class="tk-p">}</span>',
        '<span class="tk-p">});</span>'
      ],
      log: [
        { t: 'registrando ScrollTrigger…', ok: false },
        { t: 'observando <span class="muted">#testimonios</span>', ok: false },
        { t: 'animando opacity 0→1, y 40→0', ok: false },
        { t: 'animación en escena', ok: true }
      ]
    }
  ];

  var sidebarEl = document.getElementById('bsSidebar');
  var tabEl = document.getElementById('bsTab');
  var codeEl = document.getElementById('bsCode');
  var logEl = document.getElementById('bsLog');
  var diffEl = document.getElementById('bsDiff');

  if (!sidebarEl || !codeEl) return;

  var activeIndex = 0;
  var cycleTimer = null;
  var typeTimers = [];

  function clearTypeTimers() {
    typeTimers.forEach(function (t) { clearTimeout(t); });
    typeTimers = [];
  }

  function textLength(html) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    return (d.textContent || '').length;
  }

  function renderCase(index, userTriggered) {
    activeIndex = index;
    var data = CASES[index];
    clearTypeTimers();

    var items = sidebarEl.querySelectorAll('.bs-case');
    items.forEach(function (el, i) { el.classList.toggle('is-active', i === index); });

    tabEl.textContent = data.file;
    diffEl.innerHTML = '<span class="bs-diff-add">+' + data.diff.add + '</span> <span class="bs-diff-del">-' + data.diff.del + '</span>';

    codeEl.innerHTML = '';
    var cumulative = 0;
    var lineEls = data.code.map(function (html) {
      var len = Math.max(textLength(html), 1);
      var dur = Math.min(900, 90 + len * 16); // ms — máquina de escribir
      var steps = Math.max(4, Math.min(36, Math.round(len / 1.4)));

      var line = document.createElement('span');
      line.className = 'bs-code-line';
      line.style.setProperty('--dur', dur + 'ms');
      line.style.setProperty('--steps', steps);
      line.innerHTML = html || '&nbsp;';
      codeEl.appendChild(line);

      var startAt = cumulative;
      cumulative += dur + 55;
      return { el: line, startAt: startAt, dur: dur };
    });

    var cursor = document.createElement('span');
    cursor.className = 'bs-cursor-blink';
    codeEl.appendChild(cursor);

    logEl.innerHTML = '';
    var logLineEls = data.log.map(function (item) {
      var line = document.createElement('div');
      line.className = 'bs-log-line' + (item.ok ? ' ok' : '');
      line.innerHTML = '<span class="bs-log-caret">&gt;</span> ' + item.t;
      logEl.appendChild(line);
      return line;
    });

    lineEls.forEach(function (item) {
      var t = setTimeout(function () { item.el.classList.add('is-shown'); }, item.startAt);
      typeTimers.push(t);
    });

    logLineEls.forEach(function (line, i) {
      var t = setTimeout(function () { line.classList.add('is-shown'); }, cumulative + 260 + i * 460);
      typeTimers.push(t);
    });

    if (userTriggered) restartCycle();
  }

  function nextCase() { renderCase((activeIndex + 1) % CASES.length, false); }
  function restartCycle() { clearInterval(cycleTimer); cycleTimer = setInterval(nextCase, 8200); }

  CASES.forEach(function (data, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bs-case';
    btn.innerHTML =
      '<span class="bs-case-check"></span>' +
      '<span class="bs-case-body">' +
        '<span class="bs-case-name">' + data.name + '</span>' +
        '<span class="bs-case-file">' + data.tag + '</span>' +
      '</span>';
    btn.addEventListener('click', function () { renderCase(i, true); });
    sidebarEl.appendChild(btn);
  });

  renderCase(0, false);
  restartCycle();

  var editorWrap = document.getElementById('bsEditor');
  if (editorWrap) {
    editorWrap.addEventListener('mouseenter', function () { clearInterval(cycleTimer); });
    editorWrap.addEventListener('mouseleave', restartCycle);
  }

  /* ==========================================================
     MARQUEE — herramientas
     ========================================================== */
  var TOOLS = [
    { name: 'VS Code', color: '#007ACC' },
    { name: 'Cursor', color: '#8A6EEF' },
    { name: 'Figma', color: '#A259FF' },
    { name: 'Photoshop', color: '#31A8FF' },
    { name: 'Illustrator', color: '#FF9A00' },
    { name: 'GSAP', color: '#88CE02' },
    { name: 'Supabase', color: '#3ECF8E' },
    { name: 'Cloudinary', color: '#3448C5' },
    { name: 'Netlify', color: '#00C7B7' },
    { name: 'Git', color: '#F05032' }
  ];
  var marqueeEl = document.getElementById('bsMarquee');
  if (marqueeEl) {
    var buildRow = function () {
      return TOOLS.map(function (t) {
        return '<span class="bs-stack-item"><span class="dot" style="background:' + t.color + '; box-shadow:0 0 8px 1px ' + t.color + '55;"></span>' + t.name + '</span>';
      }).join('');
    };
    // duplicado para que el loop sea continuo
    marqueeEl.innerHTML = buildRow() + buildRow();
  }

  /* ==========================================================
     REC / TIMECODE — reemplaza el eyebrow genérico
     ========================================================== */
  var timeEl = document.getElementById('bsRecTime');
  if (timeEl) {
    var frames = 0;
    setInterval(function () {
      frames++;
      var f = frames % 24;
      var totalSec = Math.floor(frames / 24);
      var s = totalSec % 60;
      var m = Math.floor(totalSec / 60) % 60;
      var h = Math.floor(totalSec / 3600);
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      timeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
    }, 1000 / 24);
  }

  /* ==========================================================
     REVEAL ON SCROLL + TYPE-ON-SCROLL
     (el tipeo se dispara DENTRO del mismo observer que ya
     funciona para mostrar la tarjeta — no uno aparte)
     ========================================================== */
  function primeTypeEl(el) {
    var len = Math.max((el.textContent || '').length, 1);
    var dur = Math.min(900, 110 + len * 11);
    var steps = Math.max(6, Math.min(40, Math.round(len / 1.3)));
    el.style.setProperty('--dur', dur + 'ms');
    el.style.setProperty('--steps', steps);
  }
  document.querySelectorAll('.bs-type').forEach(primeTypeEl);

  var revealEls = document.querySelectorAll('.bs-reveal');

  function activate(el) {
    el.classList.add('is-visible');
    var typeEls = Array.prototype.slice.call(el.querySelectorAll('.bs-type'));
    if (el.classList.contains('bs-type')) typeEls.push(el);
    if (typeEls.length) {
      setTimeout(function () {
        typeEls.forEach(function (t) { t.classList.add('is-typed'); });
      }, 180);
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(activate);
  }

  // red de seguridad: si por lo que sea algo se queda sin tipear
  // (ej. ya estaba en pantalla al cargar y el observer no disparó a tiempo)
  setTimeout(function () {
    document.querySelectorAll('.bs-reveal.is-visible .bs-type:not(.is-typed)').forEach(function (el) {
      el.classList.add('is-typed');
    });
  }, 2500);

  /* ==========================================================
     MENÚ MOBILE
     ========================================================== */
  var hamburger = document.getElementById('bsHamburger');
  var mobileMenu = document.getElementById('bsMobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
})();
