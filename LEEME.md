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

- ~~PDF del libro.~~ **Entregado** (07/08/2026): se vende cifrado, ver más
  abajo.
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

## La galería

Ya no son tres bandas fijadas que se recorren con el scroll de la página: eso
costaba **18 pantallas de scroll** solo para pasar las fotos y dejaba la venta
muy lejos. Ahora hay dos piezas:

1. **El abanico**, una pantalla con seis tarjetas en arco, una por sección.
   El nombre va **fuera** de la tarjeta, debajo.
2. **El carrete**, una capa aparte con **las 58 fotos seguidas**. Se entra por
   una sección, pero dentro se recorre entero: las secciones son puntos de
   entrada, no compartimentos. Los atajos de arriba saltan a cada una.

La página pasó de 26 pantallas a 11.

- **Las fotos salen de las subcarpetas de `Galeria marcel/`** y el orden de
  las secciones está fijado en el script de generación (`ORDEN`). Para añadir
  fotos, se dejan en su carpeta y se vuelve a generar.
- **El carrete vive fuera de `<main>`** a propósito: dentro heredaría el
  apilado y los `transform` de las secciones, y una capa fija dentro de un
  ancestro transformado se posiciona respecto a ese ancestro, no a la ventana.
- **`grid-template-columns: minmax(0, 1fr)`, no `1fr`.** Un hijo de grid tiene
  `min-width: auto`, así que la pista (58 fotos en fila) estiraba la capa
  entera a 775 px en un móvil de 390 y la barra se salía de la pantalla.
- **Cada foto declara `--ar` y la imagen lleva `aspect-ratio`.** Sin eso las
  fotos no ocupan nada hasta cargar, la tira colapsa y los atajos apuntan a
  posiciones que dejan de existir cuando las imágenes aparecen.
- **Sin `scroll-snap`:** el imán se peleaba con el salto a cada sección
  (aterrizaba ~120 px desviado, dejando la marca fuera de campo).
- **El salto suave solo se usa en distancias cortas.** El carrete mide casi
  50.000 px: de una punta a otra, un desplazamiento suave tarda segundos y
  parece que la página se ha colgado.
- **`atrás` cierra el carrete**, no saca de la página: al abrir se mete una
  entrada en el historial.
- **La apertura fuerza un reflujo (`void capa.offsetHeight`) en vez de usar
  `requestAnimationFrame`.** La transición necesita que el navegador haya
  calculado el estado inicial, y un rAF puede tardar o no llegar si la
  pestaña no está componiendo.

## El video de Producción

El de la sección de composición va de fondo, en bucle y sin audio, con el
mismo montaje que el hero: poster como `<img>` y las fuentes enganchadas
desde `app.js`, para no bajar los megas con movimiento reducido.

**Las tarjetas de precio dejaron de ser transparentes y el texto ensanchó a
76ch.** Sobre un video en movimiento, una tarjeta translúcida y un párrafo a
60ch se perdían; el velo de dos capas y el fondo opaco de las tarjetas son lo
que mantiene legibles las cifras.

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
  - **Historial de vídeos del hero**, por si hay que volver atrás: pasó por
    `Video para Hero.mp4` (que llevaba un montaje por tramos, con el plano
    del guitarrista acelerado un 25%) y desde el 15/08/2026 vuelve a
    `Marcel franco hero webM.mp4`, **sin ningún montaje**: se codifica
    entero y a velocidad normal. El clip de aquel montaje es hoy
    `Videos Marcel/Video para sección composición.mp4` y vive de fondo en
    Producción, también sin editar.
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
- **Ninguna tarjeta fija su altura en `svh`. Se fija la proporción con
  `aspect-ratio` y se limita el ancho con `min(rem, svh)`.** Con altura en
  `svh` el ancho no acompaña: al bajar la ventana la tarjeta se achataba y
  `object-fit: cover` se comía la imagen. Le cortaba el titular «CLASES» al
  banner y un 30% al retrato de Bellas Artes. El `min()` con `svh` es lo que
  impide que una tarjeta alta se salga del pin en una ventana baja.
- **La forma de cada tarjeta la manda su imagen, no la retícula.** `--ancha`
  para el banner apaisado; `--cuad-pq/-med/(base)/-gr` para material que nace
  cuadrado (portadas de disco y fotos de grupo); `--pq/-med/-gr` para retratos
  verticales. La portada de Limbo es simétrica y un recorte vertical le comía
  las alas; en la foto de El Cuarto de Dante dejaba fuera a los músicos de los
  lados. Antes de meter una imagen nueva, mira su proporción y elige la
  variante que menos recorte: **el objetivo es 0%**, y se comprueba midiendo,
  no a ojo.
- **`.horiz__head` y `.horiz__progress` tienen que seguir siendo
  `position: absolute`.** Si se les pone `position: relative` (p. ej. para
  darles z-index), pasan a ser elementos en flujo dentro de `.horiz__sticky`,
  que es flex, y empujan el carril a la derecha el ancho del titular: la
  última tarjeta se sale por el borde justo esos píxeles. Para apilarlas basta
  con `z-index`, sin tocar `position`.
- **El desfase del parallax sigue una campana (`sin(p·π)`): 0 al principio,
  máximo a media altura y 0 al final.** No es estético: si creciera hasta el
  final, la tarjeta del primer plano acabaría desplazada fuera de pantalla. Al
  volver a cero, el mural aterriza exactamente donde dice la maqueta y la
  última tarjeta queda centrada.
- **La regla de `.card` en móvil repite el `transform` completo.** Si solo
  declara `translateY`, pisa el transform base y en móvil se pierden el
  desfase (`--px`) y la escala (`--ps`): el parallax deja de existir sin que
  salte ningún error.
- **`data-z` no debe dar saltos bruscos entre tarjetas vecinas.** Cuanto más
  se diferencian dos contiguas, más se separan o se pisan al final del
  recorrido. Con saltos de 0.75 se abrían huecos de 293 px junto a solapes de
  114 px; con saltos de 0.25 a 0.35 queda parejo (solape máximo de 8 px).
  `AMPLITUD` en `app.js` gradúa lo evidente que es el efecto; el desfase se
  calcula sobre ella y **no** sobre el recorrido, para que añadir tarjetas no
  dispare el desplazamiento.
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
