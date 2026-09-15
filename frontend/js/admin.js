async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    const users = await res.json();
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";
    users.forEach(u => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${u.username}</td><td>${u.email}</td><td>${u.orderCount}</td><td>${new Date(u.createdAt).toLocaleString()}</td>`;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Could not load users", err);
  }
}

async function loadLogs() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/logs`);
    const logs = await res.json();
    const tbody = document.querySelector("#logsTable tbody");
    tbody.innerHTML = "";
    logs.forEach(log => {
      const row = document.createElement("tr");
      row.className = "log-row " + log.type;
      row.innerHTML = `<td>${log.time}</td><td>${log.type.toUpperCase()}</td><td>${log.message}</td>`;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Could not load logs", err);
  }
}

loadUsers();
loadLogs();
// Refresh every 5 seconds so it behaves like a live backend dashboard
setInterval(() => {
  loadUsers();
  loadLogs();
}, 5000);
