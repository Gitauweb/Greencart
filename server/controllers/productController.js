import Product from '../models/Product.js';
import { InMemoryProduct } from '../models/InMemoryProduct.js';

let productModel = Product;
let isMongoDBAvailable = true;

// Helper to try MongoDB or fallback to in-memory
async function getProductsWithFallback(filter, options = {}) {
  try {
    // Check if we should use fallback
    if (!isMongoDBAvailable) {
      return await InMemoryProduct.find(filter);
    }

    // Try MongoDB with timeout
    const promise = productModel.find(filter);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.log('MongoDB unavailable, switching to fallback...');
    productModel = InMemoryProduct;
    isMongoDBAvailable = false;
    return await InMemoryProduct.find(filter);
  }
}

async function countDocumentsWithFallback(filter) {
  try {
    if (!isMongoDBAvailable) {
      const docs = await InMemoryProduct.find(filter);
      return docs.length;
    }

    const promise = productModel.countDocuments(filter);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.log('MongoDB unavailable, switching to fallback...');
    productModel = InMemoryProduct;
    isMongoDBAvailable = false;
    const docs = await InMemoryProduct.find(filter);
    return docs.length;
  }
}

// Get all products with filters and search
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;

    // Use helper with fallback
    let products = await getProductsWithFallback(filter);
    const total = await countDocumentsWithFallback(filter);

    // Sort if using in-memory
    if (!isMongoDBAvailable || Array.isArray(products)) {
      if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
      if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
      if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
      if (sort === 'newest') products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Paginate
    let paginatedProducts = products;
    if (Array.isArray(products)) {
      paginatedProducts = products.slice(skip, skip + parseInt(limit));
    }

    res.status(200).json({
      success: true,
      products: paginatedProducts,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await getProductsWithFallback({ _id: id });
    const product = Array.isArray(products) ? products[0] : products;

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// Create product (seller/admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, image, stock } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      stock,
      seller: req.userId,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product (seller/admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user is seller or admin
    if (product.seller.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product (seller/admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await getProductsWithFallback({ isFeatured: true });
    const featured = Array.isArray(products) ? products.slice(0, 6) : [];
    res.status(200).json({ success: true, products: featured });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const allProducts = await getProductsWithFallback({});
    const products = Array.isArray(allProducts) ? allProducts : [allProducts];
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};
