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
    const sellerName = book.seller && book.seller.name ? book.seller.name : 'Student';
    const location = book.location || 'Hyderabad';

    root.innerHTML = `
      <div class="details-grid">
        <div class="details-cover">
          <img src="${book.image || '/images/placeholder.svg'}" alt="${escapeHtml(book.title)} cover" onerror="this.onerror=null;this.src='/images/placeholder.svg';">
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
            <span class="chip">${escapeHtml(location)}</span>
          </div>
          <h2>About this book</h2>
          <p>${escapeHtml(book.description || 'No description added by seller.')}</p>
          <div class="panel seller-box">
            <h3>Seller Information</h3>
            <p><strong>${escapeHtml(sellerName)}</strong></p>
            <p class="meta">📍 Pickup Location: <strong>${escapeHtml(location)}</strong></p>
            ${book.seller && book.seller.email ? `<p class="meta">Email: ${escapeHtml(book.seller.email)}</p>` : ''}
            ${book.seller && book.seller.contact ? `<p class="meta">Contact: ${escapeHtml(book.seller.contact)}</p>` : ''}
          </div>
          <div class="card-actions" style="margin-top: 18px;">
            <button class="btn btn-primary" id="message-seller-btn" type="button">
              💬 Message Seller Privately
            </button>
            <button class="btn btn-ghost" id="save-detail" type="button">${saved ? 'Saved' : 'Save Book'}</button>
          </div>
          <p class="notice info" style="margin-top: 16px;">🔒 In-app private chat is active. Click <strong>Message Seller</strong> above to coordinate a safe meetup spot in Hyderabad.</p>
        </div>
      </div>
    `;

    document.getElementById('save-detail').addEventListener('click', (event) => {
      const nowSaved = toggleSaved(book.id);
      event.target.textContent = nowSaved ? 'Saved' : 'Save Book';
    });

    document.getElementById('message-seller-btn').addEventListener('click', () => {
      openChatModal(book.id, book.title, sellerName, location);
    });
  } catch (error) {
    root.innerHTML = '<div class="empty-state"><h2>Book not found</h2><p>That listing may have been removed.</p><p><a href="books.html">Back to books</a></p></div>';
  }
});
