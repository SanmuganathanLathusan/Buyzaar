const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const vendorId = '69bf6a0f7510d13f10c01559';

const mockProducts = [
  // Fashion Collection
  {
    vendor: vendorId,
    title: "Premium Men's Casual Shirt",
    description: "High-quality cotton casual shirt for men, perfect for all occasions.",
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    category: "Fashion Collection",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 120,
    stock: 50
  },
  {
    vendor: vendorId,
    title: "Elegant Summer Dress",
    description: "Flowy summer dress with floral patterns, comfortable and stylish.",
    price: 2500,
    originalPrice: 3500,
    discount: 28,
    category: "Fashion Collection",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 85,
    stock: 30
  },
  // Electronics Item
  {
    vendor: vendorId,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound experience with advanced noise cancellation technology.",
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    category: "Electronics Item",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 450,
    stock: 25
  },
  {
    vendor: vendorId,
    title: "Smart Watch Series 7",
    description: "Track your health and stay connected with this latest smart watch.",
    price: 25000,
    originalPrice: 30000,
    discount: 16,
    category: "Electronics Item",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 320,
    stock: 40
  },
  // Home Appliance
  {
    vendor: vendorId,
    title: "Automatic Coffee Machine",
    description: "Enjoy barista-quality coffee at home with just one touch.",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    category: "Home Appliance",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 150,
    stock: 15
  },
  {
    vendor: vendorId,
    title: "Robot Vacuum Cleaner",
    description: "Smart cleaning solution for your home, scans and cleans every corner.",
    price: 35000,
    originalPrice: 42000,
    discount: 16,
    category: "Home Appliance",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800",
    rating: 4.4,
    reviews: 95,
    stock: 20
  },
  // Kitchen Item
  {
    vendor: vendorId,
    title: "Stainless Steel Cookware Set",
    description: "10-piece professional-grade cookware set for all your kitchen needs.",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    category: "Kitchen Item",
    image: "https://images.unsplash.com/photo-1584990344610-527c5f40398c?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 60,
    stock: 25
  },
  {
    vendor: vendorId,
    title: "Air Fryer 5.5L",
    description: "Healthy frying with up to 90% less oil, large capacity for families.",
    price: 15000,
    originalPrice: 18000,
    discount: 16,
    category: "Kitchen Item",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 210,
    stock: 30
  },
  // Furniture
  {
    vendor: vendorId,
    title: "Modern Velvet Sofa",
    description: "Luxurious velvet sofa that adds style and comfort to your living room.",
    price: 85000,
    originalPrice: 110000,
    discount: 22,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 45,
    stock: 10
  },
  {
    vendor: vendorId,
    title: "Ergonomic Office Chair",
    description: "Adjustable office chair designed for long hours of comfortable work.",
    price: 22000,
    originalPrice: 28000,
    discount: 21,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505797149-43b0ad766a0e?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 130,
    stock: 25
  },
  // Food
  {
    vendor: vendorId,
    title: "Organic Honey 500g",
    description: "100% pure organic honey, sourced from the finest bee farms.",
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    category: "Food",
    image: "https://images.unsplash.com/photo-1558583055-d7ac00b1adca?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 300,
    stock: 100
  },
  {
    vendor: vendorId,
    title: "Roasted Coffee Beans 1kg",
    description: "Premium Arabica coffee beans, medium roast for a rich aroma.",
    price: 3500,
    originalPrice: 4200,
    discount: 16,
    category: "Food",
    image: "https://images.unsplash.com/photo-1447933630913-221b4a60bc61?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 180,
    stock: 60
  },
  // Gadgets
  {
    vendor: vendorId,
    title: "Portable Bluetooth Speaker",
    description: "Compact speaker with powerful sound and 12-hour battery life.",
    price: 5500,
    originalPrice: 7000,
    discount: 21,
    category: "Gadgets",
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 250,
    stock: 45
  },
  {
    vendor: vendorId,
    title: "4K Action Camera",
    description: "Capture your adventures in stunning 4K resolution, waterproof design.",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    category: "Gadgets",
    image: "https://images.unsplash.com/photo-1526170315873-3a91b5ef3571?auto=format&fit=crop&q=80&w=800",
    rating: 4.4,
    reviews: 110,
    stock: 20
  },
  // Toys and Games
  {
    vendor: vendorId,
    title: "Remote Control Racing Car",
    description: "High-speed RC car with durable tires and long-range remote control.",
    price: 4500,
    originalPrice: 6000,
    discount: 25,
    category: "Toys and Games",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 90,
    stock: 35
  },
  {
    vendor: vendorId,
    title: "Building Blocks Set 500pcs",
    description: "Creative building blocks for kids to build anything they imagine.",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    category: "Toys and Games",
    image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 150,
    stock: 50
  },
  // Health & beauty
  {
    vendor: vendorId,
    title: "Skin Rejuvenating Serum",
    description: "Advanced formula to reduce wrinkles and brighten your skin tone.",
    price: 4500,
    originalPrice: 5500,
    discount: 18,
    category: "Health & beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 110,
    stock: 40
  },
  {
    vendor: vendorId,
    title: "Lavender Essential Oil",
    description: "Pure lavender oil for relaxation, aromatherapy, and better sleep.",
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    category: "Health & beauty",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 200,
    stock: 80
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Optional: Clear existing products if needed, but the user didn't ask for that.
    // await Product.deleteMany();
    // console.log('Existing products cleared');

    await Product.insertMany(mockProducts);
    console.log('Mock products added successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
