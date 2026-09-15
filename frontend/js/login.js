document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      showMessage("loginMsg", data.message, "success");
      saveSession(data.user);
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } else {
      // Wrong password / no account -> shown here in red AND
      // logged on the backend server console + Admin page.
      showMessage("loginMsg", data.message, "error");
    }
  } catch (err) {
    showMessage("loginMsg", "Could not reach the server. Is the backend running?", "error");
  }
});
