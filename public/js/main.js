/**
 * Shared behaviour on every page: mobile menu, current nav highlight,
 * global Chat modal handlers, and the floating BookLoop AI Assistant.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Active nav link
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add('active');
    }
  });

  // Dynamic footer year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Page specific init
  if (page === 'home') {
    loadHomePage();
  }

  // Setup Global Chat Modal & BookLoop AI
  setupChatModalEvents();
  setupBookLoopAI();
});

/* --- Home Page Loader --- */
async function loadHomePage() {
  const categoryGrid = document.getElementById('category-grid');
  const bookGrid = document.getElementById('featured-grid');
  const locationGrid = document.getElementById('location-grid');

  try {
    const [catalog, booksResponse] = await Promise.all([getCategories(), getBooks()]);
    const categories = catalog.data;
    const books = booksResponse.data.slice(0, 8);

    if (categoryGrid) {
      renderCategoryCards(categories, 'All');

      // Category tab filter on Home page if tabs exist
      document.querySelectorAll('.category-tab-btn').forEach((tabBtn) => {
        tabBtn.addEventListener('click', () => {
          document.querySelectorAll('.category-tab-btn').forEach((b) => b.classList.remove('active'));
          tabBtn.classList.add('active');
          const type = tabBtn.dataset.type;
          renderCategoryCards(categories, type);
        });
      });
    }

    if (bookGrid) {
      bookGrid.innerHTML = books.map(bookCardHtml).join('');
      bindSaveButtons(bookGrid);
      bindChatButtons(bookGrid);
    }

    if (locationGrid) {
      const popularSpots = [
        'Koti', 'Secunderabad', 'Paradise', 'Ameerpet', 'Dilsukhnagar',
        'Kukatpally', 'Madhapur', 'Gachibowli', 'Hitech City', 'Begumpet',
        'Himayatnagar', 'Abids'
      ];
      locationGrid.innerHTML = popularSpots
        .map(
          (place) => `
            <a class="location-card" href="books.html?location=${encodeURIComponent(place)}">
              <h3>📍 ${place}</h3>
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

function renderCategoryCards(categories, filterType) {
  const categoryGrid = document.getElementById('category-grid');
  if (!categoryGrid) return;

  const filtered = filterType === 'All' 
    ? categories 
    : categories.filter((c) => c.type.toLowerCase() === filterType.toLowerCase());

  categoryGrid.innerHTML = filtered
    .map((category) => {
      const extra = category.branches && category.branches.length
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

const homeSearch = document.getElementById('home-search-form');
if (homeSearch) {
  homeSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const q = document.getElementById('home-search-input').value.trim();
    const url = q ? 'books.html?search=' + encodeURIComponent(q) : 'books.html';
    window.location.href = url;
  });
}

/* --- Global Chat Modal Events --- */
function setupChatModalEvents() {
  const chatModal = document.getElementById('chat-modal');
  const chatClose = document.getElementById('chat-close-btn');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');

  if (chatClose) {
    chatClose.addEventListener('click', closeChatModal);
  }

  if (chatModal) {
    chatModal.addEventListener('click', (e) => {
      if (e.target === chatModal) closeChatModal();
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
}

/* --- BookLoop AI Assistant Widget (Rule-based & Live Data) --- */
function setupBookLoopAI() {
  const toggleBtn = document.getElementById('ai-toggle-btn');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close-btn');
  const sendBtn = document.getElementById('ai-send-btn');
  const input = document.getElementById('ai-input');

  if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = chatWindow.style.display === 'none' || !chatWindow.style.display;
      chatWindow.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) input?.focus();
    });
  }

  if (closeBtn && chatWindow) {
    closeBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', handleAiMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAiMessage();
    });
  }

  // Quick prompt chips
  document.querySelectorAll('.ai-prompt-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      if (input) {
        input.value = promptText;
        handleAiMessage();
      }
    });
  });
}

async function handleAiMessage() {
  const input = document.getElementById('ai-input');
  const text = input?.value.trim();
  if (!text) return;

  appendAiMessage(escapeHtml(text), 'user');
  input.value = '';

  setTimeout(async () => {
    const replyHtml = await processAiQuery(text);
    appendAiMessage(replyHtml, 'bot');
  }, 400);
}

function appendAiMessage(htmlContent, sender) {
  const body = document.getElementById('ai-chat-body');
  if (!body) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-msg ${sender}`;
  msgDiv.innerHTML = htmlContent;
  body.appendChild(msgDiv);
  body.scrollTop = body.scrollHeight;
}

async function processAiQuery(query) {
  const q = query.toLowerCase();

  // 1. FAQ: How to sell a book
  if (q.includes('how to sell') || q.includes('sell a book') || q.includes('list a book')) {
    return `
      To sell a book on BookLoop:
      <ol style="margin: 6px 0 6px 16px; font-size: 0.8rem;">
        <li>Go to <a href="sell.html" style="font-weight: bold; color: var(--teal-dark);">Sell a Book</a>.</li>
        <li>Enter book details, price, condition, and pickup spot.</li>
        <li>Submit! Interested students will reach out to you via private chat.</li>
      </ol>
      <a class="ai-book-action-btn" href="sell.html">Post a Listing</a>
    `;
  }

  // 2. FAQ: How to buy or message sellers
  if (q.includes('how to buy') || q.includes('contact seller') || q.includes('message seller')) {
    return `
      To buy a book:
      <ol style="margin: 6px 0 6px 16px; font-size: 0.8rem;">
        <li>Search or browse in <a href="books.html" style="font-weight: bold;">Browse Books</a>.</li>
        <li>Click <strong>"View Details"</strong> or <strong>"Message"</strong>.</li>
        <li>Coordinate a safe meeting spot (e.g. Hyderabad metro stations or college gates).</li>
      </ol>
      <em>Tip: Inspect book pages before paying!</em>
    `;
  }

  // 3. FAQ: Categories
  if (q.includes('categories') || q.includes('what books') || q.includes('genres')) {
    return `
      We support:
      <ul style="margin: 4px 0 4px 16px; font-size: 0.8rem;">
        <li><strong>Academic:</strong> B.Tech (CSE, ECE, Civil, etc.), MBBS, Intermediate, Degree, PG, GATE/UPSC.</li>
        <li><strong>Non-Academic:</strong> Devotional, Mystery, Fiction, Self-Help, Fantasy, Biography.</li>
      </ul>
      <a class="ai-book-action-btn" href="books.html">Browse All</a>
    `;
  }

  // 4. Live search against the backend API
  try {
    const booksResponse = await getBooks();
    const allBooks = booksResponse.data || [];

    let maxPrice = Infinity;
    const priceMatch = q.match(/(?:under|below|less than|<|within|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) || q.match(/(\d+)\s*(?:rs|rupees|inr)/i);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
    }

    const hydLocations = [
      'koti', 'secunderabad', 'paradise', 'ameerpet', 'dilsukhnagar', 'kukatpally',
      'madhapur', 'gachibowli', 'kondapur', 'hitech city', 'begumpet', 'abids'
    ];
    const matchedLoc = hydLocations.find(l => q.includes(l));
    const branches = ['cse', 'ece', 'eee', 'it', 'mechanical', 'civil', 'ai/ml', 'data science'];
    const matchedBranch = branches.find(b => q.includes(b));
    const genres = ['fiction', 'mystery', 'devotional', 'self-help', 'fantasy', 'maths', 'java', 'dbms', 'os', 'gate'];
    const matchedGenre = genres.find(g => q.includes(g));

    const matches = allBooks.filter((book) => {
      if (maxPrice !== Infinity && book.price > maxPrice) return false;
      if (matchedLoc && book.location && !book.location.toLowerCase().includes(matchedLoc)) return false;
      if (matchedBranch && book.branch && !book.branch.toLowerCase().includes(matchedBranch)) return false;
      if (matchedGenre) {
        const fullText = `${book.title} ${book.category} ${book.description}`.toLowerCase();
        if (!fullText.includes(matchedGenre)) return false;
      }
      if (!priceMatch && !matchedLoc && !matchedBranch && !matchedGenre) {
        const words = q.split(' ').filter((w) => w.length > 2);
        return words.some((w) => 
          book.title.toLowerCase().includes(w) || 
          book.author.toLowerCase().includes(w) || 
          book.category.toLowerCase().includes(w)
        );
      }
      return true;
    });

    if (matches.length > 0) {
      const top = matches.slice(0, 3);
      const itemsHtml = top.map((b) => `
        <div class="ai-book-recommendation">
          <strong>${escapeHtml(b.title)}</strong>
          <span>${formatPrice(b.price)} · ${escapeHtml(b.condition)} · 📍 ${escapeHtml(b.location)}</span>
          <br>
          <a class="ai-book-action-btn" href="book-details.html?id=${encodeURIComponent(b.id)}">View Details</a>
        </div>
      `).join('');

      return `
        Found <strong>${matches.length}</strong> matching ${matches.length === 1 ? 'book' : 'books'}:
        ${itemsHtml}
      `;
    }
  } catch (err) {
    console.error('AI query error:', err);
  }

  return `
    I couldn't find books matching that right now. Try:
    <ul style="margin: 4px 0 4px 16px; font-size: 0.8rem;">
      <li>Asking for <em>"CSE books under ₹400 in Kukatpally"</em></li>
      <li>Searching for <em>"Java"</em>, <em>"DBMS"</em>, or <em>"Sherlock"</em></li>
      <li>Asking <em>"How do I sell a book?"</em></li>
    </ul>
  `;
}
