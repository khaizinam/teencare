# System & API Design - TeenUp Mini LMS

## System Architecture
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS.
- **Backend**: Next.js API Routes (Serverless-ready).
- **Database**: PostgreSQL 15.
- **ORM**: Prisma for type-safe database access.
- **Containerization**: Docker Compose for easy local development and deployment.

## Database Schema
### Parent
- `id`: String (CUID)
- `name`: String
- `phone`: String
- `email`: String (Unique)

### Student
- `id`: String (CUID)
- `name`: String
- `dob`: DateTime
- `gender`: String
- `currentGrade`: Int
- `parentId`: Relation to Parent

### Class
- `id`: String (CUID)
- `name`: String
- `subject`: String
- `dayOfWeek`: Int (0-6)
- `timeSlot`: String (e.g. "08:00-10:00")
- `teacherName`: String
- `maxStudents`: Int

### ClassRegistration
- `id`: String (CUID)
- `classId`: Relation to Class
- `studentId`: Relation to Student

### Subscription
- `id`: String (CUID)
- `studentId`: Relation to Student
- `packageName`: String
- `startDate`: DateTime
- `endDate`: DateTime
- `totalSessions`: Int
- `usedSessions`: Int

## API Endpoints
### Parents
- `POST /api/parents`: `{ name, phone, email }`
- `GET /api/parents/:id`: Returns parent with students.

### Students
- `POST /api/students`: `{ name, dob, gender, currentGrade, parentId }`
- `GET /api/students/:id`: Returns student with parent details.

### Classes
- `POST /api/classes`: `{ name, subject, dayOfWeek, timeSlot, teacherName, maxStudents }`
- `GET /api/classes?day=1`: Returns classes for Monday.

### Registration & Subscriptions
- `POST /api/classes/:classId/register`: `{ studentId }`. Validates:
  - Max students not reached.
  - No schedule conflict for student.
  - Active subscription exists.
- `DELETE /api/registrations/:id`: Cancels registration.
  - If > 24h: refund session.
  - If < 24h: no refund.
- `PATCH /api/subscriptions/:id/use`: Decrements `usedSessions`.
