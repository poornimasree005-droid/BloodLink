import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FileText, Printer, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/statistics');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between print:shadow-none print:border-none">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              System Analytics & Summary Report
            </h1>
            <p className="text-xs text-slate-500">
              BloodLink Operational Report & Key Performance Metrics
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 print:hidden"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading report data...</div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 print:shadow-none print:p-0">
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">BloodLink Operational Overview</h2>
                <p className="text-xs text-slate-400">Generated on: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span>Status: </span>
                <strong className="text-emerald-600 font-bold">SYSTEM ACTIVE</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Total Users</span>
                <span className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers}</span>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[11px] text-rose-500 block font-bold uppercase">Total Donors</span>
                <span className="text-2xl font-extrabold text-rose-700">{stats?.totalDonors}</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[11px] text-amber-600 block font-bold uppercase">Active Requests</span>
                <span className="text-2xl font-extrabold text-amber-800">{stats?.activeBloodRequests}</span>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[11px] text-rose-600 block font-bold uppercase">Critical Emergencies</span>
                <span className="text-2xl font-extrabold text-rose-800">{stats?.emergencyRequests}</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[11px] text-emerald-600 block font-bold uppercase">Completed Donations</span>
                <span className="text-2xl font-extrabold text-emerald-800">{stats?.completedDonations}</span>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-[11px] text-blue-600 block font-bold uppercase">Pending Requests</span>
                <span className="text-2xl font-extrabold text-blue-800">{stats?.pendingRequests}</span>
              </div>
            </div>

            <div className="pt-4 text-xs text-slate-500 space-y-2 leading-relaxed border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">System Compliance Note</h3>
              <p>
                This report summarizes the live donor registrations and emergency dispatch metrics recorded in the BloodLink MongoDB database. Confidential personal health identifiers remain encrypted and protected according to standard privacy guidelines.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
