import React, { useState } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyAdded: () => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onCompanyAdded }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('IT');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim() || !location.trim()) {
      setError('Company Name, Industry, and Location are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          industry: industry.trim(),
          location: location.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add company');
      }

      onCompanyAdded();
      setName('');
      setLocation('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold">Add Master Company</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Creates a single reusable master company entity.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Infosys, TCS, Deloitte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Industry / Sector <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. IT, Consulting, Manufacturing, Banking"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, Mumbai, Pune, Hyderabad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
