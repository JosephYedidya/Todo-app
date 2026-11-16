# TODO-APP API

A RESTful API for task management, built with Node.js, Express.js and MongoDB.

## Overview

TODO-APP is a task management application backend that allows users to create an account, authenticate securely and manage their personal tasks.

Each user can create, retrieve, update and delete their own tasks.

## Features

- User registration
- User authentication
- Password hashing with bcryptjs
- JWT-based authentication
- Create, read, update and delete tasks (CRUD)
- MongoDB Atlas integration
- User-specific task management
- Protected API routes

## Technologies

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| JSON Web Token | Authentication |
| dotenv | Environment variables |
| CORS | Cross-origin resource sharing |
| Nodemon | Development server |

## Project Structure

```text
todo-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd todo-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Never publish your `.env` file or expose your credentials.

### 5. Start the development server

```bash
npm run dev
```

The API will be available at:

`http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in | No |

### Tasks

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/todos` | Create a task | Required |
| GET | `/api/todos` | Retrieve user tasks | Required |
| PUT | `/api/todos/:id` | Update a task | Required |
| DELETE | `/api/todos/:id` | Delete a task | Required |

## Authentication

Protected routes require a valid JWT token.

Add the following HTTP header to authenticated requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Testing

API endpoints have been tested using Postman.

Verified operations:

- User registration
- User login
- JWT authentication
- Task creation
- Task retrieval
- Task updates
- Task deletion

## Development Status

**Backend CRUD API implemented and tested.**

Future improvements:

- Request validation
- Centralized error handling
- Automated API tests
- Password reset
- Production security configuration

## Author

Developed as a full-stack software engineering learning project.

## License

This project is currently intended for educational and portfolio purposes.
