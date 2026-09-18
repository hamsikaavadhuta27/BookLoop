/**
 * Login / signup / profile UI only.
 *
 * These forms do NOT log you in and do NOT store passwords.
 * Real authentication will use Node.js + MongoDB in a later phase.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      showAuthMessage('login-message');
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      showAuthMessage('signup-message');
    });
  }
});

function showAuthMessage(id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.classList.remove('hidden');
  box.textContent =
    'Accounts are not connected yet. This screen is only the design. Signup, login, and passwords will be added with the backend later — they are not saved now.';
}
