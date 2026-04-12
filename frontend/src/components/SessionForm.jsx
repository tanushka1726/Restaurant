import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSession, updateSession, getSessionById, getRestaurants } from '../api';

export default function SessionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    res_Id: '',
    restaurant_name: '',
    email: '',
    contact_no: '',
    status: 'pending',
    address: { street: '', city: '', state: '', zip: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getRestaurants()
      .then((res) => setRestaurants(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      getSessionById(id)
        .then((res) => {
          const d = res.data;
          setForm({
            res_Id: d.res_Id || '',
            restaurant_name: d.restaurant_name || '',
            email: d.email || '',
            contact_no: d.contact_no || '',
            status: d.status || 'pending',
            address: {
              street: d.address?.street || '',
              city: d.address?.city || '',
              state: d.address?.state || '',
              zip: d.address?.zip || '',
            },
          });
        })
        .catch(() => setError('Failed to load session'));
    }
  }, [id, isEdit]);

  const handleRestaurantSelect = (e) => {
    const selected = restaurants.find((r) => r._id === e.target.value);
    if (selected) {
      setForm((p) => ({
        ...p,
        res_Id: selected._id,
        restaurant_name: selected.name,
        email: selected.email || p.email,
        contact_no: selected.contact_no || p.contact_no,
        address: {
          street: selected.address?.street || '',
          city: selected.address?.city || '',
          state: selected.address?.state || '',
          zip: selected.address?.zip || '',
        },
      }));
    }
  };

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
        await updateSession(id, payload);
      } else {
        await createSession(payload);
      }
      navigate('/sessions');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-colors';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Stored Info' : 'Store Restaurant Info'}</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-5">
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-fill from Restaurant</label>
            <select value={form.res_Id} onChange={handleRestaurantSelect} className={inputCls}>
              <option value="">-- Pick a restaurant (optional) --</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
          <input name="restaurant_name" value={form.restaurant_name} onChange={handleChange} required className={inputCls} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No *</label>
            <input name="contact_no" value={form.contact_no} onChange={handleChange} required className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
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
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/sessions')} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
