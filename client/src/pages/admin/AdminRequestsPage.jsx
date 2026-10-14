import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { AlertTriangle, RefreshCw, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/requests');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await API.put(`/admin/requests/${id}`, { status: newStatus });
      if (res.data.success) {
        setMessage(`Blood request ${id} updated to ${newStatus}`);
        fetchAdminRequests();
      }
    } catch (err) {
      setMessage('Failed to update request.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blood request record?')) return;
    try {
      const res = await API.delete(`/requests/${id}`);
      if (res.data.success) {
        setMessage('Blood request deleted.');
        fetchAdminRequests();
      }
    } catch (err) {
      setMessage('Failed to delete blood request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Admin Request Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Manage Emergency Blood Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Override request statuses, check donor response counts, and maintain system data integrity
            </p>
          </div>

          <button
            onClick={fetchAdminRequests}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-500 text-xs">
            No blood requests found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Request ID</th>
                    <th className="p-4">Patient & Hospital</th>
                    <th className="p-4">Blood Group</th>
                    <th className="p-4">Emergency Level</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Donor Responses</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{r.requestId}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{r.patientName}</div>
                        <div className="text-[11px] text-slate-500">
                          {r.hospitalName}, {r.city}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                          {r.bloodGroup} ({r.unitsRequired} U)
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.emergencyLevel === 'Critical'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {r.emergencyLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                          className="text-xs p-1.5 border border-slate-200 rounded-lg font-semibold bg-slate-50 focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Searching">Searching</option>
                          <option value="Donor Found">Donor Found</option>
                          <option value="Fulfilled">Fulfilled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-700">
                          {r.responses?.length || 0} Donor(s)
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteRequest(r._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
