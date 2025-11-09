const dotenv = require("dotenv");
const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const { verifyToken } = require('./middleware/auth');
const cors = require('cors');
const {connectDB} = require('./config/db.js')
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', verifyToken, userRoutes);
app.use('/api/admin', verifyToken, adminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  