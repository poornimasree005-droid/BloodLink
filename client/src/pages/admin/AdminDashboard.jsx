import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/StatCard';
import { Link } from 'react-router-dom';
import {
  Users,
  Heart,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Activity,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    activeBloodRequests: 0,
    emergencyRequests: 0,
    completedDonations: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/statistics');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/80 border border-amber-700 text-amber-300 text-xs font-bold rounded-full mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Protected Administrator Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              BloodLink Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Centralized platform management, donor verification, request oversight, and system analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Manage Users & Donors
            </Link>
            <Link
              to="/admin/requests"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Manage Blood Requests
            </Link>
          </div>
        </div>

        {/* Dashboard Metric Cards (As specified in section 9 & 12 of prompt) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={loading ? '...' : stats.totalUsers}
            icon={Users}
            color="indigo"
            description="Registered user accounts in system"
          />
          <StatCard
            title="Total Donors"
            value={loading ? '...' : stats.totalDonors}
            icon={Heart}
            color="rose"
            description="Voluntary blood donors"
          />
          <StatCard
            title="Active Blood Requests"
            value={loading ? '...' : stats.activeBloodRequests}
            icon={Activity}
            color="amber"
            description="Currently searching or pending requests"
          />
          <StatCard
            title="Emergency Requests"
            value={loading ? '...' : stats.emergencyRequests}
            icon={Flame}
            color="rose"
            description="Critical urgency level requests"
          />
          <StatCard
            title="Completed Donations"
            value={loading ? '...' : stats.completedDonations}
            icon={CheckCircle2}
            color="emerald"
            description="Fulfilled & logged donation records"
          />
          <StatCard
            title="Pending Requests"
            value={loading ? '...' : stats.pendingRequests}
            icon={Clock}
            color="blue"
            description="Awaiting initial donor confirmation"
          />
        </div>

        {/* Admin Navigation Quick Links */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Admin Control Center</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all group"
            >
              <Users className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm">Manage Users</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Activate or deactivate user accounts</p>
            </Link>

            <Link
              to="/admin/users?role=donor"
              className="p-5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all group"
            >
              <Heart className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm">Manage Donors</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Verify donor profiles & availability</p>
            </Link>

            <Link
              to="/admin/requests"
              className="p-5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all group"
            >
              <AlertTriangle className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm">Blood Requests</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">View and update emergency request statuses</p>
            </Link>

            <Link
              to="/admin/donations"
              className="p-5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all group"
            >
              <FileText className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm">Donations & Reports</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">System reports and donation statistics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
