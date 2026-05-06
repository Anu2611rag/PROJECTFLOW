# ProjectFlow

A modern, full-stack project and task management system with role-based access control.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, React Router, Recharts, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.

## Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
# Set your MongoDB URI in .env if needed (default is local)
node index.js
```
*Backend runs on http://localhost:5000*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:5174*

## Features
- **Authentication**: JWT-based secure auth. The first user created automatically becomes the `Admin`. Subsequent users are `Members`.
- **Role-Based Access Control**:
  - `Admin`: Can create projects, add members, assign tasks, delete anything.
  - `Member`: Can only view assigned tasks and update their status.
- **Dynamic Dashboard**: Beautiful UI with Recharts displaying task completion charts and project progress.
- **Modern UI/UX**: Built with TailwindCSS and features a sleek default Dark Mode with glassmorphism components.
