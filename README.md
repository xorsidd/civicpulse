# CivicPulse — Full-Stack AI Civic Issue Intelligence Platform

CivicPulse is an AI-powered civic issue reporting and management platform designed to transform raw citizen complaints into structured, validated, duplicate-detected, clustered, severity-assessed, and priority-scored civic intelligence.

---

## 1. Vision & Architecture

CivicPulse goes beyond basic CRUD complaint forms by implementing an automated **5-Stage Civic Intelligence Engine**:

```
Citizen Report
  ↳ AI Vision Analysis (Validity, Category, Severity, Hazard Detection)
    ↳ Multi-Signal Duplicate Detection (Haversine Distance + Category + Text + Image Similarity)
      ↳ Issue Clustering & Impact Scaling (Aggregating unique citizen reports & support votes)
        ↳ Priority Engine (Severity * 0.35 + Citizen Impact * 0.25 + Location Risk * 0.20 + Duration * 0.10 + Evidence * 0.10)
          ↳ Authority Dispatch Queue & Department Routing
            ↳ Repair Resolution Evidence Upload & AI Pre-Scan
              ↳ Citizen Verification ("YES, FIXED" vs "STILL A PROBLEM" -> Escalated Reopen)
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla Tailwind CSS + Glassmorphism Theme System
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Interceptor
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: Java 21 / Spring Boot 3.2.x
- **Build Tool**: Maven Wrapper
- **Security**: Spring Security + JWT Stateless Authentication + BCrypt Password Hashing
- **ORM / Database**: Spring Data JPA / Hibernate
- **Validation**: Bean Validation (`@Valid`)
- **Documentation**: SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)

### Database
- **DBMS**: MySQL 8.0+ (`civicpulse` database)
- **Key Tables**: `users`, `reports`, `ai_analysis`, `issue_clusters`, `report_cluster`, `support_votes`, `departments`, `issue_categories`, `category_department_mapping`, `zones`, `risk_locations`, `status_history`, `resolution_evidence`, `notifications`, `fraud_flags`.

---

## 3. Demo Credentials

The platform comes pre-seeded with realistic demonstration users:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **CITIZEN** | `citizen1@gmail.com` | `Citizen@123` | Aarav Mehta (Citizens can submit & verify reports) |
| **AUTHORITY (Roads)** | `roads.auth@civicpulse.gov` | `Auth@123` | Officer Rajesh Kumar (Roads & Infrastructure Dept) |
| **AUTHORITY (Sanitation)** | `sanitation.auth@civicpulse.gov` | `Auth@123` | Officer Priya Sharma (Sanitation Dept) |
| **ADMINISTRATOR** | `admin@civicpulse.gov` | `Admin@123` | System Administrator (Full System Controls) |

---

## 4. Getting Started & Running Locally

### Prerequisites
- Java 17 or Java 21 JDK
- Node.js v18+ & npm
- MySQL 8.0 running locally on port `3306`

### 1. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS civicpulse;
```

### 2. Backend Setup (Spring Boot)
Navigate to the `backend/` folder and run the Maven Wrapper:
```bash
cd backend
./mvnw.cmd spring-boot:run
```
*The backend server will start on `http://localhost:8080` and automatically seed initial sample reports, users, categories, and clusters into MySQL.*

### 3. Frontend Setup (React + Vite)
In a separate terminal, navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*The React Vite app will open at `http://localhost:3000` with an automatic proxy to the Spring Boot REST API.*

---

## 5. Running with Docker Compose

Run the full stack (MySQL + Spring Boot + Nginx React Frontend) with a single command:

```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Spring Boot Backend**: `http://localhost:8080`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 6. End-to-End Flow Walkthrough

1. **Citizen Submission (`/citizen/report`)**:
   - Upload pothole/waste image.
   - Auto-capture GPS coordinates or adjust pin on interactive Leaflet map.
   - Provide optional description.
   - Submit → AI Vision scans image & calculates confidence %.

2. **Duplicate Detection & Clustering**:
   - System calculates Haversine distance, category match, text & image similarity.
   - If distance <= 50m & score >= 80%, links to existing `IssueCluster` and offers citizen 1-click **"SUPPORT EXISTING ISSUE"**.

3. **Priority Queue & Authority Dispatch (`/authority/dashboard`)**:
   - Issues automatically sorted descending by Priority Score (0–100).
   - High-risk locations (Schools, Hospitals, Major Intersections) dynamically increase priority score.

4. **Resolution Upload & Citizen Verification**:
   - Authority uploads repair photo evidence → Status becomes `RESOLVED`.
   - Citizen receives notification and verifies resolution:
     - `[ YES, FIXED ]` → Status becomes `CITIZEN_VERIFIED`.
     - `[ STILL A PROBLEM ]` → Status becomes `REOPENED` & priority escalates.

---

## 7. License & Authors

Built for civic intelligence and municipal infrastructure automation.
