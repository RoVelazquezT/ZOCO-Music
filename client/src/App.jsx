import { PlayerProvider } from './features/player/PlayerContext';
import { FavoritesProvider } from './features/favorites/FavoritesContext';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <PlayerProvider>
      <FavoritesProvider>
        <AppRouter />
      </FavoritesProvider>
    </PlayerProvider>
  );
}

export default App;
