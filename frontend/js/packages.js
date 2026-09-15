const currentUser = getSession();

document.getElementById("statusNote").textContent = currentUser
  ? `Logged in as ${currentUser.email}. ${currentUser.orderCount > 0 ? "You get 5% off as a returning customer!" : ""}`
  : "Please log in to select a package.";

async function placeOrder(packageName, price) {
  if (!currentUser) {
    showMessage("orderMsg", "Please log in before placing an order.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email, package: packageName, price })
    });
    const data = await res.json();

    if (data.success) {
      // "Package selected" and "Order placed" are both logged on the
      // backend (server console + Admin page) at the same time.
      const discountText = data.isOldCustomer ? ` (5% loyalty discount applied)` : "";
      showMessage(
        "orderMsg",
        `${packageName} booked! Total: Rs.${data.finalPrice}${discountText}`,
        "success"
      );
      currentUser.orderCount += 1;
      saveSession(currentUser);
    } else {
      showMessage("orderMsg", data.message, "error");
    }
  } catch (err) {
    showMessage("orderMsg", "Could not reach the server.", "error");
  }
}
