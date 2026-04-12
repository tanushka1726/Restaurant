import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteSession } from '../api';
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function SessionCard({ session, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this stored info?')) return;
    setLoading(true);
    try {
      await deleteSession(session._id);
      onRefresh();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{session.restaurant_name}</h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[session.status] || 'bg-gray-100 text-gray-800'}`}>
          {session.status}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600 mb-3">
        {session.email && (
          <div className="flex items-center gap-1.5">
            <HiOutlineMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{session.email}</span>
          </div>
        )}
        {session.contact_no && (
          <div className="flex items-center gap-1.5">
            <HiOutlinePhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{session.contact_no}</span>
          </div>
        )}
        {session.address && (
          <div className="flex items-center gap-1.5">
            <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{session.address.street}, {session.address.city}{session.address.state ? `, ${session.address.state}` : ''} {session.address.zip}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">
          {new Date(session.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Link
            to={`/sessions/${session._id}/edit`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
