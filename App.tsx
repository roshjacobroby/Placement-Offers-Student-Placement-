import React, { useEffect, useState } from 'react';
import { Company, PlacementDrive, AcademicYear, DashboardStats } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CompaniesView } from './components/CompaniesView';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { DrivesView } from './components/DrivesView';
import { AddCompanyModal } from './components/AddCompanyModal';
import { EditCompanyModal } from './components/EditCompanyModal';
import { AddDriveModal } from './components/AddDriveModal';
import { EditDriveModal } from './components/EditDriveModal';
import { ReportsView } from './components/ReportsView';
import { ErDiagramView } from './components/ErDiagramView';
import { AcceptanceTestWidget } from './components/AcceptanceTestWidget';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'companies' | 'drives' | 'reports' | 'er-diagram' | 'acceptance-test'
  >('dashboard');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<number | null>(null);

  const [isAddDriveOpen, setIsAddDriveOpen] = useState(false);
  const [preselectedCompanyId, setPreselectedCompanyId] = useState<number | null>(null);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, compRes, drivesRes, yearsRes] = await Promise.all([
        fetch('/api/stats').then((res) => res.json()),
        fetch('/api/companies').then((res) => res.json()),
        fetch('/api/drives').then((res) => res.json()),
        fetch('/api/academic-years').then((res) => res.json()),
      ]);

      setStats(statsRes);
      setCompanies(compRes);
      setDrives(drivesRes);
      setAcademicYears(yearsRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      if (res.ok) {
        showToast('Database successfully reset to default hackathon demo state!');
        await fetchAllData();
      }
    } catch (err) {
      console.error('Failed to reset database:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteCompany = async (companyId: number, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${companyName}? This will also delete all linked placement drives.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/companies/${companyId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted company "${companyName}".`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Delete company failed:', err);
    }
  };

  const handleDeleteDrive = async (driveId: number) => {
    if (!window.confirm(`Are you sure you want to delete placement drive #${driveId}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/drives/${driveId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted placement drive #${driveId}.`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Delete drive failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-900 text-white shadow-lg border border-emerald-700 flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            loading={loading}
            onNavigate={setActiveTab}
            onAddCompany={() => setIsAddCompanyOpen(true)}
            onAddDrive={() => {
              setPreselectedCompanyId(null);
              setIsAddDriveOpen(true);
            }}
          />
        )}

        {activeTab === 'companies' && (
          <CompaniesView
            companies={companies}
            loading={loading}
            onAddCompany={() => setIsAddCompanyOpen(true)}
            onEditCompany={(c) => setEditingCompany(c)}
            onViewCompanyProfile={(id) => setViewingProfileId(id)}
            onDeleteCompany={handleDeleteCompany}
          />
        )}

        {activeTab === 'drives' && (
          <DrivesView
            drives={drives}
            companies={companies}
            academicYears={academicYears}
            loading={loading}
            onAddDrive={() => {
              setPreselectedCompanyId(null);
              setIsAddDriveOpen(true);
            }}
            onEditDrive={(d) => setEditingDrive(d)}
            onDeleteDrive={handleDeleteDrive}
            onViewCompanyProfile={(id) => setViewingProfileId(id)}
          />
        )}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'er-diagram' && <ErDiagramView />}

        {activeTab === 'acceptance-test' && (
          <AcceptanceTestWidget
            onViewCompanyProfile={(id) => setViewingProfileId(id)}
            onNavigate={setActiveTab}
            onRefreshData={fetchAllData}
          />
        )}
      </main>

      {/* Modals */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onCompanyAdded={() => {
          showToast('New master company created successfully!');
          fetchAllData();
        }}
      />

      <EditCompanyModal
        company={editingCompany}
        onClose={() => setEditingCompany(null)}
        onCompanyUpdated={() => {
          showToast('Company details updated.');
          fetchAllData();
        }}
      />

      <CompanyProfileModal
        companyId={viewingProfileId}
        onClose={() => setViewingProfileId(null)}
        onAddDriveForCompany={(compId) => {
          setPreselectedCompanyId(compId);
          setIsAddDriveOpen(true);
        }}
        onViewDriveDetails={(drive) => {
          setEditingDrive(drive);
        }}
      />

      <AddDriveModal
        isOpen={isAddDriveOpen}
        onClose={() => setIsAddDriveOpen(false)}
        companies={companies}
        academicYears={academicYears}
        preselectedCompanyId={preselectedCompanyId}
        onDriveCreated={() => {
          showToast('Placement drive scheduled successfully!');
          fetchAllData();
        }}
      />

      <EditDriveModal
        drive={editingDrive}
        companies={companies}
        academicYears={academicYears}
        onClose={() => setEditingDrive(null)}
        onDriveUpdated={() => {
          showToast('Placement drive updated.');
          fetchAllData();
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-xs border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Employer & Placement Drive Management System • V05 Hackathon MVP</span>
          <span>Master Entity Normalization • SQLite Engine</span>
        </div>
      </footer>
    </div>
  );
}
