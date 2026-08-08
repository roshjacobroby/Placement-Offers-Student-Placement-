import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getDb, seedDatabase, execQuery } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Middleware to ensure DB is initialized
  app.use('/api', async (req, res, next) => {
    try {
      await getDb();
      next();
    } catch (err: any) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection failed' });
    }
  });

  // Helper function to save DB state to disk
  async function saveDatabase() {
    const db = await getDb();
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.join(process.cwd(), 'v05_placement.db'), buffer);
  }

  // --- API ROUTES ---

  // 1. Dashboard Statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const db = await getDb();

      const totalCompaniesRes = execQuery(db, 'SELECT COUNT(*) as count FROM companies');
      const totalDrivesRes = execQuery(db, 'SELECT COUNT(*) as count FROM placement_drives');

      const industryRes = execQuery(
        db,
        `SELECT industry, COUNT(*) as count FROM companies GROUP BY industry ORDER BY count DESC`
      );

      const yearDrivesRes = execQuery(
        db,
        `SELECT academic_year, COUNT(*) as count FROM placement_drives GROUP BY academic_year ORDER BY academic_year ASC`
      );

      const repeatRes = execQuery(
        db,
        `SELECT c.company_id, c.name, c.industry, c.location, COUNT(pd.drive_id) as drive_count
         FROM companies c
         JOIN placement_drives pd ON c.company_id = pd.company_id
         GROUP BY c.company_id
         HAVING drive_count > 1
         ORDER BY drive_count DESC`
      );

      res.json({
        total_companies: totalCompaniesRes[0]?.count || 0,
        total_drives: totalDrivesRes[0]?.count || 0,
        companies_by_industry: industryRes,
        drives_by_year: yearDrivesRes,
        repeat_recruiters_count: repeatRes.length,
        repeat_recruiters: repeatRes,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Academic Years
  app.get('/api/academic-years', async (req, res) => {
    try {
      const db = await getDb();
      const rows = execQuery(db, 'SELECT * FROM academic_years ORDER BY year_name ASC');
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/academic-years', async (req, res) => {
    try {
      const db = await getDb();
      const { year_name } = req.body;
      if (!year_name) return res.status(400).json({ error: 'Academic year name is required' });

      db.run(`INSERT OR IGNORE INTO academic_years (year_name) VALUES (?)`, [year_name]);
      await saveDatabase();
      res.json({ success: true, year_name });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Companies CRUD & Search/Filter
  app.get('/api/companies', async (req, res) => {
    try {
      const db = await getDb();
      const { search, industry } = req.query;

      let sql = `
        SELECT c.*, COUNT(pd.drive_id) as drive_count
        FROM companies c
        LEFT JOIN placement_drives pd ON c.company_id = pd.company_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (search) {
        sql += ` AND (c.name LIKE ? OR c.location LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      if (industry && industry !== 'ALL') {
        sql += ` AND c.industry = ?`;
        params.push(industry);
      }

      sql += ` GROUP BY c.company_id ORDER BY c.name ASC`;

      const rows = execQuery(db, sql, params);
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const db = await getDb();
      const companyId = Number(req.params.id);

      const compRows = execQuery(db, `SELECT * FROM companies WHERE company_id = ?`, [companyId]);
      if (compRows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const drivesRows = execQuery(
        db,
        `SELECT * FROM placement_drives WHERE company_id = ? ORDER BY drive_date DESC`,
        [companyId]
      );

      res.json({
        ...compRows[0],
        drives: drivesRows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/companies', async (req, res) => {
    try {
      const db = await getDb();
      const { name, industry, location } = req.body;

      if (!name || !industry || !location) {
        return res.status(400).json({ error: 'Company Name, Industry, and Location are required' });
      }

      // Check for duplicate company name
      const existing = execQuery(db, `SELECT company_id FROM companies WHERE LOWER(name) = LOWER(?)`, [
        name.trim(),
      ]);
      if (existing.length > 0) {
        return res.status(400).json({
          error: `A company with the name "${name.trim()}" already exists. Company records must be unique!`,
        });
      }

      db.run(`INSERT INTO companies (name, industry, location) VALUES (?, ?, ?)`, [
        name.trim(),
        industry.trim(),
        location.trim(),
      ]);

      const lastIdRes = execQuery(db, `SELECT last_insert_rowid() as id`);
      const newId = lastIdRes[0]?.id;

      await saveDatabase();

      res.status(201).json({
        company_id: newId,
        name: name.trim(),
        industry: industry.trim(),
        location: location.trim(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/companies/:id', async (req, res) => {
    try {
      const db = await getDb();
      const companyId = Number(req.params.id);
      const { name, industry, location } = req.body;

      if (!name || !industry || !location) {
        return res.status(400).json({ error: 'Company Name, Industry, and Location are required' });
      }

      // Check duplicate name on other record
      const existing = execQuery(
        db,
        `SELECT company_id FROM companies WHERE LOWER(name) = LOWER(?) AND company_id != ?`,
        [name.trim(), companyId]
      );
      if (existing.length > 0) {
        return res
          .status(400)
          .json({ error: `Another company named "${name.trim()}" already exists.` });
      }

      db.run(`UPDATE companies SET name = ?, industry = ?, location = ? WHERE company_id = ?`, [
        name.trim(),
        industry.trim(),
        location.trim(),
        companyId,
      ]);

      await saveDatabase();

      res.json({ company_id: companyId, name: name.trim(), industry: industry.trim(), location: location.trim() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/companies/:id', async (req, res) => {
    try {
      const db = await getDb();
      const companyId = Number(req.params.id);

      db.run(`DELETE FROM placement_drives WHERE company_id = ?`, [companyId]);
      db.run(`DELETE FROM companies WHERE company_id = ?`, [companyId]);

      await saveDatabase();

      res.json({ success: true, message: 'Company and associated drives deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Placement Drives CRUD & Search/Filter
  app.get('/api/drives', async (req, res) => {
    try {
      const db = await getDb();
      const { search, academic_year, company_id, status } = req.query;

      let sql = `
        SELECT pd.*, c.name as company_name, c.industry, c.location
        FROM placement_drives pd
        JOIN companies c ON pd.company_id = c.company_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (search) {
        sql += ` AND (c.name LIKE ? OR pd.eligibility_criteria LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      if (academic_year && academic_year !== 'ALL') {
        sql += ` AND pd.academic_year = ?`;
        params.push(academic_year);
      }

      if (company_id && company_id !== 'ALL') {
        sql += ` AND pd.company_id = ?`;
        params.push(Number(company_id));
      }

      if (status && status !== 'ALL') {
        sql += ` AND pd.drive_status = ?`;
        params.push(status);
      }

      sql += ` ORDER BY pd.drive_date DESC, pd.drive_id DESC`;

      const rows = execQuery(db, sql, params);
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/drives', async (req, res) => {
    try {
      const db = await getDb();
      const { company_id, academic_year, eligibility_criteria, drive_status, drive_date } = req.body;

      if (!company_id || !academic_year || !eligibility_criteria || !drive_status || !drive_date) {
        return res.status(400).json({
          error: 'Company, Academic Year, Eligibility Criteria, Status, and Date are all required.',
        });
      }

      // Verify company exists
      const compCheck = execQuery(db, `SELECT company_id, name FROM companies WHERE company_id = ?`, [
        Number(company_id),
      ]);
      if (compCheck.length === 0) {
        return res.status(404).json({ error: 'Selected company does not exist' });
      }

      db.run(
        `INSERT INTO placement_drives (company_id, academic_year, eligibility_criteria, drive_status, drive_date)
         VALUES (?, ?, ?, ?, ?)`,
        [
          Number(company_id),
          academic_year.trim(),
          eligibility_criteria.trim(),
          drive_status.trim(),
          drive_date.trim(),
        ]
      );

      const lastIdRes = execQuery(db, `SELECT last_insert_rowid() as id`);
      const newDriveId = lastIdRes[0]?.id;

      await saveDatabase();

      res.status(201).json({
        drive_id: newDriveId,
        company_id: Number(company_id),
        company_name: compCheck[0].name,
        academic_year: academic_year.trim(),
        eligibility_criteria: eligibility_criteria.trim(),
        drive_status: drive_status.trim(),
        drive_date: drive_date.trim(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/drives/:id', async (req, res) => {
    try {
      const db = await getDb();
      const driveId = Number(req.params.id);
      const { company_id, academic_year, eligibility_criteria, drive_status, drive_date } = req.body;

      if (!company_id || !academic_year || !eligibility_criteria || !drive_status || !drive_date) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      db.run(
        `UPDATE placement_drives
         SET company_id = ?, academic_year = ?, eligibility_criteria = ?, drive_status = ?, drive_date = ?
         WHERE drive_id = ?`,
        [
          Number(company_id),
          academic_year.trim(),
          eligibility_criteria.trim(),
          drive_status.trim(),
          drive_date.trim(),
          driveId,
        ]
      );

      await saveDatabase();

      res.json({ success: true, drive_id: driveId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/drives/:id', async (req, res) => {
    try {
      const db = await getDb();
      const driveId = Number(req.params.id);

      db.run(`DELETE FROM placement_drives WHERE drive_id = ?`, [driveId]);

      await saveDatabase();

      res.json({ success: true, message: 'Drive deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Reports & Analytics APIs
  // Report 1: Companies by year
  app.get('/api/reports/companies-by-year', async (req, res) => {
    try {
      const db = await getDb();
      const rows = execQuery(
        db,
        `SELECT
           pd.academic_year,
           COUNT(DISTINCT pd.company_id) as company_count,
           GROUP_CONCAT(DISTINCT c.name) as company_names
         FROM placement_drives pd
         JOIN companies c ON pd.company_id = c.company_id
         GROUP BY pd.academic_year
         ORDER BY pd.academic_year ASC`
      );

      const formatted = rows.map((r: any) => ({
        academic_year: r.academic_year,
        company_count: r.company_count,
        companies: r.company_names ? (r.company_names as string).split(',') : [],
      }));

      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Report 2: Drives by year
  app.get('/api/reports/drives-by-year', async (req, res) => {
    try {
      const db = await getDb();
      const rows = execQuery(
        db,
        `SELECT
           academic_year,
           COUNT(*) as drive_count,
           SUM(CASE WHEN drive_status = 'Planned' THEN 1 ELSE 0 END) as planned_count,
           SUM(CASE WHEN drive_status = 'Ongoing' THEN 1 ELSE 0 END) as ongoing_count,
           SUM(CASE WHEN drive_status = 'Completed' THEN 1 ELSE 0 END) as completed_count
         FROM placement_drives
         GROUP BY academic_year
         ORDER BY academic_year ASC`
      );

      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Report 3: Industry-wise participation
  app.get('/api/reports/industry-participation', async (req, res) => {
    try {
      const db = await getDb();
      const rows = execQuery(
        db,
        `SELECT
           c.industry,
           COUNT(DISTINCT c.company_id) as company_count,
           COUNT(pd.drive_id) as drive_count
         FROM companies c
         LEFT JOIN placement_drives pd ON c.company_id = pd.company_id
         GROUP BY c.industry
         ORDER BY drive_count DESC, company_count DESC`
      );

      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Report 4: Repeat recruiters
  app.get('/api/reports/repeat-recruiters', async (req, res) => {
    try {
      const db = await getDb();

      // Find companies with > 1 drive
      const repeatCompanies = execQuery(
        db,
        `SELECT c.company_id, c.name, c.industry, c.location, COUNT(pd.drive_id) as drive_count
         FROM companies c
         JOIN placement_drives pd ON c.company_id = pd.company_id
         GROUP BY c.company_id
         HAVING drive_count > 1
         ORDER BY drive_count DESC, c.name ASC`
      );

      // Fetch drive details for each repeat recruiter
      const result = [];
      for (const comp of repeatCompanies) {
        const compDrives = execQuery(
          db,
          `SELECT drive_id, academic_year, drive_date, drive_status, eligibility_criteria
           FROM placement_drives
           WHERE company_id = ?
           ORDER BY academic_year ASC, drive_date ASC`,
          [comp.company_id]
        );

        const academicYears = Array.from(new Set(compDrives.map((d: any) => d.academic_year)));

        result.push({
          ...comp,
          academic_years: academicYears,
          drives: compDrives,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset database endpoint
  app.post('/api/reset-demo', async (req, res) => {
    try {
      const db = await getDb();
      seedDatabase(db);
      res.json({ success: true, message: 'Database reset to default seed data' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
