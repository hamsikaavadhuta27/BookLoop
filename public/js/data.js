/**
 * Small helpers used by more than one page.
 * Saved books are stored in the browser only (not a real user account yet).
 */

const SAVED_KEY = 'bookloop-saved';

function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function isSaved(id) {
  return getSavedIds().includes(String(id));
}

function toggleSaved(id) {
  const saved = getSavedIds();
  const key = String(id);
  const next = saved.includes(key) ? saved.filter((item) => item !== key) : saved.concat(key);
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next.includes(key);
}

function availabilityLabel(available) {
  return available ? 'Available' : 'Sold / unavailable';
}

function bookCardHtml(book) {
  const saved = isSaved(book.id);
  return `
    <article class="book-card">
      <div class="book-cover">
        <img src="${book.image}" alt="${escapeHtml(book.title)} cover">
      </div>
      <div class="book-body">
        <h3>${escapeHtml(book.title)}</h3>
        <p class="meta">${escapeHtml(book.author)} · ${escapeHtml(book.edition || 'Edition n/a')}</p>
        <div class="chip-row">
          <span class="chip">${escapeHtml(book.category)}</span>
          ${book.branch ? `<span class="chip">${escapeHtml(book.branch)}</span>` : ''}
          ${book.year ? `<span class="chip">${escapeHtml(book.year)}</span>` : ''}
          <span class="chip">${escapeHtml(book.condition)}</span>
        </div>
        <p class="price">${formatPrice(book.price)}</p>
        <p class="meta">${escapeHtml(book.location)} · Seller: ${escapeHtml(book.seller.name)}</p>
        <p class="availability ${book.available ? 'in' : 'out'}">${availabilityLabel(book.available)}</p>
        <div class="card-actions">
          <a class="btn btn-primary" href="book-details.html?id=${encodeURIComponent(book.id)}">View Details</a>
          <button class="btn btn-ghost save-btn" type="button" data-id="${escapeHtml(book.id)}">${saved ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bindSaveButtons(root) {
  root.querySelectorAll('.save-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const saved = toggleSaved(button.dataset.id);
      button.textContent = saved ? 'Saved' : 'Save';
    });
  });
}

function fillSelect(select, options, placeholder) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = '';
  const first = document.createElement('option');
  first.value = '';
  first.textContent = placeholder;
  select.appendChild(first);
  options.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
  if (current) select.value = current;
}
