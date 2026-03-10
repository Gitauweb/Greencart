// In-memory product storage for fallback when MongoDB is unavailable
let products = [
  {
    _id: '1',
    name: 'Fresh Green Lettuce',
    description: 'Crisp and fresh green lettuce, perfect for salads and sandwiches',
    price: 2.99,
    originalPrice: 3.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Green+Lettuce',
    stock: 50,
    isFeatured: true,
    rating: 4.5,
    reviews: 12,
    createdAt: new Date(),
  },
  {
    _id: '2',
    name: 'Organic Tomatoes',
    description: 'Juicy organic tomatoes grown without pesticides',
    price: 4.99,
    originalPrice: 5.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Tomatoes',
    stock: 40,
    isFeatured: true,
    rating: 4.8,
    reviews: 25,
    createdAt: new Date(),
  },
  {
    _id: '3',
    name: 'Free Range Eggs',
    description: 'Dozen free-range eggs from natural farms',
    price: 6.99,
    originalPrice: 7.99,
    category: 'Dairy',
    image: 'https://via.placeholder.com/300?text=Eggs',
    stock: 30,
    isFeatured: true,
    rating: 4.6,
    reviews: 18,
    createdAt: new Date(),
  },
  {
    _id: '4',
    name: 'Wild Caught Salmon',
    description: 'Fresh wild-caught salmon fillets',
    price: 14.99,
    originalPrice: 16.99,
    category: 'Seafood',
    image: 'https://via.placeholder.com/300?text=Salmon',
    stock: 20,
    isFeatured: false,
    rating: 4.7,
    reviews: 9,
    createdAt: new Date(),
  },
  {
    _id: '5',
    name: 'Whole Wheat Bread',
    description: 'Homemade whole wheat bread, fresh daily',
    price: 5.49,
    originalPrice: 6.49,
    category: 'Bakery',
    image: 'https://via.placeholder.com/300?text=Wheat+Bread',
    stock: 25,
    isFeatured: true,
    rating: 4.4,
    reviews: 15,
    createdAt: new Date(),
  },
  {
    _id: '6',
    name: 'Organic Carrots',
    description: 'Sweet organic carrots, fresh from farm to table',
    price: 1.99,
    originalPrice: 2.99,
    category: 'Vegetables',
    image: 'https://via.placeholder.com/300?text=Carrots',
    stock: 60,
    isFeatured: false,
    rating: 4.3,
    reviews: 8,
    createdAt: new Date(),
  },
  {
    _id: '7',
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein',
    price: 5.99,
    originalPrice: 6.99,
    category: 'Dairy',
    image: 'https://via.placeholder.com/300?text=Greek+Yogurt',
    stock: 35,
    isFeatured: false,
    rating: 4.5,
    reviews: 20,
    createdAt: new Date(),
  },
  {
    _id: '8',
    name: 'Fresh Blueberries',
    description: 'Delicious fresh blueberries packed with antioxidants',
    price: 7.99,
    originalPrice: 9.99,
    category: 'Fruits',
    image: 'https://via.placeholder.com/300?text=Blueberries',
    stock: 20,
    isFeatured: true,
    rating: 4.9,
    reviews: 30,
    createdAt: new Date(),
  },
];

export class InMemoryProduct {
  static async find(filter = {}) {
    let results = [...products];
    
    if (filter.$or) {
      const searchFilters = filter.$or;
      results = results.filter(p => {
        return searchFilters.some(f => {
          if (f.name && f.name.$regex) {
            const regex = new RegExp(f.name.$regex, 'i');
            return regex.test(p.name);
          }
          if (f.description && f.description.$regex) {
            const regex = new RegExp(f.description.$regex, 'i');
            return regex.test(p.description);
          }
          return false;
        });
      });
    }
    
    if (filter.category) {
      results = results.filter(p => p.category === filter.category);
    }
    
    if (filter.price) {
      results = results.filter(p => {
        if (filter.price.$gte && p.price < filter.price.$gte) return false;
        if (filter.price.$lte && p.price > filter.price.$lte) return false;
        return true;
      });
    }
    
    return results;
  }

  static async countDocuments(filter = {}) {
    const products = await this.find(filter);
    return products.length;
  }

  static async findById(id) {
    return products.find(p => p._id === id);
  }

  static async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  static async create(data) {
    const newProduct = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date(),
      rating: 0,
      reviews: 0,
    };
    products.push(newProduct);
    return newProduct;
  }

  static async updateOne(filter, update) {
    const index = products.findIndex(p => {
      for (const key in filter) {
        if (p[key] !== filter[key]) return false;
      }
      return true;
    });

    if (index !== -1) {
      products[index] = { ...products[index], ...update.$set };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  static async deleteOne(filter) {
    const index = products.findIndex(p => {
      for (const key in filter) {
        if (p[key] !== filter[key]) return false;
      }
      return true;
    });

    if (index !== -1) {
      products.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
}
