# SmartBursery Backend

SmartBursery Backend is the server-side API for the SmartBursery bursary management system used by Sabaragamuwa University of Sri Lanka. It provides role-based access for administrators, faculty officers, department staff, and students to manage bursary-related workflows such as authentication, user management, eligible student imports, and monthly document approvals.

The project is built with TypeScript, Express, Sequelize ORM, and MySQL. It follows a modular structure with separate layers for controllers, services, models, routes, and middleware.

## Overview

This backend supports the following core capabilities:

- User registration and authentication with JWT
- Role-based authorization for admins, faculty officers, department staff, and students
- Faculty and department management
- Batch and eligible student list handling
- Excel-based eligible student upload processing
- Monthly document submission, signing, replacement, rejection, completion, and history tracking
- Admin-level document and user oversight

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- MySQL
- JWT authentication
- bcryptjs for password hashing
- multer for file uploads
- xlsx for spreadsheet parsing
- dotenv for environment configuration
- helmet, cors, morgan, and cookie-parser for HTTP security and logging

## Project Structure

```text
.
├── config/
│   └── config.js
├── migrations/
├── models/
│   └── index.js
├── seeders/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   ├── enums/
│   ├── errors/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── services/
│   ├── types/
│   └── utils/
├── uploads/
├── package.json
├── tsconfig.json
└── README.md
```

### Main folders

- src/app.ts: Express app setup, middleware registration, CORS configuration, and API route mounting
- src/server.ts: server bootstrap, database connection, seeding, and startup flow
- src/controllers/: request handlers for each domain
- src/services/: business logic layer
- src/routes/: API route definitions
- src/middlewares/: authentication, authorization, and upload middleware
- src/models/: Sequelize model definitions and relationships
- src/utils/: shared helpers such as token generation, hashing, workflow processing, file storage, and Excel parsing
- src/types/: shared TypeScript types and enums
- uploads/: stored monthly document files and related artifacts

## API Modules

The app exposes these main route groups under /api:

- /api/auth - login, registration, logout, and current user information
- /api/faculties - faculty management
- /api/officers - officer-related operations
- /api/faculty-ma - faculty MA workflows
- /api/batches - batch management
- /api/eligible-students - eligible student uploads and checks
- /api/users - user-related operations
- /api/admin - admin-level user and document management
- /api/monthly-documents - monthly document submission and workflow actions

## Roles

The application uses the following roles defined in the user role enum:

- ADMIN
- STUDENT_SERVICE_SAR
- FACULTY_AR
- FACULTY_MA
- DEPARTMENT_HEAD
- DEPARTMENT_MA
- STUDENT

These roles drive authorization across protected routes and document workflow actions.

## Prerequisites

- Node.js 18 or later
- MySQL server running locally or remotely

## Installation

```bash
git clone <repository-url>
cd smartbursery-backend
npm install
```

## Environment Variables

Create a .env file at the project root with values similar to the following:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartbursery
DB_USER=root
DB_PASSWORD=yourpassword

JWT_SECRET=your_secret_key
```

If your frontend runs on a different origin, update the CORS configuration in src/app.ts accordingly.

## Database Setup

Create the database first:

```sql
CREATE DATABASE smartbursery;
```

Then run migrations:

```bash
npx sequelize-cli db:migrate
```

## Running the Server

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Available Scripts

- npm run dev: starts the TypeScript server with nodemon and ts-node
- npm run build: compiles the project with TypeScript
- npm start: runs the compiled build from dist/server.js
- npm test: placeholder for future test coverage

## Notes

- Seeders are executed automatically during startup, so the initial database state is prepared as the server boots.
- Uploaded monthly documents are stored under uploads/monthly/ and organized by year, month, batch, and department.
- The monthly document workflow is a core part of the system and relies on the workflow and storage helpers in src/utils/.

## License

No license has been specified yet.
