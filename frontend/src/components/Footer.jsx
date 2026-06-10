import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  Youtube, CreditCard, Shield, ArrowRight
} from 'lucide-react';
import Logo from './Logo';
import toast from 'react-hot-toast';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us',   to: '/contact' },
    { label: 'Contact',    to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use',   to: '/terms'   },
  ],
  Shopping: [
    { label: 'All Products',  to: '/products'                               },
    { label: 'Electronics',   to: '/products?category=Electronics%20Item'  },
    { label: 'Fashion',       to: '/products?category=Fashion%20Collection' },
    { label: 'Gadgets',       to: '/products?category=Gadgets'             },
  ],
  Account: [
    { label: 'Sign In',    to: '/login'          },
    { label: 'Register',   to: '/login'          },
    { label: 'My Orders',  to: '/user-dashboard' },
    { label: 'Wishlist',   to: '/'              },
  ],
};

const SOCIALS = [
  { icon: Facebook,  href: '#', label: 'Facebook'  },
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube,   href: '#', label: 'Youtube'   },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    
    // Simulate API call
    toast.success('Successfully subscribed to our newsletter!');
    setEmail('');
  };

  return (
  <footer className="bg-slate-950 text-slate-400 mt-auto">
    {/* ── Newsletter band ── */}
    <div className="border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="text-white text-xl font-bold mb-1">Stay in the loop</h3>
            <p className="text-sm">Get exclusive deals &amp; new arrivals delivered to your inbox.</p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-primary/25"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* ── Main footer ── */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center mb-5 group">
            <Logo className="h-14" forceWhite={true} />
          </Link>
          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            Your trusted multi-vendor marketplace connecting buyers with the best sellers across Sri Lanka and beyond.
          </p>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span>support@buyzaar.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>+94 11 234 5678</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-primary">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Buyzaar. All rights reserved.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>

        {/* Payment icons */}
        <div className="flex items-center gap-2 text-slate-500">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs">Secure payments</span>
          <CreditCard className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
