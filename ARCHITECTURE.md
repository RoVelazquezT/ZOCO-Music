# ZOCO Music — Documento de arquitectura

## 1. Contexto del proyecto

Prueba técnica: desarrollar una aplicación web inspirada en Spotify usando la Spotify
Web API. Plazo de 48 horas. Este documento define la arquitectura, las decisiones
técnicas y el plan de implementación antes de empezar a escribir código.

**Requisitos funcionales:**
- Home con contenido musical.
- Buscador de artistas, canciones y álbumes.
- Vista de detalle de artista.
- Vista de detalle de álbum y sus canciones.
- Player inferior persistente (play/pause, anterior, siguiente, progreso). No requiere
  audio real.
- Favoritos persistidos localmente.
- Historial de escuchados recientemente.
- Navegación sin recarga de página (SPA).
- Diseño responsive (desktop y mobile).
- Estados de carga, error y búsquedas sin resultados.

---

## 2. Tipo de arquitectura

**SPA (Single Page Application) + patrón BFF (Backend For Frontend).**

- **SPA:** el navegador carga un único documento HTML. React controla qué se
  renderiza según la ruta, sin recargar la página. Esto resuelve directamente el
  requisito de "navegación sin recargar".
- **BFF:** el backend Express no es un backend de negocio tradicional (no tiene base
  de datos ni modelos de dominio propios). Es una capa fina cuya única
  responsabilidad es intermediar entre el cliente y la Spotify Web API, ocultando
  credenciales sensibles.

**Por qué esta arquitectura y no otra:**
- Un monolito con renderizado en servidor (SSR) sería sobre-ingeniería: no hay SEO
  que optimizar ni contenido que deba indexarse, y agrega complejidad de
  hidratación innecesaria para el alcance de la prueba.
- Microservicios no tienen sentido: hay un solo dominio (música) y un solo consumidor
  (el cliente propio).
- Un cliente 100% estático sin backend no es viable porque el Client Credentials
  Flow de Spotify requiere un `client_secret` que nunca debe exponerse en el
  navegador.

---

## 3. Diagrama de flujo

```
┌─────────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│   Cliente React      │  HTTP  │   Backend Express      │  HTTPS │   Spotify Web API   │
│   (Vite, SPA)         │ ─────► │   (proxy + cache token) │ ─────► │   (datos reales)     │
│                      │ ◄───── │                        │ ◄───── │                     │
└──────────┬───────────┘        └──────────────────────┘        └────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ localStorage  │
    │ favoritos +   │
    │ historial     │
    └──────────────┘
```

El cliente **nunca** se comunica directamente con Spotify. Todas las peticiones pasan
por el backend propio, que agrega, cachea el token y devuelve solo los datos que el
cliente necesita.

---

## 4. Estructura de carpetas (monorepo)

```
zoco-music/
├── client/                        # React + Vite
│   ├── src/
│   │   ├── components/            # UI reutilizable y agnóstica de dominio
│   │   │   ├── ui/                # Button, Card, Skeleton, ErrorState, EmptyState
│   │   │   └── layout/             # Navbar, Sidebar, Layout
│   │   ├── features/               # Organización por dominio, no por tipo de archivo
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── SearchResults.jsx
│   │   │   │   └── useSearch.js
│   │   │   ├── artist/
│   │   │   │   ├── ArtistDetail.jsx
│   │   │   │   └── ArtistHeader.jsx
│   │   │   ├── album/
│   │   │   │   ├── AlbumDetail.jsx
│   │   │   │   └── TrackList.jsx
│   │   │   ├── player/
│   │   │   │   ├── Player.jsx
│   │   │   │   ├── PlayerContext.jsx
│   │   │   │   └── playerReducer.js
│   │   │   └── favorites/
│   │   │       ├── FavoritesContext.jsx
│   │   │       ├── favoritesReducer.js
│   │   │       └── RecentlyPlayed.jsx
│   │   ├── hooks/                  # Hooks genéricos, reutilizables entre features
│   │   │   ├── useDebounce.js
│   │   │   ├── useFetch.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/
│   │   │   └── api.js              # cliente HTTP hacia el backend propio
│   │   ├── pages/                  # Componentes de nivel ruta
│   │   │   ├── Home.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── ArtistPage.jsx
│   │   │   └── AlbumPage.jsx
│   │   ├── router/
│   │   │   └── AppRouter.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Node + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js               # lectura y validación de variables de entorno
│   │   ├── services/
│   │   │   └── spotifyAuth.js       # obtención y cache del token (Client Credentials)
│   │   ├── controllers/
│   │   │   ├── searchController.js
│   │   │   ├── artistController.js
│   │   │   └── albumController.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js
│   │   │   └── cors.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

**Por qué `features/` en lugar de organizar por tipo (`components/`, `hooks/` planos):**
Facilita explicar el proyecto en la entrevista ("todo lo de favoritos vive en una
carpeta") y escala mejor: si mañana se agrega una feature nueva, no hay que tocar
carpetas transversales.

---

## 5. Decisiones técnicas y justificación

| Decisión | Elección | Alternativas descartadas | Por qué |
|---|---|---|---|
| Framework frontend | React + Vite | Next.js | No hay necesidad de SSR/SSG; Vite da un dev server más simple y rápido para una SPA pura. |
| Estado global | Context API + `useReducer` | Redux Toolkit, Zustand | Solo hay dos piezas de estado realmente globales (player, favoritos). Usar Redux sería una herramienta desproporcionada al problema. |
| Estilos | Tailwind CSS | CSS Modules, styled-components | Ya conocido por el desarrollador; permite iterar rápido en responsive sin salir del componente. |
| Routing | React Router | — | Estándar de facto para SPA en React; cumple el requisito de navegación sin recarga. |
| Backend | Node + Express | Serverless functions | Un servidor propio simple es más fácil de correr y depurar localmente durante el desarrollo, y no ata el proyecto a un proveedor específico. |
| Autenticación con Spotify | Client Credentials Flow (server-side) | Authorization Code Flow | El proyecto no requiere datos de un usuario de Spotify logueado (playlists propias, etc.), solo catálogo público. Client Credentials es más simple y suficiente. |
| Persistencia de favoritos/historial | `localStorage` | Backend con base de datos | El enunciado pide persistencia "local"; no hay autenticación de usuarios en el alcance, así que una base de datos sería sobre-ingeniería. |
| Reproducción de audio | Simulada (progreso con `setInterval`/timer) | Spotify Web Playback SDK | El enunciado aclara explícitamente que no es obligatorio reproducir audio real. |

---

## 6. Manejo de estados (carga, error, vacío)

Patrón consistente en toda la app mediante un hook `useFetch`:

```
status: 'idle' | 'loading' | 'success' | 'error'
```

Cada vista de datos sigue la misma estructura de renderizado condicional:
- `loading` → `<Skeleton />`
- `error` → `<ErrorState onRetry={...} />`
- `success` con lista vacía → `<EmptyState />`
- `success` con datos → contenido real

Esto evita si-else repetidos en cada componente y hace que el manejo de estados sea
predecible y fácil de explicar.

---

## 7. Manejo de errores en el backend

- Middleware centralizado (`errorHandler.js`) que captura errores de cualquier
  controlador y responde con un formato JSON consistente:
  `{ error: { message, status } }`.
- El servicio `spotifyAuth.js` maneja la renovación del token de forma transparente:
  si el token está vencido o no existe, lo pide antes de reenviar la petición
  original.
- Casos límite contemplados: rate limiting de Spotify (respuesta 429), IDs
  inexistentes (404), errores de red hacia Spotify (503).

---

## 8. Mejoras de iniciativa (no pedidas explícitamente)

- Debounce en el buscador para reducir llamadas innecesarias.
- Skeleton loaders en lugar de spinners genéricos.
- Modo oscuro con Tailwind (estética similar a Spotify).
- Atajos de teclado en el player (barra espaciadora = play/pause).
- Animaciones sutiles en transiciones de ruta.

---

## 9. Variables de entorno

`.env` en `server/`:
```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
PORT=4000
CLIENT_URL=http://localhost:5173
```

`.env` en `client/` (si aplica, para apuntar al backend en distintos entornos):
```
VITE_API_URL=http://localhost:4000
```

---

## 10. Deploy (a definir)

Backend y frontend se despliegan por separado dado que son paquetes independientes
en el monorepo. Candidatos a evaluar más adelante: Render/Railway para el backend
(necesita proceso persistente), Vercel/Netlify para el frontend estático. Esta
decisión se toma después de tener el proyecto funcionando localmente.
