import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await categoryService.getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await categoryService.updateCategory(editingId, form);
    } else {
      await categoryService.createCategory(form);
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in it may be affected.')) return;
    await categoryService.deleteCategory(id);
    loadData();
  };

  if (loading) return <p className="text-center text-gray-500 py-16">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <div className="flex gap-4 items-center">
          <Link to="/admin/products" className="text-indigo-600 text-sm font-medium hover:underline">
            Manage Products
          </Link>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 text-sm"
          >
            + Add Category
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm space-y-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          />
          <div className="flex gap-3">
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
        {categories.map((c) => (
          <div key={c.id} className="flex justify-between items-center px-5 py-3">
            <div>
              <p className="font-medium text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-500">{c.description}</p>
            </div>
            <div className="flex gap-3 text-sm font-medium">
              <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;