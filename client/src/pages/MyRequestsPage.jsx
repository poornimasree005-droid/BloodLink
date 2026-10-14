import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { AlertTriangle, CheckCircle2, XCircle, Phone, UserCheck, RefreshCw, Trash2 } from 'lucide-react';

export default function MyRequestsPage() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/requests?requester=${user?.id || user?._id}`);
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
    if (user) fetchMyRequests();
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await API.put(`/requests/${id}`, { status: newStatus });
      if (res.data.success) {
        setMessage(`Request status updated to ${newStatus}`);
        fetchMyRequests();
      }
    } catch (err) {
      setMessage('Failed to update request status.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this request?')) return;
    try {
      const res = await API.delete(`/requests/${id}`);
      if (res.data.success) {
        setMessage('Request removed successfully.');
        fetchMyRequests();
      }
    } catch (err) {
      setMessage('Failed to delete request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Emergency Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track donor responses and update fulfillment statuses of your posted blood requests
            </p>
          </div>

          <button
            onClick={fetchMyRequests}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Emergency Requests Submitted</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not posted any blood requests. If you require emergency blood, click "Emergency Request" in the navigation bar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {req.requestId}
                    </span>
                    <span className="font-extrabold text-rose-600 text-xs">
                      {req.bloodGroup} ({req.unitsRequired} Units)
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        req.emergencyLevel === 'Critical'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {req.emergencyLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border text-slate-700">
                      Status: {req.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block">Patient Name:</span>
                    <strong className="text-slate-900">{req.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hospital & City:</span>
                    <strong className="text-slate-900">
                      {req.hospitalName}, {req.city}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone:</span>
                    <strong className="text-rose-700">{req.contactNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Required Date:</span>
                    <strong className="text-slate-900">
                      {new Date(req.requiredDate).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                {/* Donor Responses Sub-panel */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Donor Responses ({req.responses?.length || 0})</span>
                  </h4>

                  {req.responses?.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">
                      No donors have responded yet. Matching donors are being notified.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {req.responses.map((resp, i) => (
                        <div
                          key={i}
                          className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl text-xs flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{resp.donor?.name || 'Volunteer Donor'}</span>
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                                {resp.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Phone: <strong className="text-rose-700">{resp.donor?.phone}</strong> ({resp.donor?.bloodGroup})
                            </div>
                            {resp.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-1">"{resp.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(req._id, 'Fulfilled')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                    >
                      Mark as Fulfilled
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req._id, 'Cancelled')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
                    >
                      Mark as Cancelled
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
