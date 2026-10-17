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
- Supabase Auth
- `@supabase/supabase-js`
- JWT Bearer Authentication

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
    ├── config/
    │   └── supabase.js
    │
    ├── errors/
    │   └── ApiError.js
    │
    ├── middleware/
    │   ├── validation.js
    │   ├── notFound.js
    │   ├── errorHandler.js
    │   └── authenticateToken.js
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
        ├── taskRoutes.js
        ├── authRoutes.js
        ├── publicRoutes.js
        └── protectedRoutes.js
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

## Environment Variables

The project uses a `.env` file for local environment configuration. Create it from the committed template:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
PORT=3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=tasks

DATABASE_URL=postgres://postgres:your_password_here@localhost:5432/tasks
REDIS_URL=redis://localhost:6379

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

Replace the Supabase placeholders with the URL and supported public client key from your Supabase project.

The `.env` file is ignored by Git. Never commit actual credentials or tokens.

When running through Docker Compose, the API connects to PostgreSQL and Redis using their Compose service names. The Supabase environment variables are passed to the API container from `.env`.

For Docker Compose, the database connection uses:

```text
postgres://postgres:your_password_here@db:5432/tasks
```

The committed `.env.example` file provides the configuration template without exposing actual credentials.

---

# **API Endpoints**

| Method | Endpoint                  | Description                               | Status Codes  |
| :----- | :------------------------ | :---------------------------------------- | :------------ |
| GET    | `/`                       | API information                           | 200           |
| GET    | `/health`                 | Health check                              | 200           |
| POST   | `/auth/signup`            | Register a user with Supabase Auth        | 201, 400      |
| POST   | `/auth/login`             | Authenticate a user and obtain tokens     | 200, 400, 401 |
| POST   | `/auth/logout`            | Sign out an authenticated user            | 204, 401, 500 |
| GET    | `/public/info`            | Retrieve public information               | 200           |
| GET    | `/protected/profile`      | Retrieve the authenticated user's profile | 200, 401      |
| GET    | `/protected/dashboard`    | Retrieve protected dashboard information  | 200, 401      |
| GET    | `/tasks`                  | Get all tasks                             | 200           |
| GET    | `/tasks?done=true`        | Get completed tasks                       | 200           |
| GET    | `/tasks?done=false`       | Get incomplete tasks                      | 200           |
| GET    | `/tasks?search=book`      | Search tasks by title                     | 200           |
| GET    | `/tasks?sort=title`       | Sort tasks alphabetically                 | 200           |
| GET    | `/tasks?limit=2&offset=0` | Paginate task results                     | 200           |
| GET    | `/tasks/:id`              | Get a task by ID                          | 200, 404      |
| POST   | `/tasks`                  | Create a task                             | 201, 400      |
| PUT    | `/tasks/:id`              | Update a task                             | 200, 400, 404 |
| DELETE | `/tasks/:id`              | Delete a task                             | 204, 404      |
| GET    | `/stats`                  | Get task statistics                       | 200           |
| POST   | `/reset`                  | Reset tasks to default state              | 200           |

---

## Authentication

The API uses Supabase Auth for user registration and login. Protected endpoints require a valid Supabase access token sent through the HTTP `Authorization` header.

### Signup

```http
POST /auth/signup
Content-Type: application/json
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

A successful signup returns `201 Created`.

### Login

```http
POST /auth/login
Content-Type: application/json
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

A successful login returns an access token, refresh token, and user information.

### Accessing a protected endpoint

Include the access token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

A valid token allows access to the protected endpoint. Missing, malformed, invalid, or expired access tokens return `401 Unauthorized`.

### Protected endpoints

- `GET /protected/profile` returns the authenticated user's profile information.
- `GET /protected/dashboard` returns protected dashboard information.

### Logout

```http
POST /auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

A successful logout returns `204 No Content`.

Logging out does not necessarily make an already-issued access token immediately unusable. Its subsequent acceptance depends on the authentication provider's token-validation and revocation behavior.

### Public endpoint

`GET /public/info` is accessible without an access token.

### Admin-Only Route

**Endpoint:** `GET /protected/admin`

Requires a valid access token and an authenticated user ID listed in the `ADMIN_USER_IDS` environment variable.

**Responses:**

- `200 OK` — Admin access granted.
- `401 Unauthorized` — Missing, invalid, or expired access token.
- `403 Forbidden` — Authenticated user does not have admin access.

Configure `ADMIN_USER_IDS` as a comma-separated list of authorized Supabase user IDs.

### Refresh Token

**Endpoint:** `POST /auth/refresh`

Exchanges a valid refresh token for a new access token and refresh token.

**Request body:**

```json
{
  "refresh_token": "your_refresh_token"
}
```

**Responses:**

- `200 OK` — Returns the new access token, refresh token, and user.
- `400 Bad Request` — Refresh token is missing or invalid in format.
- `401 Unauthorized` — Refresh token is invalid or expired.
- `500 Internal Server Error` — Unexpected refresh failure.

### Login Rate Limiting

The `POST /auth/login` endpoint is rate-limited to **5 requests per client IP within 15 minutes**.

- `429 Too Many Requests` — The client has exceeded the login request limit.

### Swagger Authorization

Interactive API documentation is available at `/docs`. Use the **Authorize** button to supply your access token when testing protected endpoints.

The OpenAPI specification documents which endpoints require authentication; the Express authentication middleware performs the actual token verification.

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

| Status Code | Meaning                                                  |
| ----------- | -------------------------------------------------------- |
| 200         | Successful request                                       |
| 201         | Resource created                                         |
| 204         | Resource deleted successfully                            |
| 400         | Invalid request body                                     |
| 404         | Task not found                                           |
| 401         | Missing, invalid, or expired authentication token        |
| 403         | Authenticated user is not permitted to access a resource |
| 429         | Too many requests                                        |

---

## **Swagger Documentation**

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

![Swagger UI Screenshot](./assets/swagger.png)

The OpenAPI specification documents authentication endpoints and Bearer token security for protected routes. Use the Authorize button to test authenticated requests.

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
