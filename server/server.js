const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const templateRoutes = require('./routes/templates');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://custom-math-worksheet-generator.vercel.app'
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB Atlas with detailed error logging
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
}).then(() => {
  console.log(`Connected to MongoDB Atlas successfully in ${process.env.NODE_ENV} mode`);
}).catch((err) => {
  console.error('MongoDB Atlas Connection Error:');
  console.error('Error:', err.message);
  console.error('Full error:', err);
  if (err.name === 'MongoNetworkError') {
    console.error('This might be an IP whitelist issue - please check Network Access in Atlas');
  }
  process.exit(1);
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/templates', templateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 