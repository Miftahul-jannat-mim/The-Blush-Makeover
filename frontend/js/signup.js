document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Frontend validation (fast feedback before even calling the backend)
  if (password.length < 8 || password.length > 16) {
    showMessage("signupMsg", "Password must be between 8 and 16 characters.", "error");
    return;
  }
  if (password !== confirmPassword) {
    showMessage("signupMsg", "Passwords do not match.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();

    if (data.success) {
      // This exact message is also printed on the backend server console
      // and saved into logs.json, viewable on the Admin page.
      showMessage("signupMsg", data.message + " You can now log in.", "success");
      document.getElementById("signupForm").reset();
    } else {
      showMessage("signupMsg", data.message, "error");
    }
  } catch (err) {
    showMessage("signupMsg", "Could not reach the server. Is the backend running?", "error");
  }
});
