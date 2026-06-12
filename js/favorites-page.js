import { getFavorites, removeFavorite } from './favorites.js';
import { createBookCard }               from './bookCard.js';

//  DOM references 
const favoritesGrid = document.getElementById('favorites-grid');
const emptyState    = document.getElementById('empty-state');
const favHeader     = document.getElementById('fav-header');
const favCount      = document.getElementById('fav-count');
const menuBtn       = document.getElementById('menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');

//  Hamburger menu 
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const isOpen = !mobileMenu.classList.contains('hidden');
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });
}


function renderFavorites() {
  const favorites = getFavorites();    // Read from localStorage

  // Clear previous renders so we don't get duplicate cards
  favoritesGrid.innerHTML = '';

  if (favorites.length === 0) {
    // Show empty state, hide the count header
    emptyState.classList.remove('hidden');
    favHeader.classList.add('hidden');
    return; // Nothing more to do
  }

  // Books exist → show count, hide empty state
  emptyState.classList.add('hidden');
  favHeader.classList.remove('hidden');
  favCount.textContent = `${favorites.length} book${favorites.length !== 1 ? 's' : ''}`;
  // WHY ternary: "1 book" vs "3 books" — grammatically correct pluralisation.

  // Render each favourite as a card
  favorites.forEach((book, index) => {
    const card = createBookCard(book, index);

    
    const favBtn = card.querySelector('.fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        
        setTimeout(renderFavorites, 0);
      });
    }

    favoritesGrid.appendChild(card);
  });
}

//  Run on page load 
renderFavorites();
