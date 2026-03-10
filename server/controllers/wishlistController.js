import Wishlist from '../models/Wishlist.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.userId }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.userId, products: [] });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide product ID' });
    }

    let wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({ success: true, message: 'Added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.userId }, { products: [] });

    res.status(200).json({ success: true, message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
