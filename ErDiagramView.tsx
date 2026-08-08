import React from 'react';
import { Network, Database, Key, ShieldCheck, ArrowDown, Check, Layers } from 'lucide-react';

export const ErDiagramView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-2">
          <Network className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Entity Relationship (ER) Diagram</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Relational Database Schema demonstrating Master Entity Normalization (1 : Many) in V05.
        </p>
      </div>

      {/* Visual ER Diagram Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold">Relational Database Architecture</h2>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full font-mono">
            SQLite Database • 1 : N Relationship
          </span>
        </div>

        {/* Diagram Entities Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Master Entity: COMPANY */}
          <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 p-5 shadow-lg relative">
            <div className="bg-indigo-600 text-white font-extrabold text-sm px-3 py-1 rounded-md -mt-8 mb-3 inline-block shadow-sm uppercase tracking-wider">
              1 • Master Entity
            </div>
            <h3 className="text-lg font-black text-white mb-2">COMPANY</h3>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold bg-slate-900/60 p-1.5 rounded">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>company_id (PK)</span>
              </div>
              <div className="text-slate-200 p-1">name (UNIQUE)</div>
              <div className="text-slate-300 p-1">industry</div>
              <div className="text-slate-300 p-1">location</div>
              <div className="text-slate-400 p-1 text-[10px]">created_at</div>
            </div>
          </div>

          {/* Relationship Connector Arrow */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <div className="hidden md:flex items-center space-x-2 text-indigo-400 font-extrabold text-xs bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <span>1</span>
              <span>──── CONDUCTS ────►</span>
              <span>N</span>
            </div>
            <div className="md:hidden flex flex-col items-center text-indigo-400 font-extrabold text-xs">
              <span>1</span>
              <ArrowDown className="w-5 h-5" />
              <span>N (Many Drives)</span>
            </div>
            <p className="text-[11px] text-slate-400 text-center max-w-xs">
              One company can conduct multiple placement drives over time.
            </p>
          </div>

          {/* Transaction Entity: PLACEMENT_DRIVE */}
          <div className="bg-slate-800 rounded-xl border-2 border-blue-500 p-5 shadow-lg relative">
            <div className="bg-blue-600 text-white font-extrabold text-sm px-3 py-1 rounded-md -mt-8 mb-3 inline-block shadow-sm uppercase tracking-wider">
              N • Detail Table
            </div>
            <h3 className="text-lg font-black text-white mb-2">PLACEMENT_DRIVE</h3>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold bg-slate-900/60 p-1.5 rounded">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>drive_id (PK)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-indigo-300 font-bold bg-indigo-950/80 p-1.5 rounded border border-indigo-700/60">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>company_id (FK → Company)</span>
              </div>
              <div className="text-slate-200 p-1">academic_year</div>
              <div className="text-slate-200 p-1">eligibility_criteria</div>
              <div className="text-slate-300 p-1">drive_status</div>
              <div className="text-slate-300 p-1">drive_date</div>
            </div>
          </div>
        </div>

        {/* Core Architecture Callout */}
        <div className="bg-indigo-950/70 border border-indigo-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Core Principle: Prevention of Duplicate Company Records</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Company is the master entity. PlacementDrive references Company using <code className="text-amber-300 font-mono">company_id</code>.</strong>
            This architecture prevents duplicate company records. For example, when Infosys conducts drives in 2024-25, 2025-26, and 2026-27, Infosys is created once in <code className="text-indigo-300 font-mono">companies</code> table, and three separate rows are created in <code className="text-blue-300 font-mono">placement_drives</code> referencing <code className="text-amber-300 font-mono">company_id</code>.
          </p>
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>V05 Database Architectural Guarantees</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Unique Name Constraint</strong>
            Enforced at SQLite database engine level (`name TEXT UNIQUE NOT NULL`) to stop identical company name insertion.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. Foreign Key Integrity</strong>
            Enabled (`PRAGMA foreign_keys = ON`) so drives cannot exist without a valid parent company.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Non-Duplicated Fields</strong>
            Company industry and location exist ONLY in the master `COMPANY` table.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">4. Real SQL Aggregate Queries</strong>
            Repeat recruiters and drive analytics are calculated directly via SQL `GROUP BY` and `HAVING` queries.
          </div>
        </div>
      </div>
    </div>
  );
};
