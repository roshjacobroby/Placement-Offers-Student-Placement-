import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'v05_placement.db');

let db: Database | null = null;

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables with Foreign Key constraints enabled
  db.run(`PRAGMA foreign_keys = ON;`);

  db.run(`
    CREATE TABLE IF NOT EXISTS academic_years (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year_name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companies (
      company_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      industry TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS placement_drives (
      drive_id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      eligibility_criteria TEXT NOT NULL,
      drive_status TEXT NOT NULL,
      drive_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
    );
  `);

  // Seed default data if empty
  const companyCheck = db.exec('SELECT COUNT(*) as count FROM companies');
  const count = companyCheck[0]?.values[0]?.[0] as number || 0;

  if (count === 0) {
    seedDatabase(db);
  } else {
    saveDb();
  }

  return db;
}

export function seedDatabase(database: Database) {
  database.run(`DELETE FROM placement_drives;`);
  database.run(`DELETE FROM companies;`);
  database.run(`DELETE FROM academic_years;`);

  // Seed Academic Years
  const years = ['2023-24', '2024-25', '2025-26', '2026-27'];
  for (const yr of years) {
    database.run(`INSERT INTO academic_years (year_name) VALUES (?)`, [yr]);
  }

  // Seed 10 Companies across 5 Industries
  const companiesData = [
    { name: 'Infosys', industry: 'IT', location: 'Bengaluru' },
    { name: 'TCS', industry: 'IT', location: 'Mumbai' },
    { name: 'Wipro', industry: 'IT', location: 'Bengaluru' },
    { name: 'Accenture', industry: 'Consulting', location: 'Gurugram' },
    { name: 'Deloitte', industry: 'Consulting', location: 'Hyderabad' },
    { name: 'Bosch', industry: 'Manufacturing', location: 'Pune' },
    { name: 'IBM', industry: 'IT', location: 'Bengaluru' },
    { name: 'L&T', industry: 'Engineering', location: 'Mumbai' },
    { name: 'HDFC Bank', industry: 'Banking', location: 'Mumbai' },
    { name: 'Tata Motors', industry: 'Automotive', location: 'Pune' },
  ];

  for (const c of companiesData) {
    database.run(
      `INSERT INTO companies (name, industry, location) VALUES (?, ?, ?)`,
      [c.name, c.industry, c.location]
    );
  }

  // Get company_ids mapped by name
  const res = database.exec(`SELECT company_id, name FROM companies`);
  const companyMap: Record<string, number> = {};
  if (res[0]) {
    for (const row of res[0].values) {
      companyMap[row[1] as string] = row[0] as number;
    }
  }

  // Seed 16 Placement Drives across academic years (with repeat recruiters Infosys, TCS, Deloitte, Accenture, Bosch)
  const drivesData = [
    // Repeat Recruiter: Infosys (3 drives)
    {
      company_name: 'Infosys',
      academic_year: '2024-25',
      eligibility_criteria: 'CSE / ISE / ECE, CGPA >= 7.0, No active backlogs',
      drive_status: 'Completed',
      drive_date: '2024-09-15',
    },
    {
      company_name: 'Infosys',
      academic_year: '2025-26',
      eligibility_criteria: 'All Engineering branches, CGPA >= 6.5',
      drive_status: 'Ongoing',
      drive_date: '2025-10-10',
    },
    {
      company_name: 'Infosys',
      academic_year: '2026-27',
      eligibility_criteria: 'CSE / ECE, CGPA >= 7.5',
      drive_status: 'Planned',
      drive_date: '2026-11-01',
    },

    // Repeat Recruiter: TCS (2 drives)
    {
      company_name: 'TCS',
      academic_year: '2024-25',
      eligibility_criteria: 'B.Tech / M.Tech, CGPA >= 6.0',
      drive_status: 'Completed',
      drive_date: '2024-10-20',
    },
    {
      company_name: 'TCS',
      academic_year: '2025-26',
      eligibility_criteria: 'CSE / IT / ECE, CGPA >= 7.0',
      drive_status: 'Planned',
      drive_date: '2025-11-15',
    },

    // Repeat Recruiter: Deloitte (3 drives)
    {
      company_name: 'Deloitte',
      academic_year: '2024-25',
      eligibility_criteria: 'CSE / ISE / EEE / MBA, CGPA >= 7.5',
      drive_status: 'Completed',
      drive_date: '2024-08-12',
    },
    {
      company_name: 'Deloitte',
      academic_year: '2025-26',
      eligibility_criteria: 'CSE / ISE / Finance, CGPA >= 7.5',
      drive_status: 'Completed',
      drive_date: '2025-08-18',
    },
    {
      company_name: 'Deloitte',
      academic_year: '2026-27',
      eligibility_criteria: 'All B.Tech streams, CGPA >= 8.0',
      drive_status: 'Planned',
      drive_date: '2026-09-05',
    },

    // Repeat Recruiter: Accenture (2 drives)
    {
      company_name: 'Accenture',
      academic_year: '2024-25',
      eligibility_criteria: 'CSE / IT / Mech, CGPA >= 6.5',
      drive_status: 'Completed',
      drive_date: '2024-11-05',
    },
    {
      company_name: 'Accenture',
      academic_year: '2025-26',
      eligibility_criteria: 'All streams, CGPA >= 6.5',
      drive_status: 'Ongoing',
      drive_date: '2025-12-02',
    },

    // Repeat Recruiter: Bosch (2 drives)
    {
      company_name: 'Bosch',
      academic_year: '2024-25',
      eligibility_criteria: 'Mech / ECE / EEE, CGPA >= 7.0',
      drive_status: 'Completed',
      drive_date: '2024-12-01',
    },
    {
      company_name: 'Bosch',
      academic_year: '2025-26',
      eligibility_criteria: 'ECE / EEE / Robotics, CGPA >= 7.5',
      drive_status: 'Planned',
      drive_date: '2026-01-20',
    },

    // Single Drive Companies
    {
      company_name: 'Wipro',
      academic_year: '2024-25',
      eligibility_criteria: 'CSE / ISE, CGPA >= 6.0',
      drive_status: 'Completed',
      drive_date: '2024-09-28',
    },
    {
      company_name: 'IBM',
      academic_year: '2025-26',
      eligibility_criteria: 'CSE / AI-ML, CGPA >= 7.5',
      drive_status: 'Ongoing',
      drive_date: '2025-09-14',
    },
    {
      company_name: 'L&T',
      academic_year: '2024-25',
      eligibility_criteria: 'Civil / Mechanical / Electrical, CGPA >= 7.0',
      drive_status: 'Completed',
      drive_date: '2024-07-22',
    },
    {
      company_name: 'HDFC Bank',
      academic_year: '2025-26',
      eligibility_criteria: 'MBA / B.Tech Data Analytics, CGPA >= 6.5',
      drive_status: 'Planned',
      drive_date: '2026-02-10',
    },
    {
      company_name: 'Tata Motors',
      academic_year: '2024-25',
      eligibility_criteria: 'Automobile / Mech / ECE, CGPA >= 7.0',
      drive_status: 'Completed',
      drive_date: '2024-10-02',
    },
  ];

  for (const d of drivesData) {
    const compId = companyMap[d.company_name];
    if (compId) {
      database.run(
        `INSERT INTO placement_drives (company_id, academic_year, eligibility_criteria, drive_status, drive_date)
         VALUES (?, ?, ?, ?, ?)`,
        [compId, d.academic_year, d.eligibility_criteria, d.drive_status, d.drive_date]
      );
    }
  }

  saveDb();
}

// Database helper functions
export function execQuery(database: Database, sql: string, params: any[] = []) {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}
