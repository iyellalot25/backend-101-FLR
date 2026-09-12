# **Task API**

A lightweight Express.js RESTful CRUD API for managing a to-do list.

The project demonstrates REST API fundamentals including CRUD operations, request validation, HTTP status codes, Swagger documentation, and additional API features such as filtering, search, sorting, pagination, statistics, and resetting the task store.

The application uses **PostgreSQL running in Docker** for persistent storage. The complete application stack can be started with a single `docker compose up` command.

---

## **Overview**

This project provides a RESTful API for creating, reading, updating, and deleting tasks.

The API uses **PostgreSQL** as its persistent data store. PostgreSQL runs as a Docker container and task data is stored in a named Docker volume.

### **Core Features**

- Create tasks
- Retrieve all tasks
- Retrieve a task by ID
- Update tasks
- Delete tasks
- Request validation
- Appropriate HTTP status codes
- Persistent PostgreSQL storage
- Interactive Swagger UI documentation
- Dockerized API and database

### **Additional Features**

- Filter tasks by completion status
- Search tasks by title
- Sort tasks alphabetically
- Paginate task results
- View task statistics
- Reset the task store to its default state
- Database index on task completion status
- Task creation and update timestamps

---

## **Tech Stack**

- Node.js
- Express.js
- JavaScript
- PostgreSQL
- `pg` (node-postgres)
- Docker
- Docker Compose
- Swagger UI
- OpenAPI

---

## **Project Architecture**

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
PostgreSQL
```

### **Layers**

**Routes**

Defines the API endpoints and maps them to controllers.

**Controllers**

Handle HTTP requests, validation, status codes, and responses.

**Services**

Contain task-related application logic.

**Repository**

Handles database operations using PostgreSQL.

**Database**

PostgreSQL stores tasks persistently using a named Docker volume.

---

## **Project Structure**

```text
task-api/
│
├── server.js
├── package.json
├── package-lock.json
├── openapi.json
├── README.md
├── Dockerfile
├── compose.yaml
├── .env.example
├── .gitignore
│
└── src/
    ├── app.js
    │
    ├── errors/
    │   └── ApiError.js
    │
    ├── middleware/
    │   ├── validation.js
    │   ├── notFound.js
    │   └── errorHandler.js
    │
    ├── repositories/
    │   ├── database.js
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

The `.env` file is excluded from Git and is used for local database configuration.

---

## **Quick Start**

### **Prerequisites**

- Docker
- Docker Compose

### **Setup & Run**

1. Clone the repository:

```bash
git clone https://github.com/iyellalot25/backend-101-FLR
cd backend-101-FLR
```

2. Create the environment file:

```bash
cp .env.example .env
```

3. Start the complete stack:

```bash
docker compose up
```

This starts:

```text
API
 ↓
PostgreSQL
```

The API is available at:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/docs
```

PostgreSQL runs internally as the `db` Compose service.

Task data is persisted using the named Docker volume `taskdata`.

### **Run in the background**

```bash
docker compose up -d
```

### **Stop the stack**

```bash
docker compose down
```

The named database volume is preserved, so task data survives container recreation.

---

## **Environment Variables**

The project uses a `.env` file for local environment configuration.

Example:

```env
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
```

The `.env` file is ignored by Git.

The committed `.env.example` file provides the required configuration template.

When running through Docker Compose, the API uses the PostgreSQL service name `db`:

```text
postgres://postgres:dev@db:5432/tasks
```

---

# **API Endpoints**

| Method | Endpoint                  | Description                  | Status Codes  |
| ------ | ------------------------- | ---------------------------- | ------------- |
| GET    | `/`                       | API information              | 200           |
| GET    | `/health`                 | Health check                 | 200           |
| GET    | `/tasks`                  | Get all tasks                | 200           |
| GET    | `/tasks?done=true`        | Get completed tasks          | 200           |
| GET    | `/tasks?done=false`       | Get incomplete tasks         | 200           |
| GET    | `/tasks?search=book`      | Search tasks by title        | 200           |
| GET    | `/tasks?sort=title`       | Sort tasks alphabetically    | 200           |
| GET    | `/tasks?limit=2&offset=0` | Paginate task results        | 200           |
| GET    | `/tasks/:id`              | Get a task by ID             | 200, 404      |
| POST   | `/tasks`                  | Create a task                | 201, 400      |
| PUT    | `/tasks/:id`              | Update a task                | 200, 400, 404 |
| DELETE | `/tasks/:id`              | Delete a task                | 204, 404      |
| GET    | `/stats`                  | Get task statistics          | 200           |
| POST   | `/reset`                  | Reset tasks to default state | 200           |

---

## **Task Object**

Example:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": false,
  "created_at": "2026-09-04 03:00:00",
  "updated_at": "2026-09-04 03:00:00"
}
```

### **Fields**

| Field        | Type    | Description             |
| ------------ | ------- | ----------------------- |
| `id`         | Number  | Unique task identifier  |
| `title`      | String  | Task title              |
| `done`       | Boolean | Completion status       |
| `created_at` | String  | Task creation timestamp |
| `updated_at` | String  | Last update timestamp   |

---

## **Query Features**

The `/tasks` endpoint supports filtering, searching, sorting, and pagination.

### **Filter by completion**

```text
GET /tasks?done=true
```

```text
GET /tasks?done=false
```

### **Search by title**

```text
GET /tasks?search=book
```

### **Sort by title**

```text
GET /tasks?sort=title
```

Descending order:

```text
GET /tasks?sort=title&order=desc
```

### **Pagination**

```text
GET /tasks?limit=2&offset=0
```

### **Combined query**

```text
GET /tasks?done=false&search=book&sort=title&limit=2&offset=0
```

---

## **PostgreSQL Storage**

The application uses PostgreSQL running inside Docker.

The database contains a `tasks` table with the following structure:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The application creates the table automatically when it starts if it does not already exist.

The three default tasks are inserted only when the table is empty:

```text
Buy groceries
Walk the dog
Read a book
```

This prevents duplicate seed data when the API container restarts.

All database queries use PostgreSQL parameterized queries.

---

## **Database Verification**

The PostgreSQL database can be accessed through the running Compose service:

```bash
docker compose exec db psql -U postgres -d tasks
```

List the tables:

```sql
\dt
```

View the tasks:

```sql
SELECT * FROM tasks;
```

Example:

```text
 id |     title      | done
----+----------------+------
  1 | Buy groceries  | f
  2 | Walk the dog   | t
  3 | Read a book    | f
```

### **Database Screenshot**

![PostgreSQL Database Screenshot](./assets/postgres.png)

---

## **Example API Request**

```bash
curl -i http://localhost:3000/tasks
```

Example response:

```text
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "done": false,
    "created_at": "2026-09-04 03:00:00",
    "updated_at": "2026-09-04 03:00:00"
  },
  {
    "id": 2,
    "title": "Walk the dog",
    "done": true,
    "created_at": "2026-09-04 03:00:00",
    "updated_at": "2026-09-04 03:00:00"
  },
  {
    "id": 3,
    "title": "Read a book",
    "done": false,
    "created_at": "2026-09-04 03:00:00",
    "updated_at": "2026-09-04 03:00:00"
  }
]
```

---

## **HTTP Status Codes**

| Status Code | Meaning                       |
| ----------- | ----------------------------- |
| 200         | Successful request            |
| 201         | Resource created              |
| 204         | Resource deleted successfully |
| 400         | Invalid request body          |
| 404         | Task not found                |

---

## **Swagger Documentation**

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

![Swagger UI Screenshot](./assets/swagger.png)

---

## **Docker Compose Architecture**

The complete stack is managed using Docker Compose:

```text
                  ┌─────────────────┐
                  │      Client     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   API Container │
                  │    Node.js      │
                  │    Express      │
                  └────────┬────────┘
                           │
                           │ db:5432
                           ▼
                  ┌─────────────────┐
                  │  PostgreSQL DB  │
                  │   Container     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  taskdata       │
                  │ Named Volume    │
                  └─────────────────┘
```

The API connects to PostgreSQL using the Compose service name `db`, rather than `localhost`.

The `taskdata` named volume ensures that database data persists when containers are stopped or recreated.

---

## **Resetting the Database**

To stop the containers while preserving database data:

```bash
docker compose down
```

To remove the containers **and** the database volume:

```bash
docker compose down -v
```

Removing the volume deletes the persisted PostgreSQL data. The next `docker compose up` will create a fresh database and seed the three default tasks.

---
