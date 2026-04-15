import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartSubtotal, clearCart, cartItems } = useCart();
  const { token } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shipping = cartSubtotal > 0 ? 500 : 0;
  const total = cartSubtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate that all items are real MongoDB products, not static demo items
    const hasLegacyItems = cartItems.some(item => !item._id || item._id.toString().length !== 24);
    if (hasLegacyItems) {
      toast.error('Your cart contains demo preview items that cannot be purchased. Please empty your cart and add real products!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map cart items exactly to match the Mongoose schema (Order.js)
      const orderItems = cartItems.map(item => ({
        product: item._id, // Backend strictly requires product ObjectId
        title: item.name || item.title,
        qty: item.quantity,
        price: item.price,
        image: item.image || (item.images && item.images[0]) || ''
      }));

      // Construct the secure payload
      const orderPayload = {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        paymentMethod: paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice: shipping,
        totalPrice: total
      };

      // Dispatch to Backend
      const response = await fetchWithAuth('http://localhost:5000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        toast.success('Order Placed Successfully!', { 
          duration: 3000,
          icon: '🎉'
        });
        clearCart();
        setTimeout(() => {
          navigate('/user-dashboard'); // Redirect directly to dashboard to see real results!
        }, 1500);
      } else {
        const errData = await response.json();
        toast.error(errData.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-cardDark p-6 rounded-sm border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your phone number" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Address</label>
                  <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Street, House No, Area" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Postal Code</label>
                  <input required name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Postal Code" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-cardDark p-6 rounded-sm border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label 
                  className={`border p-4 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 dark:bg-primary-hover/10' : 'border-gray-200 dark:border-gray-700 hover:border-primary-light'}`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-green-500" /> Cash on Delivery
                    </span>
                    <span className="text-xs text-gray-500">Pay when you receive the item</span>
                  </div>
                </label>
                
                <label 
                  className={`border p-4 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5 dark:bg-primary-hover/10' : 'border-gray-200 dark:border-gray-700 hover:border-primary-light'}`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card" 
                    checked={paymentMethod === 'card'} 
                    onChange={() => setPaymentMethod('card')}
                    className="accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" /> Credit/Debit Card
                    </span>
                    <span className="text-xs text-gray-500">Secure online payment</span>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-sm space-y-3">
                  <input required name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card Number" className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1" />
                  <div className="flex gap-4">
                    <input required name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM/YY" className="w-1/2 p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1" />
                    <input required name="cardCvc" value={formData.cardCvc} onChange={handleChange} placeholder="CVC" className="w-1/2 p-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded dark:text-white focus:outline-none focus:ring-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-cardDark rounded-sm border border-gray-100 dark:border-gray-800 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Items Total ({cartItems.length})</span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 dark:text-gray-200 font-medium">Rs. {shipping.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-gray-900 dark:text-white font-medium text-lg">Total Payment</span>
                <span className="text-xl font-bold text-primary">Rs. {total.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full block text-center bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white py-3 rounded-sm font-bold shadow-md transition-colors uppercase"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
