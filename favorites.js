const STORAGE_KEY = 'bookExplorerFavs';

export function getFavorites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}


function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}


export function addFavorite(book) {
  const favorites = getFavorites();

   const alreadySaved = favorites.some(fav => fav.key === book.key);
  if (!alreadySaved) {
    favorites.push(book);
    saveFavorites(favorites);
  }
}

export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated   = favorites.filter(fav => fav.key !== bookKey);
  saveFavorites(updated);
}


export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.key === bookKey);
}