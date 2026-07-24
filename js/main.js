/* ============================================================
   Andina Web Studio — main.js
============================================================ */

    /* ==========================================
       PRELOADER — a prueba de fallos
    ========================================== */
    function hidePreloader() {
      document.getElementById('preloader').classList.add('done');
    }
    setTimeout(hidePreloader, 1800);
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 400);
    } else {
      window.addEventListener('load', function () { setTimeout(hidePreloader, 400); });
    }

    /* ==========================================
       NAVBAR SCROLL
    ========================================== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    /* ==========================================
       HAMBURGER MENU
    ========================================== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    function closeMobile() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }

    /* ==========================================
       SCROLL REVEAL
    ========================================== */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ==========================================
       CURSOR PERSONALIZADO
    ========================================== */
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    if (window.matchMedia('(pointer: fine)').matches) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      });
      function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      }
      animateRing();
    }

    /* ==========================================
       SMOOTH SCROLL
    ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return; // ignorar links vacíos
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    /* ==========================================
       PARALLAX HERO MONTAÑA
    ========================================== */
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroBg = document.querySelector('.hero-mountain');
      if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });

    /* ==========================================
       HERO PARTICLES — canvas puro, sin librerías
    ========================================== */
    (function () {
      const canvas = document.getElementById('hero-particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let W, H;
      const particles = [];

      function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * 1.4 + 0.3,
          vx: (Math.random() - 0.5) * 0.0003,
          vy: (Math.random() - 0.5) * 0.0003,
          a: Math.random() * 0.45 + 0.1
        });
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,200,232,${p.a})`;
          ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = (particles[i].x - particles[j].x) * W;
            const dy = (particles[i].y - particles[j].y) * H;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x * W, particles[i].y * H);
              ctx.lineTo(particles[j].x * W, particles[j].y * H);
              ctx.strokeStyle = `rgba(168,200,232,${0.07 * (1 - d / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        if (isCanvasVisible) {
          rafId = requestAnimationFrame(draw);
        } else {
          rafId = null;
        }
      }

      // Pausa el dibujo cuando el Hero no está en pantalla — mismo look,
      // pero deja de gastar CPU/GPU en cuanto scrolleás más abajo.
      let isCanvasVisible = true;
      let rafId = null;
      if ('IntersectionObserver' in window) {
        const visObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isCanvasVisible = entry.isIntersecting;
            if (isCanvasVisible && !rafId) {
              rafId = requestAnimationFrame(draw);
            }
          });
        });
        visObserver.observe(canvas);
      }

      draw();
    })();

    /* ==========================================
       CARD TILT 3D — inclinación magnética al hover
    ========================================== */
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        this.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', function () {
        this.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
        this.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
      card.addEventListener('mouseenter', function () {
        this.style.transition = 'transform 0.08s ease';
      });
    });

    /* ==========================================
       THREE.JS — Sección "Sobre el Estudio"
       ==========================================
       INSTRUCCIONES PARA AÑADIR TUS ARCHIVOS .GLB:

       1. Pon tus archivos .glb en la misma carpeta
          que este index.html. Ejemplo:
            - laptop.glb
            - monitor.glb
            - figura.glb

       2. Cambia los nombres en el array GLB_MODELS
          de abajo por los nombres exactos de tus archivos.

       3. Puedes poner 1, 2 o 3 modelos.
          Más de 3 puede hacer lenta la página.

       4. Si no tienes .glb todavía, el código
          muestra esferas animadas como placeholder.
          Cuando los tengas, solo cambia los nombres.
    ========================================== */

    // ▼▼▼ CAMBIA ESTOS NOMBRES POR TUS ARCHIVOS .GLB ▼▼▼
    const GLB_MODELS = [
      { file: 'xd.glb', x: -0, y: -1.5, z: 0, scale: 0.7 },
      // { file: 'figura.glb',  x:  1.2, y: -0.3, z: 0,   scale: 0.8 },
    ];
    // ▲▲▲ Descomenta las líneas y pon tus nombres ▲▲▲

    function initThreeJS() {
      const canvas = document.getElementById('sobre-canvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const wrap = canvas.parentElement;
      const W = wrap.offsetWidth || 400;
      const H = wrap.offsetHeight || 500;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0A1628, 1);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0A1628);
      scene.fog = new THREE.FogExp2(0x0A1628, 0.05);

      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.set(0, 0, 6);

      /* Iluminación */
      scene.add(new THREE.AmbientLight(0xa8c8e8, 0.6));
      const dir = new THREE.DirectionalLight(0x4a90d9, 2.2);
      dir.position.set(4, 5, 5);
      scene.add(dir);
      const rim = new THREE.PointLight(0x2d6fa3, 1.8, 20);
      rim.position.set(-4, -2, 2);
      scene.add(rim);

      /* Partículas de fondo */
      const ptPos = new Float32Array(120 * 3);
      for (let i = 0; i < 120; i++) {
        ptPos[i * 3] = (Math.random() - .5) * 10;
        ptPos[i * 3 + 1] = (Math.random() - .5) * 10;
        ptPos[i * 3 + 2] = (Math.random() - .5) * 4 - 2;
      }
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
      scene.add(new THREE.Points(ptGeo,
        new THREE.PointsMaterial({ color: 0xa8c8e8, size: 0.04, transparent: true, opacity: 0.45 })
      ));

      /* ── 2 ESFERAS CONTROLABLES ── */
      const spheres = [];
      const configs = GLB_MODELS.length > 0 ? [] : [
        { x: -1.2, y: 0.3, z: 0, s: 1.0, c: 0x2D6FA3 },
        { x: 1.2, y: -0.3, z: 0, s: 0.72, c: 0xA8C8E8 },
      ];

      if (GLB_MODELS.length > 0 && typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        GLB_MODELS.forEach((cfg, i) => {
          loader.load(cfg.file, (gltf) => {
            const m = gltf.scene;
            m.scale.setScalar(cfg.scale || 1);
            m.position.set(cfg.x || 0, cfg.y || 0, 0);
            m.userData = { ox: cfg.x || 0, oy: cfg.y || 0, rotX: 0, rotY: 0, velX: 0, velY: 0 };
            scene.add(m); spheres.push(m);
          }, undefined, (e) => console.warn(e));
        });
      } else {
        configs.forEach(cfg => {
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.s, 64, 64),
            new THREE.MeshStandardMaterial({ color: cfg.c, roughness: 0.18, metalness: 0.7 })
          );
          mesh.position.set(cfg.x, cfg.y, 0);
          mesh.userData = { ox: cfg.x, oy: cfg.y, rotX: 0, rotY: 0, velX: 0, velY: 0 };
          scene.add(mesh);
          spheres.push(mesh);
        });
      }

      /* ── DRAG INTERACTIVO — mouse y touch ── */
      let dragging = false;
      let dragSphere = null;
      let lastX = 0, lastY = 0;
      let idleTimer = null;

      function resetIdle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { dragging = false; dragSphere = null; }, 150);
      }

      function getPointer(e) {
        if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
      }

      function toNDC(clientX, clientY) {
        const r = canvas.getBoundingClientRect();
        return {
          x: ((clientX - r.left) / r.width) * 2 - 1,
          y: -((clientY - r.top) / r.height) * 2 + 1
        };
      }

      function pickSphere(clientX, clientY) {
        if (spheres.length === 0) return null;
        const ndc = toNDC(clientX, clientY);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera);
        const hits = raycaster.intersectObjects(spheres, true);
        return hits.length > 0 ? (hits[0].object.userData.ox !== undefined ? hits[0].object : spheres[0]) : null;
      }

      function onPointerDown(e) {
        const p = getPointer(e);
        const hit = pickSphere(p.x, p.y);
        if (hit) {
          dragging = true;
          dragSphere = hit;
          lastX = p.x; lastY = p.y;
          canvas.style.cursor = 'grabbing';
        }
      }
      function onPointerMove(e) {
        if (!dragging || !dragSphere) return;
        const p = getPointer(e);
        const dx = p.x - lastX;
        const dy = p.y - lastY;
        dragSphere.userData.velY += dx * 0.0001;
        dragSphere.userData.velX += dy * 0.0001;
        lastX = p.x; lastY = p.y;
        resetIdle();
      }
      function onPointerUp() {
        dragging = false; dragSphere = null;
        canvas.style.cursor = 'grab';
      }

      canvas.style.cursor = 'grab';
      canvas.addEventListener('mousedown', onPointerDown, { passive: true });
      canvas.addEventListener('mousemove', onPointerMove, { passive: true });
      canvas.addEventListener('mouseup', onPointerUp, { passive: true });
      canvas.addEventListener('mouseleave', onPointerUp, { passive: true });
      canvas.addEventListener('touchstart', onPointerDown, { passive: true });
      canvas.addEventListener('touchmove', onPointerMove, { passive: true });
      canvas.addEventListener('touchend', onPointerUp, { passive: true });

      /* ── LOOP: rotación lenta automática + drag con inercia ── */
      let t = 0;
      const AUTO_SPEED = 0.003;
      const DAMPING = 0.96;

      let isSphereVisible = true;
      let sphereRafId = null;

      function sphereLoop() {
        if (!isSphereVisible) { sphereRafId = null; return; }
        sphereRafId = requestAnimationFrame(sphereLoop);
        t += 0.008;

        spheres.forEach((s, i) => {
          /* Oscilación flotante suave */
          const floatX = Math.sin(t * 0.5 + i * 1.5) * 0.12;
          const floatY = Math.cos(t * 0.4 + i * 1.2) * 0.09;
          s.position.x = s.userData.ox + floatX;
          s.position.y = s.userData.oy + floatY;

          if (s === dragSphere && dragging) {
            /* El usuario está arrastrando esta esfera */
            s.rotation.x += s.userData.velX;
            s.rotation.y += s.userData.velY;
          } else {
            /* Inercia post-drag + rotación lenta automática */
            s.userData.velX *= DAMPING;
            s.userData.velY *= DAMPING;
            s.rotation.x += s.userData.velX;
            s.rotation.y += s.userData.velY + AUTO_SPEED;
          }
        });

        renderer.render(scene, camera);
      }
      sphereLoop();

      // Pausa el render loop cuando la sección no está en pantalla —
      // mismo look mientras la ves, cero costo cuando ya bajaste.
      if ('IntersectionObserver' in window) {
        const sphereVisObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isSphereVisible = entry.isIntersecting;
            if (isSphereVisible && !sphereRafId) sphereLoop();
          });
        });
        sphereVisObserver.observe(canvas);
      }

      /* Resize */
      function onResize() {
        const nW = wrap.offsetWidth, nH = wrap.offsetHeight;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      }
      window.addEventListener('resize', onResize, { passive: true });
    }

    /* Iniciar Three.js — robusto para móvil y desktop */
    function tryInitThreeJS() {
      if (typeof THREE !== 'undefined') {
        initThreeJS();
      } else {
        /* Three.js aún no cargó — reintenta */
        setTimeout(tryInitThreeJS, 150);
      }
    }

    const sobreSection = document.getElementById('sobre');
    if (sobreSection) {
      if ('IntersectionObserver' in window) {
        const sobreObs = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            tryInitThreeJS();
            sobreObs.disconnect();
          }
        }, { threshold: 0.05 });
        sobreObs.observe(sobreSection);
      } else {
        tryInitThreeJS();
      }
    }

    /* ==========================================
       FORMULARIO — Netlify Forms con AJAX
       Sin redirección, mensaje de éxito en página
    ========================================== */

    /* ==========================================
       CARRUSEL DE RESEÑAS — 2 visibles, fade por par
    ========================================== */
    (function() {
      var pares  = document.querySelectorAll('.resenas-par');
      var dots   = document.querySelectorAll('.resenas-dot');
      if (!pares.length) return;

      var current  = 0;
      var timer    = null;
      var DELAY    = 5000;

      function goTo(i) {
        pares[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = i;
        pares[current].classList.add('active');
        dots[current].classList.add('active');
      }

      function next() { goTo((current + 1) % pares.length); }

      function start() { timer = setInterval(next, DELAY); }
      function stop()  { clearInterval(timer); }

      start();

      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          stop();
          goTo(parseInt(this.getAttribute('data-par')));
          start();
        });
      });

      var wrap = document.querySelector('.resenas-carousel-wrap');
      if (wrap) {
        wrap.addEventListener('mouseenter', stop);
        wrap.addEventListener('mouseleave', start);
      }
    })();

    /* ==========================================
       FAQ — Acordeón sin salto de página
    ========================================== */
    (function() {
      var items = document.querySelectorAll('.faq-item');
      items.forEach(function(item) {
        var btn    = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        // Setear height inicial a 0
        answer.style.height   = '0px';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease';
        answer.style.opacity  = '0';

        btn.addEventListener('click', function() {
          var isOpen = this.getAttribute('aria-expanded') === 'true';

          // Cerrar todos
          items.forEach(function(it) {
            var b = it.querySelector('.faq-question');
            var a = it.querySelector('.faq-answer');
            if (!b || !a) return;
            b.setAttribute('aria-expanded', 'false');
            a.style.height  = '0px';
            a.style.opacity = '0';
            a.classList.remove('open');
          });

          // Abrir el clickeado si estaba cerrado
          if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            // Medir la altura real del contenido
            answer.style.height  = 'auto';
            var h = answer.scrollHeight;
            answer.style.height  = '0px';
            // Forzar reflow y animar
            answer.getBoundingClientRect();
            answer.style.height  = h + 'px';
            answer.style.opacity = '1';
            answer.classList.add('open');
          }
        });
      });
    })();


    /* ==========================================
       FORMULARIO INTELIGENTE — campos según plan
    ========================================== */
    var tipoSelect       = document.getElementById('tipo');
    var extraPresupuesto = document.getElementById('extraPresupuesto');
    var extraDominio     = document.getElementById('extraDominio');
    var mensajeField     = document.getElementById('mensaje');

    var placeholders = {
      'inicio':      '¿Cuál es tu negocio? ¿Tienes logo y colores definidos?',
      'esencial':    '¿Qué necesitas comunicar? ¿Tienes fotos o usamos banco de imágenes?',
      'profesional': '¿Cuántas páginas necesitas? ¿Tienes referentes visuales?',
      'medida':      '¿Qué funcionalidades necesitas? ¿Hay formularios, pagos, base de datos?',
      'elite':       '¿Cuál es la visión del proyecto? ¿Tienes referentes de diseño internacional?',
      'otro':        '¿Qué necesitas? ¿Para cuándo? ¿Algún referente visual?'
    };

    if (tipoSelect) {
      tipoSelect.addEventListener('change', function() {
        var val = this.value;

        // Placeholder dinámico
        if (mensajeField && placeholders[val]) {
          mensajeField.placeholder = placeholders[val];
        }

        // Mostrar campo presupuesto solo para medida/elite
        if (extraPresupuesto) {
          extraPresupuesto.style.display = (val === 'medida' || val === 'elite') ? 'flex' : 'none';
        }

        // Mostrar campo dominio para todos excepto vacío y "otro"
        if (extraDominio) {
          extraDominio.style.display = (val && val !== 'otro') ? 'flex' : 'none';
        }
      });
    }

    /* ==========================================
       FORMULARIO — envío Web3Forms
    ========================================== */
    var contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
      contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var btn     = document.getElementById('formBtn');
        var btnText = document.getElementById('formBtnText');
        var success = document.getElementById('formSuccess');

        btn.disabled = true;
        btnText.textContent = 'Enviando…';

        var formData = new FormData(contactoForm);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.success) {
            contactoForm.reset();
            // Reset campos extra
            if (extraPresupuesto) extraPresupuesto.style.display = 'none';
            if (extraDominio)     extraDominio.style.display     = 'none';
            if (success) {
              success.style.display = 'flex';
              setTimeout(function() { success.style.display = 'none'; }, 6000);
            }
          } else {
            throw new Error(data.message || 'Error al enviar');
          }
          btn.disabled = false;
          btnText.textContent = 'Enviar mensaje';
        })
        .catch(function() {
          btn.disabled = false;
          btnText.textContent = 'Enviar mensaje';
          alert('Hubo un error al enviar. Escríbenos por WhatsApp o email directamente.');
        });
      });
    

    /* ============================================================
       TESTIMONIOS PREMIUM — sistema editorial con GSAP
    ============================================================ */
    (function() {
      if (typeof gsap === 'undefined') return;

      var reviews = [
        { quote: 'Muy recomendado y excelentes diseños!',                                        name: 'Mayerlin Padilla',              role: 'Ecuador',           avatar: 'M', color: '#1a4a6e' },
        { quote: 'Realmente es un trabajo excelente me encantó.',                                name: 'Mateo Tapia Garzon',            role: 'Ecuador',           avatar: 'M', color: '#0d3352' },
        { quote: 'Exelente trabajo en cada detalle se plasma su dedicación y profesionalismo',   name: 'Lore Garzon',                   role: 'Ecuador',           avatar: 'L', color: '#1e3a5c' },
        { quote: 'Sin duda los mejores',                                                         name: 'Cristina Garzon',               role: 'Ecuador',           avatar: 'C', color: '#0a2a40' },
        { quote: 'Excelente!!',                                                                  name: 'Lcda. Laura Fierro Valverde',   role: 'Ecuador',           avatar: 'L', color: '#163048' },
        { quote: 'Es un sitio web chido',                                                        name: 'Emilito Balladares',            role: 'Ecuador',           avatar: 'E', color: '#2a4a6e' },
        { quote: 'Todo quedó perfecto, muy contenta con el resultado.',                          name: 'Dayanna Porras Moreno',         role: 'Ecuador',           avatar: 'D', color: '#112840' },
        { quote: 'Desde que lancé mi web las consultas aumentaron notablemente. Vale cada peso.', name: 'Dr. Sebastián Ríos',           role: 'Médico · Santiago', avatar: 'S', color: '#0f2a3f' },
        { quote: 'Profesionalismo total. Mi tienda online quedó exactamente como la imaginé.',   name: 'Valentina Mora',                role: 'Emprendedora · Bs As', avatar: 'V', color: '#1a3550' },
        { quote: 'Increíble el nivel de detalle. Mis pacientes me dicen que mi web transmite confianza.', name: 'Dra. Camila Herrera', role: 'Psicóloga · Quito', avatar: 'C', color: '#0d2238' }
      ];

      /* =====================================================
         RESEÑAS PENDIENTES — descomentar y reemplazar texto
         cuando tengas las reseñas reales de tus clientes.
         Recuerda actualizar /10 en el HTML y agregar
         una entrada más al array positions.
      =====================================================
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 11',  role: 'Ciudad · País',  avatar: 'N', color: '#1a3550' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 12',  role: 'Ciudad · País',  avatar: 'N', color: '#0f2a3f' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 13',  role: 'Ciudad · País',  avatar: 'N', color: '#1e3a5c' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 14',  role: 'Ciudad · País',  avatar: 'N', color: '#0a2a40' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 15',  role: 'Ciudad · País',  avatar: 'N', color: '#163048' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 16',  role: 'Ciudad · País',  avatar: 'N', color: '#112840' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 17',  role: 'Ciudad · País',  avatar: 'N', color: '#0d3352' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 18',  role: 'Ciudad · País',  avatar: 'N', color: '#1a4a6e' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 19',  role: 'Ciudad · País',  avatar: 'N', color: '#0f2238' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 20',  role: 'Ciudad · País',  avatar: 'N', color: '#2a4a6e' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 21',  role: 'Ciudad · País',  avatar: 'N', color: '#1e4060' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 22',  role: 'Ciudad · País',  avatar: 'N', color: '#0a1e32' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 23',  role: 'Ciudad · País',  avatar: 'N', color: '#142840' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 24',  role: 'Ciudad · País',  avatar: 'N', color: '#1a3040' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 25',  role: 'Ciudad · País',  avatar: 'N', color: '#0d2030' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 26',  role: 'Ciudad · País',  avatar: 'N', color: '#162840' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 27',  role: 'Ciudad · País',  avatar: 'N', color: '#1e3550' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 28',  role: 'Ciudad · País',  avatar: 'N', color: '#0f2840' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 29',  role: 'Ciudad · País',  avatar: 'N', color: '#1a2a3c' },
        { quote: 'Reemplazar con reseña real.',  name: 'Nombre Cliente 30',  role: 'Ciudad · País',  avatar: 'N', color: '#112030' },
      */

      var current  = 0;
      var total = reviews.length;
      var timer    = null;
      var DELAY    = 4000;
      var running  = false;

      var elQuote  = document.getElementById('tQuote');
      var elName   = document.getElementById('tName');
      var elRole   = document.getElementById('tRole');
      var elAvatar = document.getElementById('tAvatar');
      var elNum    = document.getElementById('tNum');
      var elFill   = document.getElementById('tFill');
      var elBg     = document.getElementById('tBg');
      var elDots   = document.getElementById('tDots');
      var elPrev   = document.getElementById('tPrev');
      var elNext   = document.getElementById('tNext');

      if (!elQuote) return;

      // Build dots
      reviews.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Reseña ' + (i+1));
        dot.addEventListener('click', function() { goTo(i, true); });
        elDots.appendChild(dot);
      });

      function pad(n) { return n < 10 ? '0' + n : '' + n; }

      function updateDots(idx) {
        document.querySelectorAll('.t-dot').forEach(function(d, i) {
          d.classList.toggle('active', i === idx);
        });
      }

      function animateOut(cb) {
        gsap.to([elQuote, elName, elRole], {
          opacity: 0, y: -12, letterSpacing: '0.06em',
          duration: 0.35, ease: 'power2.in',
          onComplete: cb
        });
        gsap.to(elAvatar, {
          opacity: 0, scale: 0.92, filter: 'blur(4px)',
          duration: 0.3, ease: 'power2.in'
        });
      }

      function animateIn() {
        var r = reviews[current];
        elQuote.textContent  = r.quote;
        elName.textContent   = r.name;
        elRole.textContent   = r.role;
        elAvatar.textContent = r.avatar;
        elNum.textContent    = pad(current + 1);
        elAvatar.style.background = 'linear-gradient(135deg, ' + r.color + ', #0a1628)';

        // Fondo dinámico
        // Posiciones del fondo — se generan automáticamente para cualquier cantidad de reseñas
        var positions = reviews.map(function(_, i) {
          var x = 20 + (i * 37) % 60;
          var y = 30 + (i * 23) % 45;
          return x + '% ' + y + '%';
        });
        elBg.style.background = 'radial-gradient(ellipse at ' + positions[current] + ', rgba(45,111,163,0.14) 0%, transparent 65%)';

        updateDots(current);

        // Progress bar
        gsap.set(elFill, { width: '0%' });
        gsap.to(elFill, { width: '100%', duration: DELAY / 1000, ease: 'none' });

        // Animate in
        gsap.fromTo([elQuote], {
          opacity: 0, y: 16, letterSpacing: '0.04em'
        }, {
          opacity: 1, y: 0, letterSpacing: '-0.01em',
          duration: 0.65, ease: 'power3.out', delay: 0.05
        });

        gsap.fromTo([elName, elRole], {
          opacity: 0, y: 10
        }, {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out', delay: 0.18, stagger: 0.06
        });

        gsap.fromTo(elAvatar, {
          opacity: 0, scale: 0.88, filter: 'blur(6px)'
        }, {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 0.6, ease: 'power2.out', delay: 0.1
        });
      }

      function goTo(idx, manual) {
        if (running) return;
        running = true;
        if (manual) { clearInterval(timer); }
        animateOut(function() {
          current = ((idx % total) + total) % total;
          animateIn();
          running = false;
          if (manual) startAuto();
        });
      }

      function startAuto() {
        clearInterval(timer);
        timer = setInterval(function() { goTo(current + 1, false); }, DELAY);
      }

      // Controls
      elPrev && elPrev.addEventListener('click', function() { goTo(current - 1, true); });
      elNext && elNext.addEventListener('click', function() { goTo(current + 1, true); });

      // Pause on hover
      var section = document.getElementById('testimonios');
      if (section) {
        section.addEventListener('mouseenter', function() { clearInterval(timer); gsap.to(elFill, { duration: 0.2, opacity: 0.4 }); });
        section.addEventListener('mouseleave', function() { gsap.to(elFill, { duration: 0.2, opacity: 1 }); startAuto(); });
      }

      // GSAP entrada al hacer scroll
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('#testimonios .t-inner', {
          opacity: 0, y: 40,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#testimonios', start: 'top 75%' }
        });
      }

      // Init — esperar a que GSAP esté disponible
      function tryInit() {
        if (typeof gsap === 'undefined') {
          setTimeout(tryInit, 50);
          return;
        }
        animateIn();
        startAuto();
      }
      tryInit();
    })();


  }
  // =====================================================
  // SWIPER COVERFLOW — PROYECTOS
  // =====================================================
  (function () {
    if (typeof Swiper === 'undefined') return;

    var swiper = new Swiper('.proyectos-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      speed: 600,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 180,
        modifier: 1,
        slideShadows: false,
      },
      pagination: {
        el: '.proyectos-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.proyectos-next',
        prevEl: '.proyectos-prev',
      },
      on: {
        // Video hover: play en slide activo, pause en los demás
        slideChange: function () {
          document.querySelectorAll('.proyecto-slide video').forEach(function (v) {
            v.pause();
            v.currentTime = 0;
          });
        },
      },
    });

    // Hover video en slide activo
    document.querySelectorAll('.proyecto-slide .mockup-screen').forEach(function (screen) {
      screen.addEventListener('mouseenter', function () {
        var slide = screen.closest('.swiper-slide');
        if (slide && slide.classList.contains('swiper-slide-active')) {
          var video = screen.querySelector('video');
          if (video) video.play();
        }
      });
      screen.addEventListener('mouseleave', function () {
        var video = screen.querySelector('video');
        if (video) { video.pause(); video.currentTime = 0; }
      });
    });
  })();

  // =====================================================
  // PRECIOS — BOTÓN VER MÁS (solo móvil) — FIX SALTO
  // =====================================================
  (function () {
    var btn   = document.getElementById('preciosVerMasBtn');
    var extra = document.querySelector('.precios-extra');
    var wrap  = document.querySelector('.precios-ver-mas-wrap');
    if (!btn || !extra) return;

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var texto    = btn.querySelector('.precios-ver-mas-texto');

      if (expanded) {
        // Colapsar — anclar el botón al viewport para evitar salto
        var btnRect = btn.getBoundingClientRect();
        var btnTop  = btnRect.top + window.scrollY;

        extra.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        if (texto) texto.textContent = 'Ver todos los planes';

        // Scroll hasta donde estaba el botón — usuario no se pierde
        requestAnimationFrame(function () {
          var newBtnTop = btn.getBoundingClientRect().top + window.scrollY;
          var diff = newBtnTop - btnTop;
          if (Math.abs(diff) > 10) {
            window.scrollBy({ top: diff, behavior: 'instant' });
          }
        });
      } else {
        // Expandir
        var scrollY = window.scrollY;
        extra.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        if (texto) texto.textContent = 'Ver menos planes';
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    });
  })();

  // =====================================================
  // HERO — LISTA DERECHA: Fade + Slide + Blur con GSAP
  // =====================================================
  (function () {
    if (typeof gsap === 'undefined') return;
    var items = document.querySelectorAll('.hero-for-item');
    if (!items.length) return;

    gsap.to(items, {
      opacity:    1,
      x:          0,
      filter:     'blur(0px)',
      duration:   0.6,
      ease:       'power3.out',
      stagger:    0.12,
      delay:      0.9,
    });
  })();

  // =====================================================
  // PROYECTOS — PARALLAX IMAGEN CHIMBORAZO
  // =====================================================
  (function () {
    var bg = document.getElementById('proyectosBg');
    if (!bg) return;

    function onScroll() {
      var section  = document.getElementById('proyectos');
      if (!section) return;
      var rect     = section.getBoundingClientRect();
      var visible  = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) return;

      // Cuánto ha scrolleado dentro de la sección
      var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      // Mover la imagen más lento que el scroll — efecto parallax suave
      var offset   = (progress - 0.5) * 80; // ±40px máximo
      bg.style.transform = 'translateY(' + offset + 'px)';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // ejecutar al cargar
  })();

  // =====================================================
  // PROCESO — DOTS + FIX TILT EN TOUCH
  // =====================================================
  (function () {
    var grid = document.querySelector('.proceso-grid');
    var dots = document.querySelectorAll('.proceso-dot');
    var steps = document.querySelectorAll('.proceso-step');
    if (!grid || !dots.length) return;

    // Fix tilt en touch — desactivar eventos de tilt en móvil
    if (window.matchMedia('(pointer: coarse)').matches) {
      steps.forEach(function(step) {
        step.removeAttribute('data-tilt');
        step.style.transform = 'none';
      });
    }

    // Dots sincronizados con el scroll
    grid.addEventListener('scroll', function () {
      var cardW  = steps[0] ? steps[0].offsetWidth + 16 : 0;
      var index  = Math.round(grid.scrollLeft / cardW);
      index = Math.max(0, Math.min(index, dots.length - 1));
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }, { passive: true });

    // Click en dot — scroll a esa card
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var cardW = steps[0] ? steps[0].offsetWidth + 16 : 0;
        grid.scrollTo({ left: cardW * i, behavior: 'smooth' });
      });
    });
  })();

  // =====================================================
  // CONTACTO — COUNTUP STATS
  // =====================================================
  (function () {
    var stats = document.querySelectorAll('.contacto-stat .stat-num');
    if (!stats.length) return;

    var animated = false;

    function countUp(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 1800;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // Ease out
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    // Activar cuando la sección entra al viewport
    var section = document.getElementById('contacto');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        stats.forEach(function (el) { countUp(el); });
      }
    }, { threshold: 0.3 });

    observer.observe(section);
  })();

  // =====================================================
  // REPRODUCTOR VINILO
  // =====================================================
  (function () {
    var audio     = document.getElementById('vinylAudio');
    var disc      = document.getElementById('vinylDisc');
    var outer     = disc ? disc.querySelector('.vinyl-outer') : null;
    var info      = document.getElementById('vinylInfo');
    var trackName = document.getElementById('vinylTrackName');
    var shuffle   = document.getElementById('vinylShuffle');

    if (!audio || !disc) return;

    var tracks = [
      { src: 'track1.mp3', title: 'Always — DISTRXCT' },
      { src: 'track2.mp3', title: 'Stylish Lifestyle — Dope Cat' },
    ];
    var current = 0;
    audio.volume = 0.5;
    var infoTimer = null;

    function showInfo() {
      clearTimeout(infoTimer);
      info.classList.add('visible');
      infoTimer = setTimeout(function () {
        info.classList.remove('visible');
      }, 3000);
    }

    function loadTrack(idx) {
      audio.src = tracks[idx].src;
      trackName.textContent = tracks[idx].title;
      showInfo();
    }

    function setPlaying(playing) {
      if (playing) {
        outer.classList.add('spinning');
      } else {
        outer.classList.remove('spinning');
      }
    }

    // Click en disco = play/pause
    disc.addEventListener('click', function () {
      if (!audio.src || audio.src === window.location.href) {
        loadTrack(current);
      }
      if (audio.paused) {
        audio.play();
        setPlaying(true);
        showInfo();
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    // Al terminar — siguiente canción
    audio.addEventListener('ended', function () {
      current = (current + 1) % tracks.length;
      loadTrack(current);
      audio.play();
      setPlaying(true);
    });

    // Botón shuffle — cambiar canción
    shuffle.addEventListener('click', function () {
      var next = (current + 1) % tracks.length;
      current = next;
      loadTrack(current);
      if (!audio.paused) {
        audio.play();
        setPlaying(true);
      }
    });

    // Mostrar info al hover
    disc.addEventListener('mouseenter', showInfo);

  })();

  // =====================================================
  // NAV — MAGNETIC HOVER
  // =====================================================
  (function() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(function(link) {
      link.addEventListener('mousemove', function(e) {
        var rect = link.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.4) + 'px)';
      });
      link.addEventListener('mouseleave', function() {
        link.style.transform = 'translate(0, 0)';
        link.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      });
      link.addEventListener('mouseenter', function() {
        link.style.transition = 'transform 0.1s ease';
      });
    });
  })();

  // =====================================================
  // AGENDAMIENTO — CALENDARIO INTERACTIVO (conectado a Supabase)
  // =====================================================
  (function() {
    var grid = document.getElementById('agendaCalGrid');
    if (!grid) return;

    // --- Conexión a Supabase ---------------------------------------
    // Reemplazá estos dos valores por los de TU proyecto:
    // Supabase → Settings → API → Project URL / anon public key
    var SUPABASE_URL = 'https://wdyrxrunmjrxgaputcol.supabase.co';
    var SUPABASE_ANON_KEY = 'sb_publishable_w8ZiOrQH_OblYwE5x6flCw_uQNSamJt';

    var supabase = null;
    if (window.supabase && SUPABASE_URL.indexOf('TU_SUPABASE') === -1) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    // -----------------------------------------------------------------

    var monthLabel = document.getElementById('agendaMonthLabel');
    var prevBtn = document.getElementById('agendaPrev');
    var nextBtn = document.getElementById('agendaNext');
    var slotsWrap = document.getElementById('agendaSlots');
    var confirmBtn = document.getElementById('agendaConfirmBtn');
    var confirmText = document.getElementById('agendaConfirmText');
    var selectedDateLabel = document.getElementById('agendaSelectedDate');
    var formFields = document.getElementById('agendaFormFields');
    var errorBox = document.getElementById('agendaError');
    var nombreInput = document.getElementById('agendaNombre');
    var telefonoInput = document.getElementById('agendaTelefono');
    var emailInput = document.getElementById('agendaEmail');

    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();

    var minMonth = today.getMonth();
    var minYear = today.getFullYear();
    var maxMonthsAhead = 2; // solo se puede navegar 2 meses hacia adelante

    var allSlots = ['09:00', '09:40', '10:20', '11:00', '11:40', '15:00', '15:40', '16:20', '17:00'];

    var selectedDateKey = null;
    var selectedSlot = null;
    var confirmed = false;
    var occupiedMap = {}; // { 'YYYY-MM-DD': ['09:00', '10:20', ...] }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function isoDate(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
    function dateKey(y, m, d) { return y + '-' + m + '-' + d; }

    // Horario de atención — regla de negocio fija, no viene de la base de datos
    function horarioBase(y, m, d) {
      var dow = new Date(y, m, d).getDay(); // 0 = domingo
      if (dow === 0) return []; // cerrado domingos
      if (dow === 6) return allSlots.slice(0, 4); // sábados: agenda más corta
      return allSlots.slice();
    }

    function isPast(y, m, d) {
      var date = new Date(y, m, d);
      date.setHours(0, 0, 0, 0);
      return date < today;
    }

    // Trae de Supabase los horarios ya reservados del mes visible
    function fetchOccupiedForMonth(y, m) {
      if (!supabase) {
        renderMonth();
        if (selectedDateKey) refreshSelectedSlots();
        return;
      }

      var start = isoDate(y, m, 1);
      var lastDay = new Date(y, m + 1, 0).getDate();
      var end = isoDate(y, m, lastDay);

      supabase
        .from('citas')
        .select('fecha, hora')
        .eq('estado', 'confirmada')
        .gte('fecha', start)
        .lte('fecha', end)
        .then(function(res) {
          occupiedMap = {};
          if (res.data) {
            res.data.forEach(function(row) {
              if (!occupiedMap[row.fecha]) occupiedMap[row.fecha] = [];
              occupiedMap[row.fecha].push(row.hora);
            });
          }
          renderMonth();
          if (selectedDateKey) refreshSelectedSlots();
        })
        .catch(function(err) {
          console.error('No se pudo cargar la disponibilidad:', err);
          renderMonth();
        });
    }

    function getAvailability(y, m, d) {
      var base = horarioBase(y, m, d);
      if (base.length === 0) return [];
      var iso = isoDate(y, m, d);
      var ocupados = occupiedMap[iso] || [];
      return base.filter(function(hora) {
        return ocupados.indexOf(hora) === -1;
      });
    }

    function refreshSelectedSlots() {
      var parts = selectedDateKey.split('-');
      var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
      renderSlots(getAvailability(y, m, d), y, m, d);
    }

    function renderMonth() {
      monthLabel.textContent = monthNames[viewMonth] + ' ' + viewYear;

      var firstDay = new Date(viewYear, viewMonth, 1).getDay();
      var offset = firstDay === 0 ? 6 : firstDay - 1; // semana empieza en lunes
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      grid.innerHTML = '';

      for (var i = 0; i < offset; i++) {
        var empty = document.createElement('div');
        empty.className = 'agenda-day is-empty';
        grid.appendChild(empty);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'agenda-day';
        btn.textContent = d;

        var past = isPast(viewYear, viewMonth, d);
        var avail = getAvailability(viewYear, viewMonth, d);
        var key = dateKey(viewYear, viewMonth, d);

        if (past || avail.length === 0) {
          btn.classList.add('is-disabled');
          btn.disabled = true;
        } else {
          btn.classList.add('has-slots');
        }

        if (key === selectedDateKey) {
          btn.classList.add('is-selected');
        }

        if (viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate()) {
          btn.classList.add('is-today');
        }

        (function(y, m, dd, k, av) {
          btn.addEventListener('click', function() {
            selectedDateKey = k;
            selectedSlot = null;
            confirmed = false;
            errorBox.hidden = true;
            renderMonth();
            renderSlots(av, y, m, dd);
            var dow = new Date(y, m, dd).getDay();
            selectedDateLabel.textContent = dayNames[dow] + ' ' + dd + ' de ' + monthNames[m];
            updateConfirmState();
          });
        })(viewYear, viewMonth, d, key, avail);

        grid.appendChild(btn);
      }

      // límites de navegación: no ir a meses pasados, ni más de 2 meses adelante
      var monthsFromMin = (viewYear - minYear) * 12 + (viewMonth - minMonth);
      prevBtn.disabled = monthsFromMin <= 0;
      nextBtn.disabled = monthsFromMin >= maxMonthsAhead;
    }

    function renderSlots(avail, y, m, d) {
      slotsWrap.innerHTML = '';

      if (!avail || avail.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'agenda-slots-empty';
        empty.textContent = 'Sin horarios disponibles este día';
        slotsWrap.appendChild(empty);
        return;
      }

      var fullDay = horarioBase(y, m, d);

      fullDay.forEach(function(time) {
        var pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'agenda-slot';
        pill.textContent = time;

        var available = avail.indexOf(time) !== -1;
        if (!available) {
          pill.disabled = true;
        } else {
          pill.addEventListener('click', function() {
            selectedSlot = time;
            confirmed = false;
            errorBox.hidden = true;
            slotsWrap.querySelectorAll('.agenda-slot').forEach(function(el) {
              el.classList.remove('is-selected');
            });
            pill.classList.add('is-selected');
            updateConfirmState();
          });
        }

        slotsWrap.appendChild(pill);
      });
    }

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.hidden = false;
    }

    function updateConfirmState() {
      confirmBtn.classList.remove('is-ready', 'is-confirmed');

      if (confirmed) {
        confirmBtn.classList.add('is-confirmed');
        confirmText.textContent = 'Cita confirmada ✓';
        confirmBtn.disabled = true;
        formFields.hidden = true;
      } else if (selectedDateKey && selectedSlot) {
        formFields.hidden = false;
        confirmBtn.classList.add('is-ready');
        confirmBtn.disabled = false;
        confirmText.textContent = 'Confirmar ' + selectedSlot;
      } else {
        formFields.hidden = true;
        confirmBtn.disabled = true;
        confirmText.textContent = 'Selecciona fecha y hora';
      }
    }

    confirmBtn.addEventListener('click', function() {
      if (!selectedDateKey || !selectedSlot || confirmed) return;

      var nombre = (nombreInput.value || '').trim();
      var telefono = (telefonoInput.value || '').trim();
      var email = (emailInput.value || '').trim();

      if (!nombre) { showError('Ingresa tu nombre completo.'); return; }
      if (!telefono || telefono.replace(/\D/g, '').length < 7) {
        showError('Ingresa un número de WhatsApp válido.');
        return;
      }
      if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        showError('Ingresa un email válido.');
        return;
      }

      if (!supabase) {
        showError('El sistema de reservas todavía no está conectado. Escríbenos por WhatsApp mientras tanto.');
        return;
      }

      var parts = selectedDateKey.split('-');
      var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
      var fecha = isoDate(y, m, d);

      confirmBtn.disabled = true;
      confirmText.textContent = 'Confirmando…';

      supabase.from('citas').insert({
        fecha: fecha,
        hora: selectedSlot,
        nombre: nombre,
        telefono: telefono,
        email: email || null
      }).then(function(res) {
        if (res.error) {
          if (res.error.code === '23505') {
            showError('Justo se ocupó ese horario. Elige otro, por favor.');
            fetchOccupiedForMonth(viewYear, viewMonth);
          } else {
            showError('No se pudo confirmar la cita. Intenta de nuevo.');
          }
          confirmBtn.disabled = false;
          confirmText.textContent = 'Confirmar ' + selectedSlot;
          return;
        }

        confirmed = true;
        if (!occupiedMap[fecha]) occupiedMap[fecha] = [];
        occupiedMap[fecha].push(selectedSlot);
        updateConfirmState();
      }).catch(function(err) {
        console.error('Error al confirmar la cita:', err);
        showError('No se pudo confirmar la cita. Intenta de nuevo.');
        confirmBtn.disabled = false;
        confirmText.textContent = 'Confirmar ' + selectedSlot;
      });
    });

    prevBtn.addEventListener('click', function() {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      fetchOccupiedForMonth(viewYear, viewMonth);
    });

    nextBtn.addEventListener('click', function() {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      fetchOccupiedForMonth(viewYear, viewMonth);
    });

    renderMonth();

    // Se expone para que el modal recargue disponibilidad fresca cada vez que se abre
    window.agendaRefreshAvailability = function() {
      fetchOccupiedForMonth(viewYear, viewMonth);
    };
  })();

  // =====================================================
  // AGENDAMIENTO — MODAL OPEN/CLOSE
  // =====================================================
  (function() {
    var openBtn = document.getElementById('agendaOpenBtn');
    var modal = document.getElementById('agendaModal');
    if (!openBtn || !modal) return;

    var closeBtn = document.getElementById('agendaModalClose');
    var backdrop = document.getElementById('agendaModalBackdrop');

    function openModal() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('agenda-modal-open');
      if (window.agendaRefreshAvailability) window.agendaRefreshAvailability();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('agenda-modal-open');
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  })();

  // =====================================================
  // LOOKBACK — Fase 2 (estantería de libros)
  // =====================================================
  (function() {
    var shelf = document.getElementById('lookbackShelf');
    if (!shelf) return;

    // ---------------------------------------------------------------
    // Agregá tus fotos/videos acá. Copiá el mismo patrón de una fila
    // y pegá tu link de Cloudinary + el número + una etiqueta corta.
    // "tipo" puede ser 'img' o 'video'.
    // "featured: true" hace que ese lomo sea un poco más ancho y que
    // al abrirse ocupe más espacio (le da ritmo, como en una revista).
    // ---------------------------------------------------------------
    var lookbackItems = [
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/f_auto,q_auto/v1783217092/1_hf6qca.webp', tipo: 'img', numero: '01', etiqueta: 'Branding — Marzo', featured: true },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/f_auto,q_auto/v1783217092/2_z8yaf1.webp', tipo: 'img', numero: '02', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' },
      { src: 'https://res.cloudinary.com/djpfphcj/image/upload/v1783217092/3_jdtfmu.webp', tipo: 'img', numero: '03', etiqueta: 'Branding — Marzo' }

      // Ejemplo de cómo seguir agregando (descomentá y editá):
      // , { src: 'TU_LINK_DE_CLOUDINARY_AQUI', tipo: 'img', numero: '04', etiqueta: 'Merch — Abril' }
      // , { src: 'TU_LINK_DE_VIDEO_AQUI', tipo: 'video', numero: '05', etiqueta: 'Merch — Abril', featured: true }
    ];

    var BASE_WIDTHS = [64, 80, 96]; // varía el "grosor" de cada lomo, como libros reales
    var openIndex = null;
    var linkedSpineIndex = null; // qué foto está resaltando la barra ahora mismo
    var eqApi = null;            // lo llena el módulo del waveform una vez armado
    var sharedT0 = (window.performance && performance.now) ? performance.now() : Date.now();

    lookbackItems.forEach(function(item, index) {
      var spine = document.createElement('div');
      spine.className = 'lookback-spine';
      spine.tabIndex = 0;
      spine.setAttribute('role', 'button');
      spine.setAttribute('aria-expanded', 'false');
      spine.setAttribute('aria-label', 'Ver ' + item.etiqueta);

      var baseW = item.featured ? 104 : BASE_WIDTHS[index % BASE_WIDTHS.length];
      var openW = item.featured ? 480 : 400;
      spine.style.setProperty('--spine-w', baseW + 'px');
      spine.style.setProperty('--open-w', openW + 'px');

      var media = document.createElement('div');
      media.className = 'lookback-spine-media';

      if (item.tipo === 'video') {
        var video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        media.appendChild(video);
      } else {
        var img = document.createElement('img');
        img.src = item.src;
        img.loading = 'lazy';
        img.alt = item.etiqueta || 'Andina Web Studio — branding';
        media.appendChild(img);
      }

      // Título vertical, como el lomo real de un libro (solo visible cerrado)
      var label = document.createElement('span');
      label.className = 'lookback-spine-label';
      label.textContent = item.numero + ' · ' + item.etiqueta;

      // Meta horizontal, solo visible cuando el lomo está abierto
      var meta = document.createElement('div');
      meta.className = 'lookback-spine-meta';
      meta.innerHTML =
        '<span class="lookback-card-num">' + item.numero + '</span>' +
        '<span class="lookback-card-tag">' + item.etiqueta + '</span>';

      spine.appendChild(media);
      spine.appendChild(label);
      spine.appendChild(meta);
      shelf.appendChild(spine);
    });

    var spines = shelf.querySelectorAll('.lookback-spine');
    var counter = document.getElementById('lookbackCounter');
    var total = lookbackItems.length;

    function updateCounter() {
      if (!counter) return;
      var tot = String(total).padStart(2, '0');
      counter.textContent = (openIndex === null ? '—' : String(openIndex + 1).padStart(2, '0')) + ' / ' + tot;
    }
    updateCounter();

    // --- Sonido suave de apertura, generado con Web Audio (sin archivos) ---
    var audioCtx = null;

    // El navegador solo "destraba" el audio si esto corre DENTRO de un
    // gesto real del usuario (pointerdown/touchstart), no un instante
    // después (como dentro de un requestAnimationFrame). Por eso esta
    // función se llama apenas empieza el toque, no cuando el sonido
    // intenta reproducirse. Safari/iOS es más estricto que el resto:
    // además de resume(), necesita que se reproduzca algo (aunque sea
    // silencioso) en ese mismo instante para terminar de destrabar.
    var audioUnlocked = false;
    function unlockAudio() {
      try {
        if (!audioCtx) {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!audioUnlocked) {
          audioUnlocked = true;
          var silentBuffer = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
          var silentSource = audioCtx.createBufferSource();
          silentSource.buffer = silentBuffer;
          silentSource.connect(audioCtx.destination);
          silentSource.start(0);
        }
      } catch (e) { /* seguimos sin sonido */ }
    }

    // Red extra: algunos navegadores móviles solo confían en 'touchstart'
    // para desbloquear audio, no en 'pointerdown'. Escuchamos en toda la
    // sección para no depender de un único punto de entrada.
    var lookbackSection = document.getElementById('lookback');
    if (lookbackSection) {
      lookbackSection.addEventListener('touchstart', unlockAudio, { passive: true });
    }

    // Capa más robusta: el PRIMER toque/click/tecla en CUALQUIER parte de
    // la página (no solo dentro de Lookback) intenta destrabar el audio.
    // Así, para cuando la persona llega a esta sección, ya suele estar
    // destrabado de entrada.
    ['pointerdown', 'touchstart', 'mousedown', 'click', 'keydown'].forEach(function(evt) {
      document.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });

    function playOpenSound() {
      try {
        unlockAudio();
        if (!audioCtx) return;

        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(480, audioCtx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) { /* si el navegador bloquea audio, seguimos sin sonido */ }
    }

    function pauseVideo(spine) {
      var v = spine.querySelector('video');
      if (v) { v.pause(); }
    }

    function playVideo(spine) {
      var v = spine.querySelector('video');
      if (v) { v.play().catch(function() {}); }
    }

    function closeAll() {
      if (openIndex === null) return;
      openIndex = null;
      spines.forEach(function(spine) {
        spine.classList.remove('is-open');
        spine.setAttribute('aria-expanded', 'false');
        pauseVideo(spine);
      });
      shelf.classList.remove('has-open');
      updateCounter();
      if (eqApi) eqApi.clear();
    }

    function openSpine(index) {
      if (openIndex === index) {
        closeAll();
        return;
      }
      openIndex = index;
      spines.forEach(function(spine, i) {
        var isOpen = i === index;
        spine.classList.toggle('is-open', isOpen);
        spine.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) { playVideo(spine); } else { pauseVideo(spine); }
      });
      shelf.classList.add('has-open');
      playOpenSound();
      updateCounter();
      if (eqApi) eqApi.highlight(index);
      // Centra el lomo recién abierto dentro de la estantería (por si hay scroll)
      spines[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // ---------------------------------------------------------------
    // BARRA DE SONIDO — waveform scrubber sincronizado con el scroll
    // horizontal del shelf. La parte "reproducida" queda coloreada con
    // el acento, el resto en gris. Las barras REACCIONAN en vivo: laten
    // más fuerte cerca de donde tocás y cuanto más rápido te movés
    // (como un ecualizador real), con un "tick" seco que acompaña el
    // movimiento — más agudo cuanto más rápido arrastrás.
    // ---------------------------------------------------------------
    (function() {
      var eq = document.getElementById('lookbackEq');
      var barsWrap = document.getElementById('lookbackEqBars');
      var progressWrap = document.getElementById('lookbackEqProgress');
      if (!eq || !barsWrap || !progressWrap) return;

      var BAR_W = 1.5; // ancho de cada barra (px) — finas, estilo premium
      var BAR_GAP = 2; // separación entre barras (px)

      var BAR_COUNT = 0;
      var baseHeights = [];
      var curHeights = [];
      var baseBars = [];
      var progressBars = [];

      // Degradé multi-tono con tu paleta (celeste → hielo → dorado) en vez
      // de un solo color plano — cada barra interpola según su posición.
      var GRADIENT_STOPS = [
        [45, 111, 163],  // --sky
        [168, 200, 232], // --ice
        [201, 169, 110]  // --gold
      ];

      function colorAt(t) {
        var segments = GRADIENT_STOPS.length - 1;
        var scaled = Math.min(Math.max(t, 0), 1) * segments;
        var idx = Math.min(Math.floor(scaled), segments - 1);
        var localT = scaled - idx;
        var c0 = GRADIENT_STOPS[idx];
        var c1 = GRADIENT_STOPS[idx + 1];
        var r = Math.round(c0[0] + (c1[0] - c0[0]) * localT);
        var g = Math.round(c0[1] + (c1[1] - c0[1]) * localT);
        var b = Math.round(c0[2] + (c1[2] - c0[2]) * localT);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      }

      function buildBars() {
        // Calcula cuántas barras entran para llenar el ancho REAL del
        // contenedor — así nunca queda un hueco vacío en pantallas grandes
        // ni se amontonan de más en pantallas chicas.
        var width = eq.getBoundingClientRect().width;
        BAR_COUNT = Math.max(24, Math.floor(width / (BAR_W + BAR_GAP)));

        baseHeights = [];
        for (var i = 0; i < BAR_COUNT; i++) {
          // Combinación de dos senos para un waveform con "forma", no ruido plano
          var h = 20 + Math.abs(Math.sin(i * 0.4)) * 38 + Math.abs(Math.sin(i * 1.6)) * 18;
          baseHeights.push(Math.min(h, 92));
        }
        curHeights = baseHeights.slice();

        barsWrap.innerHTML = '';
        progressWrap.innerHTML = '';

        var fragA = document.createDocumentFragment();
        var fragB = document.createDocumentFragment();
        baseHeights.forEach(function(h, i) {
          var barA = document.createElement('div');
          barA.className = 'lookback-eq-bar';
          barA.style.height = h.toFixed(1) + '%';
          fragA.appendChild(barA);

          var barB = document.createElement('div');
          barB.className = 'lookback-eq-bar';
          barB.style.height = h.toFixed(1) + '%';
          barB.style.background = colorAt(i / Math.max(BAR_COUNT - 1, 1));
          fragB.appendChild(barB);
        });
        barsWrap.appendChild(fragA);
        progressWrap.appendChild(fragB);

        baseBars = barsWrap.querySelectorAll('.lookback-eq-bar');
        progressBars = progressWrap.querySelectorAll('.lookback-eq-bar');
      }

      buildBars();

      function maxScroll() {
        return Math.max(shelf.scrollWidth - shelf.clientWidth, 1);
      }

      function currentPct() {
        return Math.min(Math.max(shelf.scrollLeft / maxScroll(), 0), 1);
      }

      var isScrubbing = false;
      var hoverBarIndex = null; // qué barra está bajo el mouse, para el "cosquilleo" al pasar
      var scrubTarget = null;   // marca si estás tocando la barra ahora mismo
      var wheelTarget = null;   // a dónde "querés" llegar con la rueda del mouse (con inercia)

      function scrubToClientX(clientX) {
        var rect = eq.getBoundingClientRect();
        var pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        shelf.scrollLeft = pct * maxScroll();
      }

      function updateHoverIndex(clientX) {
        var rect = eq.getBoundingClientRect();
        var pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        hoverBarIndex = pct * (BAR_COUNT - 1);
      }

      eq.addEventListener('pointerdown', function(e) {
        unlockAudio();
        isScrubbing = true;
        scrubTarget = true;
        wheelTarget = null; // si venías con inercia de la rueda, el toque manda
        eq.classList.add('is-scrubbing');
        eq.setPointerCapture(e.pointerId);
        scrubToClientX(e.clientX);
        updateHoverIndex(e.clientX);
      });

      eq.addEventListener('pointermove', function(e) {
        updateHoverIndex(e.clientX);
        if (!isScrubbing) return;
        scrubToClientX(e.clientX);
      });

      eq.addEventListener('pointerleave', function() {
        if (!isScrubbing) hoverBarIndex = null;
      });

      function endScrub() {
        if (!isScrubbing) return;
        isScrubbing = false;
        scrubTarget = null;
        eq.classList.remove('is-scrubbing');
      }

      eq.addEventListener('pointerup', endScrub);
      eq.addEventListener('pointercancel', endScrub);

      // ---------------------------------------------------------------
      // Rueda del mouse sobre la estantería (o la barra) mueve las fotos
      // en horizontal, con inercia suave — no hace falta soltar el mouse
      // para recorrer todo el Lookback.
      // ---------------------------------------------------------------
      function onWheel(e) {
        var base = wheelTarget !== null ? wheelTarget : shelf.scrollLeft;
        var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        var atStart = base <= 0 && delta < 0;
        var atEnd = base >= maxScroll() && delta > 0;

        if (atStart || atEnd) {
          // Ya no hay más fotos para mover en esa dirección — soltamos la
          // rueda del mouse para que la página siga scrolleando normal,
          // en vez de dejar a la persona "atrapada" ahí.
          return;
        }

        unlockAudio();
        e.preventDefault();
        wheelTarget = Math.min(Math.max(base + delta, 0), maxScroll());
      }
      shelf.addEventListener('wheel', onWheel, { passive: false });
      eq.addEventListener('wheel', onWheel, { passive: false });

      // --- Tick seco (ruido filtrado), no un "bip" tipo burbuja ---
      var lastTickPlayedAt = 0;
      var MIN_TICK_INTERVAL_MS = 32; // evita que se amontonen ticks y "crepiten" en parlantes chicos

      function playScrollTick(velocity, volumeScale) {
        var nowMs = Date.now();
        if (nowMs - lastTickPlayedAt < MIN_TICK_INTERVAL_MS) return;
        lastTickPlayedAt = nowMs;

        try {
          if (!audioCtx) {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            audioCtx = new AudioCtx();
          }
          if (audioCtx.state === 'suspended') audioCtx.resume();

          var now = audioCtx.currentTime;
          var dur = 0.028;
          var bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
          var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          var data = buffer.getChannelData(0);
          var fadeIn = Math.floor(bufferSize * 0.25); // arranque suave, sin "click" de golpe
          for (var k = 0; k < bufferSize; k++) {
            var env = (1 - k / bufferSize);
            if (k < fadeIn) env *= k / fadeIn;
            data[k] = (Math.random() * 2 - 1) * env;
          }

          var noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          var vAbs = Math.min(Math.abs(velocity), 34);
          var bandpass = audioCtx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.value = 2000 + vAbs * 55;
          bandpass.Q.value = 0.9;

          var vol = (typeof volumeScale === 'number' ? volumeScale : 1);
          var gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.065 * vol, now + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

          noise.connect(bandpass);
          bandpass.connect(gain);
          gain.connect(audioCtx.destination);
          noise.start(now);
          noise.stop(now + dur);
        } catch (e) { /* sin audio, seguimos igual */ }
      }

      // ---------------------------------------------------------------
      // Enlace visual con las fotos: cuando una foto está resaltada (hover
      // o abierta), el tramo de barras que le corresponde se pinta dorado
      // — así se lee como el MISMO objeto, no dos widgets pegados.
      // ---------------------------------------------------------------
      var linkedBars = [];

      function clearLinkedBars() {
        linkedBars.forEach(function(bar) { bar.classList.remove('is-linked'); });
        linkedBars = [];
      }

      function highlightSpineRange(index) {
        clearLinkedBars();
        var spine = index === null ? null : spines[index];
        var total = shelf.scrollWidth;
        if (!spine || !total) return;
        var startBar = Math.floor((spine.offsetLeft / total) * BAR_COUNT);
        var endBar = Math.ceil(((spine.offsetLeft + spine.offsetWidth) / total) * BAR_COUNT);
        for (var i = Math.max(0, startBar); i < Math.min(BAR_COUNT, endBar); i++) {
          if (baseBars[i]) {
            baseBars[i].classList.add('is-linked');
            linkedBars.push(baseBars[i]);
          }
        }
      }

      eqApi = { highlight: highlightSpineRange, clear: clearLinkedBars };

      // ---------------------------------------------------------------
      // Loop continuo: sincroniza el progreso, hace "latir" las barras
      // cerca de donde está pasando la acción (drag o mouse encima),
      // "respira" en fase con la ola de las fotos, y dispara el tick con
      // un umbral bien fino mientras estás tocando la barra directamente.
      // ---------------------------------------------------------------
      var lastFrameScroll = shelf.scrollLeft;
      var smoothVelocity = 0;
      var lastTickScroll = shelf.scrollLeft;
      var TICK_STEP_TOUCH = 6;
      var TICK_STEP_OTHER = 46;

      function eqLoop() {
        if (!scrubTarget && wheelTarget !== null) {
          shelf.scrollLeft += (wheelTarget - shelf.scrollLeft) * 0.16;
          if (Math.abs(wheelTarget - shelf.scrollLeft) < 0.5) wheelTarget = null;
        }

        var scrollNow = shelf.scrollLeft;
        var rawVelocity = scrollNow - lastFrameScroll;
        lastFrameScroll = scrollNow;
        smoothVelocity += (rawVelocity - smoothVelocity) * 0.3;

        var pct = currentPct();
        progressWrap.style.width = (pct * 100) + '%';

        var focusIndex = pct * (BAR_COUNT - 1);
        var velocityBoost = prefersReducedMotion ? 0 : Math.min(Math.abs(smoothVelocity) * 1.4, 42);

        var now = (window.performance && performance.now) ? performance.now() : Date.now();
        var elapsedShared = (now - sharedT0) / 1000;
        var breathe = prefersReducedMotion ? 1 : (1 + Math.sin(elapsedShared * 0.9) * 0.05);

        for (var i = 0; i < BAR_COUNT; i++) {
          var target = baseHeights[i] * breathe;

          if (!prefersReducedMotion) {
            var distFocus = Math.abs(i - focusIndex);
            if (distFocus < 10) {
              target += (1 - distFocus / 10) * velocityBoost;
            }

            if (hoverBarIndex !== null) {
              var distHover = Math.abs(i - hoverBarIndex);
              if (distHover < 7) {
                target += (1 - distHover / 7) * 14;
              }
            }
          }

          target = Math.min(target, 100);
          curHeights[i] += (target - curHeights[i]) * 0.22;

          var val = curHeights[i].toFixed(1) + '%';
          baseBars[i].style.height = val;
          progressBars[i].style.height = val;
        }

        var tickStep = scrubTarget ? TICK_STEP_TOUCH : TICK_STEP_OTHER;
        var scrollDelta = scrollNow - lastTickScroll;
        if (Math.abs(scrollDelta) > tickStep) {
          var volScale = scrubTarget ? Math.min(Math.abs(scrollDelta) / 40, 1) : 1;
          playScrollTick(smoothVelocity, volScale);
          lastTickScroll = scrollNow;
        }

        requestAnimationFrame(eqLoop);
      }
      requestAnimationFrame(eqLoop);

      var resizeTimer = null;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          buildBars();
          progressWrap.style.width = (currentPct() * 100) + '%';
        }, 150);
      });
    })();

    var hoverState = new Array(spines.length).fill(false);

    // El 'click' nativo se cancela cuando el dedo se mueve aunque sea un
    // poco dentro de un contenedor con scroll (por eso a veces abría y a
    // veces no) — acá detectamos el "tap" nosotros mismos: si soltás
    // cerca de donde apretaste y rápido, cuenta como toque.
    spines.forEach(function(spine, i) {
      var pStartX = 0;
      var pStartY = 0;
      var pStartT = 0;
      var pMoved = false;
      var tapHandled = false;

      spine.addEventListener('pointerdown', function(e) {
        unlockAudio();
        pStartX = e.clientX;
        pStartY = e.clientY;
        pStartT = Date.now();
        pMoved = false;
        tapHandled = false;
      });

      spine.addEventListener('pointermove', function(e) {
        if (Math.abs(e.clientX - pStartX) > 8 || Math.abs(e.clientY - pStartY) > 8) {
          pMoved = true;
        }
      });

      spine.addEventListener('pointerup', function(e) {
        var dt = Date.now() - pStartT;
        if (!pMoved && dt < 600) {
          tapHandled = true;
          openSpine(i);
        }
      });

      // Red de seguridad: en algunos dispositivos híbridos (laptops con
      // pantalla táctil) el navegador cancela el pointer event apenas
      // detecta que el contenedor tiene scroll, aunque el toque haya sido
      // limpio. Si eso pasó, el 'click' nativo del navegador (que sigue
      // llegando en esos casos) abre igual.
      spine.addEventListener('click', function() {
        if (tapHandled) {
          tapHandled = false;
          return;
        }
        openSpine(i);
      });

      spine.addEventListener('mouseenter', function() {
        hoverState[i] = true;
        if (openIndex === null && eqApi) {
          linkedSpineIndex = i;
          eqApi.highlight(i);
        }
      });
      spine.addEventListener('mouseleave', function() {
        hoverState[i] = false;
        if (openIndex === null && eqApi && linkedSpineIndex === i) {
          linkedSpineIndex = null;
          eqApi.clear();
        }
      });
      spine.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSpine(i);
        } else if (e.key === 'Escape') {
          closeAll();
        }
      });
    });

    // Cerrar si se clickea fuera de la estantería
    document.addEventListener('click', function(e) {
      if (openIndex !== null && !shelf.contains(e.target)) closeAll();
    });

    // ---------------------------------------------------------------
    // Ola idle tipo "culebra" — mientras nada está abierto, cada lomo
    // sube y baja levemente en cascada (desfasados entre sí), dando la
    // sensación de una estantería viva, en movimiento constante. Al
    // pasar el mouse por encima, ese lomo se "asoma" un poco más.
    // Se detiene mientras hay uno abierto, para no distraer.
    // ---------------------------------------------------------------
    var waveY = new Array(spines.length).fill(0);
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function loop() {
      if (!prefersReducedMotion) {
        var now = (window.performance && performance.now) ? performance.now() : Date.now();
        var elapsed = (now - sharedT0) / 1000;

        spines.forEach(function(spine, i) {
          var targetY = 0;
          if (openIndex === null) {
            targetY = Math.sin(elapsed * 0.9 + i * 0.6) * 7;
          }
          if (hoverState[i] && !spine.classList.contains('is-open')) {
            targetY -= 14;
          }
          waveY[i] += (targetY - waveY[i]) * 0.08;
          spine.style.transform = 'translateY(' + waveY[i].toFixed(2) + 'px)';
        });
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

