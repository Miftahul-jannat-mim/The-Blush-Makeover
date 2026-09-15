const user = getSession();
if (!user) {
  window.location.href = "login.html";
}

document.getElementById("uName").textContent = user.username;
document.getElementById("uEmail").textContent = user.email;
document.getElementById("uOrders").textContent = user.orderCount;
document.getElementById("discountNote").textContent =
  user.orderCount > 0
    ? "You are a returning customer - you get 5% off your next order!"
    : "Place your first order to unlock 5% off future bookings.";

document.getElementById("logoutLink").addEventListener("click", (e) => {
  e.preventDefault();
  clearSession();
  window.location.href = "login.html";
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
  const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone.");
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/account/${encodeURIComponent(user.email)}`, {
      method: "DELETE"
    });
    const data = await res.json();

    if (data.success) {
      // "Account deleted successfully" is also logged on the backend/admin page
      showMessage("dashMsg", data.message, "success");
      clearSession();
      setTimeout(() => (window.location.href = "index.html"), 1200);
    } else {
      showMessage("dashMsg", data.message, "error");
    }
  } catch (err) {
    showMessage("dashMsg", "Could not reach the server.", "error");
  }
});
