import React, { useState } from 'react';
import { PlacementDrive, Company, AcademicYear } from '../types';
import { Search, Calendar, Plus, Filter, CheckCircle, Clock, AlertCircle, Edit2, Trash2, Building2 } from 'lucide-react';

interface DrivesViewProps {
  drives: PlacementDrive[];
  companies: Company[];
  academicYears: AcademicYear[];
  loading: boolean;
  onAddDrive: () => void;
  onEditDrive: (drive: PlacementDrive) => void;
  onDeleteDrive: (driveId: number) => void;
  onViewCompanyProfile: (companyId: number) => void;
}

export const DrivesView: React.FC<DrivesViewProps> = ({
  drives,
  companies,
  academicYears,
  loading,
  onAddDrive,
  onEditDrive,
  onDeleteDrive,
  onViewCompanyProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedCompanyId, setSelectedCompanyId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter drives
  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      (d.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.eligibility_criteria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'ALL' || d.academic_year === selectedYear;
    const matchesCompany = selectedCompanyId === 'ALL' || d.company_id === Number(selectedCompanyId);
    const matchesStatus = selectedStatus === 'ALL' || d.drive_status === selectedStatus;

    return matchesSearch && matchesYear && matchesCompany && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Ongoing</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Planned</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Placement Drives</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Recruitment drives conducted across academic years linked to master company profiles.
          </p>
        </div>
        <button
          onClick={onAddDrive}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Drive</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or eligibility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Filter Academic Year */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Academic Years</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.year_name}>
                Academic Year: {ay.year_name}
              </option>
            ))}
            <option value="2026-27">Academic Year: 2026-27</option>
          </select>
        </div>

        {/* Filter Company */}
        <div>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Master Companies</option>
            {companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Drive Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Placement Drives Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredDrives.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No placement drives found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or schedule a new drive.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Academic Year</th>
                  <th className="py-3.5 px-4">Drive Date</th>
                  <th className="py-3.5 px-4">Eligibility Criteria</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDrives.map((drive) => (
                  <tr key={drive.drive_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Company Column */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onViewCompanyProfile(drive.company_id)}
                        className="flex items-center space-x-2 text-indigo-700 font-bold hover:underline group"
                      >
                        <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{drive.company_name}</span>
                      </button>
                      <div className="text-[11px] text-slate-400 pl-6">
                        {drive.industry} • {drive.location}
                      </div>
                    </td>

                    {/* Academic Year */}
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 border border-slate-200">
                        {drive.academic_year}
                      </span>
                    </td>

                    {/* Drive Date */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {drive.drive_date}
                    </td>

                    {/* Eligibility Criteria */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs font-medium leading-relaxed">
                      {drive.eligibility_criteria}
                    </td>

                    {/* Drive Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(drive.drive_status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onEditDrive(drive)}
                          title="Edit Placement Drive"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDrive(drive.drive_id)}
                          title="Delete Placement Drive"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
