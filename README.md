# Employer & Placement Drive Management System (V05)

An enterprise-grade, full-stack placement drive and employer management portal engineered for university placement offices. Built with **React 18**, **TypeScript**, **Tailwind CSS**, **Express.js**, and an in-memory **SQLite** engine (`sql.js`).

---

## 🎯 Architecture & Data Normalization

This application strictly solves **Master Entity Redundancy** and **Data Duplication** challenges inherent in legacy placement logs:

1. **Master Entity (`companies`)**: Stores non-changing corporate profile attributes (`company_id`, `name`, `industry`, `location`).
2. **Event Data (`placement_drives`)**: Captures campus recruitment events linked via `company_id` foreign key (`drive_id`, `company_id`, `academic_year`, `eligibility_criteria`, `drive_status`, `drive_date`).
3. **Academic Reference (`academic_years`)**: Normalized reference table storing institutional calendar periods (`year_name`).

### 💡 Key Benefits
- **Zero Redundancy**: Repeating recruiters (e.g. Infosys, Deloitte, TCS) are created ONCE in the `companies` master table. Subsequent placement drives reference the existing record without re-entering company attributes.
- **Accurate Analytics**: Dynamic SQL queries join `companies` and `placement_drives` to render real-time repeat recruiter metrics and multi-year recruitment participation.

---

## ✨ Features

- 📊 **Dashboard Overview**: Key placement metrics, industry distribution charts, academic year breakdown, and repeat recruiter stats.
- 🏢 **Master Companies Management**: Search, filter by industry, add, edit, or remove master corporate entities with unique name enforcement.
- 📅 **Placement Drives Manager**: Schedule and manage drives across academic years with pre-populated company selection, branch eligibility criteria, and status tracking (`Planned`, `Ongoing`, `Completed`).
- 📈 **Analytical Reports**:
  - **Repeat Recruiters**: Dynamically aggregates companies visiting campus in multiple academic years.
  - **Companies & Drives by Academic Year**: Comprehensive breakdown of recruiter volume over time.
  - **Industry Participation**: High-level corporate sector involvement analysis.
- 🗺️ **Interactive ER Diagram**: Visual representation of the relational schema with foreign key relationships and cardinalities.
- 🧪 **Acceptance Test Suite**: Integrated verification suite testing core system constraints and API responses.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js, Vite Middleware
- **Database**: SQLite (`sql.js`) with automatic disk persistence (`v05_placement.db`)
- **Build Tooling**: Vite, esbuild, tsx

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/placement-management-system.git
   cd placement-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Run Production Server**:
   ```bash
   npm start
   ```

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/stats` | `GET` | Dashboard summary metrics and analytical breakdowns |
| `/api/companies` | `GET`, `POST` | List companies with search/filter or create new master record |
| `/api/companies/:id` | `GET`, `PUT`, `DELETE` | Retrieve company profile, update details, or delete record |
| `/api/drives` | `GET`, `POST` | List placement drives with filters or schedule new drive |
| `/api/drives/:id` | `PUT`, `DELETE` | Update placement drive or remove drive record |
| `/api/academic-years` | `GET`, `POST` | Fetch or add academic calendar years |
| `/api/reports/repeat-recruiters` | `GET` | Query companies conducting multi-year recruitment drives |
| `/api/reports/companies-by-year` | `GET` | Breakdown of distinct companies per academic year |
| `/api/reports/drives-by-year` | `GET` | Breakdown of total placement drives by status and year |
| `/api/reports/industry-participation` | `GET` | Industry-wise company and drive counts |
| `/api/reset-demo` | `POST` | Re-seed database with default hackathon sample data |

---

## 📄 License

MIT License — feel free to use and adapt for academic and placement office workflows!
