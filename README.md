# TeenUp Product Builder - Mini LMS

This is a mini-LMS application built with Next.js, PostgreSQL, and Prisma.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Setup and Run
1. Clone the repository (if not already done).
2. Run the following command to start the database and the application:
   ```bash
   docker-compose up --build
   ```
3. The application will be available at [http://localhost:3000](http://localhost:3000).

### Database Migrations
Migrations are handled within the Docker build or can be run manually:
```bash
npx prisma migrate dev --name init
```

## Features
- **Student & Parent Management**: Create and link students to parents.
- **Class Scheduling**: Create classes and register students.
- **Subscription Tracking**: Manage session usage and expiry.

## API Documentation
See [docs/implementation_plan.md](./docs/implementation_plan.md) for detailed API design.

## Project Structure
- `src/app/api`: Next.js Route Handlers for the API.
- `src/components`: UI components.
- `prisma`: Database schema and migrations.
- `Dockerfile` & `docker-compose.yml`: Containerization setup.
