import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import {
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Droplet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function EmergencyRequestPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    hospitalLocation: '',
    city: user?.city || '',
    contactNumber: user?.phone || '',
    requiredDate: new Date().toISOString().split('T')[0],
    emergencyLevel: 'Urgent',
    additionalInformation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/requests', {
        ...formData,
        unitsRequired: Number(formData.unitsRequired),
      });

      if (res.data.success) {
        setSuccessData(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit emergency blood request.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
              Request ID: {successData.requestId}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Emergency Request Dispatched!
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your blood request for <strong>{successData.patientName}</strong> ({successData.bloodGroup}, {successData.unitsRequired} {successData.unitsRequired > 1 ? 'Units' : 'Unit'}) has been recorded and broadcasted to registered voluntary donors in {successData.city}.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-semibold text-slate-800">{successData.hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Emergency Level:</span>
              <span className="font-bold text-rose-600">{successData.emergencyLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600">{successData.status}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/my-requests')}
              className="w-full py-3 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Track My Request Status
            </button>
            <button
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  patientName: '',
                  bloodGroup: 'O+',
                  unitsRequired: 1,
                  hospitalName: '',
                  hospitalLocation: '',
                  city: user?.city || '',
                  contactNumber: user?.phone || '',
                  requiredDate: new Date().toISOString().split('T')[0],
                  emergencyLevel: 'Urgent',
                  additionalInformation: '',
                });
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Post Another Emergency Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-200">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Blood Request
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Submit medical blood requirement details to dispatch urgent alerts to nearby donors
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="e.g. Robert Vance"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-rose-600 bg-rose-50"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Units Required *
                </label>
                <input
                  type="number"
                  name="unitsRequired"
                  min="1"
                  max="10"
                  required
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Urgency Level *
                </label>
                <select
                  name="emergencyLevel"
                  value={formData.emergencyLevel}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                >
                  <option value="Critical">Critical (Immediate Life Danger)</option>
                  <option value="Urgent">Urgent (Needed within 24 Hours)</option>
                  <option value="Normal">Normal (Scheduled Surgery)</option>
                </select>
              </div>
            </div>

            {/* Hospital & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g. Metropolis General Hospital"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Location / Ward *
                </label>
                <input
                  type="text"
                  name="hospitalLocation"
                  required
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  placeholder="e.g. ICU Ward 3, Room 402"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Metropolis"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1-555-0142"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Date *
                </label>
                <input
                  type="date"
                  name="requiredDate"
                  required
                  value={formData.requiredDate}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Information / Instructions
              </label>
              <textarea
                name="additionalInformation"
                rows={3}
                value={formData.additionalInformation}
                onChange={handleChange}
                placeholder="Mention any specific surgery details, doctor contact, or hospital instructions..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Dispatching Emergency Request...</span>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Emergency Blood Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
