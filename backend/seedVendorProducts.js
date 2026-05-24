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

// ─── 20 diverse products ──────────────────────────────────────────────────────
const products = [
  // Electronics
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear wireless headphones with 30-hour battery life, active noise cancellation, and deep bass audio experience.',
    price: 4999,
    originalPrice: 7999,
    discount: 37,
    category: 'Electronics',
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
    category: 'Electronics',
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
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    rating: 4.4,
    reviews: 211,
    stock: 80,
  },
  {
    title: '4K Ultra HD Action Camera',
    description: 'Compact action camera shooting 4K at 60fps, waterproof case included, wide-angle lens, ideal for sports.',
    price: 11999,
    originalPrice: 17999,
    discount: 33,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
    rating: 4.6,
    reviews: 74,
    stock: 25,
  },

  // Fashion
  {
    title: "Men's Classic Leather Jacket",
    description: 'Genuine leather jacket with quilted lining, side zip pockets, and a timeless biker silhouette.',
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    category: 'Fashion',
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
    category: 'Fashion',
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
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    rating: 4.5,
    reviews: 305,
    stock: 120,
  },
  {
    title: 'Classic Aviator Sunglasses',
    description: 'UV400 protected aviator sunglasses with polarised lens and lightweight metal frame.',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
    rating: 4.1,
    reviews: 57,
    stock: 200,
  },

  // Home & Living
  {
    title: 'Scented Soy Candle Set (6 Pack)',
    description: 'Hand-poured soy wax candles in 6 relaxing fragrances — lavender, vanilla, eucalyptus, and more.',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    rating: 4.8,
    reviews: 241,
    stock: 150,
  },
  {
    title: 'Minimalist Wooden Desk Organiser',
    description: 'Bamboo desk organiser with 5 compartments — keep your workspace tidy and stylish.',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    rating: 4.3,
    reviews: 119,
    stock: 75,
  },
  {
    title: 'Ceramic Coffee Mug Set (4 Pcs)',
    description: 'Handcrafted ceramic mugs in earthy tones, microwave & dishwasher safe, 350ml each.',
    price: 999,
    originalPrice: 1599,
    discount: 37,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    rating: 4.6,
    reviews: 183,
    stock: 90,
  },
  {
    title: 'LED Fairy String Lights (10m)',
    description: 'Warm white fairy lights, 100 LEDs, USB powered, with 8 lighting modes for cozy bedroom decor.',
    price: 499,
    originalPrice: 799,
    discount: 37,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=600',
    rating: 4.4,
    reviews: 427,
    stock: 300,
  },

  // Beauty & Health
  {
    title: 'Vitamin C Face Serum',
    description: '20% Vitamin C brightening serum with hyaluronic acid and niacinamide for glowing, even skin.',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: 'Beauty & Health',
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
    category: 'Beauty & Health',
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
    category: 'Beauty & Health',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    rating: 4.3,
    reviews: 374,
    stock: 250,
  },

  // Sports & Fitness
  {
    title: 'Yoga Mat with Alignment Lines',
    description: 'Extra thick 6mm non-slip yoga mat with printed alignment lines, includes carry strap.',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600',
    rating: 4.6,
    reviews: 298,
    stock: 110,
  },
  {
    title: 'Adjustable Dumbbell Set (5-25kg)',
    description: 'Space-saving adjustable dumbbell pair, quick-lock mechanism, replaces 9 sets of traditional weights.',
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    rating: 4.7,
    reviews: 142,
    stock: 30,
  },
  {
    title: 'Resistance Band Set (5 Levels)',
    description: 'Set of 5 latex resistance bands from extra light to extra heavy for full-body workouts.',
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    rating: 4.4,
    reviews: 189,
    stock: 180,
  },

  // Books & Stationery
  {
    title: 'Premium Leather Hardcover Journal',
    description: 'A5 dotted journal with 240 acid-free pages, elastic closure, and a bookmark ribbon. Perfect for bullet journaling.',
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
    rating: 4.8,
    reviews: 321,
    stock: 200,
  },
  {
    title: 'Gel Ink Pen Set (12 Colors)',
    description: 'Smooth-writing 0.5mm gel pens in 12 vibrant colors, ideal for note-taking, art, and calligraphy.',
    price: 299,
    originalPrice: 499,
    discount: 40,
    category: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600',
    rating: 4.5,
    reviews: 267,
    stock: 400,
  },
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
