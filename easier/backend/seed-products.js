const mongoose = require('mongoose');
const Product = require('./Models/Product');
require('dotenv').config();

const products = [
  {
    name: "6kg Total",
    description: "Portable 6kg gas cylinder, perfect for small families and camping",
    price: 1800,
    refillPrice: 1200,
    brand: "Total",
    cylinderSize: "6kg",
    stockQuantity: 50,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Portable Design", "Leak-proof valve"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "13kg Total",
    description: "Standard 13kg gas cylinder for household use",
    price: 3200,
    refillPrice: 2200,
    brand: "Total",
    cylinderSize: "13kg",
    stockQuantity: 100,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Long-lasting", "Pressure relief device"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "50kg Total",
    description: "Large 50kg gas cylinder for commercial use",
    price: 10500,
    refillPrice: 7500,
    brand: "Total",
    cylinderSize: "50kg",
    stockQuantity: 25,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Commercial Grade", "Industrial safety"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "6kg K-gas",
    description: "Compact 6kg gas cylinder, ideal for small families",
    price: 1750,
    refillPrice: 1150,
    brand: "K-gas",
    cylinderSize: "6kg",
    stockQuantity: 75,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Compact Design", "Easy handling"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "13kg K-gas",
    description: "Most popular 13kg gas cylinder size",
    price: 3100,
    refillPrice: 2100,
    brand: "K-gas",
    cylinderSize: "13kg",
    stockQuantity: 150,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Most Popular", "Reliable performance"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "50kg K-gas",
    description: "Large 50kg gas cylinder for vehicles and commercial use",
    price: 12000,
    refillPrice: 8500,
    brand: "K-gas",
    cylinderSize: "50kg",
    stockQuantity: 30,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Vehicle Compatible", "High capacity"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "6kg Pro-gas",
    description: "Budget-friendly 6kg gas cylinder",
    price: 1700,
    refillPrice: 1100,
    brand: "Pro-gas",
    cylinderSize: "6kg",
    stockQuantity: 60,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Budget-Friendly", "Cost-effective"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "13kg Pro-gas",
    description: "High-efficiency 13kg gas cylinder",
    price: 3000,
    refillPrice: 2000,
    brand: "Pro-gas",
    cylinderSize: "13kg",
    stockQuantity: 120,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "High-Efficiency", "Energy saving"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "50kg Pro-gas",
    description: "Commercial 50kg gas cylinder for restaurants and factories",
    price: 10000,
    refillPrice: 7000,
    brand: "Pro-gas",
    cylinderSize: "50kg",
    stockQuantity: 20,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Commercial Grade", "Heavy duty"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "6kg AfriGas",
    description: "Lightweight 6kg gas cylinder design",
    price: 1720,
    refillPrice: 1120,
    brand: "Other",
    cylinderSize: "6kg",
    stockQuantity: 80,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Lightweight", "Easy transport"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "13kg AfriGas",
    description: "Long-lasting 13kg gas cylinder",
    price: 3050,
    refillPrice: 2050,
    brand: "Other",
    cylinderSize: "13kg",
    stockQuantity: 130,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Long-Lasting", "Durable construction"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "45kg AfriGas",
    description: "Commercial 45kg gas cylinder for restaurants and factories",
    price: 11500,
    refillPrice: 8000,
    brand: "Other",
    cylinderSize: "50kg", // Using 50kg since 45kg is not in enum
    stockQuantity: 15,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Commercial Grade", "Industrial use"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "6kg Ola-gas",
    description: "Affordable 6kg gas cylinder from Ola Gas",
    price: 1650,
    refillPrice: 1050,
    brand: "ola-gas",
    cylinderSize: "6kg",
    stockQuantity: 70,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Affordable", "Good value"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  },
  {
    name: "13kg Ola-gas",
    description: "Reliable 13kg gas cylinder from Ola Gas",
    price: 2950,
    refillPrice: 1950,
    brand: "ola-gas",
    cylinderSize: "13kg",
    stockQuantity: 110,
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Reliable", "Trusted brand"],
    emptyCylinderExchange: true,
    approvalStatus: "approved"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mobigas');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedProducts(); 