# GeoVerse API

GeoVerse API is a production-grade SaaS platform designed to provide standardized Indian geographical hierarchy data through scalable REST APIs and modern dashboards.

The platform enables businesses, developers, logistics systems, e-commerce applications, and government services to access structured location data including:

* States
* Districts
* Sub-Districts
* Villages

GeoVerse API simplifies address management, dropdown systems, autocomplete functionality, and geographical data integration at scale.

---

# 🚀 Features

## 🔐 Authentication & Authorization

* Secure Signup/Login
* Role-based access control
* Protected routes
* Session persistence

## 🌍 Geographical Data Management

* State → District → Sub-District → Village hierarchy
* Large-scale dataset handling
* XLS/XLSX dataset upload support
* Data normalization and validation

## 🔎 Smart Search System

* Village search
* District search
* Autocomplete suggestions
* Dynamic filtering
* Pagination support

## 📡 REST API Platform

* Scalable API endpoints
* JSON responses
* API key management
* Usage tracking

## 📊 Analytics Dashboard

* API request analytics
* Search trends
* User statistics
* Usage visualization with charts

## 🎨 Modern SaaS UI

* Responsive dashboard
* Dark/Light mode
* Clean enterprise UI
* Mobile-friendly design

---

# 🛠️ Tech Stack

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

# 🏗️ System Architecture

```text id="9obz1s"
Client Application
        │
        ▼
React + Vite Frontend
        │
        ▼
Supabase Backend Services
        │
 ┌──────┴──────┐
 ▼             ▼
Authentication PostgreSQL Database
                    │
                    ▼
       Hierarchical Geographical Data
```

---

# 📂 Database Structure

## Core Tables

### countries

Stores country-level data.

### states

Stores state-level records.

### districts

Stores district-level records.

### sub_districts

Stores sub-district/taluka records.

### villages

Stores village-level data.

### users

Application users and roles.

### api_keys

API credentials and usage tracking.

### api_logs

API request monitoring and analytics.

---

# 📡 API Endpoints

## Get States

```http id="k4sy5l"
GET /states
```

## Get Districts

```http id="omumvu"
GET /districts
```

## Get Villages

```http id="w0lxn6"
GET /villages
```

## Search API

```http id="7iq0lj"
GET /search?q=
```

## Autocomplete API

```http id="s1wl3r"
GET /autocomplete?q=
```

---

# 📊 Dataset Support

The platform supports importing large XLS/XLSX datasets containing Indian geographical hierarchy data.

Supported Columns:

* MDDS STC
* STATE NAME
* MDDS DTC
* DISTRICT NAME
* MDDS Sub_DT
* SUB-DISTRICT NAME
* MDDS PLCN
* Area Name

The system automatically:

* Validates data
* Removes duplicates
* Maintains relationships
* Imports normalized records

---

# ⚙️ Installation

## Clone Repository

```bash id="yic86j"
git clone https://github.com/arun-kavali/GeoVerse-API.git
```

## Navigate to Project

```bash id="m2d7zn"
cd geoverse-api
```

## Install Dependencies

```bash id="iqov2v"
npm install
```

## Start Development Server

```bash id="z0p7g2"
npm run dev
```

---

# 🚀 Deployment

The application is deployed using:

* Vercel (Frontend)
* Supabase (Backend + Database)

---

# 📈 Future Improvements

* Redis caching
* Advanced analytics
* AI-based address suggestions
* Global geographical support
* API rate limiting
* Export systems

---

# 🎯 Project Goal

GeoVerse API aims to provide a scalable and standardized geographical API infrastructure for India that can support:

* E-commerce systems
* Logistics platforms
* Government applications
* Enterprise SaaS products

---

# 👨‍💻 Author

Developed as part of a capstone internship project focused on:

* Full Stack Development
* Data Engineering
* API Architecture
* SaaS Platform Design

---

# 📄 License

This project is intended for educational and internship demonstration purposes.
