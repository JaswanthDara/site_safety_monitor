const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/safety', require('./routes/safetyRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/hazard', require('./routes/hazardRoutes'));
app.use('/api/sites', require('./routes/SiteRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));


// Start the server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// Export app for testing or other uses
module.exports = app;
