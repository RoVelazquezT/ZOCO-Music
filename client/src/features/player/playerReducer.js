export const initialPlayerState = {
  currentTrack: null,
  isPlaying: false,
  progress: 0,
};

export function playerReducer(state, action) {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload, progress: 0, isPlaying: true };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    default:
      return state;
  }
}
