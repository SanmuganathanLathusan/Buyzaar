import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Truck, Headphones, Percent, RefreshCw, Star, Zap, ShieldCheck, Package } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { PRODUCTS } from '../data/products';

const SIDEBAR_CATEGORIES = [
  { name: 'Fashion Collection', emoji: '👗' },
  { name: 'Electronics Item',   emoji: '💻' },
  { name: 'Home Appliance',     emoji: '🏠' },
  { name: 'Kitchen Item',       emoji: '🍳' },
  { name: 'Furniture',          emoji: '🛋️' },
  { name: 'Food',               emoji: '🍔' },
  { name: 'Gadgets',            emoji: '📱' },
  { name: 'Toys and Games',     emoji: '🎮' },
  { name: 'Health & beauty',    emoji: '💄' },
];

const FEATURES = [
  { icon: Truck,       title: 'Free Shipping',        desc: 'On orders over Rs. 5,000',  color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/30'   },
  { icon: Headphones,  title: '24/7 Support',         desc: 'We\'re here anytime',        color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30'},
  { icon: Percent,     title: 'Best Prices',          desc: 'Guaranteed best deals',      color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/30'  },
  { icon: RefreshCw,   title: 'Easy Returns',         desc: 'Hassle-free 30-day returns', color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-950/30'},
];

const PROMO_CARDS = [
  {
    category: 'Gadget Store',
    title: '30% Sale',
    subtitle: 'On Earbuds',
    color: 'from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40',
    accent: 'text-blue-600 dark:text-blue-400',
    tag: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    img: '/images/promo_earbuds_1777814089396.png',
    link: '/product/69bf6a0f7510d13f10c0155a',
  },
  {
    category: 'Bundle Package',
    title: 'Save 30%',
    subtitle: 'Sweet Deals',
    color: 'from-orange-50 to-yellow-50 dark:from-orange-950/40 dark:to-yellow-950/40',
    accent: 'text-orange-600 dark:text-orange-400',
    tag: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    img: '/images/promo_chocolates_1777814134245.png',
    link: '/product/69bf6a0f7510d13f10c0155b',
  },
  {
    category: "Valentine's Offer",
    title: '30% Sale',
    subtitle: 'Fine Jewelry',
    color: 'from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40',
    accent: 'text-pink-600 dark:text-pink-400',
    tag: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300',
    img: '/images/promo_ring_1777814170273.png',
    link: '/product/69bf6a0f7510d13f10c0155c',
  },
  {
    category: 'New Arrival',
    title: 'Relax Chair',
    subtitle: 'Premium Collection',
    color: 'from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40',
    accent: 'text-purple-600 dark:text-purple-400',
    tag: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    img: '/images/promo_chair_1777814269040.png',
    link: '/product/69bf6a0f7510d13f10c0155d',
  },
];

/* ── Stagger animation for product grid ── */
const gridVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();

  return (
    <div className="page-wrapper font-sans">
      <div className="page-container pt-6 space-y-10 pb-16">

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Left sidebar categories */}
          <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-border-dark">
              <h2 className="text-sm font-bold text-secondary dark:text-white uppercase tracking-widest">Categories</h2>
            </div>
            <nav className="flex flex-col py-2 flex-1">
              {SIDEBAR_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 group ${
                    idx === 1
                      ? 'bg-primary/8 text-primary border-r-2 border-primary dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="flex-1 text-left">{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              <div className="mt-auto px-5 py-3 border-t border-border dark:border-border-dark">
                <button
                  onClick={() => navigate('/products')}
                  className="text-primary text-sm font-semibold flex items-center justify-between w-full hover:opacity-80 transition-opacity"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </nav>
          </aside>

          {/* Hero banner */}
          <div className="flex-1 relative bg-gradient-to-br from-[#EBF5FF] via-[#F0F8FF] to-[#E8F4FF] dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl overflow-hidden min-h-[380px] flex items-center shadow-card-lg">
            {/* Subtle background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 px-8 md:px-12 py-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5 border border-primary/20">
                <Zap className="w-3 h-3" />
                Limited Time Offer
              </div>
              <p className="text-slate-500 dark:text-slate-300 text-sm mb-2 font-medium">
                Up to <span className="text-primary font-extrabold text-2xl">70%</span> OFF on Black Friday
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-secondary dark:text-white leading-[1.1] tracking-tight mb-6">
                TRENDY{' '}
                <span className="gradient-text">FASHION</span>
                <br />COLLECTION
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/products?category=Fashion%20Collection')}
                  className="btn-primary btn-lg px-8"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-secondary btn-md"
                >
                  Browse All
                </button>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  {['bg-pink-400','bg-violet-400','bg-blue-400','bg-emerald-400'].map((c,i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65+i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-secondary dark:text-white">10k+</span> happy customers
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="absolute right-0 bottom-0 h-full w-1/2 flex justify-end">
              <img
                src="/images/hero_banner_woman_1777814059468.png"
                alt="Trendy Fashion Collection"
                className="h-full object-cover object-right"
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            PROMO CARDS
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PROMO_CARDS.map((promo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Link
                to={promo.link}
                className={`block relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.color} border border-border dark:border-border-dark p-5 shadow-card hover:shadow-card-lg transition-shadow duration-300 group`}
              >
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${promo.tag}`}>
                  {promo.category}
                </span>
                <h3 className={`text-xl font-black mb-0.5 ${promo.accent}`}>{promo.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{promo.subtitle}</p>
                <span className={`text-xs font-semibold flex items-center gap-1 ${promo.accent}`}>
                  Shop Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute right-2 bottom-0 w-28 h-28">
                  <img
                    src={promo.img}
                    alt={promo.title}
                    className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ══════════════════════════════════════
            TRUST FEATURES BAND
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card hover:shadow-card-md transition-shadow"
              >
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${feat.bg}`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-secondary dark:text-white text-sm leading-snug">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════
            FEATURED PRODUCTS
        ══════════════════════════════════════ */}
        <section>
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Featured</span>
              </div>
              <h2 className="section-heading">Popular Products</h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Products grid */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {PRODUCTS.slice(0, visibleCount).map((product, idx) => (
              <motion.div key={`featured-${product.id || product._id}-${idx}`} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load more */}
          {visibleCount < PRODUCTS.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((p) => p + 8)}
                className="btn-secondary btn-lg gap-2"
              >
                Load More Products
                <Package className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════
            PROMO BANNER
        ══════════════════════════════════════ */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-cyan-500 to-blue-600 p-8 md:p-12 text-white text-center shadow-glow-lg">
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-4 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted by 10,000+ customers
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Become a Seller on Buyzaar</h2>
            <p className="text-white/80 text-base mb-6 max-w-lg mx-auto">
              Join thousands of vendors growing their business on our platform. Start selling today — no listing fees!
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-2xl hover:bg-primary-light shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Selling Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
