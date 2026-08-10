import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { useFetch } from '../hooks/useFetch';
import { get } from '../services/api';
import { usePlayer } from '../features/player/PlayerContext';
import { useFavorites } from '../features/favorites/FavoritesContext';
import { cn } from '../lib/utils';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import TrackRow from '../features/track/TrackRow';

const ALBUM_TYPE_LABELS = {
  album: 'Álbum',
  single: 'Single',
  compilation: 'Compilación',
};

function formatAlbumDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function AlbumPage() {
  const { id } = useParams();
  const [retryKey, setRetryKey] = useState(0);
  const { currentTrack, isPlaying: playerIsPlaying, dispatch: playerDispatch } = usePlayer();
  const { favorites, dispatch: favoritesDispatch } = useFavorites();

  const { status, data: album, error } = useFetch(
    () => get(`/albums/${id}`),
    [id, retryKey]
  );

  const isFavorite = album ? favorites.some((item) => item.id === album.id) : false;
  const mainArtist = album?.artists?.[0];

  function toggleFavorite() {
    if (!album) return;
    if (isFavorite) {
      favoritesDispatch({ type: 'REMOVE_FAVORITE', payload: album.id });
    } else {
      favoritesDispatch({
        type: 'ADD_FAVORITE',
        payload: {
          id: album.id,
          name: album.name,
          imageUrl: album.images?.[0]?.url,
          subtitle: 'Álbum',
          variant: 'album',
        },
      });
    }
  }

  function enrichTrack(track) {
    return {
      ...track,
      album: { images: album.images, name: album.name },
    };
  }

  function handlePlayTrack(track) {
    if (!album) return;
    const trackConAlbum = enrichTrack(track);
    playerDispatch({ type: 'SET_TRACK', payload: trackConAlbum });
    playerDispatch({ type: 'PLAY' });
    favoritesDispatch({ type: 'ADD_TO_RECENT', payload: trackConAlbum });
  }

  function toggleTrackFavorite(track) {
    const isTrackFavorite = favorites.some((item) => item.id === track.id);
    if (isTrackFavorite) {
      favoritesDispatch({ type: 'REMOVE_FAVORITE', payload: track.id });
      return;
    }
    favoritesDispatch({
      type: 'ADD_FAVORITE',
      payload: { ...enrichTrack(track), subtitle: 'Canción', variant: 'track' },
    });
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="space-y-10 px-5 py-8 md:px-10 md:py-10">
        <Skeleton className="h-72 w-full md:h-64" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="px-5 py-8 md:px-10 md:py-10">
        <ErrorState message={error?.message} onRetry={() => setRetryKey((key) => key + 1)} />
      </div>
    );
  }

  const trackItems = album.tracks?.items ?? [];
  const releaseYear = album.release_date?.slice(0, 4);
  const albumTypeLabel = ALBUM_TYPE_LABELS[album.album_type] ?? album.album_type;
  const totalDurationMs = trackItems.reduce((sum, track) => sum + (track.duration_ms ?? 0), 0);

  return (
    <div className="animate-rise-in space-y-10 px-5 py-8 md:px-10 md:py-10">
      {/* Encabezado del álbum */}
      <header className="relative -mx-5 -mt-8 px-5 pb-10 pt-10 md:-mx-10 md:-mt-10 md:px-10 md:pb-14 md:pt-14">
        <div className="stage-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative aspect-square h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-[var(--shadow-glow)] sm:h-48 sm:w-48">
            {album.images?.[0]?.url ? (
              <img
                src={album.images[0].url}
                alt={album.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-5xl font-bold text-foreground/85">
                {album.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Álbum</p>
            <h1 className="text-3xl font-bold md:text-5xl">{album.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
              {mainArtist && (
                <Link
                  to={`/artists/${mainArtist.id}`}
                  className="font-semibold transition-colors duration-300 hover:text-foreground"
                >
                  {mainArtist.name}
                </Link>
              )}
              {releaseYear && <span>• {releaseYear}</span>}
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide">
                {albumTypeLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFavorite}
              aria-pressed={isFavorite}
              className={cn(
                'mt-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition-all duration-300 ease-[var(--ease-silk)] hover:-translate-y-0.5 hover:border-primary/30',
                isFavorite && 'border-primary/40 text-primary'
              )}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-primary')} />
              {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>
      </header>

      {/* Canciones */}
      <section className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-xl font-semibold">Canciones</h2>
          {trackItems.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {album.total_tracks} canciones • {formatAlbumDuration(totalDurationMs)}
            </p>
          )}
        </div>
        {trackItems.length > 0 ? (
          <div className="space-y-1">
            {trackItems.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                showIndex
                isPlaying={track.id === currentTrack?.id && playerIsPlaying}
                onPlay={handlePlayTrack}
                isFavorite={favorites.some((item) => item.id === track.id)}
                onToggleFavorite={toggleTrackFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Este álbum no tiene canciones disponibles." />
        )}
      </section>
    </div>
  );
}

export default AlbumPage;
