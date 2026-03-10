import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'Fresh Green Lettuce',
    description: 'Crisp and fresh green lettuce, perfect for salads and sandwiches',
    price: 2.99,
    originalPrice: 3.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Green+Lettuce',
    stock: 50,
    isFeatured: true,
  },
  {
    name: 'Organic Tomatoes',
    description: 'Juicy organic tomatoes grown without pesticides',
    price: 4.99,
    originalPrice: 5.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Tomatoes',
    stock: 40,
    isFeatured: true,
  },
  {
    name: 'Free Range Eggs',
    description: 'Dozen free-range eggs from natural farms',
    price: 6.99,
    originalPrice: 7.99,
    category: 'Dairy',
    image: 'https://via.placeholder.com/300?text=Eggs',
    stock: 30,
    isFeatured: true,
  },
  {
    name: 'Wild Caught Salmon',
    description: 'Fresh wild-caught salmon fillets',
    price: 14.99,
    originalPrice: 16.99,
    category: 'Seafood',
    image: 'https://via.placeholder.com/300?text=Salmon',
    stock: 20,
    isFeatured: false,
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Homemade whole wheat bread, fresh daily',
    price: 5.49,
    originalPrice: 6.49,
    category: 'Bakery',
    image: 'https://via.placeholder.com/300?text=Wheat+Bread',
    stock: 25,
    isFeatured: true,
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet organic carrots, fresh from farm to table',
    price: 1.99,
    originalPrice: 2.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Carrots',
    stock: 60,
    isFeatured: false,
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein',
    price: 5.99,
    originalPrice: 6.99,
    category: 'Dairy',
    image: 'https://via.placeholder.com/300?text=Greek+Yogurt',
    stock: 35,
    isFeatured: false,
  },
  {
    name: 'Fresh Blueberries',
    description: 'Delicious fresh blueberries packed with antioxidants',
    price: 7.99,
    originalPrice: 9.99,
    category: 'Fruits',
    image: 'https://via.placeholder.com/300?text=Blueberries',
    stock: 20,
    isFeatured: true,
  },
  {
    name: 'Organic Avocados',
    description: 'Ripe organic avocados, perfect for toast and salads',
    price: 3.49,
    originalPrice: 4.49,
    category: 'Fruits',
    image: 'https://via.placeholder.com/300?text=Avocados',
    stock: 45,
    isFeatured: false,
  },
  {
    name: 'Brown Rice',
    description: 'Organic brown rice, high in fiber and nutrients',
    price: 6.99,
    originalPrice: 8.99,
    category: 'Grains',
    image: 'https://via.placeholder.com/300?text=Brown+Rice',
    stock: 55,
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  try {
    // Try to connect to MongoDB (optional - will fail gracefully)
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (dbError) {
      console.log('MongoDB connection failed, using in-memory storage');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully inserted ${insertedProducts.length} products`);
    
    console.log('\nSample products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} ($${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
