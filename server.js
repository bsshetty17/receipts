import connectDB from './backend/config/db.js';
import receiptRoutes from './backend/routes/receiptRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const path = require('path');

//connect database
connectDB();

//dotenv config
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/build')));

//Creating API for user
app.use('/api/receipts', receiptRoutes);
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

const PORT = process.env.PORT || 5000;

//Express js listen method to run project on http://localhost:5000
app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
