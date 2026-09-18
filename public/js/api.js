/**
 * Talks to the BookLoop Express API.
 * If the server is running, these fetch() calls load live data.
 */

async function apiGet(path) {
  const response = await fetch(path);
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

async function apiPost(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

function getBooks(params) {
  const query = new URLSearchParams();
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, value);
    }
  });
  const suffix = query.toString() ? '?' + query.toString() : '';
  return apiGet('/api/books' + suffix);
}

function getBook(id) {
  return apiGet('/api/books/' + encodeURIComponent(id));
}

function createBook(body) {
  return apiPost('/api/books', body);
}

function getFilters() {
  return apiGet('/api/filters');
}

function getCategories() {
  return apiGet('/api/categories');
}
