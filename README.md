# GeoVerse API

GeoVerse API is a production-grade SaaS platform that provides standardized Indian geographical hierarchy data through scalable REST APIs and modern dashboards.

The platform is designed for:

* E-commerce platforms
* Logistics companies
* Delivery services
* Government systems
* Developers needing structured Indian address data

GeoVerse API provides hierarchical geographical data including:

* Countries
* States
* Districts
* Sub-Districts
* Villages

---

# 🚀 Features

## Authentication System

* Secure login/signup
* Role-based access
* Session management
* Protected routes

## Geographical Data Management

* XLS/XLSX dataset upload
* Data normalization
* Bulk import system
* Duplicate removal
* Hierarchical data relationships

## Search System

* Village search
* District search
* State filtering
* Autocomplete suggestions
* Fast hierarchical queries
* Pagination support

## REST API Platform

* Scalable REST APIs
* API key system
* JSON responses
* Usage tracking
* API playground

## Dashboard System

### Admin Dashboard

* User analytics
* API usage monitoring
* Dataset management
* Search analytics
* Activity logs

### Client Dashboard

* API key management
* Usage statistics
* Search playground
* Endpoint testing

## Analytics

* API request trends
* Top searched locations
* User activity graphs
* Usage metrics

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Shadcn UI
* Recharts

## Backend & Database

* Supabase
* PostgreSQL

## Deployment

* Vercel

## Version Control

* GitHub

---

# 📂 Project Structure

```bash
GeoVerse-API/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── utils/
│   ├── types/
│   └── styles/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed/
│
├── .env
├── package.json
└── README.md
```

---

# 🗄️ Database Schema

## Main Tables

### countries

Stores country-level data.

### states

Stores Indian states and union territories.

### districts

Stores district-level data.

### sub_districts

Stores talukas/blocks/sub-districts.

### villages

Stores village-level geographical data.

### users

Stores platform users.

### api_keys

Stores generated API credentials.

### api_logs

Tracks API usage and analytics.

---

# 🔗 API Endpoints

## States

```http
GET /states
```

## Districts

```http
GET /districts
```

## Sub-Districts

```http
GET /subdistricts
```

## Villages

```http
GET /villages
```

## Search

```http
GET /search?q=
```

## Autocomplete

```http
GET /autocomplete?q=
```

---

# 📊 Dataset Information

The application supports importing large-scale Indian geographical datasets.

Expected dataset columns:

* MDDS STC
* STATE NAME
* MDDS DTC
* DISTRICT NAME
* MDDS Sub_DT
* SUB-DISTRICT NAME
* MDDS PLCN
* Area Name

The import system:

* Validates data
* Removes duplicates
* Maintains relationships
* Handles large datasets efficiently

---

# 🧪 Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/geoverse-api.git
```

## 2. Navigate To Project

```bash
cd geoverse-api
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create `.env` file and add required keys.

## 5. Start Development Server

```bash
npm run dev
```

---

# ☁️ Deployment

## Frontend Deployment

Deploy using:

* Vercel

## Backend & Database

Managed using:

* Supabase

---

# 🔒 Security Features

* Protected routes
* Role-based access control
* Supabase authentication
* API key management
* Secure environment variables

---

# 📈 Future Enhancements

* Redis caching
* Advanced analytics
* AI-powered search
* Multi-country support
* Real-time monitoring
* API monetization
* Export functionality

---

# 🎯 Project Goal

GeoVerse API aims to provide a scalable, production-ready geographical API infrastructure for India’s complete village-level address hierarchy.

The platform demonstrates:

* Full-stack development
* Database architecture
* API engineering
* Data processing
* SaaS dashboard development
* Search optimization

---

# 👨‍💻 Author

Developed as part of a capstone internship project focused on real-world SaaS and API platform development.
