const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { PassesCategory } = require('../src/modules/content/content.model.js');

dotenv.config();


const newPassCategories = [
  {
    "id": "day1",
    "name": "Day 1 Pass",
    "price": 300,
    "benefits": [
      "Access to all Day 1 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Refreshments"
    ],
    "soldOut": false,
    "tags": "Day 1 Only"
  },
  {
    "id": "day2",
    "name": "Day 2 Pass",
    "price": 500,
    "benefits": [
      "Access to all Day 2 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Refreshments"
    ],
    "soldOut": false,
    "tags": "Day 2 Only"
  },
  {
    "id": "both-days",
    "name": "Both Days Pass",
    "price": 800,
    "benefits": [
      "Access to all Day 1 & Day 2 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Refreshments",
      "Networking opportunities"
    ],
    "soldOut": false,
    "tags": "Best Value"
  },
  {
    "id": "day1-accom",
    "name": "Day 1 + Accommodation",
    "price": 700,
    "benefits": [
      "Access to all Day 1 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Hostel stay (Night 1)",
      "Mess meals included"
    ],
    "soldOut": false,
    "tags": "With Stay"
  },
  {
    "id": "day2-accom",
    "name": "Day 2 + Accommodation",
    "price": 800,
    "benefits": [
      "Access to all Day 2 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Hostel stay (Night 2)",
      "Mess meals included"
    ],
    "soldOut": false,
    "tags": "With Stay"
  },
  {
    "id": "both-days-accom",
    "name": "Both Days + Accommodation",
    "price": 1500,
    "benefits": [
      "Access to all Day 1 & Day 2 events",
      "Keynotes & sessions",
      "Expo floor access",
      "Hostel stay (Night 1 & Night 2)",
      "Mess meals included",
      "Networking opportunities"
    ],
    "soldOut": false,
    "tags": "Premium"
  }
];

const seedPassCategories = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    await PassesCategory.deleteMany({});
    console.log('Cleared existing pass categories.');

    await PassesCategory.insertMany(newPassCategories);
    console.log('Successfully seeded new pass categories.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedPassCategories();
