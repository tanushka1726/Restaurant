import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { deleteRestaurant, toggleRestaurantStatus } from '../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function RestaurantCard({ restaurant, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this restaurant?')) return;
    setLoading(true);
    try {
      await deleteRestaurant(restaurant._id);
      onRefresh();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleRestaurantStatus(restaurant._id);
      onRefresh();
    } catch (err) {
      alert('Failed to toggle status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Link to={`/restaurants/${restaurant._id}`} className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              {restaurant.name}
            </Link>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{restaurant.description || 'No description'}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[restaurant.status] || 'bg-gray-100 text-gray-800'}`}>
            {restaurant.status}
          </span>
        </div>

        {restaurant.address && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1.5">
            <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{restaurant.address.street}, {restaurant.address.city}{restaurant.address.state ? `, ${restaurant.address.state}` : ''} {restaurant.address.zip}</span>
          </div>
        )}
        {restaurant.email && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1.5">
            <HiOutlineMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{restaurant.email}</span>
          </div>
        )}
        {restaurant.contact_no && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1.5">
            <HiOutlinePhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{restaurant.contact_no}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${restaurant.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
          >
            {restaurant.isActive ? 'Active' : 'Inactive'}
          </button>
          <Link
            to={`/restaurants/${restaurant._id}/edit`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
