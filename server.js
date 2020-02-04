const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', require('./features/users/routes'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
