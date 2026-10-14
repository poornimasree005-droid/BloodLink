import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FileText, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminDonations = async () => {
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
    fetchAdminDonations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Donation Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              System Donation History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete log of all voluntary blood donation records submitted by registered users
            </p>
          </div>

          <button
            onClick={fetchAdminDonations}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading donation logs...</div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-500 text-xs">
            No donation records logged yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Donor Name</th>
                    <th className="p-4">Blood Group</th>
                    <th className="p-4">Donation Location</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Units</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{d.donor?.name || 'Unknown Donor'}</div>
                        <div className="text-[11px] text-slate-400">{d.donor?.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                          {d.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{d.location}</td>
                      <td className="p-4 text-slate-900 font-bold">
                        {new Date(d.donationDate).toLocaleDateString()}
                      </td>
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
