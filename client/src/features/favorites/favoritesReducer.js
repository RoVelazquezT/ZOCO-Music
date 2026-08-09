export const initialFavoritesState = {
  favorites: [],
  recentlyPlayed: [],
};

export function favoritesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const alreadyExists = state.favorites.some((item) => item.id === action.payload.id);
      if (alreadyExists) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    }
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };
    case 'ADD_TO_RECENT': {
      const withoutDuplicate = state.recentlyPlayed.filter(
        (item) => item.id !== action.payload.id
      );
      return { ...state, recentlyPlayed: [action.payload, ...withoutDuplicate].slice(0, 20) };
    }
    default:
      return state;
  }
}
