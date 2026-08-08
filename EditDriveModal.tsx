import React, { useState, useEffect } from 'react';
import { PlacementDrive, Company, AcademicYear } from '../types';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface EditDriveModalProps {
  drive: PlacementDrive | null;
  companies: Company[];
  academicYears: AcademicYear[];
  onClose: () => void;
  onDriveUpdated: () => void;
}

export const EditDriveModal: React.FC<EditDriveModalProps> = ({
  drive,
  companies,
  academicYears,
  onClose,
  onDriveUpdated,
}) => {
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [academicYear, setAcademicYear] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [driveStatus, setDriveStatus] = useState<'Planned' | 'Ongoing' | 'Completed'>('Planned');
  const [driveDate, setDriveDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (drive) {
      setCompanyId(drive.company_id);
      setAcademicYear(drive.academic_year);
      setEligibilityCriteria(drive.eligibility_criteria);
      setDriveStatus(drive.drive_status);
      setDriveDate(drive.drive_date);
    }
  }, [drive]);

  if (!drive) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !academicYear || !eligibilityCriteria.trim() || !driveDate) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/drives/${drive.drive_id}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update drive');
      }

      onDriveUpdated();
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
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold">Edit Placement Drive</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Updating Drive #{drive.drive_id}
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
              Company <span className="text-rose-500">*</span>
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 text-slate-900"
            >
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
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
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Eligibility Criteria <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
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

            <div className="space-y-1">
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
              {loading ? 'Updating...' : 'Update Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
