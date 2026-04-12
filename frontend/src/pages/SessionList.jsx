import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../api';
import SessionCard from '../components/SessionCard';
import { HiPlus } from 'react-icons/hi';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSessions();
      // Session API returns array directly or wrapped
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.value || []);
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stored Restaurant Info</h1>
        <Link to="/sessions/new" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">
          <HiPlus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No sessions found. Create one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((s) => (
            <SessionCard key={s._id} session={s} onRefresh={fetchData} />
          ))}
        </div>
      )}
    </div>
  );
}
