const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI;

// ─── Vendor credentials (from .env) ───────────────────────────────────────────
const VENDOR_EMAIL    = process.env.VENDOR_EMAIL;
const VENDOR_PASSWORD = process.env.VENDOR_PASSWORD;
const VENDOR_NAME     = process.env.VENDOR_NAME;
const VENDOR_BUSINESS = process.env.VENDOR_BUSINESS;

// ─── 27 diverse products (3 for each category) ────────────────────────────────
const products = [
  // ============ FASHION COLLECTION ============
  {
    title: "Men's Classic Leather Jacket",
    description: 'Genuine leather jacket with quilted lining, side zip pockets, and a timeless biker silhouette.',
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    category: 'Fashion Collection',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    rating: 4.7,
    reviews: 162,
    stock: 40,
  },
  {
    title: "Women's Casual Floral Dress",
    description: 'Light summer dress in breathable cotton blend, floral print, available in multiple sizes.',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Fashion Collection',
    image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600',
    rating: 4.2,
    reviews: 88,
    stock: 100,
  },
  {
    title: 'Unisex Running Sneakers',
    description: 'Lightweight mesh sneakers with cushioned sole, anti-slip grip, and breathable upper. Perfect for daily runs.',
    price: 2799,
    originalPrice: 4499,
    discount: 37,
    category: 'Fashion Collection',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    rating: 4.5,
    reviews: 305,
    stock: 120,
  },

  // ============ ELECTRONICS ITEM ============
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear wireless headphones with 30-hour battery life, active noise cancellation, and deep bass audio experience.',
    price: 4999,
    originalPrice: 7999,
    discount: 37,
    category: 'Electronics Item',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    rating: 4.5,
    reviews: 128,
    stock: 50,
  },
  {
    title: 'Smart Watch Series 5',
    description: 'Feature-packed smartwatch with health monitoring, GPS, 7-day battery, and water resistance up to 50m.',
    price: 8999,
    originalPrice: 12999,
    discount: 30,
    category: 'Electronics Item',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    rating: 4.3,
    reviews: 95,
    stock: 35,
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: '360° surround sound portable speaker, IPX7 waterproof, 12-hour playtime, perfect for outdoor adventures.',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    category: 'Electronics Item',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    rating: 4.4,
    reviews: 211,
    stock: 80,
  },

  // ============ HOME APPLIANCE ============
  {
    title: 'Automatic Electric Kettle',
    description: 'Smart electric kettle with temperature control, auto shut-off, and keep-warm function. 1.8L capacity.',
    price: 1299,
    originalPrice: 1899,
    discount: 31,
    category: 'Home Appliance',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600',
    rating: 4.6,
    reviews: 245,
    stock: 60,
  },
  {
    title: 'Cordless Vacuum Cleaner',
    description: 'Lightweight cordless vacuum with HEPA filtration, LED lights, and multiple cleaning attachments.',
    price: 8999,
    originalPrice: 12999,
    discount: 30,
    category: 'Home Appliance',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
    rating: 4.4,
    reviews: 178,
    stock: 25,
  },
  {
    title: 'Microwave Oven with Grill',
    description: '25L microwave oven with grill function, 10 power levels, and digital display. Energy efficient.',
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    category: 'Home Appliance',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
    rating: 4.5,
    reviews: 156,
    stock: 35,
  },

  // ============ KITCHEN ITEM ============
  {
    title: 'Non-Stick Stainless Steel Cookware Set',
    description: '5-piece cookware set with non-stick coating, heat-resistant handles, induction compatible.',
    price: 2299,
    originalPrice: 3499,
    discount: 34,
    category: 'Kitchen Item',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    rating: 4.7,
    reviews: 289,
    stock: 45,
  },
  {
    title: 'Ceramic Knife Block Set (6 Pcs)',
    description: 'Sharp ceramic knives with wooden block, non-toxic coating, easy to maintain and clean.',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: 'Kitchen Item',
    image: 'https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=600',
    rating: 4.4,
    reviews: 134,
    stock: 70,
  },
  {
    title: 'Glass Food Storage Containers (12 Pcs)',
    description: 'Airtight glass containers with snap lids, microwave & dishwasher safe, BPA-free plastic lids.',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    category: 'Kitchen Item',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600',
    rating: 4.5,
    reviews: 267,
    stock: 90,
  },

  // ============ FURNITURE ============
  {
    title: 'Ergonomic Office Chair with Lumbar Support',
    description: 'High-back office chair with adjustable armrests, lumbar support, and breathable mesh back.',
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    rating: 4.6,
    reviews: 198,
    stock: 30,
  },
  {
    title: 'Coffee Table with Storage',
    description: 'Modern coffee table with hidden storage compartment, tempered glass top, and wooden frame.',
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    rating: 4.3,
    reviews: 112,
    stock: 20,
  },
  {
    title: 'Wooden Bed Frame Queen Size',
    description: 'Solid wood bed frame with slat support, no box spring needed, available in walnut finish.',
    price: 12999,
    originalPrice: 19999,
    discount: 35,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=600',
    rating: 4.7,
    reviews: 156,
    stock: 15,
  },

  // ============ FOOD ============
  {
    title: 'Premium Basmati Rice (5kg)',
    description: 'Long grain basmati rice, aged for 3 years, aromatic and fluffy texture, perfect for biryanis.',
    price: 699,
    originalPrice: 999,
    discount: 30,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    rating: 4.5,
    reviews: 423,
    stock: 200,
  },
  {
    title: 'Organic Honey (500ml)',
    description: 'Pure organic honey with no additives, raw and unpasteurized, rich in antioxidants.',
    price: 399,
    originalPrice: 599,
    discount: 33,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1587049352861-d92d19ce7813?w=600',
    rating: 4.6,
    reviews: 289,
    stock: 150,
  },
  {
    title: 'Almond Butter Smooth (300g)',
    description: 'Natural almond butter made from roasted almonds, creamy texture, no artificial ingredients.',
    price: 299,
    originalPrice: 499,
    discount: 40,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd11b10?w=600',
    rating: 4.4,
    reviews: 176,
    stock: 120,
  },

  // ============ GADGETS ============
  {
    title: 'USB-C Multi-Port Hub (7-in-1)',
    description: 'USB-C hub with HDMI, USB 3.0 ports, SD card reader, and charging port. Plug and play.',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600',
    rating: 4.5,
    reviews: 234,
    stock: 85,
  },
  {
    title: 'Wireless Charging Pad with LED',
    description: 'Fast wireless charger for all Qi-enabled devices, non-slip surface, LED indicator light.',
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1590492571903-8fac03ea7e6f?w=600',
    rating: 4.3,
    reviews: 145,
    stock: 110,
  },
  {
    title: 'Phone Stand Adjustable Metal',
    description: 'Portable phone stand for all smartphones and tablets, aluminum alloy construction, foldable.',
    price: 399,
    originalPrice: 699,
    discount: 43,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1567998173011-07130e9b2b09?w=600',
    rating: 4.4,
    reviews: 267,
    stock: 150,
  },

  // ============ TOYS AND GAMES ============
  {
    title: 'Building Blocks Set (500 Pcs)',
    description: 'Colorful building blocks for kids age 3+, promotes creativity and problem-solving skills.',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Toys and Games',
    image: 'https://images.unsplash.com/photo-1613323593108-611356062e4b?w=600',
    rating: 4.6,
    reviews: 312,
    stock: 60,
  },
  {
    title: 'Remote Control RC Drone',
    description: '4K camera drone with 30-minute flight time, obstacle avoidance, and stable GPS positioning.',
    price: 8999,
    originalPrice: 13999,
    discount: 35,
    category: 'Toys and Games',
    image: 'https://images.unsplash.com/photo-1579033100066-41d379fbb31d?w=600',
    rating: 4.7,
    reviews: 189,
    stock: 25,
  },
  {
    title: 'Puzzle Set (1000 Pieces)',
    description: 'Premium jigsaw puzzle with beautiful scenic image, glossy finish pieces, comes in gift box.',
    price: 399,
    originalPrice: 599,
    discount: 33,
    category: 'Toys and Games',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600',
    rating: 4.5,
    reviews: 156,
    stock: 95,
  },

  // ============ HEALTH & BEAUTY ============
  {
    title: 'Vitamin C Face Serum',
    description: '20% Vitamin C brightening serum with hyaluronic acid and niacinamide for glowing, even skin.',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: 'Health & beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    rating: 4.5,
    reviews: 512,
    stock: 200,
  },
  {
    title: 'Electric Face Massage Roller',
    description: 'Vibrating face roller with rose quartz head, reduces puffiness, improves blood circulation.',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: 'Health & beauty',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
    rating: 4.2,
    reviews: 68,
    stock: 60,
  },
  {
    title: 'Natural Charcoal Face Wash',
    description: 'Deep-cleansing charcoal face wash that removes impurities, excess oil, and unclogs pores. Paraben-free.',
    price: 299,
    originalPrice: 499,
    discount: 40,
    category: 'Health & beauty',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    rating: 4.3,
    reviews: 374,
    stock: 250,
  },
  {
    _id: new mongoose.Types.ObjectId("69bf6a0f7510d13f10c0155a"),
    title: "Wireless Blue Earbuds",
    description: "High-fidelity wireless earbuds featuring active noise cancellation, deep bass, water resistance, and up to 30 hours of total playtime with the smart charging case.",
    price: 3500,
    originalPrice: 5000,
    discount: 30,
    category: "Gadgets",
    image: "/images/promo_earbuds_1777814089396.png",
    rating: 4.8,
    reviews: 150,
    stock: 50
  },
  {
    _id: new mongoose.Types.ObjectId("69bf6a0f7510d13f10c0155b"),
    title: "Sweet Valentine Chocolate Box",
    description: "An assortment of premium imported chocolates, milk truffles, and dark chocolate delights in a beautifully decorated gift box.",
    price: 1400,
    originalPrice: 2000,
    discount: 30,
    category: "Food",
    image: "/images/promo_chocolates_1777814134245.png",
    rating: 4.9,
    reviews: 85,
    stock: 30
  },
  {
    _id: new mongoose.Types.ObjectId("69bf6a0f7510d13f10c0155c"),
    title: "Elegant Diamond Engagement Ring",
    description: "A stunning 18k yellow gold band featuring a brilliant-cut solitaire diamond centerpiece, crafted for everlasting elegance.",
    price: 35000,
    originalPrice: 50000,
    discount: 30,
    category: "Fashion Collection",
    image: "/images/promo_ring_1777814170273.png",
    rating: 4.9,
    reviews: 45,
    stock: 10
  },
  {
    _id: new mongoose.Types.ObjectId("69bf6a0f7510d13f10c0155d"),
    title: "Premium Wooden Relax Chair",
    description: "Ergonomically designed lounge chair handcrafted from solid walnut wood with premium soft fabric cushions for ultimate relaxation.",
    price: 17500,
    originalPrice: 25000,
    discount: 30,
    category: "Furniture",
    image: "/images/promo_chair_1777814269040.png",
    rating: 4.7,
    reviews: 120,
    stock: 25
  }
];

// ─── Main seeder function ─────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected');

    // 1. Find or create the vendor
    let vendor = await User.findOne({ email: VENDOR_EMAIL });

    if (vendor) {
      console.log(`ℹ️  Vendor already exists: ${vendor.email} (${vendor._id})`);
      // Make sure role is vendor
      if (vendor.role !== 'vendor') {
        vendor.role = 'vendor';
        vendor.businessName = VENDOR_BUSINESS;
        await vendor.save();
        console.log('🔄  Updated role to vendor');
      }
    } else {
      // bcrypt hashing is handled by the pre-save hook in User model
      vendor = await User.create({
        name: VENDOR_NAME,
        email: VENDOR_EMAIL,
        password: VENDOR_PASSWORD,
        role: 'vendor',
        businessName: VENDOR_BUSINESS,
      });
      console.log(`🎉  Vendor created: ${vendor.email} (${vendor._id})`);
    }

    // 2. Delete existing products for this vendor (fresh seed)
    const deleted = await Product.deleteMany({ vendor: vendor._id });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Removed ${deleted.deletedCount} old product(s) for this vendor`);
    }

    // 3. Insert 20 products
    const productsWithVendor = products.map(p => ({ ...p, vendor: vendor._id }));
    const inserted = await Product.insertMany(productsWithVendor);
    console.log(`\n🛒  Successfully added ${inserted.length} products:\n`);
    inserted.forEach((p, i) =>
      console.log(`   ${String(i + 1).padStart(2, '0')}. [${p.category}] ${p.title} — ₹${p.price}`)
    );

    console.log('\n✅  Seeding complete!\n');
    console.log(`   Vendor Email   : ${VENDOR_EMAIL}`);
    console.log(`   Vendor Password: ${VENDOR_PASSWORD}`);
    console.log(`   Vendor ID      : ${vendor._id}`);
  } catch (err) {
    console.error('❌  Seeder error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌  MongoDB disconnected');
  }
}

seed();
