# SmartBursery Backend

SmartBursery Backend is the server-side application developed for the **Student Bursary Management System** of **Sabaragamuwa University of Sri Lanka**.
It provides secure RESTful APIs for managing students, bursary applications, approvals, authentication, and administrative operations.

The backend is built using **Express.js** with **Sequelize ORM** and **MySQL**, following a scalable layered architecture suitable for enterprise-level development.

## 🚀 Technologies Used

* Node.js
* Express.js
* Sequelize ORM
* MySQL
* JWT Authentication
* bcryptjs
* dotenv
* cors
* helmet
* morgan

## ✨ Features

* User authentication and authorization using JWT
* Student registration and management
* Bursary application handling
* Administrative approval workflows
* Secure password encryption
* RESTful API design
* Environment-based configuration
* Database integration with Sequelize ORM

## ⚙️ Installation

Clone the repository:

```bash
git clone [<your-backend-repository-url>](https://github.com/SUSLCore/smartbursary-server.git)
cd smartbursery-server
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the project root and configure:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartbursery
DB_USER=root
DB_PASSWORD=yourpassword

JWT_SECRET=your_secret_key
```

## ▶️ Run the Development Server

```bash
npm run dev
```

## ▶️ Run Production Server

```bash
npm start
```

## 🗄️ Database Setup

Create the MySQL database before starting the server:

```sql
CREATE DATABASE smartbursery;
```

Run migrations if configured:

```bash
npx sequelize-cli db:migrate
```

## 🔗 API Base URL

```bash
http://localhost:5000
```

## 🛡️ Security

* Password hashing with bcryptjs
* Token-based authentication using JWT
* HTTP security headers with helmet

## 📌 Project Purpose

This backend is designed to digitalize the bursary management process by improving transparency, reducing manual work, and enabling efficient student financial support administration.

## 👨‍💻 Developer

Developed as part of the SmartBursery project using modern backend engineering practices.
Developed by SE Students in Sabaragamuwa University of Sri Lanka - 21/22 Batch 
