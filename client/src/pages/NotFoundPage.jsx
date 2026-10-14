import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-200">
        <Droplet className="w-8 h-8 fill-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The requested page does not exist or has been moved. Return to the BloodLink homepage.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
