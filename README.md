# Book Explorer

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Open Library API](https://img.shields.io/badge/Open_Library-API-52616B?style=flat)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

> *Good books don't find you. You find them.*

Book Explorer is a responsive, API-powered web application that lets you search millions of books,
save your favourites, and come back to them any time, even after closing your browser.
No account. No emails. Just you and your next great read.

**Live Demo:** [https://phase-one-capstone-project-ecru.vercel.app/] | **Built by:** [Honnete Nishimwe](https://github.com/honnete-1)

---

## Table of Contents

- [The Story Behind It](#the-story-behind-it)
- [Features](#features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Local Setup](#local-setup)
- [What I Learned](#what-i-learned)
- [What I Would Do Differently](#what-i-would-do-differently)
- [Acknowledgements](#acknowledgements)

---

## The Story Behind It

I didn't want to build just another todo app or a weather widget to tick a box.
I wanted to build something a real person would actually open on a Tuesday evening
and find useful. Books felt like the right answer — because almost everyone has
a mental list of books they mean to read, and almost everyone loses that list.

Book Explorer is my attempt to fix that, built from scratch as my Frontend Phase 1
Capstone at **IGIRE Rwanda Organisation / She Can Code**. Every line of HTML,
every CSS rule, every JavaScript function — I wrote it, broke it, debugged it,
and learned why it works.

This README is both documentation and a reflection of that process.

---

## Features

- **Search** — Search millions of books by title or author using the Open Library API
- **Browse** — Trending books load automatically on the homepage so there's always something to discover
- **Favourites** — Save any book with one click; remove it just as easily
- **Persistence** — Favourites survive browser closes and page refreshes via localStorage, no login required
- **Pagination** — Navigate through hundreds of search results with a smart page window
- **Fully Responsive** — Works cleanly on mobile, tablet, and desktop
- **Loading States** — Spinner while fetching, friendly message when nothing is found
- **Accessible** — Semantic HTML, aria-labels on interactive elements, keyboard navigation support

---

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Search, browse, and add books to favourites |
| Favourites | `favorites.html` | View and manage your saved books |
| About | `about.html` | The story behind the app and what went into building it |

---

## Tech Stack

| Technology | Why I Used It |
|-----------|--------------|
| **HTML5** | Semantic structure — using the right element for the right purpose |
| **Tailwind CSS** | Utility-first styling with a custom colour palette and responsive breakpoints |
| **Vanilla JavaScript** | DOM manipulation, events, async/await — no frameworks, just fundamentals |
| **ES6 Modules** | Separated concerns across files using `import`/`export` |
| **Open Library API** | Free, open book database — no API key required |
| **localStorage** | Persisting favourites across sessions without a backend |
| **GitHub** | Version control with branches, commits, and pull requests |

**Colour Palette:**

| Name | Hex | Role |
|------|-----|------|
| Snow | `#F0F5F9` | Page backgrounds |
| Mist | `#C9D6DF` | Borders, accents, nav text |
| Slate | `#52616B` | Secondary text, authors |
| Charcoal | `#1E2022` | Headings, navbar, buttons |

---

## Project Structure

```
book-explorer/
│
├── index.html              # Homepage — search + book grid
├── favorites.html          # Favourites page
├── about.html              # About page
│
├── css/
│   └── styles.css          # Custom styles Tailwind can't handle
│                           # (animations, pseudo-elements, spinner)
│
├── js/
│   ├── main.js             # Homepage orchestrator — wires everything together
│   ├── fetchBooks.js       # All API calls live here (Open Library)
│   ├── favorites.js        # All localStorage logic lives here
│   ├── bookCard.js         # Reusable book card component
│   ├── favorites-page.js   # Favourites page logic
│   └── nav.js              # Hamburger menu toggle (shared)
│
└── images/
    └── iro-logo.png        # IGIRE Rwanda Organisation logo
```

Every file has a single job. `fetchBooks.js` only knows about the API.
`favorites.js` only knows about localStorage. `main.js` connects them.
This is the **separation of concerns** principle in practice.

---

## How It Works

### Search & Browse
When the page loads, `main.js` immediately calls `fetchBooks('award winning fiction', 1)`.
This hits the Open Library API and renders 12 book cards in a responsive grid.
When the user searches, the same function runs with their query and page 1.

### Pagination
The API returns `numFound` — the total number of matching books.
We calculate total pages with `Math.ceil(numFound / 12)`, capped at 100.
A smart window algorithm shows the current page, 2 neighbours on each side,
and always the first and last page, with `…` gaps in between.

### Favourites
Each book card has a toggle button. One click calls `addFavorite(book)` or
`removeFavorite(bookKey)` from `favorites.js`. The book object is serialised
to JSON and stored in `localStorage` under the key `bookExplorerFavs`.
On the Favourites page, `getFavorites()` reads that key and renders the saved cards.
The data persists indefinitely until the user removes a book or clears their browser data.

### Module System
All JavaScript files use `type="module"` and communicate via ES6 `import`/`export`.
This means each file's variables are scoped to that file, no accidental global conflicts.

---

## API Reference

**Base URL:** `https://openlibrary.org/search.json`

**Example request:**
```
GET https://openlibrary.org/search.json?q=toni+morrison&limit=12&offset=0&fields=key,title,author_name,cover_i,first_publish_year
```

**Parameters used:**

| Parameter | Purpose |
|-----------|---------|
| `q` | Search query (encoded with `encodeURIComponent`) |
| `limit` | Results per page (12) |
| `offset` | How many results to skip — calculated as `(page - 1) × 12` |
| `fields` | Only request the fields we need — faster response |

**Book cover images** are constructed from the `cover_i` field:
```
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
```

No API key required. Open Library is free and open. 

---

## Local Setup

No build tools, no package manager, no configuration needed.

**1. Clone the repository**
```bash
git clone https://github.com/honnete-1/book-explorer.git
cd book-explorer
```

**2. Open in a browser**

If you have VS Code, install the **Live Server** extension, right-click `index.html`,
and select **Open with Live Server**. That's it.

Alternatively, open `index.html` directly in Chrome or Firefox.

> **Important:** Open the file through a local server (Live Server), not by
> double-clicking the file. ES6 modules require a server context — browsers block
> `import`/`export` on plain `file://` URLs for security reasons.

---

## What I Learned

This project taught me things I couldn't have learned from a tutorial alone.

**Breaking things is how you learn them.** I introduced 9 bugs when I rewrote the code
to make it mine. Two typos — `unction` instead of `function` — broke the entire
JavaScript file silently. One missing `<script>` tag meant zero API calls ran.
A single space inside an `id` attribute (`id=" section-title"`) caused
`getElementById` to return `null` and crash the app.

None of these mistakes appear in tutorials. They appear when you're writing real code.

**The things I got most comfortable with:**
- How `async`/`await` and Promises actually work, not just copying the pattern
- Why ES6 modules exist and what problem they solve
- The difference between what Tailwind can do and what needs a real CSS file
- How `position: absolute` takes elements out of document flow (learned the hard way)
- Reading error messages in the browser DevTools console instead of guessing

**The concept that clicked latest:** Separation of concerns. It felt like unnecessary
extra files at first. By the end, it felt obvious, each file knowing only its own
job made debugging straightforward and made the code readable.

---

## What I Would Do Differently

- **Add a book detail page** — clicking a card could open a dedicated page with
  a full description, ISBN, and publisher info from the Open Library API
- **Add genre filtering** — filter books by subject category on the homepage
- **Improve mobile search UX** — auto-focus the search input when the page loads on mobile
- **Add a "recently viewed" section** — using localStorage to track browsing history
- **Write tests** — I now understand enough to appreciate why unit tests exist

---

## Acknowledgements

**IGIRE Rwanda Organisation / She Can Code** — for creating the space and the programme
that made this possible. Building something real from scratch in a structured learning
environment is a gift.

**Open Library** — for maintaining a free, open API that makes projects like this
accessible to anyone learning to code without needing a credit card or a corporate account.

**This project was built as the Frontend Phase 1 Capstone.**
Every bug was a lesson. Every fix was progress.

---

*Built by Honnete Nishimwe 2026*