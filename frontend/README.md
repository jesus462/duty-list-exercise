# Frontend - TODO List Application

React + TypeScript frontend for a TODO list application, built with Vite and Ant Design.

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker and Docker Compose (for Docker setup)
- Backend API running (see [backend/README.md](../backend/README.md))

## Setup Instructions

### Option 1: Docker (Local Development)

The frontend can be run in Docker using the root-level `docker-compose.yml`:

```bash
# From project root
docker compose up --build
```

This runs the Vite development server in Docker.

### Option 2: Local Development (Without Docker)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** (optional)

   Create a `.env` file in the `frontend` directory:

   ```bash
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

   If not set, defaults to `http://localhost:3000/api`.

3. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

## Docker

The frontend includes a Dockerfile for local development that:

- Installs dependencies
- Runs the Vite development server
- Uses volume mounts for hot-reload (code changes reflect immediately)
- Supports environment variables via Docker Compose

**Dockerfile**: `frontend/Dockerfile` - Development server with hot-reload

See the root [README.md](../README.md) for full Docker orchestration setup.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types without building

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety (strict mode)
- **Vite** - Build tool and dev server
- **Ant Design 5** - UI component library
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ts-jest** - TypeScript support for Jest

## Application Features

- **Create Duties**: Add new duties via input field (Enter key or button click)
- **List Duties**: Display all duties in a scrollable list
- **Edit Duties**: Inline editing with Enter to save, Escape to cancel
- **Delete Duties**: Remove duties with delete icon
- **Validation**: Client-side validation with error messages
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages via Ant Design notifications

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DutyInput/        # Input components for create/edit
│   │   │   ├── creation/     # Create duty input
│   │   │   ├── update/       # Edit duty input
│   │   │   └── __tests__/    # Component tests
│   │   └── DutyList/         # List component with edit/delete
│   │       └── __tests__/    # Component tests
│   ├── services/             # API service layer
│   │   ├── dutyService.ts    # API calls
│   │   ├── useDutyServiceActions.ts  # Global state hook
│   │   └── __tests__/        # Service tests
│   ├── utils/                # Utilities and constants
│   └── App.tsx               # Main application component
```

## Testing

Run tests with:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

For coverage:

```bash
npm run test:coverage
```
