/**
 * Book details page.
 * The selected book id comes from the URL: book-details.html?id=sample-1
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const root = document.getElementById('details-root');

  if (!id) {
    root.innerHTML = '<div class="empty-state"><h2>No book selected</h2><p>Go back to Browse Books and choose a listing.</p></div>';
    return;
  }

  try {
    const response = await getBook(id);
    const book = response.data;
    const saved = isSaved(book.id);

    root.innerHTML = `
      <div class="details-grid">
        <div class="details-cover">
          <img src="${book.image}" alt="${escapeHtml(book.title)} cover">
        </div>
        <div class="details-panel">
          <p class="eyebrow">${escapeHtml(book.category)}${book.branch ? ' · ' + escapeHtml(book.branch) : ''}</p>
          <h1>${escapeHtml(book.title)}</h1>
          <p class="meta">${escapeHtml(book.author)} · ${escapeHtml(book.edition || 'Edition not specified')}</p>
          <p class="price">${formatPrice(book.price)}</p>
          <p class="availability ${book.available ? 'in' : 'out'}">${availabilityLabel(book.available)}</p>
          <div class="chip-row">
            <span class="chip">${escapeHtml(book.condition)}</span>
            <span class="chip">${escapeHtml(book.year || 'Year n/a')}</span>
            <span class="chip">${escapeHtml(book.location)}</span>
          </div>
          <h2>About this book</h2>
          <p>${escapeHtml(book.description || 'No description added.')}</p>
          <div class="panel seller-box">
            <h3>Seller</h3>
            <p><strong>${escapeHtml(book.seller.name)}</strong></p>
            <p class="meta">${escapeHtml(book.seller.email || 'Email hidden until chat is built')}</p>
            <p class="meta">${escapeHtml(book.seller.contact || '')}</p>
          </div>
          <div class="card-actions">
            <button class="btn btn-ghost" id="save-detail" type="button">${saved ? 'Saved' : 'Save Book'}</button>
            <a class="btn btn-primary" id="contact-seller" href="${book.seller.email ? 'mailto:' + encodeURIComponent(book.seller.email) + '?subject=' + encodeURIComponent('BookLoop: ' + book.title) : '#'}">Contact Seller</a>
          </div>
          <p class="notice info">In-app chat, pickup details, and price negotiation will be added in a later phase. For now you can email the seller if they shared an address.</p>
        </div>
      </div>
    `;

    document.getElementById('save-detail').addEventListener('click', (event) => {
      const nowSaved = toggleSaved(book.id);
      event.target.textContent = nowSaved ? 'Saved' : 'Save Book';
    });

    document.getElementById('contact-seller').addEventListener('click', (event) => {
      if (!book.seller.email) {
        event.preventDefault();
        alert('Chat is a future feature. This seller did not add an email.');
      }
    });
  } catch (error) {
    root.innerHTML = '<div class="empty-state"><h2>Book not found</h2><p>That listing may have been removed.</p><p><a href="books.html">Back to books</a></p></div>';
  }
});
