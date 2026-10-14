import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import RequestCard from '../components/RequestCard';
import {
  Droplet,
  HeartHandshake,
  Search,
  UserPlus,
  AlertCircle,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Activity,
} from 'lucide-react';

export default function LandingPage() {
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingRequests = async () => {
      try {
        const res = await API.get('/requests?status=Pending&emergencyLevel=Critical');
        if (res.data.success) {
          setEmergencyRequests(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load landing requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingRequests();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-400 text-xs font-semibold">
                <Droplet className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
                <span>Emergency Blood Donor Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Every Drop Can <span className="text-rose-500">Save a Life</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Connect with voluntary blood donors and respond to critical emergency blood requirements instantly through one centralized platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/donors"
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-rose-900/60 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" /> Find a Donor
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-rose-400" /> Become a Donor
                </Link>

                <Link
                  to="/emergency-request"
                  className="px-6 py-3.5 bg-rose-950/90 hover:bg-rose-900 border border-rose-600 text-rose-300 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" /> Request Blood
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <h4 className="text-2xl font-extrabold text-white">100%</h4>
                  <p className="text-xs text-slate-400">Verified Donors</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-rose-400">24/7</h4>
                  <p className="text-xs text-slate-400">Emergency Dispatch</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">8+</h4>
                  <p className="text-xs text-slate-400">Blood Types Covered</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" />
                    <span className="font-bold text-sm text-white">Emergency Blood Alert</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-rose-400">Metropolis General Hospital</span>
                      <span className="text-xs font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                        O+ Needed
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      2 Units required for emergency surgical procedure.
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Location: Downtown Center</span>
                      <span className="text-rose-400 font-semibold">Critical Level</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/60">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-rose-400">City Trauma Center</span>
                      <span className="text-xs font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                        AB- Needed
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      1 Unit required immediately for accident recovery.
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Location: West End</span>
                      <span className="text-amber-400 font-semibold">Urgent Level</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/emergency-request"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl block text-center transition-colors shadow-md"
                >
                  Create Emergency Blood Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW BLOODLINK WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
              Simple & Rapid Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How BloodLink Works
            </h3>
            <p className="text-slate-500 text-sm mt-3">
              BloodLink bridges the critical gap between blood seekers and willing donors in just three streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Register or Search</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a verified donor account with your blood group and city, or search our public directory of voluntary donors.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Post Emergency Request</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit patient hospital details, required blood group, and emergency level. Matching donors in your city get notified immediately.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Direct Donor Response</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compatible donors review and accept requests directly in-app. Requesters receive instant donor response notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOOD GROUPS GUIDE */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
              Compatibility Guide
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Blood Groups & Compatibility
            </h3>
            <p className="text-slate-500 text-sm mt-3">
              Understanding compatibility helps ensure life-saving blood reaches patients safely without delay.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { type: 'O-', give: 'All Blood Types', receive: 'O- Only' },
              { type: 'O+', give: 'O+, A+, B+, AB+', receive: 'O+, O-' },
              { type: 'A-', give: 'A+, A-, AB+, AB-', receive: 'A-, O-' },
              { type: 'A+', give: 'A+, AB+', receive: 'A+, A-, O+, O-' },
              { type: 'B-', give: 'B+, B-, AB+, AB-', receive: 'B-, O-' },
              { type: 'B+', give: 'B+, AB+', receive: 'B+, B-, O+, O-' },
              { type: 'AB-', give: 'AB+, AB-', receive: 'AB-, A-, B-, O-' },
              { type: 'AB+', give: 'AB+ Only', receive: 'All Blood Types' },
            ].map((bg) => (
              <div
                key={bg.type}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 text-rose-600 font-extrabold text-lg flex items-center justify-center mb-3">
                  {bg.type}
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-500">
                    <strong className="text-slate-700">Gives to:</strong> {bg.give}
                  </p>
                  <p className="text-slate-500">
                    <strong className="text-slate-700">Receives:</strong> {bg.receive}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DONATE BLOOD & HOW TO BECOME A DONOR */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Life-Saving Impact
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Why Donate Blood Through BloodLink?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A single donation can save up to three lives. In times of accident trauma, complex surgery, or chronic medical conditions, accessible blood donors are the difference between life and death.
              </p>

              <div className="space-y-3 text-sm font-medium text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Instant notifications for emergency requests in your area</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Privacy-first design protects donor contact details</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Track your personal donation history & impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Verified donor badges for transparent healthcare coordination</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Join as Volunteer Donor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card: How to Become a Donor */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
              <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-rose-500" />
                <span>Donor Eligibility Checklist</span>
              </h4>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Age Requirement</strong>
                  <span>Must be between 18 and 65 years of age.</span>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Minimum Weight</strong>
                  <span>Must weigh at least 50 kg (110 lbs).</span>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Donation Interval</strong>
                  <span>Must have at least 3 months gap since last blood donation.</span>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Overall Health</strong>
                  <span>Must be in good general health and free from acute infections.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-r from-rose-700 to-rose-600 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">
            Be the Beacon of Hope in Someone’s Emergency
          </h2>
          <p className="text-rose-100 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Register as a voluntary donor today or easily dispatch an emergency request for your loved ones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-rose-700 font-bold text-sm rounded-xl shadow-lg hover:bg-slate-100 transition-colors"
            >
              Register as Donor
            </Link>
            <Link
              to="/emergency-request"
              className="px-8 py-3.5 bg-rose-950 text-white font-bold text-sm rounded-xl border border-rose-800 hover:bg-rose-900 transition-colors"
            >
              Post Emergency Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
