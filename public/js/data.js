/**
 * Small helpers used by more than one page.
 * Saved books & private chat messages are stored in the browser.
 */

const SAVED_KEY = 'bookloop-saved';
const CHAT_STORAGE_PREFIX = 'bookloop_chat_';

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
  const sellerName = book.seller && book.seller.name ? book.seller.name : 'Student';
  const location = book.location || 'Hyderabad';

  return `
    <article class="book-card" data-id="${escapeHtml(book.id)}">
      <div class="book-cover">
        <img src="${book.image || '/images/placeholder.svg'}" alt="${escapeHtml(book.title)} cover" onerror="this.onerror=null;this.src='/images/placeholder.svg';">
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
        <p class="meta">${escapeHtml(location)} · Seller: ${escapeHtml(sellerName)}</p>
        <p class="availability ${book.available ? 'in' : 'out'}">${availabilityLabel(book.available)}</p>
        <div class="card-actions">
          <a class="btn btn-primary" href="book-details.html?id=${encodeURIComponent(book.id)}">View Details</a>
          <button class="btn btn-chat-seller chat-btn" type="button" 
            data-id="${escapeHtml(book.id)}" 
            data-title="${escapeHtml(book.title)}" 
            data-seller="${escapeHtml(sellerName)}"
            data-location="${escapeHtml(location)}">
            💬 Message
          </button>
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
  if (!root) return;
  root.querySelectorAll('.save-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const saved = toggleSaved(button.dataset.id);
      button.textContent = saved ? 'Saved' : 'Save';
    });
  });
}

function bindChatButtons(root) {
  if (!root) return;
  root.querySelectorAll('.chat-btn').forEach((button) => {
    button.addEventListener('click', () => {
      openChatModal(
        button.dataset.id,
        button.dataset.title,
        button.dataset.seller,
        button.dataset.location
      );
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

// Global Chat Modal Manager
let currentChatBook = null;

function openChatModal(bookId, bookTitle, sellerName, location) {
  currentChatBook = { id: bookId, title: bookTitle, sellerName: sellerName, location: location };
  const modal = document.getElementById('chat-modal');
  const titleEl = document.getElementById('chat-book-title');
  const sellerEl = document.getElementById('chat-seller-name');

  if (titleEl) titleEl.textContent = bookTitle || 'Book Chat';
  if (sellerEl) sellerEl.textContent = `Seller: ${sellerName || 'Student'} (📍 ${location || 'Hyderabad'})`;

  loadChatMessages(bookId);
  if (modal) modal.style.display = 'flex';

  setTimeout(() => {
    document.getElementById('chat-input')?.focus();
  }, 100);
}

function closeChatModal() {
  const modal = document.getElementById('chat-modal');
  if (modal) modal.style.display = 'none';
}

function loadChatMessages(bookId) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const chatKey = CHAT_STORAGE_PREFIX + bookId;
  const rawData = localStorage.getItem(chatKey);
  let messages = [];

  if (rawData) {
    try {
      messages = JSON.parse(rawData);
    } catch (e) {
      console.error(e);
    }
  } else {
    // Initial greeting from seller
    const defaultMsg = {
      sender: 'seller',
      text: `Hi! Thanks for reaching out about "${currentChatBook?.title}". It's available for pickup in ${currentChatBook?.location || 'Hyderabad'}. When would you like to meet?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages = [defaultMsg];
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }

  renderChatMessages(messages);
}

function renderChatMessages(messages) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = messages.map((msg) => `
    <div class="chat-bubble ${msg.sender === 'user' ? 'sent' : 'received'}">
      <div>${escapeHtml(msg.text)}</div>
      <span class="chat-timestamp">${escapeHtml(msg.time)}</span>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !currentChatBook) return;

  const text = input.value.trim();
  if (!text) return;

  const chatKey = CHAT_STORAGE_PREFIX + currentChatBook.id;
  const rawData = localStorage.getItem(chatKey);
  let messages = rawData ? JSON.parse(rawData) : [];

  const userMsg = {
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  messages.push(userMsg);
  localStorage.setItem(chatKey, JSON.stringify(messages));
  input.value = '';
  renderChatMessages(messages);

  // Simulated seller reply for prototype interaction
  setTimeout(() => {
    const replies = [
      `Sounds good! I'm available near ${currentChatBook.location} metro station or campus gate. Let me know what time works best.`,
      `Yes, the book is in good condition as described. You can check it thoroughly before paying!`,
      `Great, feel free to share your phone or WhatsApp number to coordinate the meetup easily.`
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    const sellerMsg = {
      sender: 'seller',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.push(sellerMsg);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    renderChatMessages(messages);
  }, 1200);
}
