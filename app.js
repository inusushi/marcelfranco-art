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
    },

    /* Clave del libro. El PDF de media/ está cifrado con AES-256 usando esta
       misma clave, así que cambiarla aquí NO basta: hay que volver a cifrar
       el PDF con la nueva. Ver LEEME → "El libro va cifrado". */
    claveLibro: '2345',
    libroArchivo: 'media/un-viaje-por-la-luz.pdf'
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
      'Hola Marcel 👋 Quiero comprar tu libro "Un viaje por la luz" (' + CONFIG.precios.libro + ').\n\n' +
      'Mi nombre es: ',

    'composicion':
      'Hola Marcel 👋 Quiero encargarte una canción.\n\n' +
      'Mi nombre es: \n' +
      'Tipo de composición (Simple $1,500 / Mejorada $2,200 / Artística $3,000): \n' +
      'De qué quiero que hable: \n' +
      'Canción de referencia: \n' +
      '¿Tengo la letra? (completa / una idea / ninguna): ',

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

      abrir(waLink(texto), true);
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
     2-bis. DESBLOQUEO DEL LIBRO
     Esto es comodidad, NO seguridad: el PDF de media/ va cifrado
     con AES-256 y esa misma clave, así que quien encuentre la URL
     del archivo se topa igual con la contraseña al abrirlo. Si se
     cambia CONFIG.claveLibro hay que volver a cifrar el PDF.
     ============================================================ */
  function initLibro() {
    var form = document.querySelector('#form-libro');
    if (!form) return;
    var campo = form.querySelector('input');
    var msg = document.querySelector('#unlock-msg');
    var caja = form.closest('.unlock');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (campo.value.trim() !== CONFIG.claveLibro) {
        caja.classList.remove('is-open');
        caja.classList.add('is-wrong');
        msg.textContent = 'Ese código no es. Revísalo en el mensaje de Marcel.';
        setTimeout(function () { caja.classList.remove('is-wrong'); }, 600);
        campo.select();
        return;
      }

      caja.classList.add('is-open');
      msg.textContent = 'Listo. Al abrir el archivo te pedirá el mismo código.';

      if (!caja.querySelector('.unlock__descarga')) {
        var a = document.createElement('a');
        a.className = 'btn btn--cobre unlock__descarga';
        a.href = CONFIG.libroArchivo;
        a.setAttribute('download', 'Un viaje por la luz — Marcel Franco.pdf');
        a.innerHTML = '<span class="btn__swap"><span>Descargar el PDF</span>' +
                      '<span aria-hidden="true">Descargar el PDF</span></span>';
        msg.parentNode.insertBefore(a, msg.nextSibling);
        a.focus();
      }
    });
  }

  /* ============================================================
     3-bis. NOTAS AL PULSAR UN BOTÓN
     El equivalente musical de las huellitas de Inu Studio Web.
     El botón espera ESPERA_NOTAS antes de actuar, para que dé
     tiempo a ver la animación.
     ============================================================ */
  var NOTAS = ['𝄞', '♪', '♫', '♪', '♬'];
  var ESPERA_NOTAS = 1500;

  function lanzarNotas(btn) {
    var r = btn.getBoundingClientRect();

    for (var i = 0; i < 5; i++) {
      (function (i) {
        setTimeout(function () {
          var n = document.createElement('span');
          n.className = 'nota-fly';
          n.setAttribute('aria-hidden', 'true');
          n.textContent = NOTAS[Math.floor(Math.random() * NOTAS.length)];
          n.style.left = (r.left + r.width * (0.2 + Math.random() * 0.65)) + 'px';
          n.style.top = (r.top + r.height * 0.35) + 'px';
          n.style.setProperty('--dx', (Math.random() * 48 - 24).toFixed(0) + 'px');
          n.style.setProperty('--rot', (Math.random() * 44 - 22).toFixed(0) + 'deg');
          document.body.appendChild(n);
          setTimeout(function () { n.remove(); }, 1300);
        }, i * 110);
      })(i);
    }
  }

  /* Abrir una pestaña 1.5 s después del clic sigue dentro de la ventana de
     "activación transitoria" de Chrome y Firefox (5 s), así que no lo bloquea
     el antipopups. Safari sí es capaz de bloquearlo: si window.open devuelve
     null, se navega en la misma pestaña en lugar de perder el clic. */
  function abrir(href, nuevaPestana) {
    if (!nuevaPestana) { location.href = href; return; }
    var w = window.open(href, '_blank', 'noopener');
    if (!w) location.href = href;
  }

  function initNotas() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (!btn || btn.dataset.esperando) return;

      /* Sin animación no hay nada que esperar: que el botón actúe ya. */
      if (reduce) return;

      var esEnlace = btn.tagName === 'A';
      var href = esEnlace ? btn.getAttribute('href') : null;
      var form = !esEnlace ? btn.closest('form') : null;

      /* Estos no se tocan, solo se lanzan las notas:
         - enlace sin destino real, o botón suelto fuera de formulario;
         - enlace de descarga: reenviarlo a mano perdería el atributo
           download y el PDF se abriría en el navegador en vez de bajarse;
         - ancla interna: retrasar un salto dentro de la misma página se
           siente como que el clic no ha funcionado. */
      if ((!form && (!href || href === '#')) ||
          btn.hasAttribute('download') ||
          (href && href.charAt(0) === '#')) { lanzarNotas(btn); return; }

      /* Un formulario incompleto tiene que avisar YA. Si se retrasara 1.5 s,
         el usuario vería volar las notas y solo después el "falta un campo". */
      if (form && !form.checkValidity()) return;

      e.preventDefault();
      btn.dataset.esperando = '1';
      btn.setAttribute('aria-busy', 'true');
      lanzarNotas(btn);

      setTimeout(function () {
        delete btn.dataset.esperando;
        btn.removeAttribute('aria-busy');
        if (form) form.requestSubmit ? form.requestSubmit(btn) : form.submit();
        else abrir(href, btn.getAttribute('target') === '_blank');
      }, ESPERA_NOTAS);
    });
  }

  /* ============================================================
     3-ter. VIDEO DEL HERO
     Las fuentes se enganchan aquí y no en el HTML para no descargar
     los megas si el usuario pidió movimiento reducido: en ese caso
     se queda el poster, que ya es una <img> normal.
     ============================================================ */
  /* Espera a que la página esté pintada y el navegador ocioso antes de pedir
     un video. Sin esto, el hero se lleva 1,7 MB por delante de la hoja de
     estilos y del resto de la página: la primera pintura pasaba de ~190 KB a
     3 MB. El póster ya está puesto, así que no se ve un hueco. */
  function cuandoSobreTiempo(fn) {
    function luego() {
      if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 1500 });
      else setTimeout(fn, 200);
    }
    if (document.readyState === 'complete') luego();
    else addEventListener('load', luego);
  }

  function initHeroVideo() {
    var v = document.querySelector('.hero__video');
    if (!v || reduce) return;

    [['data-webm', 'video/webm'], ['data-mp4', 'video/mp4']].forEach(function (par) {
      var url = v.getAttribute(par[0]);
      if (!url) return;
      var s = document.createElement('source');
      s.src = url; s.type = par[1];
      v.appendChild(s);
    });

    /* Solo se muestra cuando de verdad hay imagen que pintar. Si el
       navegador rechaza el autoplay, el poster se queda y no pasa nada. */
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* sin autoplay: se queda el poster */ });
  }

  /* ============================================================
     3-quater. EL CARRETE DE LA GALERÍA
     Se entra por una sección, pero dentro se recorre el carrete
     entero: las secciones son puntos de entrada, no compartimentos.
     ============================================================ */
  function initCarrete() {
    var capa = document.querySelector('#carrete');
    var pista = document.querySelector('#carrete-pista');
    if (!capa || !pista) return;

    var abierto = false, devolverFoco = null;

    function irA(slug, suave) {
      var marca = document.getElementById('sec-' + slug);
      if (!marca) return;
      var destino = function () { return marca.offsetLeft - pista.clientWidth * 0.08; };

      /* Suave solo en saltos cortos. El carrete mide casi 50.000 px: de una
         punta a otra, un desplazamiento suave tarda varios segundos y parece
         que la página se ha colgado. En distancias largas se salta y ya. */
      var lejos = Math.abs(destino() - pista.scrollLeft) > pista.clientWidth * 2.5;
      pista.scrollTo({ left: destino(), behavior: (suave && !lejos) ? 'smooth' : 'auto' });
      marcarAtajo(slug);

      /* Segundo intento al abrir: la primera vez que se muestra la capa, las
         fotos de esa zona aún no han cargado y el navegador puede recolocar
         la tira unos píxeles. Sin este ajuste se entra ligeramente descuadrado. */
      if (!suave) setTimeout(function () { pista.scrollLeft = destino(); }, 120);
    }

    function marcarAtajo(slug) {
      capa.querySelectorAll('.carrete__atajo').forEach(function (b) {
        b.classList.toggle('is-actual', b.getAttribute('data-ir') === slug);
      });
    }

    function abrir(slug, deHistorial) {
      devolverFoco = document.activeElement;
      capa.hidden = false;
      /* El scroll del fondo se bloquea con overflow y no con position:fixed:
         fixed obliga a restaurar el scrollY a mano y, con Lenis por medio,
         eso deja la página unos píxeles descolocada al cerrar. */
      document.documentElement.style.overflow = 'hidden';

      /* Reflujo forzado en vez de requestAnimationFrame: la transición de
         opacidad necesita que el navegador haya calculado el estado inicial,
         y un rAF puede tardar en llegar (o no llegar) si la pestaña no está
         componiendo. Leer offsetHeight lo garantiza aquí mismo. */
      void capa.offsetHeight;
      capa.classList.add('is-open');

      irA(slug, false);
      pista.focus({ preventScroll: true });
      abierto = true;
      /* Una entrada en el historial para que «atrás» cierre el carrete en
         vez de sacar al usuario de la página. */
      if (!deHistorial) history.pushState({ carrete: slug }, '', '#galeria');
    }

    function cerrar(deHistorial) {
      if (!abierto) return;
      abierto = false;
      capa.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      setTimeout(function () { if (!abierto) capa.hidden = true; }, 350);
      if (devolverFoco && devolverFoco.focus) devolverFoco.focus();
      if (!deHistorial && history.state && history.state.carrete) history.back();
    }

    document.querySelectorAll('[data-abrir]').forEach(function (b) {
      b.addEventListener('click', function () { abrir(b.getAttribute('data-abrir')); });
    });
    capa.querySelectorAll('[data-ir]').forEach(function (b) {
      b.addEventListener('click', function () { irA(b.getAttribute('data-ir'), true); });
    });
    capa.querySelector('.carrete__cerrar').addEventListener('click', function () { cerrar(); });

    addEventListener('keydown', function (e) {
      if (!abierto) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') pista.scrollBy({ left: pista.clientWidth * 0.7, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') pista.scrollBy({ left: -pista.clientWidth * 0.7, behavior: 'smooth' });
    });

    addEventListener('popstate', function () {
      if (abierto) cerrar(true);
    });

    /* Una rueda de ratón solo da deltaY: sin esto, dentro del carrete no se
       movería nada. Los trackpads que ya mandan deltaX se dejan en paz. */
    pista.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      pista.scrollLeft += e.deltaY;
    }, { passive: false });

    /* Qué sección se está viendo, para resaltar su atajo. */
    var marcas = [].slice.call(capa.querySelectorAll('.carrete__marca'));
    pista.addEventListener('scroll', function () {
      var x = pista.scrollLeft + pista.clientWidth * 0.1, actual = marcas[0];
      marcas.forEach(function (m) { if (m.offsetLeft <= x) actual = m; });
      if (actual) marcarAtajo(actual.getAttribute('data-seccion'));
    }, { passive: true });
  }

  /* Inclinación 3D del abanico: cada tarjeta gira sobre X/Y siguiendo la
     posición del cursor dentro de ella (rotateX/rotateY + perspective en
     el contenedor, styles.css). Nada de librerías: son dos grados que se
     escriben como custom properties y transiciona el propio CSS.
     Se apaga con movimiento reducido y en táctil (ahí "hover" no
     significa nada y --rx/--ry se quedarían pegadas donde tocó el dedo). */
  function initAbanicoTilt() {
    if (reduce) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cartas = [].slice.call(document.querySelectorAll('.abanico__carta'));
    if (!cartas.length) return;

    var MAX = 9; /* grados máximos de inclinación por eje */

    cartas.forEach(function (carta) {
      carta.addEventListener('pointermove', function (e) {
        var r = carta.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var ry = (px - 0.5) * MAX * 2;   /* eje X del cursor → rotateY */
        var rx = (0.5 - py) * MAX * 2;   /* eje Y del cursor → rotateX, invertido */
        carta.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        carta.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      });
      carta.addEventListener('pointerleave', function () {
        carta.style.setProperty('--rx', '0deg');
        carta.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Video de fondo de Producción. Mismo trato que el del hero: las fuentes
     se enganchan aquí para no descargarlas con movimiento reducido. */
  function initVideoFondo() {
    var v = document.querySelector('.produccion__video');
    if (!v || reduce) return;
    [['data-webm', 'video/webm'], ['data-mp4', 'video/mp4']].forEach(function (par) {
      var url = v.getAttribute(par[0]);
      if (!url) return;
      var s = document.createElement('source');
      s.src = url; s.type = par[1];
      v.appendChild(s);
    });
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* sin autoplay: se queda el poster */ });
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

    /* Las líneas se unen CON un espacio. Con join('') el titular se quedaba
       sin separación entre líneas y su textContent salía pegado: el <h1>
       decía «MarcelFranco» y los <h2>, «Donde lamúsicacomienza». Los lectores
       de pantalla no se enteraban (leen el .sr de al lado), pero Google
       renderiza el JavaScript e indexaba justo eso. El espacio entre bloques
       no se pinta, así que no cambia nada en pantalla. */
    el.innerHTML = lines.map(function (line, i) {
      return '<span class="line" style="--i:' + i + '">' +
             '<span class="line__in">' + line.join(' ') + '</span>' +
             '<span class="line__bar"></span></span>';
    }).join(' ');
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

    /* Píxeles de desfase entre la capa más al fondo y la más al frente.
       Subirlo hace el parallax más evidente; pasado cierto punto las
       tarjetas se solapan, lo cual está previsto (van apiladas por
       profundidad) pero deja de leerse como una fila. */
    var AMPLITUD = 105;

    /* Apilado por profundidad: lo que está delante tapa a lo que está
       detrás. Sin esto, el solape que provoca el parallax se vería como un
       fallo de maquetación en vez de como capas. */
    [].forEach.call(sections, function (s) {
      s.querySelectorAll('[data-z]').forEach(function (c) {
        c.style.zIndex = String(Math.round(parseFloat(c.dataset.z) * 20) + 1);
      });
    });

    function measure() {
      instances = [];
      [].forEach.call(sections, function (section) {
        var sticky = section.querySelector('.horiz__sticky');
        var track = section.querySelector('.horiz__track');
        if (!sticky || !track) return;
        /* clientWidth y no innerWidth: innerWidth incluye la barra de scroll,
           pero el carril se maqueta sin ella. Con innerWidth el recorrido
           salía ~15 px corto y la última tarjeta nunca acababa de entrar. */
        var travel = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        /* Una pantalla de más al final si la siguiente sección sube por
           encima: durante ese tramo el avance ya está al 100% y el pin solo
           tiene que aguantar quieto mientras la otra lo tapa. */
        var solape = section.hasAttribute('data-solape') ? innerHeight : 0;

        /* Cuántos píxeles de foto avanzan por cada píxel de scroll. En la
           trayectoria vale 1 (seis tarjetas, paso deliberado). En la galería
           son 58 fotos: a 1:1 harían falta 36 pantallas solo para pasarlas,
           así que va más rápido. */
        var ritmo = parseFloat(section.getAttribute('data-ritmo')) || 1;
        var recorridoScroll = travel / ritmo;
        section.style.height = (innerHeight + recorridoScroll + solape) + 'px';
        instances.push({
          section: section, track: track,
          bar: section.querySelector('.horiz__progress i'),
          travel: travel, recorridoScroll: recorridoScroll,
          anchoMedido: track.scrollWidth,
          derecha: section.getAttribute('data-dir') === 'der',
          cards: [].slice.call(track.querySelectorAll('[data-z]')),
          fondo: [].slice.call(section.querySelectorAll('[data-parallax]'))
        });
      });
    }

    function update() {
      /* Red de seguridad: si el ancho real del carril ya no es el que se midió,
         la altura de la sección está mal y el pin iría descompasado. Un
         ResizeObserver sobre el carril no vale para esto, porque vigila su
         caja, no su scrollWidth, y la caja no cambia al recomponerse dentro. */
      for (var i = 0; i < instances.length; i++) {
        if (instances[i].track.scrollWidth !== instances[i].anchoMedido) { measure(); break; }
      }

      instances.forEach(function (o) {
        var rect = o.section.getBoundingClientRect();
        var p = o.recorridoScroll === 0 ? 0 : Math.min(1, Math.max(0, -rect.top / o.recorridoScroll));
        var desliz = o.derecha ? -o.travel * (1 - p) : -p * o.travel;

        o.track.style.transform = 'translate3d(' + desliz + 'px,0,0)';
        if (o.bar) o.bar.style.width = (p * 100) + '%';

        /* Profundidad. Cada tarjeta se adelanta o se retrasa respecto al
           carril según su data-z: las del fondo se quedan atrás, las del
           primer plano se adelantan, y además se difuminan y encogen.

           El desplazamiento se calcula sobre AMPLITUD y no sobre el recorrido
           entero: si dependiera del recorrido, un mural más largo dispararía
           el desfase hasta separar las tarjetas del carril por completo. Así
           el efecto se nota igual sea cual sea el número de piezas. */
        /* El desfase sigue una campana: vale 0 al principio, es máximo a
           mitad de recorrido y vuelve a 0 al final. Así el mural arranca y
           aterriza exactamente donde dice la maqueta, y la última tarjeta
           acaba centrada en pantalla en vez de salirse por un lado. Con un
           desfase que creciera hasta el final, la tarjeta del primer plano
           terminaba cortada. */
        var campana = Math.sin(p * Math.PI);

        o.cards.forEach(function (c) {
          var z = parseFloat(c.dataset.z);
          if (isNaN(z)) return;
          var dx = campana * AMPLITUD * (0.5 - z) * 2;
          c.style.setProperty('--px', dx.toFixed(1) + 'px');
          c.style.setProperty('--pe', (0.7 + z * 0.3).toFixed(3));    // opacidad
          c.style.setProperty('--ps', (0.88 + z * 0.12).toFixed(3));  // escala
        });

        /* El texto de fondo va mucho más lento: es lo que da la sensación
           de que las tarjetas pasan por delante de un espacio, no de un muro. */
        o.fondo.forEach(function (el) {
          var k = parseFloat(el.dataset.parallax) || 0.3;
          el.style.transform = 'translate3d(' + (desliz * k) + 'px,0,0)';
        });
      });
    }

    function remedir() { measure(); update(); }

    remedir();
    addEventListener('resize', remedir);

    /* La altura de la sección depende del ancho del carril, y ese ancho no es
       definitivo al arrancar: las tipografías web llegan después y recomponen
       los titulares de las tarjetas. Sin esto, la sección se queda con una
       altura corta y el mural entero pasa volando en unos pocos píxeles de
       scroll. Pasaba de verdad: 544 px medidos donde tocaban 1741. */
    addEventListener('load', remedir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remedir);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(remedir);
      instances.forEach(function (o) { ro.observe(o.track); });
    }

    return update;
  }

  /* Las dos columnas de Música entran desde los lados y se cierran en el
     centro. Va pegado al scroll y no es una animación de duración fija:
     el usuario "empuja" las mitades con la rueda o con el dedo.
     Devuelve la función de actualización, que corre en el bucle de rAF. */
  function initCierre() {
    var partes = [].slice.call(document.querySelectorAll('[data-cierre]'));
    if (!partes.length) return function () {};

    var MAX = 18;   // % de desplazamiento en el punto más abierto
    if (reduce) {
      partes.forEach(function (el) { el.style.setProperty('--cx', '0px'); });
      return function () {};
    }

    return function () {
      partes.forEach(function (el) {
        /* El avance se mide sobre el contenedor común, no sobre cada columna:
           si cada una midiera su propio centro, la más alta cerraría más tarde
           y las dos mitades no se encontrarían a la vez. */
        var caja = el.parentNode.getBoundingClientRect();

        /* 0 = el borde superior aún toca el fondo de la pantalla,
           1 = ese borde ha subido hasta el 40% del alto: ya está cerrado. */
        var p = (innerHeight - caja.top) / (innerHeight * 0.6);
        p = Math.min(1, Math.max(0, p));
        p = 1 - Math.pow(1 - p, 2);   // frena al final en vez de dar un tirón

        var signo = el.getAttribute('data-cierre') === 'izq' ? -1 : 1;
        el.style.setProperty('--cx', (signo * MAX * (1 - p)).toFixed(2) + '%');
      });
    };
  }

  /* Halo de fondo de cada sección de color. Se arrastra más despacio que el
     scroll, que es lo que da la sensación de profundidad. Devuelve la función
     de actualización para el bucle de rAF. */
  function initFondos() {
    var zonas = [].slice.call(document.querySelectorAll('[data-fondo]'));
    if (!zonas.length || reduce) return function () {};

    var AMPLITUD = 90;   // píxeles de recorrido del halo, de punta a punta

    return function () {
      zonas.forEach(function (z) {
        var r = z.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;   // fuera de vista
        /* -1 cuando la sección entra por abajo, +1 cuando sale por arriba. */
        var p = (innerHeight - r.top) / (innerHeight + r.height) * 2 - 1;
        z.style.setProperty('--py', (-p * AMPLITUD).toFixed(1) + 'px');
      });
    };
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
    initLibro();
    initNotas();
    initCarrete();
    initAbanicoTilt();

    /* Los dos videos son decoración: entran cuando ya está todo lo demás. */
    cuandoSobreTiempo(function () { initHeroVideo(); initVideoFondo(); });

    initLenis();
    initSplits();
    initReveals();
    initMarquee();

    var updateHoriz = initHorizontal();
    var updateTheme = initTheme();
    var updateCierre = initCierre();
    var updateFondos = initFondos();

    function refresh() {
      if (updateHoriz) updateHoriz();
      updateTheme(); updateCierre(); updateFondos();
    }

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
