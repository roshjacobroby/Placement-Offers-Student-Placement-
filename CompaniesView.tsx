import React, { useState } from 'react';
import { Company } from '../types';
import { Search, Building2, MapPin, Briefcase, Plus, Edit2, Eye, Trash2 } from 'lucide-react';

interface CompaniesViewProps {
  companies: Company[];
  loading: boolean;
  onAddCompany: () => void;
  onEditCompany: (company: Company) => void;
  onViewCompanyProfile: (companyId: number) => void;
  onDeleteCompany: (companyId: number, companyName: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  loading,
  onAddCompany,
  onEditCompany,
  onViewCompanyProfile,
  onDeleteCompany,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');

  // Extract unique industries for filter dropdown
  const industries = Array.from(new Set(companies.map((c) => c.industry))).filter(Boolean);

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'ALL' || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Master Company Directory</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Master records for all visiting companies. Each company is stored once to prevent duplicate entries.
          </p>
        </div>
        <button
          onClick={onAddCompany}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
          />
        </div>

        {/* Industry Filter */}
        <div className="w-full sm:w-64">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
          >
            <option value="ALL">All Industries ({companies.length})</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No companies found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or industry filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => (
            <div
              key={comp.company_id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                      {comp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                        {comp.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 mt-0.5">
                        Master ID: #{comp.company_id}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditCompany(comp)}
                      title="Edit Company Details"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCompany(comp.company_id, comp.name)}
                      title="Delete Company"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Industry: <strong className="text-slate-800 font-semibold">{comp.industry}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Location: <strong className="text-slate-800 font-semibold">{comp.location}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer / Profile Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {comp.drive_count || 0} Placement Drives
                </span>
                <button
                  onClick={() => onViewCompanyProfile(comp.company_id)}
                  className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
