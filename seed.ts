import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';

dotenv.config();

const sampleFoods = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500',
    category: 'Pizza'
  },
  {
    name: 'Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, and tomato.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    category: 'Burger'
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with pancetta, egg, and parmesan cheese.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
    category: 'Pasta'
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with croutons and Caesar dressing.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500',
    category: 'Salad'
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a gooey molten center.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62adda51?w=500',
    category: 'Dessert'
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is missing!');
      return;
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing foods
    await Food.deleteMany({});
    console.log('Cleared existing foods.');

    // Insert sample foods
    await Food.insertMany(sampleFoods);
    console.log('Sample foods added successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDB();
