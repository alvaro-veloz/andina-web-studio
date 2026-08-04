/* ============================================================
   Andina Web Studio — blog.js
   Sin dependencias. Cubre:
   - Render del listado (blog.html) desde data/posts.json
   - Barra de progreso tipo "línea de elevación" (páginas de post)
   - Tabla de contenidos automática (páginas de post)
   - Botón "copiar link" para compartir
============================================================ */

/* ---------- Utilidades ---------- */
function bgFormatDate(iso) {
  var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var d = new Date(iso + 'T12:00:00');
  return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
}

/* ---------- Listado del blog (blog.html) ---------- */
(function () {
  var featuredMount = document.getElementById('bgFeatured');
  var listMount = document.getElementById('bgList');
  if (!featuredMount && !listMount) return; // no estamos en blog.html

  fetch('data/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

      var featured = posts.find(function (p) { return p.featured; }) || posts[0];
      var rest = posts.filter(function (p) { return p !== featured; });

      if (featured && featuredMount) {
        featuredMount.innerHTML =
          '<a class="bg-featured" href="' + featured.url + '">' +
          '  <div class="bg-featured-img"><img src="' + featured.cover + '" alt="" loading="lazy"></div>' +
          '  <div>' +
          '    <div class="bg-featured-meta">' +
          '      <span class="tag">' + featured.category + '</span>' +
          '      <span>—</span><span>' + bgFormatDate(featured.date) + '</span>' +
          '      <span>—</span><span>' + featured.readingTime + ' min de lectura</span>' +
          '    </div>' +
          '    <h2>' + featured.title + '</h2>' +
          '    <p class="bg-featured-dek">' + featured.dek + '</p>' +
          '  </div>' +
          '</a>';
      }

      if (listMount) {
        if (!rest.length) {
          listMount.innerHTML = '<p class="bg-empty">Más artículos, pronto.</p>';
          return;
        }
        listMount.innerHTML = rest.map(function (p) {
          return (
            '<a class="bg-entry" href="' + p.url + '">' +
            '  <div class="bg-entry-date">' + bgFormatDate(p.date) + '</div>' +
            '  <div class="bg-entry-body">' +
            '    <h3>' + p.title + '</h3>' +
            '    <p class="bg-entry-dek">' + p.dek + '</p>' +
            '    <div class="bg-entry-tags">' +
                   p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') +
            '    </div>' +
            '  </div>' +
            '</a>'
          );
        }).join('');
      }
    })
    .catch(function (err) {
      console.error('No se pudo cargar data/posts.json', err);
      if (listMount) listMount.innerHTML = '<p class="bg-empty">No se pudo cargar el listado de artículos.</p>';
    });
})();

/* ---------- Barra de progreso "línea de elevación" (páginas de post) ---------- */
(function () {
  var fill = document.getElementById('bgProgressFill');
  var article = document.querySelector('.bg-article');
  if (!fill || !article) return;

  var pathLength = fill.getTotalLength();
  fill.style.strokeDasharray = pathLength;
  fill.style.strokeDashoffset = pathLength;

  function update() {
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight * 0.5;
    var scrolled = -rect.top;
    var pct = Math.min(Math.max(scrolled / total, 0), 1);
    fill.style.strokeDashoffset = pathLength - (pathLength * pct);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- Tabla de contenidos automática (páginas de post) ---------- */
(function () {
  var toc = document.getElementById('bgToc');
  var article = document.querySelector('.bg-article');
  if (!toc || !article) return;

  var headings = article.querySelectorAll('h2');
  if (headings.length < 2) { toc.style.display = 'none'; return; }

  var ol = document.createElement('ol');
  headings.forEach(function (h, i) {
    if (!h.id) h.id = 'seccion-' + (i + 1);
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ol.appendChild(li);
  });

  var wrap = document.createElement('div');
  wrap.innerHTML = '<div class="bg-toc-title">En este artículo</div>';
  wrap.appendChild(ol);
  toc.appendChild(wrap);
})();

/* ---------- Copiar link para compartir ---------- */
(function () {
  var btn = document.getElementById('bgCopyLink');
  if (!btn) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(function () {
      var original = btn.textContent;
      btn.textContent = 'Link copiado ✓';
      setTimeout(function () { btn.textContent = original; }, 2000);
    });
  });
})();
