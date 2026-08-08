# Technology Decision & Architectural Specification (V05)

## 1. Technology Chosen

- **Frontend**: React 19 + Vite + Tailwind CSS + Lucide Icons + Motion
- **Backend**: Node.js + Express
- **Database**: SQLite (via `sql.js` with binary filesystem persistence `v05_placement.db`)
- **Architecture**: Monolithic full-stack application running on port 3000

---

## 2. Why This Stack Was Chosen

1. **Hackathon Efficiency**: React + Express + SQLite is simple, fast, and easy to run locally on any OS without complex dependencies.
2. **Zero External DB Setup**: SQLite stores all data locally in `v05_placement.db`. No PostgreSQL/MySQL database server installation is required.
3. **Single Port Execution**: Express hosts both the REST API `/api/*` and serves Vite frontend assets on port `3000`.
4. **Relational Integrity**: SQLite enforces standard SQL Foreign Keys, UNIQUE constraints, joins, and aggregate functions (`GROUP BY`, `HAVING`).

---

## 3. Database Design & Schema

### COMPANY (Master Table)
- `company_id` (INTEGER, Primary Key, Auto Increment)
- `name` (TEXT, UNIQUE, Not Null) — e.g. "Infosys"
- `industry` (TEXT, Not Null) — e.g. "IT"
- `location` (TEXT, Not Null) — e.g. "Bengaluru"
- `created_at` (DATETIME, Default CURRENT_TIMESTAMP)

### PLACEMENT_DRIVE (Transaction / Detail Table)
- `drive_id` (INTEGER, Primary Key, Auto Increment)
- `company_id` (INTEGER, Foreign Key → `companies.company_id`)
- `academic_year` (TEXT, Not Null) — e.g. "2024-25"
- `eligibility_criteria` (TEXT, Not Null) — e.g. "CSE/ECE, CGPA >= 7.0"
- `drive_status` (TEXT, Not Null) — "Planned" | "Ongoing" | "Completed"
- `drive_date` (TEXT, Not Null) — e.g. "2025-10-10"
- `created_at` (DATETIME, Default CURRENT_TIMESTAMP)

### ACADEMIC_YEAR (Lookup Table)
- `id` (INTEGER, Primary Key, Auto Increment)
- `year_name` (TEXT, UNIQUE, Not Null) — e.g. "2024-25"

---

## 4. Entity Relationship (ER) Diagram

```text
+-----------------------+              +-----------------------------------+
|       COMPANY         |              |          PLACEMENT_DRIVE          |
+-----------------------+              +-----------------------------------+
| company_id (PK)       | 1          N | drive_id (PK)                     |
| name (UNIQUE)         |<------------>| company_id (FK -> company_id)    |
| industry              |              | academic_year                     |
| location              |              | eligibility_criteria              |
| created_at            |              | drive_status                      |
+-----------------------+              | drive_date                        |
                                       | created_at                        |
                                       +-----------------------------------+
```

---

## 5. Why Company is a Master Entity & How Duplication is Prevented

### Master Entity Concept
A company visiting the institution is a **reusable master entity**. Infosys remains Infosys whether they visit in 2024-25, 2025-26, or 2026-27.

### Prevention of Data Duplication
1. **Schema Constraints**: The `name` column in `companies` is defined as `UNIQUE`. Attempting to insert a duplicate company name throws a database validation error.
2. **Foreign Key Reference**: The `placement_drives` table stores **ONLY** `company_id`. Company details (name, industry, location) are **NOT** duplicated inside `placement_drives`.
3. **UI Enforcement**: When creating a placement drive, the user **selects an existing company from a dropdown menu**. The user is **NOT** allowed or asked to re-enter company name, industry, or location.

---

## 6. Calculation of Reports & Repeat Recruiters

All reports are calculated **dynamically from SQL database queries** (never hardcoded):

1. **Companies by Year**:
   ```sql
   SELECT academic_year, COUNT(DISTINCT company_id) as company_count
   FROM placement_drives
   GROUP BY academic_year;
   ```

2. **Drives by Year**:
   ```sql
   SELECT academic_year, COUNT(*) as drive_count
   FROM placement_drives
   GROUP BY academic_year;
   ```

3. **Industry-Wise Participation**:
   ```sql
   SELECT c.industry, COUNT(DISTINCT c.company_id) as company_count, COUNT(pd.drive_id) as drive_count
   FROM companies c
   LEFT JOIN placement_drives pd ON c.company_id = pd.company_id
   GROUP BY c.industry;
   ```

4. **Repeat Recruiters**:
   ```sql
   SELECT c.company_id, c.name, c.industry, c.location, COUNT(pd.drive_id) as drive_count
   FROM companies c
   JOIN placement_drives pd ON c.company_id = pd.company_id
   GROUP BY c.company_id
   HAVING drive_count > 1
   ORDER BY drive_count DESC;
   ```

---

## 7. Simple Setup Instructions (Windows)

```text
STEP 1: Open VS Code.
STEP 2: Open the project folder.
STEP 3: Open Terminal (Ctrl + `).
STEP 4: Run 'npm install' to install dependencies.
STEP 5: Run 'npm run dev' to launch the system.
STEP 6: Open browser at http://localhost:3000
```
