const STORAGE_KEY = 'bookExplorerFavs';

// Obtain the data from the local storage

export function getFavorites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
// Once favorite button is clicked, save the updated list back to localStorage

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
// Save the favorite to the favorites part of the local storage, and remove it when the user clicks again. Also, check if a book is already in favorites to update the button state accordingly.

export function addFavorite(book) {
  const favorites = getFavorites();

   const alreadySaved = favorites.some(fav => fav.key === book.key);
  if (!alreadySaved) {
    favorites.push(book);
    saveFavorites(favorites);
  }
}
// If the user wantes to remove favorite book, allow it
export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated   = favorites.filter(fav => fav.key !== bookKey);
  saveFavorites(updated);
}


export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.key === bookKey);
}