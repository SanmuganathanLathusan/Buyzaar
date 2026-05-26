import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

/* Pages that should NOT show the main Navbar/Footer */
const NO_LAYOUT_PATHS = ['/admin', '/vendor-dashboard'];

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

/* Inner component has access to router context */
import { useLocation } from 'react-router-dom';

function AppInner() {
  const { pathname } = useLocation();
  const hideLayout = NO_LAYOUT_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  // Special case: vendor dashboard usually wants its own layout if complex, but let's stick to the request.
  // The user only explicitly asked for Admin Dashboard to be isolated.
  const isIsolated = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isIsolated && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/"                         element={<Home />}           />
          <Route path="/products"                 element={<ProductList />}    />
          <Route path="/product/:id"              element={<ProductDetails />} />
          <Route path="/cart"                     element={<Cart />}           />
          <Route path="/checkout"                 element={<Checkout />}       />
          <Route path="/contact"                  element={<Contact />}        />
          <Route path="/login"                    element={<Auth />}           />
          <Route path="/reset-password/:token"    element={<ResetPassword />}  />
          <Route path="/vendor-dashboard"         element={<VendorDashboard />}/>
          <Route path="/admin"                    element={<AdminDashboard />} />
          <Route path="/user-dashboard"           element={<UserDashboard />}  />
        </Routes>
      </main>

      {!isIsolated && <Footer />}

      <Toaster
        position="bottom-right"
        gutter={12}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25), 0 4px 8px -4px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#f8fafc' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
          },
        }}
      />
    </div>
  );
}

export default App;
