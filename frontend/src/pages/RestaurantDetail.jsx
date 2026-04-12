import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRestaurantById, deleteRestaurant, toggleRestaurantStatus } from '../api';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getRestaurantById(id);
      setRestaurant(res.data.data);
    } catch {
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this restaurant?')) return;
    await deleteRestaurant(id);
    navigate('/');
  };

  const handleToggle = async () => {
    await toggleRestaurantStatus(id);
    fetchData();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!restaurant) return <div className="text-center py-12 text-gray-500">Restaurant not found</div>;

  const { address } = restaurant;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Back to list</Link>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[restaurant.status] || 'bg-gray-100 text-gray-800'}`}>
            {restaurant.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{restaurant.description || 'No description'}</p>

        {restaurant.imageUrl && (
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-56 object-cover rounded-xl mb-4" />
        )}

        <div className="space-y-2 mb-5">
          {address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineLocationMarker className="w-4 h-4 text-gray-400" />
              {address.street}, {address.city}{address.state ? `, ${address.state}` : ''} {address.zip}
            </div>
          )}
          {restaurant.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineMail className="w-4 h-4 text-gray-400" />
              {restaurant.email}
            </div>
          )}
          {restaurant.contact_no && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlinePhone className="w-4 h-4 text-gray-400" />
              {restaurant.contact_no}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          <button onClick={handleToggle} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${restaurant.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
            {restaurant.isActive ? 'Active' : 'Inactive'}
          </button>
          <Link to={`/restaurants/${id}/edit`} className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
            Edit
          </Link>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors ml-auto">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
