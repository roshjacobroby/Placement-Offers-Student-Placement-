import React, { useEffect, useState } from 'react';
import { Company, PlacementDrive } from '../types';
import { X, Building2, MapPin, Briefcase, Calendar, Plus, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface CompanyProfileModalProps {
  companyId: number | null;
  onClose: () => void;
  onAddDriveForCompany: (companyId: number) => void;
  onViewDriveDetails: (drive: PlacementDrive) => void;
}

interface FullCompanyProfile extends Company {
  drives: PlacementDrive[];
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  companyId,
  onClose,
  onAddDriveForCompany,
  onViewDriveDetails,
}) => {
  const [profile, setProfile] = useState<FullCompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    setLoading(true);
    setError(null);
    fetch(`/api/companies/${companyId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch company profile');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [companyId]);

  if (!companyId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="py-4 text-slate-400 text-sm">Loading company profile...</div>
          ) : profile ? (
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Master Entity Profile (ID: #{profile.company_id})</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">{profile.name}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Industry: <strong className="text-white">{profile.industry}</strong></span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Location: <strong className="text-white">{profile.location}</strong></span>
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {profile && (
            <div className="space-y-5">
              {/* Placement Drives Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Associated Placement Drives ({profile.drives.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    All placement drives linked to master company record: <strong className="text-slate-800">{profile.name}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onAddDriveForCompany(profile.company_id);
                  }}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Drive</span>
                </button>
              </div>

              {/* Drives List */}
              {profile.drives.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No placement drives found for {profile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Click 'Add New Drive' to schedule a recruitment drive.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.drives.map((drive) => {
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'Completed':
                          return (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          );
                        case 'Ongoing':
                          return (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span>Ongoing</span>
                            </span>
                          );
                        default:
                          return (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              <AlertCircle className="w-3 h-3" />
                              <span>Planned</span>
                            </span>
                          );
                      }
                    };

                    return (
                      <div
                        key={drive.drive_id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-extrabold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-md">
                              {drive.academic_year}
                            </span>
                            {getStatusBadge(drive.drive_status)}
                          </div>
                          <p className="text-xs text-slate-600 pt-1">
                            <strong>Date:</strong> {drive.drive_date}
                          </p>
                          <p className="text-xs text-slate-600">
                            <strong>Criteria:</strong> {drive.eligibility_criteria}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onViewDriveDetails({
                              ...drive,
                              company_name: profile.name,
                              industry: profile.industry,
                              location: profile.location,
                            });
                          }}
                          className="flex items-center justify-center space-x-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
                        >
                          <span>Drive Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
