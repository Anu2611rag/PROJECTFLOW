# 🚀 ProjectFlow

**ProjectFlow** is a modern, full-stack project and task management system designed to streamline team collaboration. Built with the MERN stack, it features robust Role-Based Access Control (RBAC), a dynamic analytical dashboard, and a stunning UI/UX tailored for professional company use.

**🔴 Live Demo:** [https://projectflow-production-0401.up.railway.app](https://projectflow-production-0401.up.railway.app)

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS (v3), React Router DOM, Recharts, React Hot Toast, Lucide Icons.
- **Backend**: Node.js, Express.js (v5)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Deployment**: Railway (Monorepo architecture)

---

## 🔐 Features & Architecture

### 1. Role-Based Access Control (RBAC)
The application handles complex authorization through JWTs and role-based middleware guards.
- **Admin**: Has full system control. Can create/manage projects, assign tasks, delete resources, and promote other Members to the Admin role via the "Team" dashboard. *(Note: The very first user to register on a fresh database is automatically granted Admin privileges).*
- **Member**: Has a streamlined view. Can only view projects they are assigned to, see tasks assigned to them, and update task statuses (Pending → In Progress → Completed).

### 2. Analytical Dashboard
A dynamic, real-time dashboard that gives users a bird's-eye view of their productivity.
- Calculates and displays total, completed, pending, and overdue tasks.
- Integrates **Recharts** to render visual Pie Charts for task statuses and Bar Charts for project-wise task completion.

### 3. Project & Task Management
- **Projects**: Admins can define project scope, add deadlines, and assign multiple team members.
- **Tasks**: Tasks are nested within projects. They feature priority levels (Low, Medium, High) and strict due dates.

### 4. Premium UI/UX Design
- **Glassmorphism Aesthetic**: Built entirely with Tailwind CSS featuring a sleek, default Dark Mode aesthetic.
- **Responsive Layout**: Includes a collapsible navigation sidebar and mobile-friendly task tables.
- **Micro-interactions**: Hover effects, smooth transitions, and instant toast notifications for CRUD operations.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Anu2611rag/PROJECTFLOW.git
cd PROJECTFLOW
```

### 2. Configure Environment Variables
Create a `.env` file inside the `/backend` directory and add the following:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/projectflow
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Install Dependencies & Run (Monorepo Setup)
You can run both the frontend and backend simultaneously from the root directory:
```bash
# Install dependencies for both backend and frontend
npm run build

# Start the application
npm start
```

*Alternatively, to run the frontend and backend separately in development mode:*
- **Backend**: `cd backend && npm install && npm run dev` (Runs on http://localhost:5000)
- **Frontend**: `cd frontend && npm install && npm run dev` (Runs on http://localhost:5173)

---

## 🚢 Production Deployment

This repository is configured as a Monorepo for seamless deployment on platforms like Railway or Render.
1. Connect the GitHub repository.
2. Ensure the Root Directory is set to `/` (empty).
3. The root `package.json` will automatically build the React frontend and configure the Express backend to serve the static frontend files.
4. Add your `MONGODB_URI` and `JWT_SECRET` as environment variables in the hosting dashboard.
