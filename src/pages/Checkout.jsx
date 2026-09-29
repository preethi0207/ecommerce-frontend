import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { paymentService } from '../services/paymentService';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setErrorMsg(null);

    try {
      // 1. Create the order on our backend (status: PENDING)
      const orderResult = await dispatch(createOrder());
      if (!createOrder.fulfilled.match(orderResult)) {
        throw new Error('Failed to create order');
      }
      const order = orderResult.payload;

      // 2. Create a Razorpay order tied to this order
      const paymentOrder = await paymentService.createPaymentOrder(order.id);

      // 3. Open Razorpay Checkout
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Ecommerce Store',
        description: `Order #${order.id}`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            dispatch(clearCart());
            navigate('/orders');
          } catch (err) {
            setErrorMsg('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
          },
        },
        theme: { color: '#3399cc' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setErrorMsg('Something went wrong placing your order.');
      setPlacing(false);
    }
  };

    if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-indigo-600 font-medium hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between px-5 py-3 text-sm text-gray-700">
            <span>{item.product?.name} × {item.quantity}</span>
            <span>₹{(item.product?.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-bold text-gray-900">Total: ₹{total.toFixed(2)}</h2>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
        >
          {placing ? 'Processing...' : 'Place Order & Pay'}
        </button>
      </div>
    </div>
  );
}

export default Checkout;