# marcelfranco.art — sitio

Estático. Sin backend, sin base de datos, sin cobros. Todo botón de venta abre
WhatsApp con el mensaje ya escrito.

```bash
python -m http.server 8324 --directory "CLIENTES INU STUDIO WEB/Marcel Franco - músico,compositor, clases, conciertos, contrataciones  y venta de libro online/sitio"
```

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo el contenido |
| `styles.css` | Paleta y componentes |
| `app.js` | Motor + **configuración** |
| `fechas.js` | **Lo único que edita Marcel**: fechas y flyers |
| `media/` | Fotos en webp, logo, imagen de compartir |

## Publicación

Vive en GitHub Pages: **https://inusushi.github.io/marcelfranco-art/**
(repo `inusushi/marcelfranco-art`, rama `master`, raíz). Cada `git push`
republica el sitio en menos de un minuto.

Cuando Marcel compre `marcelfranco.art`, hay que hacer **las dos cosas**, no
solo una: añadir el dominio en Settings → Pages → Custom domain **y** cambiar
`og:url`, `og:image` y `twitter:image` en `index.html`, que llevan la URL
absoluta a mano. Las etiquetas Open Graph no admiten rutas relativas: WhatsApp
y Facebook no las resuelven y la tarjeta saldría sin imagen.

## WhatsApp

Configurado en `app.js` → `CONFIG.whatsapp: '525574804590'`. Los cuatro flujos
(clases online, clases presencial, libro y formulario de contrataciones)
apuntan ahí. Si el número cambia, se toca solo en ese punto.

**Falta una prueba que no se puede hacer desde aquí:** abrir cada botón en un
teléfono real y confirmar que WhatsApp arranca la conversación con Marcel y
con el mensaje ya escrito. El enlace está bien formado y verificado, pero que
el número esté activo en WhatsApp solo lo confirma un envío real.

## Pendientes de Marcel

- **PDF del libro** (en corrección de estilo). La sección está en
  "Próximamente"; para activar la venta, cambia el texto del botón y su
  mensaje en `app.js` → `MENSAJES.libro`.
- **Portada del libro en alta.** Ahora hay una foto de relleno marcada con
  `TODO` en `index.html`.
- **Flyers y fechas reales.** `fechas.js` trae dos de ejemplo — hay que
  borrarlas. Las fechas pasadas desaparecen solas.
- **Años de la trayectoria.** Solo "Limbo · 2020" está confirmado por él. Las
  demás tarjetas van sin año a propósito, para no inventar.

## Decisiones que no hay que deshacer

- **El cambio de tema es instantáneo, sin desvanecido.** Está documentado en
  `styles.css`. No añadir `transition: background-color`: rompe el cambio de
  tema por completo.
- **`.footer` lleva `position: relative`** porque contiene un `.theme-marker`.
  Sin eso, el marcador se ancla al origen del documento y secuestra el tema de
  todo el sitio.
- **El hero es una foto fija, no video.** Marcel descartó el movimiento. La
  imagen es `media/hero.webp`, que sale de `hero 2.jpg`. El video y su poster
  se borraron de `media/` para no cargar 850 KB muertos; el original
  (`marcel background web M.mp4`) sigue intacto en la carpeta de arriba por si
  algún día se recupera.
- **La foto del hero mide 1280×960**, que es lo que dio el original. En un
  monitor de 1440 se estira un 11% y en uno de 1920 bastante más. El velo
  oscuro lo disimula, pero si Marcel encuentra esa toma en resolución mayor,
  vale la pena sustituirla: es la primera imagen que ve todo el mundo.
- **Ni `.reglas li` ni `.plan__lista li` pueden ser `display: grid` o `flex`.**
  Fue un bug real: en un contenedor grid o flex, cada `<strong>` y cada trozo
  de texto suelto se vuelve un ítem independiente, y el párrafo se partía en
  columnas de una palabra por línea. El número y el guion van con
  `position: absolute` y el `<li>` con `padding-left`.
- **El logo del nav va recortado en círculo.** El PNG original trae su propio
  fondo oscuro; en el tema claro un recuadro se vería pegado, un medallón no.
- **Los botones esperan 1.5 s antes de actuar** (`ESPERA_NOTAS` en `app.js`),
  para que dé tiempo a ver las notas. Tres cosas que no hay que deshacer ahí:
  - Abrir la pestaña con `window.open` a los 1.5 s **sí** funciona: sigue
    dentro de la ventana de activación transitoria del navegador, que son 5 s.
    Safari puede bloquearlo igual, y por eso hay un `if (!w) location.href`.
    Si algún día se sube la espera por encima de 5 s, esto deja de funcionar.
  - **El formulario se valida ANTES de lanzar las notas.** Si no, el usuario
    ve volar las notas y 1.5 s después un "te falta un campo".
  - `data-esperando` bloquea el doble clic durante la espera.
- **El cierre lateral de Música mide el contenedor, no cada columna.** Si cada
  mitad midiera su propio centro, la más alta cerraría más tarde y las dos no
  se encontrarían a la vez. En móvil está desactivado: a una columna, cerrar
  de lado a lado se lee como un temblor.
- **Las tarjetas de trayectoria alternan tamaño a propósito** (`--gr`, `--med`,
  `--pq`) y se desplazan en vertical con `--y`. Es lo que da el aire de mural
  en vez de carrusel; si se añade una tarjeta, que no queden dos iguales
  seguidas. El `translateY` va en la tarjeta, nunca en `.horiz__track`, que ya
  lleva su propio `translate3d` horizontal.
- **El burgundy nunca es color de texto sobre carbón** (1.53:1, ilegible).
  Solo superficie. Ver la nota en `styles.css`.
- **La web no guarda ningún dato personal.** El formulario compone un mensaje
  de WhatsApp, no envía nada a ningún servidor. Si algún día se añade captura
  de correos, hace falta aviso de privacidad.

## Verificado en navegador (1440×900 y 390×844)

Pin horizontal exacto en 3 posiciones y en móvil · temas correctos en 9
paradas subiendo y bajando · 8 titulares partidos con texto accesible
coincidente · formulario de contrataciones compone el mensaje completo ·
fechas ordenadas y filtradas por fecha · sin desbordamiento horizontal ·
consola limpia salvo el aviso del WhatsApp pendiente.
