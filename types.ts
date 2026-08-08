export interface Company {
  company_id: number;
  name: string;
  industry: string;
  location: string;
  created_at?: string;
  drive_count?: number;
}

export interface PlacementDrive {
  drive_id: number;
  company_id: number;
  company_name?: string;
  industry?: string;
  location?: string;
  academic_year: string;
  eligibility_criteria: string;
  drive_status: 'Planned' | 'Ongoing' | 'Completed';
  drive_date: string;
  created_at?: string;
}

export interface AcademicYear {
  id: number;
  year_name: string;
}

export interface DashboardStats {
  total_companies: number;
  total_drives: number;
  companies_by_industry: { industry: string; count: number }[];
  drives_by_year: { academic_year: string; count: number }[];
  repeat_recruiters_count: number;
  repeat_recruiters: {
    company_id: number;
    name: string;
    industry: string;
    location: string;
    drive_count: number;
  }[];
}

export interface CompaniesByYearReport {
  academic_year: string;
  company_count: number;
  companies: string[];
}

export interface DrivesByYearReport {
  academic_year: string;
  drive_count: number;
  planned_count: number;
  ongoing_count: number;
  completed_count: number;
}

export interface IndustryParticipationReport {
  industry: string;
  company_count: number;
  drive_count: number;
}

export interface RepeatRecruiter {
  company_id: number;
  name: string;
  industry: string;
  location: string;
  drive_count: number;
  academic_years: string[];
  drives: {
    drive_id: number;
    academic_year: string;
    drive_date: string;
    drive_status: string;
    eligibility_criteria: string;
  }[];
}
