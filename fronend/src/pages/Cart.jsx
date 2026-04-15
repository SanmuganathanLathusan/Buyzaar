import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();

  const shipping = cartSubtotal > 0 ? 500 : 0;
  const total = cartSubtotal + shipping;

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-cardDark p-12 text-center rounded-sm shadow-sm">
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">Your cart is empty</h2>
            <Link to="/" className="text-primary hover:underline font-medium">Continue Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-cardDark p-4 rounded-sm border border-gray-100 dark:border-gray-800 items-start sm:items-center shadow-sm">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-gray-100 font-medium leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">Brand: Sony</div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                    <div className="text-primary font-bold">
                      Rs. {item.price.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 h-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                      >-</button>
                      <span className="w-10 text-center text-sm dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 h-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                      >+</button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-cardDark rounded-sm border border-gray-100 dark:border-gray-800 p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b dark:border-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-gray-900 dark:text-gray-200 font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="text-gray-900 dark:text-gray-200 font-medium">Rs. {shipping.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-gray-900 dark:text-white font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">Rs. {total.toLocaleString()}</span>
                </div>

                <div className="text-xs text-gray-400 mb-6 text-right">VAT included, where applicable</div>

                <Link 
                  to="/checkout" 
                  className="w-full block text-center bg-primary hover:bg-primary-hover text-white py-3 rounded-sm font-bold shadow-md transition-colors uppercase"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
