import { useState } from 'react';
import { Search } from 'lucide-react';

import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { get } from '../services/api';
import { usePlayer } from '../features/player/PlayerContext';
import { useFavorites } from '../features/favorites/FavoritesContext';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import ArtistCard from '../features/search/ArtistCard';
import AlbumCard from '../features/album/AlbumCard';
import TrackRow from '../features/track/TrackRow';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const debouncedQuery = useDebounce(query, 400);
  const trimmedQuery = debouncedQuery.trim();

  const { currentTrack, isPlaying: playerIsPlaying, dispatch: playerDispatch } = usePlayer();
  const { favorites, dispatch: favoritesDispatch } = useFavorites();

  const { status, data, error } = useFetch(
    () =>
      trimmedQuery
        ? get(`/search?q=${encodeURIComponent(trimmedQuery)}&type=artist,track,album`)
        : Promise.resolve(null),
    [trimmedQuery, retryKey]
  );

  function handlePlayTrack(track) {
    playerDispatch({ type: 'SET_TRACK', payload: track });
    playerDispatch({ type: 'PLAY' });
    favoritesDispatch({ type: 'ADD_TO_RECENT', payload: track });
  }

  function toggleTrackFavorite(track) {
    const isTrackFavorite = favorites.some((item) => item.id === track.id);
    if (isTrackFavorite) {
      favoritesDispatch({ type: 'REMOVE_FAVORITE', payload: track.id });
    } else {
      favoritesDispatch({
        type: 'ADD_FAVORITE',
        payload: { ...track, subtitle: 'Canción', variant: 'track' },
      });
    }
  }

  const artistItems = data?.artists?.items ?? [];
  const albumItems = data?.albums?.items ?? [];
  const trackItems = data?.tracks?.items ?? [];
  const hasResults = artistItems.length > 0 || albumItems.length > 0 || trackItems.length > 0;
  const isSearching = trimmedQuery && (status === 'loading' || status === 'idle');

  return (
    <div className="animate-rise-in space-y-10 px-5 py-8 md:px-10 md:py-10">
      <header className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Buscar</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Encontrá tu música</h1>
        </div>
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artistas, canciones o álbumes"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm backdrop-blur-lg placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </header>

      {!trimmedQuery && (
        <EmptyState message="Buscá tu artista, canción o álbum favorito" />
      )}

      {isSearching && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      )}

      {trimmedQuery && status === 'error' && (
        <ErrorState message={error?.message} onRetry={() => setRetryKey((key) => key + 1)} />
      )}

      {trimmedQuery && status === 'success' && !hasResults && (
        <EmptyState message={`No encontramos resultados para "${trimmedQuery}"`} />
      )}

      {trimmedQuery && status === 'success' && hasResults && (
        <div className="space-y-10">
          {artistItems.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-xl font-semibold">Artistas</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {artistItems.map((artist, i) => (
                  <ArtistCard key={artist.id} artist={artist} index={i} />
                ))}
              </div>
            </section>
          )}

          {albumItems.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-xl font-semibold">Álbumes</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {albumItems.map((album, i) => (
                  <AlbumCard key={album.id} album={album} index={i} />
                ))}
              </div>
            </section>
          )}

          {trackItems.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-xl font-semibold">Canciones</h2>
              <div className="space-y-1">
                {trackItems.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i}
                    showIndex={false}
                    isPlaying={track.id === currentTrack?.id && playerIsPlaying}
                    onPlay={handlePlayTrack}
                    isFavorite={favorites.some((item) => item.id === track.id)}
                    onToggleFavorite={toggleTrackFavorite}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
