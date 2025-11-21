# Duty List Application

A full-stack web application for managing a TODO list of duties, built as a monorepo with separate frontend and backend projects.

## Project Structure

```
duty-list-exercise/
├── backend/          # Node.js + TypeScript + Express + PostgreSQL
└── frontend/         # React + TypeScript + Vite + Ant Design
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed (recommended)
- Node.js 20+ (if running without Docker)
- Git

### Running the Application

#### Option 1: Full Docker Orchestration (Recommended)

Run everything with a single command:

```bash
docker compose up --build
```

This will start:

- PostgreSQL database
- Backend API (with hot-reload via volumes)
- Frontend dev server (with hot-reload via volumes)

Access the application:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

To stop all services:

```bash
docker compose down
```

To stop and remove volumes:

```bash
docker compose down -v
```

#### Option 2: Mixed Setup (Backend Docker, Frontend Local)

1. **Start Backend with Docker**

   ```bash
   cd backend
   npm run docker:up
   ```

2. **Start Frontend locally**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

## Features

- ✅ Create, read, update, and delete duties
- ✅ Inline editing with keyboard shortcuts (Enter to save, Escape to cancel)
- ✅ Real-time validation and error handling
- ✅ Responsive UI with Ant Design components
- ✅ Full test coverage for both frontend and backend

## Documentation

- [Backend README](./backend/README.md) - Backend setup, API documentation, and Docker instructions
- [Frontend README](./frontend/README.md) - Frontend setup, development guide, and testing
