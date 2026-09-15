// IMPORTANT: After you deploy the backend (e.g. on Render), replace this
// with your live backend URL, e.g. "https://your-app-name.onrender.com"
const API_BASE_URL = "http://localhost:5000";

// Shows a message box under a form (green for success, red for error)
function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = "msg " + type; // "success" or "error"
}

// Adds a show/hide eye button next to a password field
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (input.type === "password") {
    input.type = "text";
    btn.textContent = "Hide";
  } else {
    input.type = "password";
    btn.textContent = "Show";
  }
}

// Simple helper to store/read the logged-in user in the browser (sessionStorage)
function saveSession(user) {
  sessionStorage.setItem("salonUser", JSON.stringify(user));
}
function getSession() {
  const raw = sessionStorage.getItem("salonUser");
  return raw ? JSON.parse(raw) : null;
}
function clearSession() {
  sessionStorage.removeItem("salonUser");
}
