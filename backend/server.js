require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const requestRoutes = require('./routes/requestRoutes');
const consentRoutes = require('./routes/consentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/requests', requestRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// Central error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });