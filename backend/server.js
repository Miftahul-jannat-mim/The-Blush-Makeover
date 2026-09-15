const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');
const LOG_FILE = path.join(__dirname, 'logs.json');

// ---------- Helper functions (simple file-based "database") ----------
function readDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
function readLogs() {
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
  return JSON.parse(fs.readFileSync(LOG_FILE));
}
// Every important event is written here AND printed in the server terminal.
// This is what "showing in the backend" means for this project.
function addLog(type, message) {
  const logs = readLogs();
  const entry = { type, message, time: new Date().toLocaleString() };
  logs.unshift(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 200), null, 2));
  console.log(`[${entry.time}] [${type.toUpperCase()}] ${message}`);
}

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 16;

// ---------- SIGN UP ----------
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    addLog('error', `Signup failed - missing fields (email: ${email || 'N/A'})`);
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    addLog('error', `Signup failed - password length invalid for ${email}`);
    return res.status(400).json({
      success: false,
      message: `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`
    });
  }

  const db = readDB();
  if (db.users.find(u => u.email === email)) {
    addLog('error', `Signup failed - account already exists for ${email}`);
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    username,
    email,
    password: hashedPassword,
    orderCount: 0,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDB(db);

  addLog('success', `Account created successfully for ${email}`);
  res.json({ success: true, message: 'Account created successfully' });
});

// ---------- LOGIN ----------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    addLog('error', `Login failed - no account found for ${email}`);
    return res.status(404).json({ success: false, message: 'No account found with this email' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (!passwordMatches) {
    addLog('error', `Login failed - wrong password entered for ${email}`);
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  addLog('success', `${email} logged in successfully`);
  res.json({
    success: true,
    message: 'Login successful',
    user: { username: user.username, email: user.email, orderCount: user.orderCount }
  });
});

// ---------- DELETE ACCOUNT ----------
app.delete('/api/account/:email', (req, res) => {
  const { email } = req.params;
  const db = readDB();
  const index = db.users.findIndex(u => u.email === email);

  if (index === -1) {
    addLog('error', `Delete failed - account not found for ${email}`);
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  db.users.splice(index, 1);
  writeDB(db);

  addLog('success', `Account deleted successfully for ${email}`);
  res.json({ success: true, message: 'Account deleted successfully' });
});

// ---------- PLACE ORDER (packages + 5% old-customer discount) ----------
app.post('/api/order', (req, res) => {
  const { email, package: packageName, price } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    addLog('error', `Order failed - account not found for ${email}`);
    return res.status(404).json({ success: false, message: 'Please login before placing an order' });
  }

  const isOldCustomer = user.orderCount > 0; // has ordered before
  const discountPercent = isOldCustomer ? 5 : 0;
  const finalPrice = Math.round(price - (price * discountPercent) / 100);

  user.orderCount += 1;
  writeDB(db);

  addLog('success', `Package selected: "${packageName}" by ${email}`);
  addLog(
    'success',
    `Order placed by ${email} - Package: ${packageName}, Total: Rs.${finalPrice}${isOldCustomer ? ' (5% old customer discount applied)' : ''}`
  );

  res.json({
    success: true,
    message: 'Order placed successfully',
    isOldCustomer,
    discountPercent,
    finalPrice
  });
});

// ---------- GET LOGS (used by the admin/backend panel page) ----------
app.get('/api/logs', (req, res) => {
  res.json(readLogs());
});

// ---------- GET ALL USERS (admin view) ----------
app.get('/api/users', (req, res) => {
  const db = readDB();
  const safeUsers = db.users.map(u => ({
    username: u.username,
    email: u.email,
    orderCount: u.orderCount,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The Blush Makeover backend running on port ${PORT}`));
