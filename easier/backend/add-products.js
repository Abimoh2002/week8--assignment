const mongoose = require('mongoose');
const Product = require('./Models/Product');

const testProducts = [
  {
    name: "K-gas 6kg Gas Cylinder",
    description: "High-quality 6kg gas cylinder for household use. EPRA certified and safety compliant.",
    price: 2000,
    brand: "K-gas",
    cylinderSize: "6kg",
    stockQuantity: 50,
    refillPrice: 1800,
    gasType: "LPG",
    availability: true,
    emptyCylinderExchange: true,
    approvalStatus: "approved",
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Pressure Tested"],
    certification: "EPRA Certified"
  },
  {
    name: "Total 13kg Gas Cylinder",
    description: "Reliable 13kg gas cylinder perfect for medium households. Long-lasting and efficient.",
    price: 3500,
    brand: "Total",
    cylinderSize: "13kg",
    stockQuantity: 30,
    refillPrice: 3200,
    gasType: "LPG",
    availability: true,
    emptyCylinderExchange: true,
    approvalStatus: "approved",
    safetyFeatures: ["EPRA Certified", "Safety Compliant", "Durable"],
    certification: "EPRA Certified"
  },
  {
    name: "Pro-gas 50kg Gas Cylinder",
    description: "Commercial 50kg gas cylinder for restaurants and factories. High capacity and reliable.",
    price: 12000,
    brand: "Pro-gas",
    cylinderSize: "50kg",
    stockQuantity: 10,
    refillPrice: 11000,
    gasType: "LPG",
    availability: true,
    emptyCylinderExchange: true,
    approvalStatus: "approved",
    safetyFeatures: ["EPRA Certified", "Commercial Grade", "High Capacity"],
    certification: "EPRA Certified"
  },
  {
    name: "Ola Gas 6kg Gas Cylinder",
    description: "Compact and portable 6kg gas cylinder. Perfect for small households and camping.",
    price: 1800,
    brand: "ola-gas",
    cylinderSize: "6kg",
    stockQuantity: 25,
    refillPrice: 1600,
    gasType: "LPG",
    availability: true,
    emptyCylinderExchange: false,
    approvalStatus: "approved",
    safetyFeatures: ["EPRA Certified", "Portable", "Compact"],
    certification: "EPRA Certified"
  }
];

async function addProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mobigas');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add test products
    const insertedProducts = await Product.insertMany(testProducts);
    console.log(`Successfully added ${insertedProducts.length} products`);

    // Display added products
    insertedProducts.forEach(product => {
      console.log(`- ${product.name}: KES ${product.price} (${product.stockQuantity} in stock)`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding products:', error);
    mongoose.connection.close();
  }
}

addProducts(); 