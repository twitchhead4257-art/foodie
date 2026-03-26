import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Contact form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
