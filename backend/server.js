require('dotenv').config();
const { validateEnv } = require('./src/config/validateEnv');
const app = require('./src/app');
const connectDB = require('./src/config/db');

validateEnv();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('[START]', err.message || err);
    process.exit(1);
  }
};

start();
