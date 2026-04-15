const Product = require('../models/Product');

// @desc    Fetch all products with optional search/category filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      title: { $regex: req.query.keyword, $options: 'i' }
    } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find({ ...keyword, ...category }).populate('vendor', 'name businessName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
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

module.exports = { getProducts, getProductById, createProduct, getVendorProducts, deleteProduct };
