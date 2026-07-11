require('dotenv').config();
const express = require('express');
const cors = require('cors');

const csvRoutes = require('./routes/csvRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Only allow your Next.js frontend
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Routes
app.use('/api/csv', csvRoutes);

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});