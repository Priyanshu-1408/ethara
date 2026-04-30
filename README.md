# 🚀 Team Task Manager (Full-Stack MERN)

<div align="center">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img alt="NodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
</div>

<br/>

A robust, production-ready full-stack web application designed for seamless team collaboration and task management. Built entirely on the **MERN** stack, this application features secure authentication, comprehensive project grouping, and advanced Role-Based Access Control (RBAC).

---

## 🌟 Key Features

*   **Secure Authentication:** JWT-based user authentication integrated with `bcryptjs` for heavily encrypted passwords.
*   **Role-Based Access Control (RBAC):** 
    *   **👑 Admin:** Full administrative privileges. Can create projects, add members, create tasks, and assign tasks to any member.
    *   **👤 Member:** Focused workflow. Can only view projects they are assigned to, see their designated tasks, and update their personal task progress.
*   **Dynamic Task Management:** Features task creation with strict deadline tracking (`dueDate`), member assignments, and live status updates (`Todo`, `In Progress`, `Done`).
*   **Real-time Dashboard Analytics:** Complex backend aggregations instantly summarize total tasks, status-wise distributions, and critically highlight overdue tasks.
*   **Premium Modern UI:** Completely custom, fully responsive frontend utilizing CSS variables, modern `Outfit` typography, glassmorphism shadows, and smooth micro-animations.

---

## 🛠️ Technology Stack

### **Frontend**
*   **React (Vite):** Lightning-fast build tool and component-based UI architecture.
*   **React Router DOM:** Seamless Client-Side Routing.
*   **Axios:** Promise-based HTTP client for secure API interactions.
*   **Vanilla CSS3:** Highly scalable, custom premium styling without the bloat of external libraries.

### **Backend**
*   **Node.js & Express.js:** Scalable RESTful API server.
*   **MongoDB Atlas & Mongoose:** Cloud-hosted NoSQL database with strict schema validation.
*   **JWT (JSON Web Tokens):** Stateless API protection and secure authorization.

---

## 📡 Core API Architecture

The application strictly follows REST principles. All protected routes require a Bearer token in the `Authorization` header.

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register a new user (Admin/Member) |
| `/api/auth/login` | `POST` | Public | Authenticate user & receive JWT |
| `/api/auth/users` | `GET` | Private | Retrieve user list for task assignments |
| `/api/projects` | `POST` | Admin | Create a new project grouping |
| `/api/projects` | `GET` | Private | Get projects (Filtered by Membership) |
| `/api/tasks` | `POST` | Admin | Create and assign a new task |
| `/api/tasks` | `GET` | Private | Get tasks (Admins see all, Members see assigned) |
| `/api/tasks/:id/status` | `PUT` | Private | Update task progression status |
| `/api/tasks/summary` | `GET` | Private | Aggregate task statistics for Dashboard |

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### 1. Database Configuration
Ensure you have a MongoDB Atlas connection string. In the `backend` folder, verify the `.env` file contains:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Booting up the Backend
```bash
cd backend
npm install
npm run dev
```
*The server will start on `http://localhost:5000`*

### 3. Booting up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React app will start on `http://localhost:5173`*

---

> **Note to Evaluator:** This project demonstrates deep understanding of full-stack engineering, particularly concerning relational document schemas in NoSQL, secure RESTful middleware patterns, and maintaining strict state synchronization between an active database and a modern React frontend.
