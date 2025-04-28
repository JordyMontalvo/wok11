const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Mock database (replace with a real database in production)
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin'
  }
];

let products = [
  {
    id: 1,
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 249.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    description: 'Compact wireless earbuds with premium sound',
    price: 129.99,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Smartphone',
    description: 'Latest smartphone with advanced camera system',
    price: 899.99,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics'
  }
];

let orders = [];
let carts = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: 'customer' // Default role
    };
    
    users.push(newUser);
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// User routes
app.get('/api/users', authenticateToken, isAdmin, (req, res) => {
  // Return users without passwords
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    };
    
    users.push(newUser);
    
    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Product routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

// Cart routes
app.get('/api/cart', authenticateToken, (req, res) => {
  const userCart = carts.find(cart => cart.userId === req.user.id) || { userId: req.user.id, items: [] };
  res.json(userCart);
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  
  // Find the product
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // Find or create user's cart
  let userCart = carts.find(cart => cart.userId === req.user.id);
  
  if (!userCart) {
    userCart = { userId: req.user.id, items: [] };
    carts.push(userCart);
  }
  
  // Check if item is already in cart
  const existingItem = userCart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }
  
  res.json(userCart);
});

app.put('/api/cart/:productId', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  const productId = parseInt(req.params.productId);
  
  // Find user's cart
  let userCart = carts.find(cart => cart.userId === req.user.id);
  
  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Find item in cart
  const itemIndex = userCart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    userCart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    userCart.items[itemIndex].quantity = quantity;
  }
  
  res.json(userCart);
});

app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
  const productId = parseInt(req.params.productId);
  
  // Find user's cart
  let userCart = carts.find(cart => cart.userId === req.user.id);
  
  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Find item in cart
  const itemIndex = userCart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  // Remove item
  userCart.items.splice(itemIndex, 1);
  
  res.json(userCart);
});

// Order routes
app.post('/api/orders', authenticateToken, (req, res) => {
  // Find user's cart
  const userCart = carts.find(cart => cart.userId === req.user.id);
  
  if (!userCart || userCart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  
  // Calculate total
  const total = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create order
  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id,
    items: [...userCart.items],
    total,
    status: 'pending',
    createdAt: new Date()
  };
  
  orders.push(newOrder);
  
  // Clear cart
  userCart.items = [];
  
  res.status(201).json(newOrder);
});

app.get('/api/orders', authenticateToken, (req, res) => {
  // Filter orders by user ID (admin can see all orders)
  const userOrders = req.user.role === 'admin' 
    ? orders 
    : orders.filter(order => order.userId === req.user.id);
  
  res.json(userOrders);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});