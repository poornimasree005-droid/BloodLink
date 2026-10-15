import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import DonorCard from '../components/DonorCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Droplet,
  X,
  AlertTriangle,
  Building2,
  Calendar,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export default function FindDonorsPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filters
  const [bloodGroup, setBloodGroup] = useState('All');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [availability, setAvailability] = useState('Available'); // Default to Available donors as requested!
  const [search, setSearch] = useState('');

  // Selected Target Donor Request Modal
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestFormData, setRequestFormData] = useState({
    patientName: '',
    unitsRequired: 1,
    hospitalName: '',
    hospitalLocation: '',
    city: '',
    contactNumber: user?.phone || '',
    requiredDate: new Date().toISOString().split('T')[0],
    emergencyLevel: 'Urgent',
    additionalInformation: '',
  });

  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const params = new URLSearchParams();
      if (bloodGroup !== 'All') params.append('bloodGroup', bloodGroup);
      if (city) params.append('city', city);
      if (area) params.append('area', area);
      if (availability !== 'All') params.append('availability', availability);
      if (search) params.append('search', search);

      // Query /users/donors endpoint with fallback to /donors
      let res;
      try {
        res = await API.get(`/users/donors?${params.toString()}`);
      } catch (apiErr) {
        res = await API.get(`/donors?${params.toString()}`);
      }
      if (res?.data?.success) {
        setDonors(res.data.data);
      } else {
        setFetchError(res?.data?.message || 'Unable to retrieve donor list from server.');
      }
    } catch (err) {
      console.error('Error loading donors', err);
      setFetchError(err.response?.data?.message || err.message || 'Cannot connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleResetFilters = () => {
    setBloodGroup('All');
    setCity('');
    setArea('');
    setAvailability('Available');
    setSearch('');
    setTimeout(fetchDonors, 50);
  };

  const handleOpenRequestModal = (donor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedDonor(donor);
    setRequestFormData({
      patientName: '',
      unitsRequired: 1,
      hospitalName: '',
      hospitalLocation: '',
      city: donor.city || user?.city || '',
      contactNumber: user?.phone || '',
      requiredDate: new Date().toISOString().split('T')[0],
      emergencyLevel: 'Urgent',
      additionalInformation: '',
    });
    setRequestMessage('');
  };

  const handleDirectRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestMessage('');

    try {
      setSubmittingRequest(true);
      const res = await API.post('/requests', {
        ...requestFormData,
        bloodGroup: selectedDonor.bloodGroup,
        targetDonor: selectedDonor._id,
        unitsRequired: Number(requestFormData.unitsRequired),
      });

      if (res.data.success) {
        setRequestMessage('Blood request dispatched successfully! Donor has been notified.');
        setTimeout(() => {
          setSelectedDonor(null);
          navigate('/my-requests');
        }, 1500);
      }
    } catch (err) {
      setRequestMessage(
        err.response?.data?.message || 'Failed to submit request to selected donor.'
      );
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Display Available Donors title and exact count */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2">
              <Droplet className="w-3.5 h-3.5 fill-emerald-600" />
              <span>Available Donors Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Available Donors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing registered volunteers who are willing and currently available to donate blood.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
              {loading ? '...' : `${donors.length} donors available`}
            </div>
            <button
              onClick={fetchDonors}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-colors"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Keyword / Name
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, location..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Blood group */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-rose-600"
              >
                <option value="All">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Area / Location
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Banjara Hills"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-emerald-700"
              >
                <option value="Available">Available to Donate</option>
                <option value="All">All Statuses (Including Unavailable)</option>
                <option value="Unavailable">Currently Unavailable</option>
                <option value="Donated Recently">Donated Recently</option>
              </select>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{donors.length}</strong> donors available
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-rose-600 font-semibold text-xs"
              >
                Reset Filters
              </button>
              <button
                onClick={fetchDonors}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error notification banner */}
        {fetchError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchDonors}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Donors Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading available donors...</div>
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <Droplet className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Available Donors Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No donors are currently available matching your selected blood group and city filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <DonorCard
                key={donor._id}
                donor={donor}
                onRequestClick={handleOpenRequestModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* REQUEST BLOOD FORM MODAL FROM FIND DONORS */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  {selectedDonor.bloodGroup}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Request Blood from {selectedDonor.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Location: {selectedDonor.area}, {selectedDonor.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{requestMessage}</span>
              </div>
            )}

            <form onSubmit={handleDirectRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestFormData.patientName}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, patientName: e.target.value })
                    }
                    placeholder="e.g. Robert Vance"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Donor Blood Group
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedDonor.bloodGroup}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-rose-50 font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units Required *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={requestFormData.unitsRequired}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, unitsRequired: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Level *
                  </label>
                  <select
                    value={requestFormData.emergencyLevel}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, emergencyLevel: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  value={requestFormData.hospitalName}
                  onChange={(e) =>
                    setRequestFormData({ ...requestFormData, hospitalName: e.target.value })
                  }
                  placeholder="e.g. City Care Hospital"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital Location / Ward *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestFormData.hospitalLocation}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, hospitalLocation: e.target.value })
                    }
                    placeholder="e.g. Room 302, ICU"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestFormData.city}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, city: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestFormData.contactNumber}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, contactNumber: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Required Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={requestFormData.requiredDate}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, requiredDate: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  rows={2}
                  value={requestFormData.additionalInformation}
                  onChange={(e) =>
                    setRequestFormData({ ...requestFormData, additionalInformation: e.target.value })
                  }
                  placeholder="Optional medical notes..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  {submittingRequest ? 'Dispatching Request...' : 'Send Request to Donor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
