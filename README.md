# Task API

A lightweight Express.js RESTful CRUD API for managing a to-do list. Built for **Week 2 Assignment 1 of the FlyRank Internship (Backend Track)**.

The project demonstrates REST API fundamentals including CRUD operations, request validation, HTTP status codes, Swagger documentation, and additional API features such as filtering, search, pagination, statistics, and resetting the in-memory task store.

---

## Overview

This project provides a RESTful API for creating, reading, updating, and deleting tasks.

The API uses an **in-memory data store**, meaning tasks are stored in the Node.js process memory and are not persisted to a database.

### Core Features

- Create tasks
- Retrieve all tasks
- Retrieve a task by ID
- Update tasks
- Delete tasks
- Request validation
- Appropriate HTTP status codes
- Interactive Swagger UI documentation

### Additional Features

- Filter tasks by completion status
- Search tasks by title
- Paginate task results
- View task statistics
- Reset the task store to its default state

---

## Tech Stack

- Node.js
- Express.js
- JavaScript
- Swagger UI
- OpenAPI

---

## Project Architecture

The application follows a layered architecture:

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repository
  ↓
In-Memory Data
```

### Layers

**Routes**

Defines the API endpoints and maps them to controllers.

**Controllers**

Handle HTTP requests, validation, status codes, and responses.

**Services**

Contain task-related application logic.

**Repository**

Handles operations on the in-memory task collection.

**Data**

Contains the initial dummy task data.

---

## Project Structure

```text
task-api/
│
├── server.js
├── package.json
├── openapi.json
├── README.md
│
└── src/
    ├── app.js
    │
    ├── data/
    │   └── tasks.js
    │
    ├── repositories/
    │   └── taskRepository.js
    │
    ├── services/
    │   └── taskService.js
    │
    ├── controllers/
    │   └── taskController.js
    │
    └── routes/
        └── taskRoutes.js
```

---

## Quick Start

### Prerequisites

- Node.js v16 or higher
- npm

### Setup & Run

1. Clone the repository:

```bash
git clone https://github.com/iyellalot25/backend-101-FLR
cd backend-101-FLR
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

The server will run on:

```text
http://localhost:3000
```

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

---

# API Endpoints

| Method     | Endpoint                  | Description                             | Status Codes        |
| ---------- | ------------------------- | --------------------------------------- | ------------------- |
| **GET**    | `/`                       | API information and available endpoints | `200`               |
| **GET**    | `/health`                 | Server health check                     | `200`               |
| **GET**    | `/tasks`                  | Retrieve all tasks                      | `200`               |
| **GET**    | `/tasks?done=true`        | Filter completed tasks                  | `200`               |
| **GET**    | `/tasks?done=false`       | Filter incomplete tasks                 | `200`               |
| **GET**    | `/tasks?search=book`      | Search tasks by title                   | `200`               |
| **GET**    | `/tasks?limit=2&offset=0` | Paginate task results                   | `200`               |
| **GET**    | `/tasks/:id`              | Retrieve a specific task                | `200`, `404`        |
| **POST**   | `/tasks`                  | Create a new task                       | `201`, `400`        |
| **PUT**    | `/tasks/:id`              | Update an existing task                 | `200`, `400`, `404` |
| **DELETE** | `/tasks/:id`              | Delete a task                           | `204`, `404`        |
| **GET**    | `/stats`                  | View task statistics                    | `200`               |
| **POST**   | `/reset`                  | Reset tasks to the default state        | `200`               |

---

# Task Object

A task has the following structure:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": false
}
```

| Field   | Type    | Description            |
| ------- | ------- | ---------------------- |
| `id`    | Number  | Unique task identifier |
| `title` | String  | Task title             |
| `done`  | Boolean | Completion status      |

---

# Combining Query Parameters

The filtering, search, and pagination parameters can be combined.

Example:

```http
GET /tasks?done=false&search=book&limit=2&offset=0
```

This:

1. Selects incomplete tasks
2. Searches their titles for `book`
3. Returns at most 2 results
4. Starts from offset 0

---

# In-Memory Storage

This project intentionally uses an in-memory JavaScript array instead of a database.

This keeps the implementation simple and focuses on REST API fundamentals.

### Important consequence

Data is **not persistent**.

For example:

1. Start the server.
2. Create a new task.
3. Confirm it appears in `GET /tasks`.
4. Stop the server.
5. Start the server again.
6. The newly created task will no longer exist.

The application starts again with the original dummy tasks.

This demonstrates the limitation of in-memory storage: all data is lost when the Node.js process stops.

A production application would use persistent storage such as a database.

---

# HTTP Status Codes

The API uses HTTP status codes to communicate the result of each request.

| Status | Meaning                       | Example                |
| ------ | ----------------------------- | ---------------------- |
| `200`  | Successful request            | GET, PUT, stats, reset |
| `201`  | Resource successfully created | POST `/tasks`          |
| `204`  | Resource successfully deleted | DELETE `/tasks/:id`    |
| `400`  | Invalid request               | Invalid task data      |
| `404`  | Resource not found            | Unknown task ID        |

---

# Interactive Documentation

Swagger UI provides interactive API documentation.

Open:

```text
http://localhost:3000/docs
```

Swagger can be used to:

- View all available endpoints
- View request parameters
- View request bodies
- Execute API requests
- Inspect responses
- Understand available status codes

![Swagger UI Screenshot](./assets/swagger.png)

---

# Future Improvements

Possible future improvements include:

- Persistent database storage
- Authentication and authorization
- User-specific tasks
- Unit and integration testing
- Better request validation
- API versioning
- Deployment to a cloud platform

---
