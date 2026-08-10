import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useFavorites } from '../features/favorites/FavoritesContext';
import { usePlayer } from '../features/player/PlayerContext';
import { get } from '../services/api';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import FavoriteCard from '../features/favorites/FavoriteCard';
import RecentCard from '../features/favorites/RecentCard';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function Home() {
  const saludo = useMemo(() => greeting(), []);
  const [retryKey, setRetryKey] = useState(0);
  const { status, data, error } = useFetch(() => get('/home'), [retryKey]);
  const { favorites, recentlyPlayed, dispatch: favoritesDispatch } = useFavorites();
  const { dispatch: playerDispatch } = usePlayer();

  function handlePlayRecent(track) {
    playerDispatch({ type: 'SET_TRACK', payload: track });
    playerDispatch({ type: 'PLAY' });
    favoritesDispatch({ type: 'ADD_TO_RECENT', payload: track });
  }

  function handlePlayFavorite(item) {
    const track = favorites.find((favorite) => favorite.id === item.id);
    if (!track) return;
    playerDispatch({ type: 'SET_TRACK', payload: track });
    playerDispatch({ type: 'PLAY' });
    favoritesDispatch({ type: 'ADD_TO_RECENT', payload: track });
  }

  const hasFavorites = favorites.length > 0;
  const isLoadingCurated = !hasFavorites && (status === 'idle' || status === 'loading');
  const isCuratedError = !hasFavorites && status === 'error';

  const favoriteItems = hasFavorites
    ? favorites.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl ?? item.album?.images?.[0]?.url,
        subtitle: item.subtitle,
        variant: item.variant,
      }))
    : (data?.curated ?? []).slice(0, 6).map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url,
        subtitle: 'Sugerencia',
        variant: 'artist',
      }));

  return (
    <div className="animate-rise-in space-y-10 px-5 py-8 md:px-10 md:py-10">
      {/* Encabezado de bienvenida */}
      <header className="relative -mx-5 -mt-8 px-5 pb-10 pt-10 md:-mx-10 md:-mt-10 md:px-10 md:pb-14 md:pt-14">
        <div className="stage-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Inicio</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl lg:text-6xl">{saludo}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Volvé a disfrutar lo que más te gusta o descubrí algo nuevo.
          </p>
        </div>
      </header>

      {/* Escuchado recientemente */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Escuchado recientemente</h2>
        </div>
        {recentlyPlayed.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyPlayed.map((item, i) => (
              <RecentCard key={item.id} item={item} index={i} onPlay={handlePlayRecent} />
            ))}
          </div>
        ) : (
          <EmptyState message="Todavía no escuchaste nada por acá" />
        )}
      </section>

      {/* Tus favoritos */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Tus Favoritos</h2>
        </div>
        {isLoadingCurated && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        )}
        {isCuratedError && (
          <ErrorState
            message={error?.message}
            onRetry={() => setRetryKey((key) => key + 1)}
          />
        )}
        {!isLoadingCurated && !isCuratedError && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {favoriteItems.map((item, i) => (
              <FavoriteCard key={item.id} item={item} index={i} onPlay={handlePlayFavorite} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
