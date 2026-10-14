import React from 'react';
import { Droplet, Heart, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Blood<span className="text-rose-500">Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              BloodLink is an emergency blood donor management system connecting patients, hospitals, and voluntary donors instantly during critical healthcare emergencies.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-medium bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 rounded-lg w-fit">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saving lives, one donation at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-rose-400 transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/donors" className="hover:text-rose-400 transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/emergency-request" className="hover:text-rose-400 transition-colors">
                  Emergency Blood Request
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-rose-400 transition-colors">
                  Register as Volunteer Donor
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-rose-400 transition-colors">
                  Donor / Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Supported Blood Groups
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <div
                  key={bg}
                  className="bg-slate-800 border border-slate-700 rounded-lg py-1 text-rose-400 hover:bg-rose-900/30 hover:border-rose-700 transition-colors"
                >
                  {bg}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              24/7 Support & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Emergency Hotline: 1-800-BLOOD-LINK</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@bloodlink.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Central Emergency Dispatch Center</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} BloodLink: Online Blood Donation and Emergency Donor Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
