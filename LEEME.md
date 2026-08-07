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
- ~~Portada del libro en alta.~~ **Entregada** (04/08/2026):
  `media/libro-portada.webp`.
- **Flyers y fechas reales.** `fechas.js` trae dos de ejemplo — hay que
  borrarlas. Las fechas pasadas desaparecen solas.
- **Años de la trayectoria.** Solo "Limbo · 2020" está confirmado por él. Las
  demás tarjetas van sin año a propósito, para no inventar.

## El libro va cifrado

El repositorio es **público**, así que cualquiera puede llegar a
`media/un-viaje-por-la-luz.pdf` sin pasar por la web. Por eso la protección
**no** es el formulario de la página: el PDF está cifrado con **AES-256** y su
clave de usuario es la misma que se teclea ahí. El formulario solo es la
comodidad de recibir el enlace; quien se salte la web se topa igual con la
contraseña al abrir el archivo.

**La clave está en dos sitios y tienen que coincidir:** `app.js` →
`CONFIG.claveLibro`, y el cifrado del propio PDF. Cambiar solo el JavaScript no
cambia nada. Para cambiarla de verdad hay que volver a cifrar:

```bash
python -c "import pikepdf,secrets; p=pikepdf.open('ORIGINAL.pdf'); p.save('sitio/media/un-viaje-por-la-luz.pdf', encryption=pikepdf.Encryption(user='NUEVACLAVE', owner=secrets.token_urlsafe(24), aes=True, R=6))"
```

**Hasta dónde protege esto.** Frena que el PDF circule solo por haber
encontrado la URL. No frena a quien se lo proponga: `2345` son cuatro dígitos,
diez mil combinaciones, y un programa de fuerza bruta las prueba en segundos.
Tampoco impide que un comprador legítimo reenvíe el archivo y la clave. Es un
apaño razonable mientras no haya cobros; cuando los haya, lo que toca es servir
el PDF desde un backend con enlaces caducables por compra, y entonces esta
clave compartida sobra.

## Decisiones que no hay que deshacer

- **El cambio de tema es instantáneo, sin desvanecido.** Está documentado en
  `styles.css`. No añadir `transition: background-color`: rompe el cambio de
  tema por completo.
- **`.footer` lleva `position: relative`** porque contiene un `.theme-marker`.
  Sin eso, el marcador se ancla al origen del documento y secuestra el tema de
  todo el sitio.
- **El hero vuelve a ser video** (04/08/2026), a partir de
  `Marcel franco hero webM.mp4`. Deroga la decisión anterior de dejarlo en
  foto fija. Cosas que hay que respetar si se toca:
  - **Las fuentes las engancha `app.js`, no el HTML.** Con movimiento
    reducido no se descargan los 3 MB y se queda el poster, que es una
    `<img>` normal.
  - **El original traía barras negras incrustadas** (el cuadro real es
    1920×976 con 52 px de offset). Se recortan al codificar; si se vuelve a
    exportar sin recortar, salen franjas negras en el hero.
  - Va **sin audio** a propósito: un hero con sonido no arranca solo en
    ningún navegador.
  - El poster sale del **primer fotograma**, no de uno bonito de en medio:
    si no coincide con el arranque, se ve un salto al entrar el video.
  - Hubo un primer video (`marcel background web M.mp4`) que se descartó por
    llevar marca de agua de Pika incrustada. No recuperarlo.
- **La foto del hero medía 1280×960**, que es lo que dio el original. En un
  monitor de 1440 se estira un 11% y en uno de 1920 bastante más. El velo
  oscuro lo disimula, pero si Marcel encuentra esa toma en resolución mayor,
  vale la pena sustituirla: es la primera imagen que ve todo el mundo.
- **El recorrido del pin se mide con `clientWidth`, nunca con `innerWidth`.**
  `innerWidth` incluye la barra de scroll; el carril se maqueta sin ella. Con
  `innerWidth` el recorrido salía ~15 px corto y la última tarjeta no acababa
  de entrar nunca.
- **`measure()` se rehace cuando cambia el `scrollWidth` del carril**, no solo
  al redimensionar la ventana. Las tipografías web llegan después del primer
  cálculo y recomponen los titulares: sin esa comprobación la sección se
  quedaba con 544 px de alto donde tocaban 1741, y el mural entero pasaba
  volando en unos pocos píxeles de scroll. Un `ResizeObserver` sobre el carril
  **no** basta: vigila su caja, y la caja no cambia cuando lo que crece es el
  contenido de dentro.
- **Los enlaces de descarga y las anclas internas se excluyen del retraso de
  1.5 s de las notas.** Reenviar a mano un enlace con `download` pierde ese
  atributo y el PDF se abriría en el navegador en vez de bajarse; y retrasar un
  salto dentro de la misma página se siente como que el clic no funcionó.
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
