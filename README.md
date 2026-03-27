# 🧩 TriPowers LLC Website

A modern, full-stack web platform built to showcase TriPowers LLC’s capabilities in Technology, Staffing, and Human Resources. Developed by Kimberly D. Jenkins to demonstrate technical skills in React, C#, .NET, Azure, and government contracting operations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-in%20progress-yellow.svg)
![Made With](https://img.shields.io/badge/made%20with-React-blue)

---

## 🚀 Live Demo

🔗 www.tripowersllc.com

---

## 📌 Project Overview

TriPowers LLC is a certified SDVOSB, minority, and veteran-owned small business. This web application provides:
- A public-facing site for prospective clients and candidates
- A job board and resume submission portal
- An internal admin dashboard for managing applications
- A portfolio section highlighting technical expertise

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- JavaScript (ES6+)
- Tailwind CSS

**Backend:**
- ASP.NET Core Web API (C#)
- Entity Framework Core

**Database:**
- SQL Server / PostgreSQL

**DevOps & Hosting:**
- Azure App Services
- Azure SQL
- GitHub Actions (CI/CD)

---

## 🧱 Features

### Public-Facing Website
- Dynamic Homepage with hero section
- About Us & Services overview
- Careers page with job board
- Resume submission form
- Portfolio with project highlights
- Contact form with automated email

### Admin Dashboard
- Job listing management
- Resume viewing/download
- Website traffic analytics (future)
- Data export to Excel or SharePoint (future)

---

## 📁 Project Structure

- server/ – ASP.NET Core 8 backend configured with JWT authentication and Entity Framework Core for database access

- functions/ – Legacy Node.js Azure Functions app (optional/legacy path; primary email sending is handled by the ASP.NET API).

- jobs_react/ – React front end built with Vite and targeting Node.js 20.x

## Running components locally

- Backend (server/)

    1. Install the .NET 8 SDK and a local SQL Server or compatible connection.

    2. cd server

    3. dotnet restore

    4. Provide configuration values (e.g., connection string and JWT key) via appsettings.json or environment variables.

    5. dotnet run – launches the API on the default ASP.NET Core ports.

- API email configuration (server/)

    1. Set `RESEND_API_KEY` in the API environment for contact-form email delivery.

    2. Optionally set `RESEND_TO` and `RESEND_FROM` (defaults are used if not provided).

    3. The API endpoint `POST /api/send-email` sends directly to Resend, which works for AWS-hosted deployments.

- Frontend (jobs_react/)

    1. Ensure Node.js 20.x and npm are installed.

    2. cd jobs_react

    3. npm install

    4. npm run dev – starts the Vite development server (default http://localhost:5173).

## Required tooling

- .NET 8 SDK

- Node.js 20.x & npm

- (Optional) Local SQL Server or another EF Core–supported database

- Resend API key for the email function

### Configuration

The API reads its database connection string from the environment. Set the
`DEFAULT_CONNECTION` environment variable to your SQL Server connection string
before running the application. The value in `server/appsettings.json` is only a placeholder.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.