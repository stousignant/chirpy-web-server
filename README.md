# Chirpy

Chirpy is a robust backend API for a social network application similar to Twitter. This project demonstrates the implementation of a scalable web server using TypeScript and modern Node.js practices, focusing on type safety, database management, and secure authentication.

## Features

-   **User Authentication**: Secure signup and login flows using Argon2 for password hashing and JWTs (JSON Web Tokens) for session management. Includes refresh token rotation and revocation strategies.
-   **Chirps (Posts)**: Full CRUD (Create, Read, Update, Delete) capabilities for user posts, known as "chirps".
-   **Membership Tiering**: Integration with webhooks to handle premium user upgrades ("Chirpy Red").
-   **Admin Tools**: Dedicated endpoints for system metrics and database management (reset functionality for development).
-   **Database Management**: Utilizes PostgreSQL with Drizzle ORM for type-safe database interactions and schema migrations.
-   **Middleware**: Custom middleware for request logging, error handling, and metric tracking.

## Tech Stack

-   **Language**: TypeScript
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM (with `drizzle-kit` for migrations)
-   **Authentication**: JWT, Argon2
-   **Testing**: Vitest
-   **Tooling**: npm

## Achievements & Key Learnings

Building Chirpy provided deep insights into backend development:
-   **Architecting a RESTful API**: Designed and implemented a clean, RESTful API structure separating concerns between routing, controllers, and database logic.
-   **TypeScript Mastery**: Leveraged TypeScript's static typing to catch errors early and ensure type safety across the entire application, from database models to API responses.
-   **Database Integration**: Gained hands-on experience with PostgreSQL and Drizzle ORM, including defining schemas, running migrations, and writing complex queries.
-   **Security Best Practices**: Implemented industry-standard security measures, including password hashing with Argon2 and stateless authentication using JWTs.
-   **Webhook Integration**: Handled external events via webhooks to simulate real-world payment processing and user status updates.
-   **Testing**: Wrote comprehensive unit and integration tests using Vitest to ensure code reliability and prevent regressions.

## Getting Started

### Prerequisites

-   **Node.js** (v20+ recommended)
-   **npm**
-   **PostgreSQL** database

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chirpy.git
    cd chirpy
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```env
    PORT=8080
    PLATFORM=dev
    DB_URL=postgres://user:password@localhost:5432/chirpy
    SECRET=your_jwt_secret_key
    POLKA_KEY=your_mock_payment_api_key
    ```

4.  Run database migrations:
    ```bash
    npm run migrate
    ```

### Running the Server

-   **Development Mode** (with hot reload):
    ```bash
    npm run dev
    ```

-   **Production Build**:
    ```bash
    npm run build
    npm start
    ```

-   **Run Tests**:
    ```bash
    npm test
    ```

## API Endpoints

### Auth & Users
-   `POST /api/login`: Authenticate a user.
-   `POST /api/users`: Create a new user.
-   `PUT /api/users`: Update user details.
-   `POST /api/refresh`: Refresh an access token.
-   `POST /api/revoke`: Revoke a refresh token.

### Chirps
-   `GET /api/chirps`: Retrieve all chirps (optional sorting).
-   `GET /api/chirps/:chirpId`: Retrieve a specific chirp.
-   `POST /api/chirps`: Create a new chirp.
-   `DELETE /api/chirps/:chirpId`: Delete a chirp.

### Webhooks
-   `POST /api/polka/webhooks`: Handle events from Polka (payment provider).

### Admin
-   `GET /admin/metrics`: View server metrics.
-   `POST /admin/reset`: Reset the database (dev only).

---
*This project was built as part of the backend engineering curriculum at Boot.dev.*
