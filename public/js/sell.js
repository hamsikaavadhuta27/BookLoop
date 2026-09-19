/**
 * Sell a Book form: validate on the page, then POST to /api/books.
 * New listings appear immediately on the Browse page.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('sell-form');
  if (!form) return;

  const categorySelect = document.getElementById('sell-category');
  const branchSelect = document.getElementById('sell-branch');
  const yearSelect = document.getElementById('sell-year');
  const locationSelect = document.getElementById('sell-location');
  const conditionSelect = document.getElementById('sell-condition');
  
  const customBranchInput = document.getElementById('sell-custom-branch');
  const customYearInput = document.getElementById('sell-custom-year');
  const customLocationInput = document.getElementById('sell-custom-location');

  const errorBox = document.getElementById('sell-error');
  const successBox = document.getElementById('sell-success');
  let imageData = '';

  try {
    const filters = await getFilters();
    window.bookloopCategories = filters.data.categories;

    // Populate Category dropdown with optgroups
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Select category</option>';
      const academicGroup = document.createElement('optgroup');
      academicGroup.label = '── Educational / Academic ──';
      const nonAcademicGroup = document.createElement('optgroup');
      nonAcademicGroup.label = '── Non-Academic / General ──';

      window.bookloopCategories.forEach((cat) => {
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

    fillSelect(yearSelect, filters.data.years, 'Select year / semester');
    fillSelect(locationSelect, filters.data.locations, 'Select location');
    fillSelect(conditionSelect, filters.data.conditions, 'Select condition');
  } catch (error) {
    errorBox.textContent = 'Could not load form options. Start the server and refresh.';
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const selected = (window.bookloopCategories || []).find((item) => item.name === categorySelect.value);
      const branches = selected && selected.branches && selected.branches.length ? selected.branches : [];
      if (branches.length > 0) {
        fillSelect(branchSelect, branches, 'Select branch / course');
        branchSelect.disabled = false;
      } else {
        fillSelect(branchSelect, ['Other'], 'Not applicable / Other');
        branchSelect.disabled = false;
      }
      handleSellOtherFields();
    });
  }

  function handleSellOtherFields() {
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

  branchSelect?.addEventListener('change', handleSellOtherFields);
  yearSelect?.addEventListener('change', handleSellOtherFields);
  locationSelect?.addEventListener('change', handleSellOtherFields);

  document.getElementById('sell-image')?.addEventListener('change', (event) => {
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

    let branchVal = branchSelect ? branchSelect.value : '';
    if (branchVal === 'Other' && customBranchInput && customBranchInput.value.trim()) {
      branchVal = customBranchInput.value.trim();
    }

    let yearVal = yearSelect ? yearSelect.value : '';
    if (yearVal === 'Other' && customYearInput && customYearInput.value.trim()) {
      yearVal = customYearInput.value.trim();
    }

    let locationVal = locationSelect ? locationSelect.value : '';
    if (locationVal === 'Other' && customLocationInput && customLocationInput.value.trim()) {
      locationVal = customLocationInput.value.trim();
    }

    const payload = {
      title: document.getElementById('sell-title').value.trim(),
      author: document.getElementById('sell-author').value.trim(),
      edition: document.getElementById('sell-edition').value.trim(),
      category: categorySelect ? categorySelect.value : '',
      branch: branchVal,
      year: yearVal,
      condition: conditionSelect ? conditionSelect.value : '',
      price: document.getElementById('sell-price').value,
      location: locationVal,
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
    if (fileInput && fileInput.files[0] && !imageData) {
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
  if (!data.location) return 'Please choose or enter a location.';
  if (!data.sellerName) return 'Please enter your name.';
  if (data.sellerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sellerEmail)) {
    return 'Please enter a valid email, or leave it blank.';
  }
  if (data.description && data.description.length > 1000) return 'Description should be under 1000 characters.';
  return '';
}
