import React from 'react';
import { DashboardStats } from '../types';
import { Building2, Calendar, Repeat, PieChart, Plus, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: 'companies' | 'drives' | 'reports' | 'acceptance-test') => void;
  onAddCompany: () => void;
  onAddDrive: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onNavigate,
  onAddCompany,
  onAddDrive,
}) => {
  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>V05 Standard Implementation • Master Entity Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Placement Drive Management System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Centralized company master entity hub preventing duplicate records across academic years. Each company is stored once and linked to multiple placement drives.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onAddCompany}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company (Master)</span>
            </button>
            <button
              onClick={onAddDrive}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Drive</span>
            </button>
            <button
              onClick={() => onNavigate('acceptance-test')}
              className="flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Run Acceptance Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Companies */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Companies</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total_companies}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Unique Master Records
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Reusable entities stored once in DB</p>
        </div>

        {/* Total Drives */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Placement Drives</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total_drives}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Across All Years
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Linked via foreign key `company_id`</p>
        </div>

        {/* Repeat Recruiters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Repeat Recruiters</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.repeat_recruiters_count}</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              &gt; 1 Drive Conducted
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Calculated dynamically from database</p>
        </div>

        {/* Industries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Sectors</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.companies_by_industry.length}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Industries
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">IT, Consulting, Manufacturing, etc.</p>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repeat Recruiters Showcase */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Repeat Recruiters</h2>
              <p className="text-xs text-slate-500">Companies conducting multiple placement drives</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.repeat_recruiters.slice(0, 5).map((company) => (
              <div
                key={company.company_id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{company.name}</div>
                    <div className="text-xs text-slate-500">
                      {company.industry} • {company.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    {company.drive_count} Drives
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drives by Academic Year */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Drives by Academic Year</h2>
              <p className="text-xs text-slate-500">Year-on-year placement drive distribution</p>
            </div>
            <button
              onClick={() => onNavigate('drives')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {stats.drives_by_year.map((item) => {
              const maxDrives = Math.max(...stats.drives_by_year.map((d) => d.count), 1);
              const percentage = Math.round((item.count / maxDrives) * 100);

              return (
                <div key={item.academic_year} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-800 font-bold">{item.academic_year}</span>
                    <span className="text-slate-600 font-semibold">{item.count} Drives</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
