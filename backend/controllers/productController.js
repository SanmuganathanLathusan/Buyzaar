const Product = require('../models/Product');

// @desc    Fetch all products with optional search/category filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    let categoryFilter = {};

    // 1) cat[] array param: ?cat[]=Fashion Collection&cat[]=Watches
    //    URLSearchParams / qs parses repeated params as an array
    const catArray = req.query['cat[]'];
    if (catArray) {
      const cats = (Array.isArray(catArray) ? catArray : [catArray])
        .map((c) => c.trim())
        .filter(Boolean);
      if (cats.length > 0) {
        categoryFilter = {
          category: { $in: cats.map((c) => new RegExp(`^${c}$`, 'i')) },
        };
      }
      // 2) Legacy comma-joined: ?categories=A,B,C
    } else if (req.query.categories) {
      const cats = req.query.categories.split(',').map((c) => c.trim()).filter(Boolean);
      if (cats.length > 0) {
        categoryFilter = {
          category: { $in: cats.map((c) => new RegExp(`^${c}$`, 'i')) },
        };
      }
      // 3) Single category: ?category=Fashion Collection
    } else if (req.query.category) {
      categoryFilter = { category: { $regex: `^${req.query.category}$`, $options: 'i' } };
    }

    const products = await Product.find({ ...keyword, ...categoryFilter }).populate('vendor', 'name businessName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require('mongoose');

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id).populate('vendor', 'name businessName');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
  try {
    const { title, description, price, originalPrice, discount, category, image, stock } = req.body;
    const product = new Product({
      vendor: req.user._id,
      title, description, price, originalPrice, discount, category, image, stock
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor's own products
// @route   GET /api/products/vendor/myproducts
// @access  Private/Vendor
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.vendor.toString() === req.user._id.toString()) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, getVendorProducts, deleteProduct, createProductReview };
