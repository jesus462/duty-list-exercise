# Backend API - TODO List Application

Node.js backend API built with TypeScript, Express, and PostgreSQL for managing a TODO list of duties.

## Prerequisites

- Node.js 20+ (if running without Docker)
- Docker and Docker Compose (recommended)
- PostgreSQL 15+ (if running without Docker)

## Setup Instructions

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd duty-list-exercise
   ```

2. **Create environment file** (optional, defaults are provided)

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` if you need to change default values.

3. **Build and start services**

   ```bash
   cd backend
   npm run docker:up
   ```

   Or using Docker Compose directly:

   ```bash
   cd backend
   docker compose -f docker-compose.yml up --build
   ```

   This will:

   - Build the backend Docker image
   - Start PostgreSQL database
   - Initialize the database schema

4. **Verify the setup**
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - PostgreSQL: localhost:5432

### Option 2: Local Development (Without Docker)

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL database**

   - Create a PostgreSQL database
   - Run the initialization script:
     ```bash
     psql -U postgres -d duties_list_db -f db/init.sql
     ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials.

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Or for development with hot-reload:
   ```bash
   npm run dev
   ```

## Scripts

### Build & Run

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with hot-reload

### Testing

- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Code Quality

- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types without building

### Docker

- `npm run docker:up` - Build and start all Docker services (PostgreSQL + Backend)
- `npm run docker:down` - Stop and remove all Docker services and volumes

## API Endpoints

All endpoints are prefixed with `/api/duties`.

### Get All Duties

- **GET** `/api/duties`
- **Response:** `200 OK`
  ```json
  [
    { "id": 1, "name": "Duty 1" },
    { "id": 2, "name": "Duty 2" }
  ]
  ```

### Create Duty

- **POST** `/api/duties`
- **Request Body:**
  ```json
  { "name": "New Duty" }
  ```
- **Response:** `201 Created`
  ```json
  { "id": 3, "name": "New Duty" }
  ```
- **Validation:**
  - `name` is required and must be a non-empty string
  - `name` must be 255 characters or less
  - Whitespace is automatically trimmed

### Update Duty

- **PUT** `/api/duties/:id`
- **Request Body:**
  ```json
  { "name": "Updated Duty" }
  ```
- **Response:** `200 OK`
  ```json
  { "id": 1, "name": "Updated Duty" }
  ```
- **Error:** `404 Not Found` if duty doesn't exist
- **Validation:** Same as create

### Delete Duty

- **DELETE** `/api/duties/:id`
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if duty doesn't exist

### Health Check

- **GET** `/health`
- **Response:** `200 OK`
  ```json
  { "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
  ```

## Technology Stack

- **Node.js 20** - Runtime environment
- **TypeScript** - Type safety (strict mode)
- **Express** - Web framework
- **PostgreSQL 15** - Database
- **Jest** - Testing framework
- **Docker** - Containerization
