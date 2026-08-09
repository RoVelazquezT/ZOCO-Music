import { createContext, useContext } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { favoritesReducer, initialFavoritesState } from './favoritesReducer';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [state, setState] = useLocalStorage('zoco-favorites', initialFavoritesState);

  function dispatch(action) {
    setState((prevState) => favoritesReducer(prevState, action));
  }

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + hook co-locados a propósito
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}
