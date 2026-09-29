import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) return <p className="text-center text-gray-500 py-16">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500 py-16">Failed to load cart.</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <Link to="/products" className="text-indigo-600 text-sm font-medium hover:underline">
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-5 py-4">
                <div>
                  <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.product?.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <h2 className="text-xl font-bold text-gray-900">Total: ₹{total.toFixed(2)}</h2>
            <Link to="/checkout">
              <button className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;