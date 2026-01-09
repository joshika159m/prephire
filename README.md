# Prephire – Resume Review & Mock Interview SaaS (Backend)

## Project Overview
Prephire is a backend-focused SaaS application that allows users to upload resumes and receive structured reviews from administrators.  
The project demonstrates real-world backend concepts such as authentication, role-based access control, file handling, and admin-driven workflows.

This project is built with an emphasis on **backend engineering practices**, not UI design.

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Authorization:** Role-Based Access Control (USER / ADMIN)
- **File Uploads:** Multer (local storage)
- **Tools:** Git, GitHub, REST APIs

---

## Features

### User
- Register and login securely
- JWT-based authentication
- Upload resume (PDF)
- View resume review status
- Read admin feedback

### Admin
- Admin-only access using RBAC
- View all uploaded resumes
- Download user resumes
- Review resumes with status and feedback

---

## Backend Concepts Implemented
- Secure authentication using JWT
- Role-based authorization middleware
- Protected routes
- File upload handling
- Database-driven workflow design
- RESTful API architecture
- Separation of routes, middleware, and configuration

---

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive JWT

### Resume (User)
- `POST /api/resume/upload` – Upload resume
- `GET /api/resume/my` – View own resume status & feedback

### Resume (Admin)
- `GET /api/resume/all` – View all resumes
- `GET /api/resume/download/:id` – Download resume
- `PATCH /api/resume/:id/review` – Review resume (status & feedback)

---

## How to Run Locally

```bash
git clone https://github.com/joshika159m/prephire.git
cd prephire/backend
npm install
npm start
```

Make sure MySQL server is running and required tables are created.

## Project Objective

The objective of this project is to demonstrate backend development skills required for software engineering roles, including authentication, authorization, database interaction, and real-world SaaS workflows.

---

## Future Enhancements

Frontend using React

Email notifications

Mock interview scheduling

Cloud storage (AWS S3)

Payment integration

---

## Author

Joshika M
