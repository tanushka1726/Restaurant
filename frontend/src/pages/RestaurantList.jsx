import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../api';
import RestaurantCard from '../components/RestaurantCard';
import { HiPlus } from 'react-icons/hi';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getRestaurants();
      setRestaurants(res.data.data || []);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <Link to="/restaurants/new" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">
          <HiPlus className="w-4 h-4" /> Add Restaurant
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No restaurants found. Add one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} onRefresh={fetchData} />
          ))}
        </div>
      )}
    </div>
  );
}
