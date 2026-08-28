const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High quality noise cancelling over-ear wireless headphones with long battery life.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Smart Watch Series X',
    description: 'Fitness tracker smart watch with heart rate monitor and AMOLED display.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'Ergonomic Leather Gaming Chair',
    description: 'Comfortable gaming chair with lumbar support and adjustable armrests.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&q=80',
    category: 'Furniture',
    stock: 10
  },
  {
    name: 'Minimalist Mechanical Keyboard',
    description: 'RGB mechanical keyboard with tactile switches and durable keycaps.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    category: 'Electronics',
    stock: 30
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 1 Liter water bottle that keeps drinks cold for 24 hours.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    category: 'Fitness',
    stock: 50
  },
  {
    name: 'Urban Backpack 25L',
    description: 'Water-resistant laptop backpack ideal for daily commuting and travel.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    category: 'Accessories',
    stock: 20
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const createdAdmin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    const createdUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });

    console.log(`Created Admin: ${createdAdmin.email} (Password: admin123)`);
    console.log(`Created User: ${createdUser.email} (Password: user123)`);

    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
