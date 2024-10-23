const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Model
const Operation = require('./models/Operation');

// Route to add new operation
app.post('/api/operation', async (req, res) => {
  const { expression, result } = req.body;
  try {
    const newOperation = new Operation({ expression, result });
    await newOperation.save();
    res.status(201).json(newOperation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all operations
app.get('/api/operations', async (req, res) => {
  try {
    const operations = await Operation.find().sort({ createdAt: -1 });
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
