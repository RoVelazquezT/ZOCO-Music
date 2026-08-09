import { createContext, useContext, useReducer } from 'react';
import { initialPlayerState, playerReducer } from './playerReducer';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + hook co-locados a propósito
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  const { state, dispatch } = context;
  return { currentTrack: state.currentTrack, isPlaying: state.isPlaying, progress: state.progress, dispatch };
}
