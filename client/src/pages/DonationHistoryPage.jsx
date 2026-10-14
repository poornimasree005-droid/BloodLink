import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { History, Plus, Calendar, MapPin, Droplet, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DonationHistoryPage() {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    location: '',
    donationDate: new Date().toISOString().split('T')[0],
    units: 1,
    bloodGroup: user?.bloodGroup || 'O+',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/donations');
      if (res.data.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      setFormLoading(true);
      const res = await API.post('/donations', {
        ...formData,
        units: Number(formData.units),
      });

      if (res.data.success) {
        setMessage('Donation record saved successfully!');
        setShowAddForm(false);
        setFormData({
          location: '',
          donationDate: new Date().toISOString().split('T')[0],
          units: 1,
          bloodGroup: user?.bloodGroup || 'O+',
        });
        fetchDonations();
      }
    } catch (err) {
      setMessage('Failed to add donation record.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Personal Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Donation History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track all your voluntary blood donation contributions over time
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Log New Donation'}
          </button>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {/* Add Donation Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              Record a Blood Donation Event
            </h3>
            <form onSubmit={handleSubmitDonation} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donation Location / Hospital / Camp *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Red Cross Blood Drive, Metropolis"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donation Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.donationDate}
                  onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.bloodGroup}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Units Donated *
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  required
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  {formLoading ? 'Saving...' : 'Save Donation Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading donation history...</div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Donation Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not recorded any blood donations yet. Click "Log New Donation" above after donating blood.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Donation Date</th>
                    <th className="p-4">Blood Group</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Units</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-900 font-bold">
                        {new Date(d.donationDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                          {d.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{d.location}</td>
                      <td className="p-4">{d.units} Unit(s)</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          {d.status}
                        </span>
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
