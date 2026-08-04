/* ============================================================
   marcelfranco.art — motor
   Base: "Plantilla para página inmersiva personal" (Inu Studio Web)
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     CONFIGURACIÓN
     ============================================================ */
  var CONFIG = {
    /* Número de Marcel. Formato: código de país + número, solo dígitos,
       sin + y sin espacios. México = 52, más los 10 dígitos. */
    whatsapp: '525574804590',

    precios: {
      online: '$1,000 MXN al mes',
      presencial: '$3,200 MXN al mes',
      libro: '$250 MXN'
    }
  };

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. WHATSAPP — mensajes precargados
     Cada botón abre WhatsApp con el texto ya escrito, para que
     Marcel reciba información y no un "hola, info".
     ============================================================ */
  var MENSAJES = {
    'clases-online':
      'Hola Marcel 👋 Me interesan tus clases de guitarra ONLINE (' + CONFIG.precios.online + ', 4 clases de 1 hora por Zoom).\n\n' +
      'Mi nombre es: \n' +
      'Mi nivel es (principiante / intermedio): \n' +
      'Me gustaría empezar la semana del: \n' +
      '¿Qué horario tienes libre entre lunes y martes de 10:00 a 15:00?',

    'clases-presencial':
      'Hola Marcel 👋 Me interesan tus clases de guitarra PRESENCIALES (' + CONFIG.precios.presencial + ', 4 clases de 1 hora).\n\n' +
      'Mi nombre es: \n' +
      'Mi nivel es (principiante / intermedio): \n' +
      'Vivo en la alcaldía / zona: \n' +
      'Me gustaría empezar la semana del: ',

    'libro':
      'Hola Marcel 👋 Quiero que me avises cuando salga tu libro "Un viaje por la luz" (' + CONFIG.precios.libro + ').\n\n' +
      'Mi nombre es: ',

    'contacto':
      'Hola Marcel 👋 Te escribo desde tu página web.\n\n'
  };

  function waLink(texto) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  function initWhatsApp() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      var clave = el.getAttribute('data-wa');
      var texto = MENSAJES[clave] || MENSAJES.contacto;
      el.setAttribute('href', waLink(texto));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });

    if (CONFIG.whatsapp.indexOf('X') !== -1) {
      console.warn('[marcelfranco.art] Falta configurar el número de WhatsApp en app.js → CONFIG.whatsapp');
    }
  }

  /* ============================================================
     2. FORMULARIO DE CONTRATACIONES
     No envía nada a ningún servidor: compone el mensaje de
     WhatsApp con las respuestas y lo abre. Por eso la web no
     almacena ningún dato personal.
     ============================================================ */
  function initFormulario() {
    var form = document.querySelector('#form-contrataciones');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var v = function (k) { return (d.get(k) || '').toString().trim() || '—'; };

      var texto =
        'Hola Marcel 👋 Quiero contratarte para un evento. Te paso los datos:\n\n' +
        '• Nombre: ' + v('nombre') + '\n' +
        '• Tipo de evento: ' + v('tipo') + '\n' +
        '• ¿Para cuántas personas?: ' + v('personas') + '\n' +
        '• ¿Qué tipo de lugar?: ' + v('lugar') + '\n' +
        '• ¿Hay equipo de sonido profesional?: ' + v('sonido') + '\n' +
        '• Fecha: ' + v('fecha') + '\n' +
        '• Hora y dirección exacta: ' + v('direccion') + '\n' +
        '• Formato: ' + v('formato') + '\n' +
        (v('notas') !== '—' ? '• Notas: ' + v('notas') + '\n' : '');

      window.open(waLink(texto), '_blank', 'noopener');
    });
  }

  /* ============================================================
     3. FECHAS Y FLYERS (se alimenta de fechas.js)
     ============================================================ */
  function initFechas() {
    var cont = document.querySelector('#lista-fechas');
    var chip = document.querySelector('#proxima-fecha');
    var lista = (window.FECHAS || []).slice();

    // Solo las que no han pasado, ordenadas de la más próxima a la más lejana
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    lista = lista.filter(function (f) {
      var d = new Date(f.fecha + 'T00:00:00');
      return !isNaN(d) && d >= hoy;
    }).sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });

    var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    function formato(f) {
      var d = new Date(f.fecha + 'T00:00:00');
      return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
    }
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // Ficha del hero
    if (chip) {
      if (lista.length) {
        var p = lista[0];
        chip.querySelector('.chip__value').textContent = p.lugar || 'Por anunciar';
        chip.querySelector('.chip__sub').textContent =
          formato(p) + (p.hora ? ' · ' + p.hora : '') + (p.ciudad ? ' · ' + p.ciudad : '');
      } else {
        chip.hidden = true;
      }
    }

    if (!cont) return;
    if (!lista.length) {
      cont.innerHTML = '<p class="fecha__vacio">No hay fechas anunciadas por ahora. ' +
        'Sígueme en Instagram para enterarte de las próximas.</p>';
      return;
    }

    cont.innerHTML = lista.map(function (f, i) {
      var interior =
        (f.flyer ? '<div class="fecha__flyer"><img src="' + esc(f.flyer) + '" alt="Flyer: ' + esc(f.lugar) + '" loading="lazy"></div>' : '') +
        '<div class="fecha__body">' +
          '<span class="fecha__cuando">' + formato(f) + (f.hora ? ' · ' + esc(f.hora) : '') + '</span>' +
          '<span class="fecha__donde">' + esc(f.lugar) + '</span>' +
          (f.ciudad ? '<span class="dim">' + esc(f.ciudad) + '</span>' : '') +
        '</div>';

      var attrs = 'class="fecha" data-reveal style="--i:' + (i % 8) + '"';
      return f.link
        ? '<a ' + attrs + ' href="' + esc(f.link) + '" target="_blank" rel="noopener">' + interior + '</a>'
        : '<article ' + attrs + '>' + interior + '</article>';
    }).join('');
  }

  /* ============================================================
     3-bis. NOTAS AL PULSAR UN BOTÓN
     El equivalente musical de las huellitas de Inu Studio Web.
     Se engancha en 'pointerdown' y no en 'click' porque casi todos
     los botones abren WhatsApp en otra pestaña: con 'click' la
     animación arrancaría cuando el navegador ya cambió de foco.
     ============================================================ */
  var NOTAS = ['𝄞', '♪', '♫', '♪', '♬'];  // 𝄞 ♪ ♫ ♪ ♬

  function lanzarNotas(btn) {
    if (reduce) return;
    var r = btn.getBoundingClientRect();

    for (var i = 0; i < 4; i++) {
      (function (i) {
        setTimeout(function () {
          var n = document.createElement('span');
          n.className = 'nota-fly';
          n.setAttribute('aria-hidden', 'true');
          n.textContent = NOTAS[Math.floor(Math.random() * NOTAS.length)];
          n.style.left = (r.left + r.width * (0.25 + Math.random() * 0.6)) + 'px';
          n.style.top = (r.top + r.height * 0.35) + 'px';
          n.style.setProperty('--dx', (Math.random() * 44 - 22).toFixed(0) + 'px');
          n.style.setProperty('--rot', (Math.random() * 44 - 22).toFixed(0) + 'deg');
          document.body.appendChild(n);
          setTimeout(function () { n.remove(); }, 1200);
        }, i * 90);
      })(i);
    }
  }

  function initNotas() {
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (btn) lanzarNotas(btn);
    });
  }

  /* ============================================================
     4. MOTOR VISUAL
     ============================================================ */
  function initLenis() {
    if (reduce || !window.Lenis) return;
    var lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    document.documentElement.classList.add('lenis');
  }

  /* Parte un titular en sus líneas reales para revelarlas de una en una.
     El texto accesible se conserva aparte y el animado va aria-hidden. */
  function splitLines(el) {
    var raw = el.textContent.replace(/\s+/g, ' ').trim();
    if (!raw) return;

    if (!el.previousElementSibling || !el.previousElementSibling.classList.contains('sr')) {
      var sr = document.createElement('span');
      sr.className = 'sr'; sr.textContent = raw;
      el.parentNode.insertBefore(sr, el);
    }
    el.setAttribute('aria-hidden', 'true');

    el.innerHTML = raw.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');

    var words = [].slice.call(el.querySelectorAll('.w'));
    var lines = [], current = null, lastTop = null;
    words.forEach(function (w) {
      var top = w.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) { current = []; lines.push(current); lastTop = top; }
      current.push(w.textContent);
    });

    el.innerHTML = lines.map(function (line, i) {
      return '<span class="line" style="--i:' + i + '">' +
             '<span class="line__in">' + line.join(' ') + '</span>' +
             '<span class="line__bar"></span></span>';
    }).join('');
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-revealed');
      revealObserver.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  function initSplits() {
    var els = document.querySelectorAll('[data-split]');
    [].forEach.call(els, function (el) { splitLines(el); });

    var w = innerWidth, t;
    addEventListener('resize', function () {
      if (innerWidth === w) return;
      w = innerWidth; clearTimeout(t);
      t = setTimeout(function () {
        [].forEach.call(els, function (el) {
          var sr = el.previousElementSibling;
          if (sr && sr.classList.contains('sr')) el.textContent = sr.textContent;
          el.classList.remove('is-revealed');
          splitLines(el);
          revealObserver.observe(el);
        });
      }, 200);
    });
  }

  function initReveals() {
    document.querySelectorAll('[data-split], [data-reveal]').forEach(function (el, i) {
      if (el.hasAttribute('data-reveal') && !el.style.getPropertyValue('--i')) {
        el.style.setProperty('--i', i % 8);
      }
      revealObserver.observe(el);
    });
  }

  /* Scroll horizontal pinneado.
     La altura de la sección se iguala al recorrido lateral, así 1px de
     scroll vertical = 1px de desplazamiento y el movimiento no acelera. */
  function initHorizontal() {
    var sections = document.querySelectorAll('[data-horiz]');
    if (!sections.length) return;
    var instances = [];

    function measure() {
      instances = [];
      [].forEach.call(sections, function (section) {
        var sticky = section.querySelector('.horiz__sticky');
        var track = section.querySelector('.horiz__track');
        if (!sticky || !track) return;
        var travel = Math.max(0, track.scrollWidth - innerWidth);
        section.style.height = (innerHeight + travel) + 'px';
        instances.push({ section: section, track: track, bar: section.querySelector('.horiz__progress i'), travel: travel });
      });
    }

    function update() {
      instances.forEach(function (o) {
        var rect = o.section.getBoundingClientRect();
        var p = o.travel === 0 ? 0 : Math.min(1, Math.max(0, -rect.top / o.travel));
        o.track.style.transform = 'translate3d(' + (-p * o.travel) + 'px,0,0)';
        if (o.bar) o.bar.style.width = (p * 100) + '%';
      });
    }

    measure(); update();
    addEventListener('resize', function () { measure(); update(); });
    return update;
  }

  /* Tema por scroll. Al final del documento el scroll se topa, así que un
     marcador de la última pantalla nunca cruzaría la línea del nav: estando
     abajo del todo vale cualquiera que ya esté visible. */
  function initTheme() {
    var markers = [].slice.call(document.querySelectorAll('[data-theme-set]'));
    var nav = document.querySelector('.nav');
    var currentTheme = null;

    return function () {
      var y = window.scrollY || window.pageYOffset || 0;
      if (nav) nav.classList.toggle('is-stuck', y > 40);
      if (!markers.length) return;

      var atBottom = (innerHeight + y) >= (document.documentElement.scrollHeight - 2);
      var theme = 'noche';
      for (var i = 0; i < markers.length; i++) {
        var top = markers[i].getBoundingClientRect().top;
        if (top <= 80 || (atBottom && top <= innerHeight)) theme = markers[i].getAttribute('data-theme-set');
      }
      if (theme !== currentTheme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
      }
    };
  }

  /* Marquee: bucle por rAF (no @keyframes) para poder frenar suave en hover.
     El reinicio se hace sobre el ancho de UNA copia, nunca sobre la mitad
     del total: da igual cuántas copias hagan falta. */
  function initMarquee() {
    document.querySelectorAll('[data-marquee]').forEach(function (el) {
      var track = el.querySelector('.marquee__track');
      if (!track) return;
      var speed = parseFloat(el.getAttribute('data-marquee')) || 40;
      var original = track.innerHTML;
      var oneSet = track.scrollWidth;
      if (!oneSet) return;

      var guard = 0;
      while (track.scrollWidth < innerWidth + oneSet && guard++ < 20) track.innerHTML += original;

      var x = 0, last = performance.now(), factor = 1, target = 1;
      el.addEventListener('mouseenter', function () { target = 0.15; });
      el.addEventListener('mouseleave', function () { target = 1; });
      if (reduce) return;

      (function tick(now) {
        var dt = Math.min(64, now - last) / 1000; last = now;
        factor += (target - factor) * 0.08;
        x -= speed * factor * dt;
        if (x <= -oneSet) x += oneSet;
        track.style.transform = 'translate3d(' + x + 'px,0,0)';
        requestAnimationFrame(tick);
      })(last);
    });
  }

  /* ============================================================
     5. ARRANQUE
     ============================================================ */
  function init() {
    initWhatsApp();
    initFechas();
    initFormulario();
    initNotas();

    initLenis();
    initSplits();
    initReveals();
    initMarquee();

    var updateHoriz = initHorizontal();
    var updateTheme = initTheme();

    function refresh() { if (updateHoriz) updateHoriz(); updateTheme(); }

    /* No se puede colgar del evento 'scroll': Lenis no emite eventos scroll
       nativos y el pin y los temas se quedarían congelados. */
    var lastY = -1, lastH = -1;
    (function frame() {
      var y = window.scrollY || window.pageYOffset || 0;
      var h = document.documentElement.scrollHeight;
      if (y !== lastY || h !== lastH) { lastY = y; lastH = h; refresh(); }
      requestAnimationFrame(frame);
    })();

    window.MarcelFranco = { refresh: refresh, config: CONFIG };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
