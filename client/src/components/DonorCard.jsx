import React from 'react';
import { MapPin, Calendar, Phone, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function DonorCard({ donor, onRequestClick }) {
  const isAvailable = donor.availability === 'Available';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center font-extrabold text-xl text-rose-600 shadow-inner shrink-0">
              {donor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base">{donor.name}</h3>
                {donor.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Donor" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {donor.gender}, {donor.age} yrs
              </p>
            </div>
          </div>
        </div>

        {/* Availability Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold border ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{isAvailable ? '🟢 Available to Donate' : '🔴 Currently Unavailable'}</span>
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-2 mb-5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">City & Area:</span>
            <span className="font-bold text-slate-800 truncate max-w-[160px]">
              {donor.area}, {donor.city}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Last Donation:</span>
            <span className="font-medium text-slate-700">
              {donor.lastDonationDate
                ? new Date(donor.lastDonationDate).toLocaleDateString()
                : 'Never / First Time'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Verification:</span>
            <span className="font-bold text-emerald-700">
              {donor.verified ? 'Verified Donor' : 'Standard Registered'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onRequestClick(donor)}
        disabled={!isAvailable}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
          isAvailable
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 hover:shadow-lg'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
        }`}
      >
        <HeartHandshake className="w-4 h-4" />
        <span>{isAvailable ? 'Request Blood' : 'Currently Unavailable'}</span>
      </button>
    </div>
  );
}
