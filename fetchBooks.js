onst BASE_URL   = 'https://openlibrary.org/search.json';
const PAGE_SIZE  = 12;   // books per page — change this one number to adjust everywhere

export async function fetchBooks(query, page = 1) {


    const offset = (page - 1) * PAGE_SIZE;

  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

const totalFound = data.numFound || 0;
    const totalPages = Math.min(Math.ceil(totalFound / PAGE_SIZE), 100);

    const books = data.docs.map(book => ({
      key:      book.key,
      title:    book.title || 'Unknown Title',
      author:   book.author_name?.[0] || 'Unknown Author',
      year:     book.first_publish_year || '',
      coverUrl: book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : null,
    }));

  return { books, totalPages, totalFound };

  } catch (error) {
    throw error;
  }
}

export async function fetchTrendingBooks() {
  return fetchBooks('award winning fiction', 1);
}

// Export PAGE_SIZE so main.js can reference it if needed
export { PAGE_SIZE };