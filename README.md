# Task API

A light, fast Express.js RESTful CRUD API for managing a to-do list. Built for Week 2 Assignment 1 of the FlyRank Internship (Backend Track).

---

## Overview

This project provides a complete CRUD API for managing task items, with full validation, HTTP status code adherence, interactive Swagger UI documentation, and optional extras like statistics and task resetting.

---

## Quick Start

### Prerequisites

- [Node.js](https://www.google.com/search?q=https://nodejs.org/) (v16 or higher recommended)
- `npm`

### Setup & Run

1. Clone the repository:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_NAME>

```

2. Install dependencies:

```bash
npm install

```

3. Start the server:

```bash
node index.js

```

The server will run on **http://localhost:3000**. Interactive documentation will be available at **http://localhost:3000/docs**.

---

## API Endpoints

| Method     | Endpoint     | Description                                                   | Status Codes        |
| ---------- | ------------ | ------------------------------------------------------------- | ------------------- |
| **GET**    | `/`          | API Information and root overview                             | `200`               |
| **GET**    | `/health`    | Server health check                                           | `200`               |
| **GET**    | `/tasks`     | List all tasks (supports `done`, `search`, `limit`, `offset`) | `200`               |
| **GET**    | `/tasks/:id` | Get a specific task by ID                                     | `200`, `404`        |
| **POST**   | `/tasks`     | Create a new task                                             | `201`, `400`        |
| **PUT**    | `/tasks/:id` | Update an existing task (`title` or `done`)                   | `200`, `400`, `404` |
| **DELETE** | `/tasks/:id` | Delete a task by ID                                           | `204`, `404`        |
| **GET**    | `/stats`     | Task metrics (`total`, `done`, `open`)                        | `200`               |
| **POST**   | `/reset`     | Reset task store to default state                             | `200`               |

---

## Example `curl -i` Request & Response

### Creating a Task (`POST /tasks`)

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete Stage 6 documentation"}'

```

**Response:**

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-S8m4N1p2pXQ8/8"
Date: Tue, 11 Aug 2026 04:14:00 GMT
Connection: keep-alive

{
  "id": 4,
  "title": "Complete Stage 6 documentation",
  "done": false
}

```

---

## Interactive Documentation (Swagger UI)

Explore and test all endpoints visually at **`http://localhost:3000/docs`**.
![Swagger UI Screenshot](./assets/swagger.png)

---
