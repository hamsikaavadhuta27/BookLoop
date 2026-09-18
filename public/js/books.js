/**
 * Browse page: live search + combined filters (no page refresh).
 */

const filterForm = document.getElementById('filter-form');
const searchInput = document.getElementById('search-input');
const bookGrid = document.getElementById('book-grid');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');
const categorySelect = document.getElementById('filter-category');
const branchSelect = document.getElementById('filter-branch');

let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!filterForm) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('search') && searchInput) {
    searchInput.value = params.get('search');
  }

  try {
    const filters = await getFilters();
    allCategories = filters.data.categories;
    fillSelect(categorySelect, allCategories.map((item) => item.name), 'All categories');
    fillSelect(document.getElementById('filter-year'), filters.data.years, 'All years');
    fillSelect(document.getElementById('filter-location'), filters.data.locations, 'All locations');
    fillSelect(document.getElementById('filter-condition'), filters.data.conditions, 'All conditions');

    if (params.get('category')) categorySelect.value = params.get('category');
    if (params.get('location')) document.getElementById('filter-location').value = params.get('location');
    updateBranchOptions();
    if (params.get('branch')) branchSelect.value = params.get('branch');
  } catch (error) {
    console.error(error);
  }

  await loadBooks();
});

function updateBranchOptions() {
  const selected = allCategories.find((item) => item.name === categorySelect.value);
  const branches = selected && selected.branches ? selected.branches : [];
  fillSelect(branchSelect, branches, branches.length ? 'All branches' : 'No branch needed');
  branchSelect.disabled = branches.length === 0;
}

function currentFilters() {
  return {
    search: searchInput ? searchInput.value.trim() : '',
    category: categorySelect.value,
    branch: branchSelect.value,
    year: document.getElementById('filter-year').value,
    location: document.getElementById('filter-location').value,
    condition: document.getElementById('filter-condition').value,
    minPrice: document.getElementById('filter-min-price').value,
    maxPrice: document.getElementById('filter-max-price').value
  };
}

async function loadBooks() {
  if (!bookGrid) return;
  bookGrid.innerHTML = '<p class="muted">Loading books…</p>';

  try {
    const response = await getBooks(currentFilters());
    const books = response.data;

    if (!books.length) {
      bookGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      resultsCount.textContent = '0 books found';
      return;
    }

    emptyState.classList.add('hidden');
    resultsCount.textContent = books.length + (books.length === 1 ? ' book found' : ' books found');
    bookGrid.innerHTML = books.map(bookCardHtml).join('');
    bindSaveButtons(bookGrid);
  } catch (error) {
    bookGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    emptyState.querySelector('h3').textContent = 'Could not load books';
    emptyState.querySelector('p').textContent = 'Make sure the BookLoop server is running.';
    resultsCount.textContent = '';
  }
}

if (categorySelect) {
  categorySelect.addEventListener('change', () => {
    updateBranchOptions();
    loadBooks();
  });
}

if (filterForm) {
  filterForm.addEventListener('input', () => {
    loadBooks();
  });

  filterForm.addEventListener('reset', () => {
    setTimeout(() => {
      updateBranchOptions();
      if (searchInput) searchInput.value = '';
      loadBooks();
    }, 0);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    loadBooks();
  });
}
