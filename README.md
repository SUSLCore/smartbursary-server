# SmartBursery Backend

SmartBursery Backend is the server-side application for the SmartBursery student bursary management system used at Sabaragamuwa University of Sri Lanka. It exposes REST APIs for authentication, faculty and department management, user management, eligible student imports, monthly document workflows, and administrative operations.

The codebase is a TypeScript Express application using Sequelize and MySQL. It also keeps Sequelize CLI files at the project root for database migrations and legacy model generation support.

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
- helmet, cors, morgan, and cookie-parser for server middleware

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

### What Each Folder Does

- `src/app.ts` sets up the Express app, middleware, CORS, and API route mounting.
- `src/server.ts` boots the server, connects to the database, and runs seeders before listening.
- `src/config/database.ts` creates the Sequelize runtime connection used by the TypeScript app.
- `src/controllers/` contains request handlers for the different API domains.
- `src/services/` holds the business logic for each domain.
- `src/middlewares/` contains authentication, authorization, and upload middleware.
- `src/models/` contains the Sequelize TypeScript model definitions and associations.
- `src/routes/` defines the API route groups.
- `src/utils/` contains shared helpers such as file storage, hashing, token generation, Excel parsing, and workflow helpers.
- `src/errors/` contains custom error classes.
- `src/types/` contains TypeScript request and domain types.
- `migrations/` contains Sequelize migration files.
- `config/config.js` and `models/index.js` support Sequelize CLI workflows.
- `uploads/` stores generated monthly document files.

## API Modules

The server mounts the following route groups under `/api`:

- `/api/auth`
- `/api/faculties`
- `/api/officers`
- `/api/faculty-ma`
- `/api/batches`
- `/api/eligible-students`
- `/api/users`
- `/api/admin`
- `/api/monthly-documents`

## Runtime Flow

When the application starts, `src/server.ts` does the following:

1. Loads environment variables with `dotenv`.
2. Authenticates the Sequelize connection.
3. Runs the built-in seeders for faculties, departments, and admin users.
4. Starts the Express server.

## Requirements

- Node.js 18 or later
- MySQL

## Installation

```bash
git clone <repository-url>
cd smartbursery-backend
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartbursery
DB_USER=root
DB_PASSWORD=yourpassword

JWT_SECRET=your_secret_key
```

If your frontend runs on a different origin, update the CORS origin in `src/app.ts` as well.

## Database Setup

Create the database first:

```sql
CREATE DATABASE smartbursery;
```

Run migrations with Sequelize CLI if needed:

```bash
npx sequelize-cli db:migrate
```

## Available Scripts

- `npm run dev` starts the TypeScript server with `nodemon` and `ts-node`.
- `npm run build` compiles the project with `tsc`.
- `npm start` runs the compiled server from `dist/server.js`.
- `npm test` is currently a placeholder.

## Development

The server listens on the port defined by `PORT` or falls back to `5000`.

Uploaded monthly documents are stored under `uploads/monthly/`, grouped by year, month, batch, and department.

## Notes

- The repository currently keeps both runtime Sequelize models in `src/models/` and CLI-related files at the project root.
- The monthly document workflow relies on `src/utils/documentWorkflow.ts` and `src/utils/fileStorage.ts`.
- Seeders are executed automatically on server startup, so repeated starts may reapply seed logic depending on the seeder implementation.

## License

No license has been specified yet.
