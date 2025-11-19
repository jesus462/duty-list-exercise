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
   cd nexplore-test
   ```

2. **Create environment file** (optional, defaults are provided)

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` if you need to change default values.

3. **Build and start services**

   ```bash
   docker-compose up --build
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

## API Endpoints

### Health Check

- **GET** `/health` - Check API status

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
