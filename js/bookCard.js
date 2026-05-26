// I made Book Card more dynamic for favorites-page.js and homepage
import { isFavorite, addFavorite, removeFavorite } from './favorites.js';

export function createBookCard(book, index = 0) {
    const card = document.createElement('article');
    card.className= 'book-card';


// I added animation delay for cards to create a cascading waterfall effect
  
card.style.animationDelay = `${index * 50}ms`;
// cover imege(placeholder)
 const coverWrapper = document.createElement('div');
  coverWrapper.className = 'book-cover';

  if (book.coverUrl) {
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.alt = `Cover of ${book.title}`;   // WHY: alt text for accessibility
    img.loading = 'lazy';        

      img.onerror = () => {
      coverWrapper.innerHTML = '';
      coverWrapper.appendChild(createPlaceholder());
    };

     coverWrapper.appendChild(img);
  } else {
    coverWrapper.appendChild(createPlaceholder());
  }

//   Book info section

const info = document.createElement('div');
  info.className = 'book-info';

  const title = document.createElement('h3');
  title.className = 'book-title';
  title.textContent = book.title;           // WHY textContent: safe — won't parse HTML tags

  const author = document.createElement('p');
  author.className = 'book-author';
  author.textContent = book.author + (book.year ? ` · ${book.year}` : '');


//   Favorite  button

const favBtn = document.createElement('button');
  favBtn.className = 'fav-btn';
  updateFavBtn(favBtn, book.key); 

//   DOM events
favBtn.addEventListener('click', () => {
    if (isFavorite(book.key)) {
      removeFavorite(book.key);
    } else {
      addFavorite(book);
    }
  updateFavBtn(favBtn, book.key);
  });


//   I then  Assembled the card

 info.appendChild(title);
  info.appendChild(author);
  info.appendChild(favBtn);

  card.appendChild(coverWrapper);
  card.appendChild(info);

  return card;
}

// I created a placeholder when no book cover is present

function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'book-cover-placeholder';
  placeholder.textContent = '📚';
  return placeholder;
}

// Set button text + style based on favorite state

function updateFavBtn(btn, bookKey) {
  if (isFavorite(bookKey)) {
    btn.textContent = '♥ Remove from Favourites';
    btn.classList.add('is-fav');
  } else {
    btn.textContent = '♡ Add to Favourites';
    btn.classList.remove('is-fav');
  }
}