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
| `media/` | Fotos en webp, video del hero, poster |

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
