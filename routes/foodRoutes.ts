import express from 'express';
import Food from '../models/Food.ts';
import { authMiddleware, adminMiddleware } from '../middleware/auth.ts';

const router = express.Router();

// Get all foods
router.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add food (Admin only)
router.post('/addFood', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const newFood = new Food({ name, description, price, image, category });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit food (Admin only)
router.put('/editFood/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category },
      { new: true }
    );
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food (Admin only)
router.delete('/deleteFood/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
