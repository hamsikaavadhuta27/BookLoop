/**
 * Sell a Book form: validate on the page, then POST to /api/books.
 * New listings appear immediately on the Browse page.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('sell-form');
  if (!form) return;

  const categorySelect = document.getElementById('sell-category');
  const branchSelect = document.getElementById('sell-branch');
  const errorBox = document.getElementById('sell-error');
  const successBox = document.getElementById('sell-success');
  let imageData = '';

  try {
    const filters = await getFilters();
    fillSelect(categorySelect, filters.data.categories.map((item) => item.name), 'Select category');
    fillSelect(document.getElementById('sell-year'), filters.data.years, 'Select year / semester');
    fillSelect(document.getElementById('sell-location'), filters.data.locations, 'Select location');
    fillSelect(document.getElementById('sell-condition'), filters.data.conditions, 'Select condition');
    window.bookloopCategories = filters.data.categories;
  } catch (error) {
    errorBox.textContent = 'Could not load form options. Start the server and refresh.';
  }

  categorySelect.addEventListener('change', () => {
    const selected = (window.bookloopCategories || []).find((item) => item.name === categorySelect.value);
    const branches = selected && selected.branches ? selected.branches : [];
    fillSelect(branchSelect, branches, branches.length ? 'Select branch / course' : 'Not applicable');
    branchSelect.disabled = branches.length === 0;
    if (!branches.length) branchSelect.value = '';
  });

  document.getElementById('sell-image').addEventListener('change', (event) => {
    const file = event.target.files[0];
    imageData = '';
    if (!file) return;
    if (file.size > 1500000) {
      errorBox.textContent = 'Please choose an image smaller than 1.5 MB.';
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      imageData = reader.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.textContent = '';

    const payload = {
      title: document.getElementById('sell-title').value.trim(),
      author: document.getElementById('sell-author').value.trim(),
      edition: document.getElementById('sell-edition').value.trim(),
      category: categorySelect.value,
      branch: branchSelect.value,
      year: document.getElementById('sell-year').value,
      condition: document.getElementById('sell-condition').value,
      price: document.getElementById('sell-price').value,
      location: document.getElementById('sell-location').value,
      description: document.getElementById('sell-description').value.trim(),
      image: imageData,
      sellerName: document.getElementById('sell-seller-name').value.trim(),
      sellerEmail: document.getElementById('sell-seller-email').value.trim(),
      sellerContact: document.getElementById('sell-seller-contact').value.trim(),
      available: true
    };

    const localError = validateSellForm(payload);
    if (localError) {
      errorBox.textContent = localError;
      return;
    }

    const fileInput = document.getElementById('sell-image');
    if (fileInput.files[0] && !imageData) {
      errorBox.textContent = 'The image is still loading. Wait a second, then post again.';
      return;
    }

    try {
      const result = await createBook(payload);
      form.classList.add('hidden');
      successBox.style.display = 'block';
      document.getElementById('new-book-link').href = 'book-details.html?id=' + encodeURIComponent(result.data.id);
    } catch (error) {
      errorBox.textContent = error.message;
    }
  });
});

function validateSellForm(data) {
  if (!data.title) return 'Please enter the book name.';
  if (!data.author) return 'Please enter the author.';
  if (!data.category) return 'Please choose a category.';
  if (!data.condition) return 'Please choose the condition.';
  if (!data.price || Number(data.price) < 1) return 'Please enter a price of at least ₹1.';
  if (!data.location) return 'Please choose a location.';
  if (!data.sellerName) return 'Please enter your name.';
  if (data.sellerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sellerEmail)) {
    return 'Please enter a valid email, or leave it blank.';
  }
  if (data.description.length > 1000) return 'Description should be under 1000 characters.';
  return '';
}
