/**
 * Shared behaviour on every page: mobile menu and current nav highlight.
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add('active');
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (page === 'home') {
    loadHomePage();
  }
});

async function loadHomePage() {
  const categoryGrid = document.getElementById('category-grid');
  const bookGrid = document.getElementById('featured-grid');
  const locationGrid = document.getElementById('location-grid');

  try {
    const [catalog, booksResponse] = await Promise.all([getCategories(), getBooks()]);
    const categories = catalog.data;
    const books = booksResponse.data.slice(0, 8);

    if (categoryGrid) {
      categoryGrid.innerHTML = categories
        .map((category) => {
          const extra = category.branches.length
            ? category.branches.slice(0, 3).join(', ') + (category.branches.length > 3 ? '…' : '')
            : 'Browse listings';
          return `
            <a class="category-card" href="books.html?category=${encodeURIComponent(category.name)}">
              <span class="badge ${category.type}">${category.type === 'academic' ? 'Academic' : 'Non-academic'}</span>
              <h3>${escapeHtml(category.name)}</h3>
              <small>${escapeHtml(extra)}</small>
            </a>
          `;
        })
        .join('');
    }

    if (bookGrid) {
      bookGrid.innerHTML = books.map(bookCardHtml).join('');
      bindSaveButtons(bookGrid);
    }

    if (locationGrid) {
      const locations = ['Koti', 'Secunderabad', 'Paradise', 'Ameerpet', 'Dilsukhnagar', 'Kukatpally', 'Madhapur'];
      locationGrid.innerHTML = locations
        .map(
          (place) => `
            <a class="location-card" href="books.html?location=${encodeURIComponent(place)}">
              <h3>${place}</h3>
              <small>Hyderabad</small>
            </a>
          `
        )
        .join('');
    }
  } catch (error) {
    if (bookGrid) {
      bookGrid.innerHTML = '<p class="empty-state">Could not load books. Start the server with npm start, then refresh.</p>';
    }
  }
}

const homeSearch = document.getElementById('home-search-form');
if (homeSearch) {
  homeSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const q = document.getElementById('home-search-input').value.trim();
    const url = q ? 'books.html?search=' + encodeURIComponent(q) : 'books.html';
    window.location.href = url;
  });
}
