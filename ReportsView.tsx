import React, { useEffect, useState } from 'react';
import { CompaniesByYearReport, DrivesByYearReport, IndustryParticipationReport, RepeatRecruiter } from '../types';
import { BarChart3, Repeat, Building2, Calendar, PieChart, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [companiesByYear, setCompaniesByYear] = useState<CompaniesByYearReport[]>([]);
  const [drivesByYear, setDrivesByYear] = useState<DrivesByYearReport[]>([]);
  const [industryPart, setIndustryPart] = useState<IndustryParticipationReport[]>([]);
  const [repeatRecruiters, setRepeatRecruiters] = useState<RepeatRecruiter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch('/api/reports/companies-by-year').then((res) => res.json()),
        fetch('/api/reports/drives-by-year').then((res) => res.json()),
        fetch('/api/reports/industry-participation').then((res) => res.json()),
        fetch('/api/reports/repeat-recruiters').then((res) => res.json()),
      ]);

      setCompaniesByYear(r1);
      setDrivesByYear(r2);
      setIndustryPart(r3);
      setRepeatRecruiters(r4);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Dynamic calculations querying SQLite database for institutional placement drives and company participation.
        </p>
      </div>

      {/* Report 4 Highlight: Repeat Recruiters (User Requirement explicitly highlighted!) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Repeat className="w-3.5 h-3.5" />
              <span>Core Business Insight • Repeat Recruiters</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">4. Repeat Recruiters Report</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Companies that have conducted <strong>more than one placement drive</strong> across academic years.
            </p>
          </div>
          <div className="bg-indigo-600/30 border border-indigo-400/30 px-4 py-2 rounded-xl text-right shrink-0">
            <span className="text-2xl font-black text-amber-300">{repeatRecruiters.length}</span>
            <span className="text-xs text-indigo-200 block font-semibold">Repeat Partners</span>
          </div>
        </div>

        {/* Repeat Recruiters Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {repeatRecruiters.map((company) => (
            <div
              key={company.company_id}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{company.name}</h3>
                    <p className="text-xs text-indigo-300 font-medium">
                      {company.industry} • {company.location}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-sm">
                    {company.drive_count} Drives
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                    Participating Academic Years:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.academic_years.map((year) => (
                      <span
                        key={year}
                        className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-950 text-indigo-200 border border-indigo-800/60"
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini Drives Timeline */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                {company.drives.map((d) => (
                  <div key={d.drive_id} className="flex justify-between items-center text-slate-400">
                    <span>{d.academic_year} ({d.drive_date})</span>
                    <span className="font-semibold text-indigo-300">{d.drive_status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Other 3 Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report 1: Companies by Year */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">1. Companies By Year</h2>
          </div>
          <p className="text-xs text-slate-500">Unique companies participating in each academic year</p>

          <div className="space-y-3">
            {companiesByYear.map((item) => (
              <div key={item.academic_year} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">{item.academic_year}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {item.company_count} Companies
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  <strong>Recruiters:</strong> {item.companies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report 2: Drives by Year */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">2. Drives By Year</h2>
          </div>
          <p className="text-xs text-slate-500">Placement drive count and status breakdown per year</p>

          <div className="space-y-3">
            {drivesByYear.map((item) => (
              <div key={item.academic_year} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-extrabold text-slate-900 text-sm">{item.academic_year}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {item.drive_count} Total Drives
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1 border-t border-slate-200/60">
                  <div className="bg-emerald-50 p-1 rounded text-emerald-800 font-bold">
                    Completed: {item.completed_count}
                  </div>
                  <div className="bg-blue-50 p-1 rounded text-blue-800 font-bold">
                    Ongoing: {item.ongoing_count}
                  </div>
                  <div className="bg-amber-50 p-1 rounded text-amber-800 font-bold">
                    Planned: {item.planned_count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report 3: Industry-wise Participation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">3. Industry Participation</h2>
          </div>
          <p className="text-xs text-slate-500">Recruitment drive distribution by industry sector</p>

          <div className="space-y-3">
            {industryPart.map((item) => (
              <div key={item.industry} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">{item.industry}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {item.drive_count} Drives
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Companies in Sector: <strong className="text-slate-900">{item.company_count}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
