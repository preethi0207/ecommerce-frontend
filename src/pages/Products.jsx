import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (loading) return <p className="text-center text-gray-500 py-16">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 py-16">Failed to load products.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-5 text-sm font-medium">
          <Link to="/cart" className="text-indigo-600 hover:underline">View Cart</Link>
          <Link to="/orders" className="text-indigo-600 hover:underline">My Orders</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                )}
                <p className="text-lg font-bold text-gray-900 mb-2">₹{product.price}</p>
                <p
                  className={`text-sm mb-4 ${
                    product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </p>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stockQuantity === 0}
                  className="mt-auto w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;