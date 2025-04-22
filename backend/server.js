const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string for MongoDB Compass with database name advanceddb (all lowercase)
const mongoURI = 'mongodb://localhost:27017/advanceddb';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// In-memory activity log
let activityLog = [];

// Helper to add activity
function logActivity(action, item) {
  const timestamp = new Date().toISOString();
  activityLog.push({ timestamp, action, item });
  // Keep only last 100 activities
  if (activityLog.length > 100) {
    activityLog.shift();
  }
}

// CRUD Endpoints

// Create
app.post('/items', async (req, res) => {
  console.log('POST /items body:', req.body);
  try {
    if (!req.body.name) {
      throw new Error('Name field is required');
    }
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    logActivity('CREATE', savedItem);
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(400).json({ error: err.message });
  }
});

// Read all
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    logActivity('UPDATE', updatedItem);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    logActivity('DELETE', deletedItem);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get activity log
app.get('/activity', (req, res) => {
  res.json(activityLog);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
