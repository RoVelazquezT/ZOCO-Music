# ZOCO Music

Aplicación web inspirada en Spotify, desarrollada como prueba técnica. Permite
explorar artistas, álbumes y canciones reales a través de la Spotify Web API,
con favoritos e historial persistidos localmente y un player inferior
persistente.

## Stack tecnológico

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS v4
- Context API + `useReducer` para estado global (player y favoritos)

**Backend**
- Node.js + Express
- Spotify Web API (Client Credentials Flow)
- Arquitectura BFF (Backend For Frontend): el backend actúa como proxy,
  ocultando las credenciales de Spotify del cliente

Para el detalle completo de las decisiones técnicas y su justificación, ver
[`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Estructura del proyecto

```
zoco-music/
├── client/          # React + Vite (SPA)
├── server/          # Node + Express (proxy hacia Spotify)
├── ARCHITECTURE.md  # Documento de arquitectura y decisiones técnicas
└── README.md
```

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de Spotify **con suscripción Premium activa** (ver nota abajo)
- Credenciales de una app de Spotify Developer
- 
## 1. Obtener credenciales de Spotify

> **Importante:** desde marzo de 2026, Spotify exige que la cuenta que
> registra la app en el Dashboard tenga una suscripción Premium activa.
> Con una cuenta gratuita, el Dashboard no permite crear la app. Si no
> tenés Premium, Spotify suele ofrecer un período de prueba gratuito para
> cuentas nuevas.

1. Ingresá a [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
   y logueate con tu cuenta de Spotify (Premium).
2. Hacé clic en **Create app**.
3. Completá el formulario:
   - **Redirect URI:** `http://127.0.0.1:5173` (usar `127.0.0.1`, no
     `localhost`; Spotify rechaza `localhost` como URI de redirección
     desde 2026). No se usa activamente en este proyecto, pero Spotify
     lo exige para crear la app.
   - Tildá **Web API** en "¿Qué API/SDK pensás utilizar?"
4. Guardá la app, entrá a **Settings** y copiá el **Client ID** y el
   **Client Secret**.

## 2. Configurar variables de entorno

**`server/.env`** (crear a partir de `server/.env.example`):
```
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
PORT=4000
CLIENT_URL=http://localhost:5173
```

**`client/.env`**:
```
VITE_API_URL=http://localhost:4000/api
```

## 3. Instalación

```bash
# Backend
cd server
npm install

# Frontend (en otra terminal)
cd client
npm install
```

## 4. Ejecución

```bash
# Terminal 1 — backend
cd server
npm run dev
# Servidor disponible en http://localhost:4000

# Terminal 2 — frontend
cd client
npm run dev
# App disponible en http://localhost:5173
```

Abrí `http://localhost:5173` en el navegador.

## Funcionalidades implementadas

- [x] Home con contenido musical (artistas curados + descubrimiento por género)
- [x] Buscador de artistas, canciones y álbumes, con debounce
- [x] Vista de detalle de artista (álbumes agrupados por tipo, canciones
      destacadas)
- [x] Vista de detalle de álbum y sus canciones (año, tipo, duración total)
- [x] Player inferior persistente (play/pause, progreso, favorito de la
      canción sonando)
- [x] Favoritos persistidos en `localStorage` (artistas, álbumes y
      canciones, con distinción visual entre tipos)
- [x] Historial de escuchados recientemente, con reproducción directa
- [x] Navegación sin recarga de página (SPA)
- [x] Diseño responsive (mobile y desktop)
- [x] Estados de carga, error y búsquedas sin resultados en toda la app

## Limitaciones conocidas

En febrero de 2026, Spotify restringió varios endpoints y reglas de su Web
API para apps en modo Development (el modo por defecto para apps nuevas, sin
aprobación comercial). Esto afecta directamente algunas decisiones de este
proyecto:

- **`GET /artists/{id}/top-tracks` fue eliminado.** La sección "Canciones
  destacadas" de la vista de artista muestra en su lugar las canciones del
  álbum más reciente del artista, priorizando álbumes de estudio sobre
  singles/compilaciones.
- **`GET /browse/new-releases` fue eliminado.** El contenido del Home se
  arma con una lista curada de artistas más una búsqueda por género, en
  vez de "nuevos lanzamientos" globales de Spotify.
- **El límite máximo del parámetro `limit` en `/search` bajó de 50 a 10.**
  El backend valida y acota este parámetro en vez de confiar en la
  documentación pública, para tolerar futuros ajustes de política.
- **La cuenta que registra la app debe tener Spotify Premium activo**
  desde marzo de 2026 (ver sección de credenciales más arriba).
- **La cuota de Development Mode se cuenta por cuenta de desarrollador,
  no por app.** Si tenés varias apps en Development Mode bajo la misma
  cuenta, todas comparten un único presupuesto de peticiones. Un error
  `429` con `"reason": "QUOTA_EXCEEDED"` indica que se agotó ese
  presupuesto compartido, a diferencia del rate limit por ráfaga (30
  segundos), que sí se resetea solo. El endpoint `/api/home` pide sus
  datos de forma secuencial (no en paralelo) para reducir el riesgo de
  activar el límite de ráfaga.
- El campo `preview_url` (audio de 30 segundos) fue deprecado por Spotify
  en noviembre de 2024 y casi nunca viene poblado; por eso el player
  simula la reproducción en vez de usar audio real.

## Autor -- Velázquez Rocío :)

Proyecto desarrollado como prueba técnica para Zoco.
