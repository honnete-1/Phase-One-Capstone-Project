import { fetchBooks, fetchTrendingBooks } from './fetchBooks.js';
import { createBookCard }                 from './bookCard.js';

const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const booksGrid    = document.getElementById('books-grid');
const loading      = document.getElementById('loading');
const noResults    = document.getElementById('no-results');
const sectionTitle = document.getElementById('section-title');
const resultCount  = document.getElementById('result-count');
const menuBtn      = document.getElementById('menu-btn');
const mobileMenu   = document.getElementById('mobile-menu');


let currentQuery = 'award winning fiction';  // active search term
let currentPage  = 1;                        // active page number
let totalPages   = 1;  

// Hmburger menu toggle for mobile
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const isOpen = !mobileMenu.classList.contains('hidden');
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });
}


// UI Helper

function showLoading() {
  loading.classList.remove('hidden');
  booksGrid.innerHTML = '';
  noResults.classList.add('hidden');
  resultCount.textContent = '';
  // Also clear pagination while loading so it doesn't show stale buttons
  renderPagination(0, 0);
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showNoResults() {
  noResults.classList.remove('hidden');
}

async function loadBooks(query, page = 1, isSearch = false) {

  currentQuery = query;
  currentPage  = page;

  showLoading();
    try {

        const { books, totalPages: pages, totalFound } = await fetchBooks(query, page);

    // Save totalPages to module state so pagination buttons can use it
    totalPages = pages;

    hideLoading();

    sectionTitle.textContent = isSearch
      ? `Results for "${query}"`
      : 'Trending Books';

    if (books.length === 0) {
      showNoResults();
      renderPagination(0, 0);
      return;
    }

    // Format the count nicely e.g. "1,234 books found · Page 3 of 103"
    resultCount.textContent =
      `${totalFound.toLocaleString()} books · Page ${page} of ${totalPages}`;
    // WHY toLocaleString(): turns 157086 into "157,086" — much more readable.

    books.forEach((book, index) => {
      const card = createBookCard(book, index);
      booksGrid.appendChild(card);
    });

    // Draw the pagination buttons AFTER we know totalPages
    renderPagination(page, totalPages);

    /*
      WHY scroll to top after page change:
      When you navigate to page 2, you're still scrolled down from page 1.
      Scrolling to the top mimics how normal page navigation feels.
      We don't scroll on the very first load (page 1, not a search).
    */
    if (page > 1 || isSearch) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  } catch (error) {
    hideLoading();
    renderPagination(0, 0);
    booksGrid.innerHTML = `
      <div class="col-span-full text-center py-16 text-slate">
        <p class="text-4xl mb-3">⚠️</p>
        <p class="font-medium text-lg">Could not load books</p>
        <p class="text-sm mt-1">Check your internet connection and try again.</p>
      </div>
    `;
    console.error('API error:', error);
  }
}


// Pagination renderer 

function renderPagination(page, total) {
  // Find or create the pagination container
  let container = document.getElementById('pagination');
  if (!container) {
    container = document.createElement('div');
    container.id = 'pagination';
    // Insert it after the books grid
    booksGrid.parentNode.insertBefore(container, booksGrid.nextSibling);
  }

  // Clear previous buttons
  container.innerHTML = '';

  // Nothing to paginate
  if (total <= 1) return;

  container.className = 'pagination-bar';

//   Previous button

const prevBtn = makePageBtn('← Prev', page === 1, () => {
    loadBooks(currentQuery, currentPage - 1, true);
  });
  prevBtn.classList.add('pagination-prev-next');
  container.appendChild(prevBtn);


//   Page number buttons

 const pagesToShow = buildPageWindow(page, total);

  pagesToShow.forEach(item => {
    if (item === '...') {
      // Ellipsis — not a button, just a visual gap
      const gap = document.createElement('span');
      gap.className = 'pagination-gap';
      gap.textContent = '…';
      container.appendChild(gap);
    } else {
      const btn = makePageBtn(item, false, () => {
        loadBooks(currentQuery, item, true);
      });
      // Highlight the current page
      if (item === page) {
        btn.classList.add('pagination-active');
        btn.setAttribute('aria-current', 'page'); // WHY: tells screen readers which page is active
        btn.disabled = true;
      }
      container.appendChild(btn);
    }
  });

  //  Next button 
  const nextBtn = makePageBtn('Next →', page === total, () => {
    loadBooks(currentQuery, currentPage + 1, true);
  });
  nextBtn.classList.add('pagination-prev-next');
  container.appendChild(nextBtn);
}

function buildPageWindow(current, total) {
  const pageSet = new Set();

  // Always include first and last page
  pageSet.add(1);
  pageSet.add(total);

  // Include current page and 2 neighbours on each side
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pageSet.add(i);
  }

  // Convert Set → sorted array
  const sorted = [...pageSet].sort((a, b) => a - b);

  // Insert '...' wherever consecutive numbers jump by more than 1
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }

  return result;
}

/*
  makePageBtn(label, isDisabled, onClick)
  Helper that creates a single pagination <button> element.
  WHY a helper: we create many buttons with the same structure —
  DRY principle again.
*/
function makePageBtn(label, isDisabled, onClick) {
  const btn = document.createElement('button');
  btn.className   = 'pagination-btn';
  btn.textContent = label;
  btn.disabled    = isDisabled;
  if (!isDisabled) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

//  Search event listeners 
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    // WHY reset to page 1 on new search:
    // A new search term means completely new results.
    // Staying on page 5 of the old search while viewing new results would be wrong.
    loadBooks(query, 1, true);
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      loadBooks(query, 1, true);
    }
  }
});

//  Initial load 
loadBooks('award winning fiction', 1, false);
