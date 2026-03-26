import express from 'express';
import Order from '../models/Order.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Place order
router.post('/order', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { items, totalAmount, address, phone } = req.body;
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      address,
      phone
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/myOrders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
