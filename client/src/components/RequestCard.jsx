import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import {
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Check,
  X,
  Clock,
  UserCheck,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function RequestCard({ request, onResponseSuccess }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Searching':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Donor Found':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Fulfilled':
        return 'bg-green-600 text-white';
      case 'Cancelled':
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getEmergencyBadge = (level) => {
    switch (level) {
      case 'Critical':
        return <span className="badge-critical">CRITICAL EMERGENCY</span>;
      case 'Urgent':
        return <span className="badge-urgent">URGENT</span>;
      default:
        return <span className="badge-normal">NORMAL</span>;
    }
  };

  // Check if current logged in user has already responded
  const myResponse = request.responses?.find(
    (r) => r.donor?._id === user?.id || r.donor === user?.id || r.donor?._id === user?._id
  );

  const handleRespond = async (statusAction) => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await API.post(`/requests/${request._id}/respond`, {
        status: statusAction, // 'Accepted' or 'Rejected'
      });

      if (res.data.success) {
        setFeedback({
          type: 'success',
          message: statusAction === 'Accepted'
            ? 'Response saved: You registered as "I Can Donate". Requester has been notified!'
            : 'Response saved as "Not Available".',
        });
        if (onResponseSuccess) onResponseSuccess();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit response',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
            {request.requestId}
          </span>
          {getEmergencyBadge(request.emergencyLevel)}
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>

      {/* Main Request Information */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center font-extrabold text-lg shadow-md shadow-rose-200 shrink-0">
          <span>{request.bloodGroup}</span>
          <span className="text-[10px] font-normal leading-none opacity-90">
            {request.unitsRequired} {request.unitsRequired > 1 ? 'Units' : 'Unit'}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-base leading-tight">
            Patient: {request.patientName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{request.hospitalName}</span>
          </p>
        </div>
      </div>

      {/* Info List as required */}
      <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Hospital Location:</span>
          <strong className="text-slate-800">{request.hospitalLocation}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">City:</span>
          <strong className="text-slate-900">{request.city}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Required Date:</span>
          <strong className="text-slate-800">
            {new Date(request.requiredDate).toLocaleDateString()}
          </strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Contact Number:</span>
          <strong className="text-rose-700 font-mono">{request.contactNumber}</strong>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-1">
          <span className="text-slate-400">Request Created Date:</span>
          <span className="text-slate-600 font-medium">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>

        {request.additionalInformation && (
          <p className="text-[11px] text-slate-500 pt-1 italic">
            "{request.additionalInformation}"
          </p>
        )}
      </div>

      {/* Feedback message */}
      {feedback && (
        <div
          className={`p-2.5 mb-3 rounded-lg text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Donor Action Panel */}
      {isAuthenticated && user?.role === 'user' && (
        <div className="border-t border-slate-100 pt-3">
          {myResponse ? (
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl text-xs">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>Your Response:</span>
              </span>
              <span
                className={`font-bold px-2.5 py-1 rounded-lg text-[11px] ${
                  myResponse.status === 'Accepted'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {myResponse.status === 'Accepted' ? 'I Can Donate (Accepted)' : 'Not Available (Rejected)'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRespond('Accepted')}
                disabled={loading}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> I Can Donate
              </button>

              <button
                onClick={() => handleRespond('Rejected')}
                disabled={loading}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" /> Not Available
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
