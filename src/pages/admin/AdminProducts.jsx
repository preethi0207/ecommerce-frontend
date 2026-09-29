import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '',
  });
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      productService.getAllProducts(),
      categoryService.getAllCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
      imageUrl: form.imageUrl,
      category: { id: parseInt(form.categoryId) },
    };

    if (editingId) {
      await productService.updateProduct(editingId, payload);
    } else {
      await productService.createProduct(payload);
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productService.deleteProduct(id);
    loadData();
  };

  if (loading) return <p className="text-center text-gray-500 py-16">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <div className="flex gap-4 items-center">
          <Link to="/admin/categories" className="text-indigo-600 text-sm font-medium hover:underline">
            Manage Categories
          </Link>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 text-sm"
          >
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm grid grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="col-span-2 flex gap-3">
            <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center px-5 py-3">
            <div>
              <p className="font-medium text-gray-900">{p.name}</p>
              <p className="text-sm text-gray-500">
                ₹{p.price} · {p.stockQuantity} in stock · {p.category?.name}
              </p>
            </div>
            <div className="flex gap-3 text-sm font-medium">
              <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;