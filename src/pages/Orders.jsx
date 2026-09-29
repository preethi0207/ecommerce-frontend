import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrderHistory, cancelOrder } from '../redux/slices/orderSlice';

function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const handleCancel = (orderId) => {
    if (!confirm('Cancel this order?')) return;
    dispatch(cancelOrder(orderId));
  };

  if (loading) return <p className="text-center text-gray-500 py-16">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 py-16">Failed to load orders.</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <Link to="/products" className="text-indigo-600 text-sm font-medium hover:underline">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {[...orders].reverse().map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 mb-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 text-sm text-gray-700">
                    <span>{item.product?.name} × {item.quantity}</span>
                    <span>₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total: ₹{order.totalAmount}</span>
                <span
                  className={`text-xs font-medium ${
                    order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {order.status === 'PENDING' && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="mt-3 text-sm font-medium text-red-500 hover:underline"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;