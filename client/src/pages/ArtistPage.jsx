import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { useFetch } from '../hooks/useFetch';
import { get } from '../services/api';
import { usePlayer } from '../features/player/PlayerContext';
import { useFavorites } from '../features/favorites/FavoritesContext';
import { cn } from '../lib/utils';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import AlbumCard from '../features/album/AlbumCard';
import TrackRow from '../features/track/TrackRow';

function pickFeaturedAlbum(items) {
  if (!items || items.length === 0) return null;
  const sorted = [...items].sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );
  return sorted.find((album) => album.album_type === 'album') ?? sorted[0];
}

function ArtistPage() {
  const { id } = useParams();
  const [retryKey, setRetryKey] = useState(0);
  const [featuredRetryKey, setFeaturedRetryKey] = useState(0);
  const { currentTrack, isPlaying: playerIsPlaying, dispatch: playerDispatch } = usePlayer();
  const { favorites, dispatch: favoritesDispatch } = useFavorites();

  const { status, data, error } = useFetch(
    () => get(`/artists/${id}`),
    [id, retryKey]
  );

  const artist = data?.artist;
  const albumItems = data?.albums?.items ?? [];
  const featuredAlbumId = useMemo(
    () => pickFeaturedAlbum(data?.albums?.items)?.id ?? null,
    [data]
  );

  const {
    status: featuredStatus,
    data: featuredAlbum,
    error: featuredError,
  } = useFetch(
    () => (featuredAlbumId ? get(`/albums/${featuredAlbumId}`) : Promise.resolve(null)),
    [featuredAlbumId, featuredRetryKey]
  );

  const isFavorite = artist ? favorites.some((item) => item.id === artist.id) : false;

  function toggleFavorite() {
    if (!artist) return;
    if (isFavorite) {
      favoritesDispatch({ type: 'REMOVE_FAVORITE', payload: artist.id });
    } else {
      favoritesDispatch({
        type: 'ADD_FAVORITE',
        payload: {
          id: artist.id,
          name: artist.name,
          imageUrl: artist.images?.[0]?.url,
          subtitle: 'Artista',
          variant: 'artist',
        },
      });
    }
  }

  function handlePlayTrack(track) {
    if (!featuredAlbum) return;
    const trackConAlbum = {
      ...track,
      album: { images: featuredAlbum.images, name: featuredAlbum.name },
    };
    playerDispatch({ type: 'SET_TRACK', payload: trackConAlbum });
    playerDispatch({ type: 'PLAY' });
    favoritesDispatch({
      type: 'ADD_TO_RECENT',
      payload: { id: track.id, name: track.name, imageUrl: featuredAlbum.images?.[0]?.url },
    });
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="space-y-10 px-5 py-8 md:px-10 md:py-10">
        <Skeleton className="h-56 w-full md:h-64" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
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

  return (
    <div className="animate-rise-in space-y-10 px-5 py-8 md:px-10 md:py-10">
      {/* Encabezado del artista */}
      <header className="relative -mx-5 -mt-8 px-5 pb-10 pt-10 md:-mx-10 md:-mt-10 md:px-10 md:pb-14 md:pt-14">
        <div className="stage-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border border-white/10 bg-secondary shadow-[var(--shadow-glow)] sm:h-48 sm:w-48">
            {artist.images?.[0]?.url ? (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-5xl font-bold text-foreground/85">
                {artist.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Artista</p>
            <h1 className="text-3xl font-bold md:text-5xl">{artist.name}</h1>

            {artist.genres?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {artist.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

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

      {/* Álbumes */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Álbumes</h2>
        {albumItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {albumItems.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState message="Este artista todavía no tiene álbumes disponibles." />
        )}
      </section>

      {/* Canciones destacadas */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Canciones destacadas</h2>
        {(featuredStatus === 'loading' || featuredStatus === 'idle') && featuredAlbumId && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}
        {featuredStatus === 'error' && (
          <ErrorState
            message={featuredError?.message}
            onRetry={() => setFeaturedRetryKey((key) => key + 1)}
          />
        )}
        {featuredStatus === 'success' && featuredAlbum && (
          <div className="space-y-1">
            {featuredAlbum.tracks?.items?.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                showIndex={false}
                isPlaying={track.id === currentTrack?.id && playerIsPlaying}
                onPlay={handlePlayTrack}
              />
            ))}
          </div>
        )}
        {featuredStatus === 'success' && !featuredAlbum && (
          <EmptyState message="No encontramos canciones destacadas para este artista." />
        )}
      </section>
    </div>
  );
}

export default ArtistPage;
