import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import store from './redux/slices/store';
import Login from './pages/login';
import Register from './pages/register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import { logout } from './redux/slices/authSlice';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';

function NavBar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="flex flex-wrap justify-between items-center gap-y-2 px-4 sm:px-8 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="flex flex-wrap gap-4 sm:gap-6 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
        <Link to="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/products" className="hover:text-indigo-600 transition-colors text-amber-600 font-semibold">
            Admin
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">{user?.name || user?.email}</span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function Home() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ecommerce Frontend</h1>
      <p className="text-gray-500 mb-6">Welcome{user ? `, ${user.name || user.email}` : ''}!</p>
      <Link
        to="/products"
        className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />

        <Route
          path="/admin/products"
          element={<AdminRoute><AdminProducts /></AdminRoute>}
        />
        <Route
          path="/admin/categories"
          element={<AdminRoute><AdminCategories /></AdminRoute>}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;