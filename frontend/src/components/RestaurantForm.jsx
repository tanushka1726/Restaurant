import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRestaurant, getRestaurantById, updateRestaurant } from '../api';

const emptyForm = {
  name: '',
  description: '',
  email: '',
  contact_no: '',
  imageUrl: '',
  address: { street: '', city: '', state: '', zip: '' },
};

export default function RestaurantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getRestaurantById(id)
        .then((res) => {
          const d = res.data.data;
          setForm({
            name: d.name || '',
            description: d.description || '',
            email: d.email || '',
            contact_no: d.contact_no || '',
            imageUrl: d.imageUrl || '',
            address: {
              street: d.address?.street || '',
              city: d.address?.city || '',
              state: d.address?.state || '',
              zip: d.address?.zip || '',
            },
          });
        })
        .catch(() => setError('Failed to load restaurant'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, address: { ...p.address, [key]: key === 'zip' ? (value === '' ? '' : Number(value)) : value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, address: { ...form.address, zip: Number(form.address.zip) } };
      if (isEdit) {
        await updateRestaurant(id, payload);
      } else {
        await createRestaurant(payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-colors';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Restaurant' : 'Add Restaurant'}</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputCls} placeholder="Restaurant name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} placeholder="Brief description" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
            <input name="contact_no" value={form.contact_no} onChange={handleChange} className={inputCls} placeholder="10-digit phone" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
        </div>

        <fieldset className="border border-gray-200 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 px-2">Address *</legend>
          <div className="space-y-3">
            <input name="address.street" value={form.address.street} onChange={handleChange} required className={inputCls} placeholder="Street" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input name="address.city" value={form.address.city} onChange={handleChange} required className={inputCls} placeholder="City" />
              <input name="address.state" value={form.address.state} onChange={handleChange} className={inputCls} placeholder="State" />
              <input name="address.zip" type="number" value={form.address.zip} onChange={handleChange} required className={inputCls} placeholder="ZIP" />
            </div>
          </div>
        </fieldset>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
