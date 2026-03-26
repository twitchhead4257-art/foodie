import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';

dotenv.config();

const seedData = async () => {
  const count = await Food.countDocuments();
  if (count === 0) {
    const sampleFoods = [
      {
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and cheese.",
        price: 10,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        category: "Burgers"
      },
      {
        name: "Pepperoni Pizza",
        description: "Freshly baked pizza with spicy pepperoni and mozzarella.",
        price: 15,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        category: "Pizza"
      },
      {
        name: "Pasta Carbonara",
        description: "Creamy pasta with bacon and parmesan cheese.",
        price: 12,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
        category: "Pasta"
      }
    ];
    await Food.insertMany(sampleFoods);
    console.log('Sample food data seeded!');
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('****************************************************************');
    console.error('ERROR: MONGODB_URI is missing.');
    console.error('Please provide a valid MongoDB connection string in the .env file.');
    console.error('For local development: MONGODB_URI="mongodb://localhost:27017/foodie"');
    console.error('For MongoDB Atlas: Get the connection string from your Atlas dashboard.');
    console.error('****************************************************************');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedData();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default connectDB;
