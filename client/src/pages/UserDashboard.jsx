import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import RequestCard from '../components/RequestCard';
import StatCard from '../components/StatCard';
import {
  Droplet,
  Heart,
  Search,
  PlusCircle,
  History,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function UserDashboard() {
  const { user, updateUser } = useContext(AuthContext);
  const [myRequests, setMyRequests] = useState([]);
  const [compatibleRequests, setCompatibleRequests] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reqRes, compRes, donRes] = await Promise.all([
        API.get(`/requests?requester=${user?.id || user?._id}`),
        API.get('/requests/compatible'),
        API.get('/donations'),
      ]);

      if (reqRes.data.success) setMyRequests(reqRes.data.data);
      if (compRes.data.success) setCompatibleRequests(compRes.data.data);
      if (donRes.data.success) setMyDonations(donRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSetAvailability = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await API.put('/users/profile', { availability: newStatus });
      if (res.data.success) {
        updateUser({ availability: newStatus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold rounded-full">
              <Droplet className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Donor Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your registered blood group is <strong className="text-rose-400 font-bold">{user?.bloodGroup}</strong>. Active requests matching your donor blood group are automatically highlighted below.
            </p>
          </div>

          {/* User Profile Availability Switcher inside Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 font-medium">My Blood Group:</span>
              <span className="w-8 h-8 rounded-lg bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center">
                {user?.bloodGroup}
              </span>
            </div>

            {/* Explicit Donor Availability Choice */}
            <div className="space-y-1.5">
              <span className="text-slate-300 font-medium block">Donor Availability Status:</span>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleSetAvailability('Available')}
                  disabled={updatingStatus}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                    user?.availability === 'Available'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 Available to Donate
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAvailability('Unavailable')}
                  disabled={updatingStatus}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                    user?.availability === 'Unavailable'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔴 Currently Unavailable
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-slate-300 text-[11px]">
              <span>Location:</span>
              <span className="font-semibold text-white">
                {user?.area}, {user?.city}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/emergency-request"
            className="p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-md shadow-rose-200 transition-all flex flex-col items-center justify-center text-center group"
          >
            <AlertTriangle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Request Emergency Blood</span>
          </Link>

          <Link
            to="/donors"
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center group"
          >
            <Search className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Find Donors</span>
          </Link>

          <Link
            to="/my-donations"
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center group"
          >
            <History className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">My Donations</span>
          </Link>

          <Link
            to="/my-requests"
            className="p-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center group"
          >
            <PlusCircle className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">My Requests ({myRequests.length})</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Donations"
            value={myDonations.length}
            icon={Heart}
            color="rose"
            description="Your total lifetime blood donations"
          />
          <StatCard
            title="My Requests"
            value={myRequests.length}
            icon={AlertTriangle}
            color="amber"
            description="Submitted emergency requests"
          />
          <StatCard
            title="Compatible Requests"
            value={compatibleRequests.length}
            icon={Droplet}
            color="emerald"
            description={`Active requests compatible with ${user?.bloodGroup} blood`}
          />
        </div>

        {/* SECTION 1: COMPATIBLE BLOOD REQUESTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Compatible Blood Requests
              </h2>
              <p className="text-xs text-slate-500">
                Active emergency requests that can be fulfilled by an <strong className="text-slate-800">{user?.bloodGroup}</strong> donor
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg bg-white border border-slate-200 text-xs flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading compatible blood requests...</div>
          ) : compatibleRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Compatible Requests</h3>
              <p className="text-xs text-slate-500 mt-1">
                There are currently no active pending requests matching your donor blood group ({user?.bloodGroup}).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compatibleRequests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  onResponseSuccess={fetchDashboardData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
