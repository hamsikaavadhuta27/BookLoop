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
const yearSelect = document.getElementById('filter-year');
const locationSelect = document.getElementById('filter-location');
const conditionSelect = document.getElementById('filter-condition');

const customBranchInput = document.getElementById('custom-branch-input');
const customYearInput = document.getElementById('custom-year-input');
const customLocationInput = document.getElementById('custom-location-input');

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

    // Populate Category select with Optgroups for Educational & Non-Educational
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">All categories</option>';
      
      const academicGroup = document.createElement('optgroup');
      academicGroup.label = '── Educational / Academic ──';
      const nonAcademicGroup = document.createElement('optgroup');
      nonAcademicGroup.label = '── Non-Academic / General ──';

      allCategories.forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat.name;
        opt.textContent = cat.name;
        if (cat.type === 'academic') {
          academicGroup.appendChild(opt);
        } else {
          nonAcademicGroup.appendChild(opt);
        }
      });

      categorySelect.appendChild(academicGroup);
      categorySelect.appendChild(nonAcademicGroup);
    }

    fillSelect(yearSelect, filters.data.years, 'All years & semesters');
    fillSelect(locationSelect, filters.data.locations, 'All locations');
    fillSelect(conditionSelect, filters.data.conditions, 'All conditions');

    if (params.get('category')) categorySelect.value = params.get('category');
    if (params.get('location')) locationSelect.value = params.get('location');
    updateBranchOptions();
    if (params.get('branch')) branchSelect.value = params.get('branch');

    handleOtherFieldsVisibility();
  } catch (error) {
    console.error('Error fetching filters:', error);
  }

  setupEventListeners();
  await loadBooks();
});

function updateBranchOptions() {
  if (!branchSelect) return;
  const selected = allCategories.find((item) => item.name === categorySelect.value);
  const branches = selected && selected.branches && selected.branches.length ? selected.branches : [];
  
  if (branches.length > 0) {
    fillSelect(branchSelect, branches, 'All branches');
    branchSelect.disabled = false;
  } else {
    fillSelect(branchSelect, ['Other'], 'Not applicable / Other');
    branchSelect.disabled = false;
  }
  handleOtherFieldsVisibility();
}

function handleOtherFieldsVisibility() {
  if (customBranchInput) {
    customBranchInput.style.display = branchSelect && branchSelect.value === 'Other' ? 'block' : 'none';
  }
  if (customYearInput) {
    customYearInput.style.display = yearSelect && yearSelect.value === 'Other' ? 'block' : 'none';
  }
  if (customLocationInput) {
    customLocationInput.style.display = locationSelect && locationSelect.value === 'Other' ? 'block' : 'none';
  }
}

function setupEventListeners() {
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      updateBranchOptions();
      loadBooks();
    });
  }

  if (branchSelect) {
    branchSelect.addEventListener('change', () => {
      handleOtherFieldsVisibility();
      loadBooks();
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      handleOtherFieldsVisibility();
      loadBooks();
    });
  }

  if (locationSelect) {
    locationSelect.addEventListener('change', () => {
      handleOtherFieldsVisibility();
      loadBooks();
    });
  }

  if (customBranchInput) {
    customBranchInput.addEventListener('input', () => loadBooks());
  }
  if (customYearInput) {
    customYearInput.addEventListener('input', () => loadBooks());
  }
  if (customLocationInput) {
    customLocationInput.addEventListener('input', () => loadBooks());
  }

  if (filterForm) {
    filterForm.addEventListener('input', (e) => {
      if (e.target !== searchInput && e.target !== customBranchInput && e.target !== customYearInput && e.target !== customLocationInput) {
        loadBooks();
      }
    });

    filterForm.addEventListener('reset', () => {
      setTimeout(() => {
        if (customBranchInput) customBranchInput.value = '';
        if (customYearInput) customYearInput.value = '';
        if (customLocationInput) customLocationInput.value = '';
        if (searchInput) searchInput.value = '';
        updateBranchOptions();
        handleOtherFieldsVisibility();
        loadBooks();
      }, 0);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadBooks();
    });
  }
}

function currentFilters() {
  return {
    search: searchInput ? searchInput.value.trim() : '',
    category: categorySelect ? categorySelect.value : '',
    branch: branchSelect ? branchSelect.value : '',
    customBranch: customBranchInput ? customBranchInput.value.trim() : '',
    year: yearSelect ? yearSelect.value : '',
    customYear: customYearInput ? customYearInput.value.trim() : '',
    location: locationSelect ? locationSelect.value : '',
    customLocation: customLocationInput ? customLocationInput.value.trim() : '',
    condition: conditionSelect ? conditionSelect.value : '',
    minPrice: document.getElementById('filter-min-price') ? document.getElementById('filter-min-price').value : '',
    maxPrice: document.getElementById('filter-max-price') ? document.getElementById('filter-max-price').value : ''
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
    bindChatButtons(bookGrid);
  } catch (error) {
    bookGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    emptyState.querySelector('h3').textContent = 'Could not load books';
    emptyState.querySelector('p').textContent = 'Make sure the BookLoop server is running.';
    resultsCount.textContent = '';
  }
}
