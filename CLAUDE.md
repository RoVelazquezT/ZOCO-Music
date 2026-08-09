# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

ZOCO Music is a technical-test project (48h scope): a Spotify-inspired web app built with a
React (Vite) client and an Express BFF server. **The codebase is at a very early stage** — the
client is still the default `create-vite` React template (no routing, no features implemented),
and the server currently only exposes a health check and a temporary test route that fetches a
Spotify access token. See `ARCHITECTURE.md` at the repo root for the full target design — it
documents the planned folder structure (`features/`, `pages/`, `controllers/`, etc.) and technical
decisions, but most of it does not exist in code yet. When implementing new features, follow the
structure and rationale in `ARCHITECTURE.md` rather than the current minimal state of `client/src`
and `server/src`.

This is a monorepo with two independent npm packages, `client/` and `server/`, each with its own
`package.json` and `node_modules` (no workspaces configured).

## Commands

Run these from within `client/` or `server/` respectively — there is no root `package.json`.

**Client** (`client/`):
- `npm run dev` — start Vite dev server (default port 5173)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview the production build

**Server** (`server/`):
- `npm run dev` — start with nodemon, entry point `server.js`
- No test suite is configured (`npm test` is a placeholder that exits with an error)

## Architecture

**Pattern: SPA + BFF.** The React client never talks to the Spotify Web API directly. All
requests go through the Express server, which holds the Spotify credentials, obtains/caches an
access token, and will proxy/aggregate data for the client. This exists specifically because
Spotify's Client Credentials Flow requires a `client_secret` that must never be exposed in the
browser.

**Server internals** (`server/src`):
- `app.js` — Express app setup: CORS restricted to `env.clientUrl`, JSON body parsing, routes.
- `config/env.js` — loads and validates env vars via `dotenv`; **process exits immediately** if
  `SPOTIFY_CLIENT_ID` or `SPOTIFY_CLIENT_SECRET` is missing.
- `services/spotifyAuth.js` — implements the Client Credentials Flow against
  `https://accounts.spotify.com/api/token`, module-level in-memory caching of the token
  (`cachedToken`/`tokenExpiresAt`) with a 60s safety margin before real expiry. This is the
  pattern to reuse/extend when adding real Spotify proxy endpoints (search, artist, album, etc.
  per `ARCHITECTURE.md` §4-5).
- `server.js` (root of `server/`) is the actual entry point that imports `src/app.js` and calls
  `.listen()`.

**Env vars** (`server/.env`, see `server/.env.example`): `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, `PORT` (default 4000), `CLIENT_URL` (default `http://localhost:5173`,
used for CORS).

**Client internals** (`client/src`): still the unmodified Vite React starter (`App.jsx`,
`main.jsx`). No router, state management, or Spotify-facing services exist yet. When building
these out, `ARCHITECTURE.md` specifies: React Router for navigation, Context API + `useReducer`
for the two global state slices (player, favorites) rather than Redux/Zustand, Tailwind CSS for
styling, and a `useFetch` hook with a `status: 'idle' | 'loading' | 'success' | 'error'` pattern
used consistently across data-driven views (loading → skeleton, error → retry UI, empty success →
empty state). Favorites and recently-played history are meant to persist in `localStorage` only
(no backend database — out of scope per the architecture doc). Audio playback is simulated
(no real audio, no Web Playback SDK).
