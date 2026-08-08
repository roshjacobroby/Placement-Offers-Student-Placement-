import React, { useState, useEffect } from 'react';
import { Company, AcademicYear } from '../types';
import { X, Calendar, Building2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AddDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  academicYears: AcademicYear[];
  preselectedCompanyId?: number | null;
  onDriveCreated: () => void;
}

export const AddDriveModal: React.FC<AddDriveModalProps> = ({
  isOpen,
  onClose,
  companies,
  academicYears,
  preselectedCompanyId,
  onDriveCreated,
}) => {
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [academicYear, setAcademicYear] = useState<string>('2025-26');
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string>('');
  const [driveStatus, setDriveStatus] = useState<'Planned' | 'Ongoing' | 'Completed'>('Planned');
  const [driveDate, setDriveDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedCompanyId) {
      setCompanyId(preselectedCompanyId);
    } else if (companies.length > 0 && companyId === '') {
      setCompanyId(companies[0].company_id);
    }
  }, [preselectedCompanyId, companies]);

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.company_id === Number(companyId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setError('Please select an existing company.');
      return;
    }
    if (!eligibilityCriteria.trim()) {
      setError('Eligibility criteria is required.');
      return;
    }
    if (!driveDate) {
      setError('Drive date is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: Number(companyId),
          academic_year: academicYear,
          eligibility_criteria: eligibilityCriteria,
          drive_status: driveStatus,
          drive_date: driveDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create placement drive');
      }

      onDriveCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold">Schedule New Placement Drive</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Links a recruitment drive to a master company record via <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">company_id</code>.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Select Existing Company Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Company <span className="text-rose-500">*</span>
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-900"
            >
              <option value="" disabled>
                Select existing company...
              </option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.name} ({c.industry} • {c.location})
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Master Entity Rule: No manual company entry required! Selected company details (Industry & Location) are referenced automatically.
              </span>
            </div>
          </div>

          {/* Auto-populated details banner */}
          {selectedCompany && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex justify-between items-center">
              <div>
                <span className="font-bold">{selectedCompany.name} Master Record:</span>
                <div className="text-[11px] text-indigo-700">
                  Industry: <strong>{selectedCompany.industry}</strong> | Location: <strong>{selectedCompany.location}</strong>
                </div>
              </div>
              <span className="text-[10px] uppercase font-extrabold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                Linked via FK
              </span>
            </div>
          )}

          {/* 2. Select Academic Year */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-900"
            >
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.year_name}>
                  {ay.year_name}
                </option>
              ))}
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
            </select>
          </div>

          {/* 3. Eligibility Criteria */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Eligibility Criteria <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              placeholder="e.g. CSE / ECE, CGPA >= 7.0, No active backlogs"
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* 4. Drive Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Drive Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Drive Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={driveStatus}
                onChange={(e) => setDriveStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-900"
              >
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
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
              className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Creating Drive...' : 'Create Drive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
